import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';

const SYNAPSE_URL = process.env.SYNAPSE_URL || 'http://localhost:8008';
const SYNAPSE_SHARED_SECRET = process.env.SYNAPSE_SHARED_SECRET || '';
const SYNAPSE_DOMAIN = 'saubh.tech';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private adminToken: string | null = null;

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('chat-translation') private readonly translationQueue: Queue,
  ) {
    this.s3 = new S3Client({
      endpoint: `http://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'saubh_minio',
        secretAccessKey: process.env.MINIO_SECRET_KEY || 'MinIOSecure2026Saubh',
      },
      forcePathStyle: true,
    });
    this.redisPub = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
    });
  }

  private s3: S3Client;
  private redisPub: Redis;

  // ─── Matrix Admin Helpers ──────────────────────────────────

  async getAdminToken(): Promise<string> {
    if (this.adminToken) return this.adminToken as string;

    // Try env token first (pre-registered bot)
    const envToken = process.env.SYNAPSE_ADMIN_TOKEN;
    if (envToken) {
      this.adminToken = envToken;
      this.logger.log('Using Synapse admin token from env');
      return this.adminToken as string;
    }

    // Fallback: login with password
    try {
      const login = await this.synapsePost('/_matrix/client/v3/login', {
        type: 'm.login.password',
        identifier: { type: 'm.id.user', user: 'saubh-bot' },
        password: 'changeme123',
      });
      this.adminToken = login.access_token;
      this.logger.log('Synapse admin bot logged in');
      return this.adminToken as string;
    } catch (err: any) {
      this.logger.error('Synapse login failed', err);
      throw err;
    }
  }

  async provisionMatrixUser(userId: bigint): Promise<string> {
    const matrixUserId = `@u_${userId}:${SYNAPSE_DOMAIN}`;
    const token = await this.getAdminToken();

    try {
      await this.synapseAdminPut(
        `/_synapse/admin/v2/users/${encodeURIComponent(matrixUserId)}`,
        { password: `saubh_user_${userId}_${Date.now()}`, admin: false, deactivated: false },
        token,
      );
    } catch (err: any) {
      this.logger.warn(`Matrix user provision warning: ${err?.message || err}`);
    }
    return matrixUserId;
  }

  async createMatrixRoom(name: string, inviteUserIds: string[]): Promise<string> {
    const token = await this.getAdminToken();
    const res = await this.synapsePost(
      '/_matrix/client/v3/createRoom',
      {
        name,
        preset: 'private_chat',
        invite: inviteUserIds,
        creation_content: { 'm.federate': false },
      },
      token,
    );
    return res.room_id;
  }

  // ─── API Methods ───────────────────────────────────────────

  async createDm(userAId: bigint, userBId: bigint) {
    if (userAId === userBId) {
      throw new BadRequestException('Cannot create DM with yourself');
    }

    const existing = await this.prisma.chatRoom.findFirst({
      where: {
        type: 'DM',
        members: {
          every: { userId: { in: [userAId, userBId] } },
        },
      },
      include: { roomMap: true, members: true },
    });

    if (existing && existing.members.length === 2) {
      return {
        conversation_id: existing.id.toString(),
        matrix_room_id: existing.roomMap?.matrixRoomId || null,
        livekit_room: existing.roomMap?.livekitRoom || null,
        existing: true,
      };
    }

    const matrixUserA = await this.provisionMatrixUser(userAId);
    const matrixUserB = await this.provisionMatrixUser(userBId);

    const room = await this.prisma.chatRoom.create({
      data: {
        type: 'DM',
        createdBy: userAId,
        members: {
          create: [
            { userId: userAId, role: 'member' },
            { userId: userBId, role: 'member' },
          ],
        },
      },
    });

    const livekitRoom = `conv_${room.id}`;

    let matrixRoomId: string;
    try {
      matrixRoomId = await this.createMatrixRoom(`DM ${room.id}`, [matrixUserA, matrixUserB]);
    } catch (err) {
      this.logger.error(`Matrix room creation failed: ${err}`);
      matrixRoomId = `!pending_${room.id}:${SYNAPSE_DOMAIN}`;
    }

    await this.prisma.chatRoomMap.create({
      data: { roomId: room.id, matrixRoomId, livekitRoom },
    });

    return {
      conversation_id: room.id.toString(),
      matrix_room_id: matrixRoomId,
      livekit_room: livekitRoom,
      existing: false,
    };
  }

  async createGroup(creatorId: bigint, title: string, memberIds: bigint[]) {
    const allMembers = Array.from(new Set([creatorId, ...memberIds]));

    const matrixUsers = await Promise.all(
      allMembers.map((id) => this.provisionMatrixUser(id)),
    );

    const room = await this.prisma.chatRoom.create({
      data: {
        type: 'GROUP',
        title,
        createdBy: creatorId,
        members: {
          create: allMembers.map((uid) => ({
            userId: uid,
            role: uid === creatorId ? 'admin' : 'member',
          })),
        },
      },
    });

    const livekitRoom = `conv_${room.id}`;

    let matrixRoomId: string;
    try {
      matrixRoomId = await this.createMatrixRoom(title, matrixUsers);
    } catch (err) {
      this.logger.error(`Matrix room creation failed: ${err}`);
      matrixRoomId = `!pending_${room.id}:${SYNAPSE_DOMAIN}`;
    }

    await this.prisma.chatRoomMap.create({
      data: { roomId: room.id, matrixRoomId, livekitRoom },
    });

    return {
      conversation_id: room.id.toString(),
      matrix_room_id: matrixRoomId,
      livekit_room: livekitRoom,
    };
  }

  async getUserRooms(userId: bigint) {
    const memberships = await this.prisma.chatRoomMember.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            roomMap: true,
            members: {
              include: { user: { select: { userid: true, fname: true, lname: true, pic: true } } },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    return memberships.map((m) => ({
      conversation_id: m.roomId.toString(),
      type: m.room.type,
      title: m.room.title,
      matrix_room_id: m.room.roomMap?.matrixRoomId || null,
      livekit_room: m.room.roomMap?.livekitRoom || null,
      my_lang: m.preferredLang,
      is_muted: m.isMuted,
      members: m.room.members.map((mem) => ({
        user_id: mem.userId.toString(),
        fname: mem.user.fname,
        lname: mem.user.lname,
        pic: mem.user.pic,
        role: mem.role,
        lang: mem.preferredLang,
      })),
    }));
  }

  async updatePrefs(userId: bigint, roomId: bigint, preferredLang: string) {
    const member = await this.prisma.chatRoomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!member) throw new NotFoundException('Not a member of this room');

    await this.prisma.chatRoomMember.update({
      where: { roomId_userId: { roomId, userId } },
      data: { preferredLang },
    });

    return { updated: true };
  }

  async blockUser(blockerId: bigint, roomId: bigint, targetUserId: bigint) {
    const blocker = await this.prisma.chatRoomMember.findUnique({
      where: { roomId_userId: { roomId, userId: blockerId } },
    });
    if (!blocker) throw new NotFoundException('Not a member of this room');

    await this.prisma.chatRoomMember.update({
      where: { roomId_userId: { roomId, userId: targetUserId } },
      data: { isBlocked: true },
    });

    try {
      const roomMap = await this.prisma.chatRoomMap.findUnique({ where: { roomId } });
      if (roomMap) {
        const token = await this.getAdminToken();
        const matrixUserId = `@u_${targetUserId}:${SYNAPSE_DOMAIN}`;
        await this.synapsePost(
          `/_matrix/client/v3/rooms/${encodeURIComponent(roomMap.matrixRoomId)}/ban`,
          { user_id: matrixUserId, reason: 'Blocked by user' },
          token,
        );
      }
    } catch (err) {
      this.logger.warn(`Matrix ban failed: ${err}`);
    }

    return { blocked: true };
  }

  
  



  // ─── Read Receipts ─────────────────────────────────────────

  async markRead(userId: bigint, roomId: bigint, eventId: string) {
    await this.prisma.chatReadReceipt.upsert({
      where: { roomId_userId: { roomId, userId } },
      create: { roomId, userId, lastEventId: eventId, lastReadAt: new Date() },
      update: { lastEventId: eventId, lastReadAt: new Date() },
    });

    // Broadcast read receipt via Redis
    await this.publishChatEvent(roomId, {
      type: 'read_receipt',
      room_id: roomId.toString(),
      user_id: userId.toString(),
      last_event_id: eventId,
    });

    return { marked: true };
  }

  async getUnreadCounts(userId: bigint): Promise<Record<string, number>> {
    // Get all rooms for user
    const memberships = await this.prisma.chatRoomMember.findMany({
      where: { userId },
      select: { roomId: true },
    });

    const counts: Record<string, number> = {};
    for (const m of memberships) {
      const receipt = await this.prisma.chatReadReceipt.findUnique({
        where: { roomId_userId: { roomId: m.roomId, userId } },
      });

      if (!receipt) {
        // Never read - count all enrichments in room
        const total = await this.prisma.chatEnrichment.count({
          where: { roomId: m.roomId },
        });
        counts[m.roomId.toString()] = total;
      } else {
        // Count enrichments after last read
        const total = await this.prisma.chatEnrichment.count({
          where: {
            roomId: m.roomId,
            createdAt: { gt: receipt.lastReadAt },
          },
        });
        counts[m.roomId.toString()] = total;
      }
    }
    return counts;
  }

  // ─── Real-time Push ────────────────────────────────────────

  async publishChatEvent(roomId: bigint, event: any) {
    try {
      await this.redisPub.publish(`chat:${roomId}`, JSON.stringify(event));
    } catch (err) {
      this.logger.warn(`Redis publish failed: ${err}`);
    }
  }

  // ─── Voice Notes ───────────────────────────────────────────

  /**
   * Upload voice note to MinIO, send to Matrix, queue STT + translation.
   */
  async uploadVoiceNote(
    userId: bigint,
    roomId: bigint,
    audioBuffer: Buffer,
    mimeType: string,
    filename: string,
  ) {
    // Verify membership
    const member = await this.prisma.chatRoomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!member) throw new NotFoundException('Not a member of this room');

    const roomMap = await this.prisma.chatRoomMap.findUnique({ where: { roomId } });
    if (!roomMap) throw new NotFoundException('Room not mapped');

    // Upload to MinIO
    const key = `voice/${roomId}/${Date.now()}_${userId}_${filename}`;
    await this.s3.send(new PutObjectCommand({
      Bucket: 'voice-notes',
      Key: key,
      Body: audioBuffer,
      ContentType: mimeType,
    }));
    const mediaUrl = `minio://voice-notes/${key}`;
    this.logger.log(`Voice note uploaded: ${key}`);

    // Send to Matrix as m.audio
    const token = await this.getAdminToken();
    const matrixUserId = `@u_${userId}:${SYNAPSE_DOMAIN}`;

    // Get user's matrix token
    const userMatrixToken = await this.getMatrixToken(userId);

    let eventId = `!pending_voice_${Date.now()}`;
    try {
      const txnId = `voice_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const sendRes = await fetch(
        `${SYNAPSE_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomMap.matrixRoomId)}/send/m.room.message/${txnId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${userMatrixToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            msgtype: 'm.audio',
            body: filename,
            info: { mimetype: mimeType, size: audioBuffer.length },
            url: mediaUrl,
          }),
        }
      );
      if (sendRes.ok) {
        const data = await sendRes.json() as any;
        eventId = data.event_id || eventId;
      }
    } catch (err) {
      this.logger.warn(`Matrix voice send failed: ${err}`);
    }

    // Create enrichment (appservice might also create one - dedup by event_id)
    let enrichment;
    try {
      enrichment = await this.prisma.chatEnrichment.create({
        data: {
          roomId,
          matrixEventId: eventId,
          messageType: 'VOICE',
          originalMediaUrl: mediaUrl,
        },
      });
    } catch (err: any) {
      // Dedup: appservice may have already created it
      enrichment = await this.prisma.chatEnrichment.findUnique({
        where: { matrixEventId: eventId },
      });
      if (!enrichment) throw err;
    }

    // Queue STT job
    await this.translationQueue.add('stt', {
      enrichmentId: enrichment.id.toString(),
      roomId: roomId.toString(),
      mediaUrl,
      senderLang: member.preferredLang || 'hi',
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
    });

    this.logger.log(`Voice note queued for STT: enrichment ${enrichment.id}`);

    return {
      enrichment_id: enrichment.id.toString(),
      event_id: eventId,
      media_url: mediaUrl,
    };
  }

  /**
   * Get a presigned-like URL for voice note playback (read from MinIO).
   */
  async getVoiceUrl(mediaUrl: string): Promise<Buffer> {
    const match = mediaUrl.match(/^minio:\/\/([^/]+)\/(.+)$/);
    if (!match) throw new BadRequestException('Invalid media URL');
    const [, bucket, key] = match;
    const res = await this.s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const chunks: Uint8Array[] = [];
    for await (const chunk of res.Body as any) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  
  // ─── File Sharing ──────────────────────────────────────────

  async uploadFile(
    userId: bigint,
    roomId: bigint,
    fileBuffer: Buffer,
    mimeType: string,
    filename: string,
  ) {
    const member = await this.prisma.chatRoomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!member) throw new NotFoundException('Not a member of this room');

    const roomMap = await this.prisma.chatRoomMap.findUnique({ where: { roomId } });
    if (!roomMap) throw new NotFoundException('Room not mapped');

    // Upload to MinIO
    const ext = filename.split('.').pop() || 'bin';
    const key = `files/${roomId}/${Date.now()}_${userId}_${filename}`;
    await this.s3.send(new PutObjectCommand({
      Bucket: 'chat-media',
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    }));
    const mediaUrl = `minio://chat-media/${key}`;
    this.logger.log(`File uploaded: ${key} (${mimeType}, ${fileBuffer.length} bytes)`);

    // Send to Matrix
    const userMatrixToken = await this.getMatrixToken(userId);
    const isImage = mimeType.startsWith('image/');
    const txnId = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    let eventId = `!pending_file_${Date.now()}`;
    try {
      const sendRes = await fetch(
        `${SYNAPSE_URL}/_matrix/client/v3/rooms/${encodeURIComponent(roomMap.matrixRoomId)}/send/m.room.message/${txnId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${userMatrixToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            msgtype: isImage ? 'm.image' : 'm.file',
            body: filename,
            info: { mimetype: mimeType, size: fileBuffer.length },
            url: mediaUrl,
          }),
        }
      );
      if (sendRes.ok) {
        const data = await sendRes.json() as any;
        eventId = data.event_id || eventId;
      }
    } catch (err) {
      this.logger.warn(`Matrix file send failed: ${err}`);
    }

    // Create enrichment
    let enrichment;
    try {
      enrichment = await this.prisma.chatEnrichment.create({
        data: {
          roomId,
          matrixEventId: eventId,
          messageType: isImage ? 'IMAGE' : 'FILE',
          originalMediaUrl: mediaUrl,
        },
      });
    } catch (err: any) {
      enrichment = await this.prisma.chatEnrichment.findUnique({
        where: { matrixEventId: eventId },
      });
      if (!enrichment) throw err;
    }

    this.logger.log(`File enrichment created: ${enrichment!.id} (${isImage ? 'IMAGE' : 'FILE'})`);

    return {
      enrichment_id: enrichment!.id.toString(),
      event_id: eventId,
      media_url: mediaUrl,
      filename,
      mimetype: mimeType,
      size: fileBuffer.length,
    };
  }

  /**
   * Stream a file from MinIO.
   */
  async getFileBuffer(mediaUrl: string): Promise<{ buffer: Buffer; contentType: string }> {
    const match = mediaUrl.match(/^minio:\/\/([^/]+)\/(.+)$/);
    if (!match) throw new BadRequestException('Invalid media URL');
    const [, bucket, key] = match;
    const res = await this.s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const chunks: Uint8Array[] = [];
    for await (const chunk of res.Body as any) {
      chunks.push(chunk);
    }
    return {
      buffer: Buffer.concat(chunks),
      contentType: res.ContentType || 'application/octet-stream',
    };
  }

  // ─── Matrix Token + Messages ───────────────────────────────

  /**
   * Get a Matrix access token for a user (reset password + login).
   */
  async getMatrixToken(userId: bigint): Promise<string> {
    const matrixUserId = `@u_${userId}:${SYNAPSE_DOMAIN}`;
    const password = `saubh_chat_${userId}_${Date.now()}`;
    const token = await this.getAdminToken();

    // Reset password
    await this.synapseAdminPut(
      `/_synapse/admin/v2/users/${encodeURIComponent(matrixUserId)}`,
      { password, admin: false, deactivated: false },
      token,
    );

    // Login
    const login = await this.synapsePost('/_matrix/client/v3/login', {
      type: 'm.login.password',
      identifier: { type: 'm.id.user', user: `u_${userId}` },
      password,
    });

    return login.access_token;
  }

  /**
   * Get messages for a room with enrichments.
   */
  async getMessages(userId: bigint, roomId: bigint) {
    // Verify membership
    const member = await this.prisma.chatRoomMember.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!member) throw new NotFoundException('Not a member of this room');

    const roomMap = await this.prisma.chatRoomMap.findUnique({ where: { roomId } });
    if (!roomMap) throw new NotFoundException('Room not mapped');

    // Fetch messages from Matrix
    let messages: any[] = [];
    try {
      const token = await this.getAdminToken();
      const res = await this.synapseGet(
        `/_matrix/client/v3/rooms/${encodeURIComponent(roomMap.matrixRoomId)}/messages?dir=b&limit=50`,
        token,
      );
      messages = (res.chunk || []).reverse().filter((e: any) => e.type === 'm.room.message');
    } catch (err) {
      this.logger.warn(`Failed to fetch Matrix messages: ${err}`);
    }

    // Get enrichments for these events
    const eventIds = messages.map((m: any) => m.event_id);
    const enrichments = eventIds.length > 0
      ? await this.prisma.chatEnrichment.findMany({
          where: { matrixEventId: { in: eventIds } },
          include: { translations: true },
        })
      : [];

    return { messages, enrichments };
  }

  // ─── Appservice Event Handler ──────────────────────────────

  /**
   * Called by Synapse via appservice for every message in matched rooms.
   * Deduplicates, stores enrichment record, queues translation.
   */
  async handleAppserviceEvents(txnId: string, events: any[]) {
    const results: any[] = [];

    for (const event of events) {
      // Only process room messages (not state events, receipts, etc.)
      if (event.type !== 'm.room.message') continue;

      const eventId = event.event_id;
      const roomId = event.room_id;
      const senderId = event.sender; // e.g. @u_2:saubh.tech
      const content = event.content;

      // Skip messages from our bot
      if (senderId === '@saubh-bot:saubh.tech' || senderId === '@saubh-appservice:saubh.tech') continue;

      // Check if already processed (idempotency)
      const existing = await this.prisma.chatEnrichment.findUnique({
        where: { matrixEventId: eventId },
      });
      if (existing) {
        this.logger.debug(`Event ${eventId} already processed, skipping`);
        continue;
      }

      // Find our chat room by matrix room ID
      const roomMap = await this.prisma.chatRoomMap.findFirst({
        where: { matrixRoomId: roomId },
      });
      if (!roomMap) {
        this.logger.warn(`No chat room mapping for matrix room ${roomId}`);
        continue;
      }

      // Determine message type
      const msgType = content?.msgtype;
      const isVoice = msgType === 'm.audio' || msgType === 'm.voice';
      const messageType = isVoice ? 'VOICE' : 'TEXT';

      // Create enrichment record
      const enrichment = await this.prisma.chatEnrichment.create({
        data: {
          roomId: roomMap.roomId,
          matrixEventId: eventId,
          messageType,
          originalMediaUrl: isVoice ? content?.url : null,
        },
      });

      // Get target languages (all members except sender)
      const senderUserId = this.extractUserId(senderId);
      const members = await this.prisma.chatRoomMember.findMany({
        where: { roomId: roomMap.roomId },
      });

      const senderMember = members.find(m => m.userId.toString() === senderUserId);
      const senderLang = senderMember?.preferredLang || 'en';

      // Unique target languages (excluding sender's language)
      const targetLangs = [...new Set(
        members
          .filter(m => m.userId.toString() !== senderUserId && m.preferredLang !== senderLang)
          .map(m => m.preferredLang)
      )];

      // Queue translation jobs
      if (msgType === 'm.text' && content?.body && targetLangs.length > 0) {
        for (const targetLang of targetLangs) {
          await this.queueTranslation({
            enrichmentId: enrichment.id.toString(),
            text: content.body,
            sourceLang: senderLang,
            targetLang,
          });
        }
      }

      results.push({
        event_id: eventId,
        enrichment_id: enrichment.id.toString(),
        queued_translations: targetLangs,
      });

      this.logger.log(`Processed event ${eventId}: ${messageType}, translations queued for [${targetLangs.join(',')}]`);

      // Push to realtime via Redis
      await this.publishChatEvent(roomMap.roomId, {
        type: 'new_message',
        event_id: eventId,
        room_id: roomMap.roomId.toString(),
        sender: senderId,
        content: content,
        timestamp: event.origin_server_ts,
        enrichment_id: enrichment.id.toString(),
      });
    }

    return results;
  }

  /**
   * Queue a translation job via BullMQ.
   */
  private async queueTranslation(job: {
    enrichmentId: string;
    text: string;
    sourceLang: string;
    targetLang: string;
  }) {
    await this.translationQueue.add('translate', job, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 100,
      removeOnFail: 50,
    });
    this.logger.log(`Queued translation: ${job.sourceLang}->${job.targetLang}`);
  }

  /**
   * Extract numeric user ID from Matrix user ID.
   * @u_123:saubh.tech -> "123"
   */
  private extractUserId(matrixUserId: string): string {
    const match = matrixUserId.match(/@u_(\d+):/);
    return match ? match[1] : '';
  }

  // ─── Synapse HTTP Helpers ──────────────────────────────────

  private async synapseGet(path: string, token?: string): Promise<any> {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${SYNAPSE_URL}${path}`, { headers });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw { status: res.status, ...body };
    }
    return res.json();
  }

  private async synapsePost(path: string, body: any, token?: string): Promise<any> {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${SYNAPSE_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const respBody = await res.json().catch(() => ({}));
      throw { status: res.status, ...respBody };
    }
    return res.json();
  }

  private async synapseAdminPut(path: string, body: any, token: string): Promise<any> {
    const headers: any = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const res = await fetch(`${SYNAPSE_URL}${path}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const respBody = await res.json().catch(() => ({}));
      throw { status: res.status, ...respBody };
    }
    return res.json();
  }
}
