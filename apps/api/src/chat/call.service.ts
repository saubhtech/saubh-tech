import { Injectable, Logger, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

@Injectable()
export class CallService {
  private readonly logger = new Logger(CallService.name);
  private readonly roomService: RoomServiceClient;
  private readonly livekitUrl: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(private readonly prisma: PrismaService) {
    this.livekitUrl = process.env.LIVEKIT_URL || 'wss://lk.saubh.tech';
    this.apiKey = process.env.LIVEKIT_API_KEY || '';
    this.apiSecret = process.env.LIVEKIT_API_SECRET || '';

    if (!this.apiKey || !this.apiSecret) {
      this.logger.warn('LIVEKIT_API_KEY or LIVEKIT_API_SECRET not set!');
    }

    const httpUrl = this.livekitUrl.replace('wss://', 'https://').replace('ws://', 'http://');
    this.roomService = new RoomServiceClient(httpUrl, this.apiKey, this.apiSecret);
  }

  async generateToken(userId: number, roomId: number) {
    const membership = await this.prisma.$queryRaw<any[]>`
      SELECT crm.id, crm.preferred_lang
      FROM chat_room_member crm
      WHERE crm.room_id = ${roomId} AND crm.user_id = ${userId}
    `;
    if (!membership || membership.length === 0) {
      throw new ForbiddenException('You are not a member of this room');
    }

    const user = await this.prisma.$queryRaw<any[]>`
      SELECT id, name, whatsapp FROM "User" WHERE id = ${userId}
    `;
    if (!user || user.length === 0) {
      throw new BadRequestException('User not found');
    }

    const participantName = user[0].name || `User ${userId}`;
    const participantIdentity = `user_${userId}`;
    const roomName = `saubh_call_${roomId}`;

    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity: participantIdentity,
      name: participantName,
      ttl: '2h',
      metadata: JSON.stringify({
        userId,
        roomId,
        lang: membership[0].preferred_lang || 'en',
      }),
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();
    this.logger.log(`Generated call token for user ${userId} in room ${roomName}`);

    // Log call initiation
    try {
      await this.prisma.$executeRaw`
        INSERT INTO chat_call_log (room_id, caller_id, call_type, status, livekit_room)
        VALUES (${roomId}, ${userId}, 'video', 'initiated', ${roomName})
      `;
    } catch (e) { this.logger.warn('Failed to log call: ' + e.message); }

    return { token, livekitUrl: this.livekitUrl, roomName };
  }

  async isCallActive(roomId: number) {
    const roomName = `saubh_call_${roomId}`;
    try {
      const participants = await this.roomService.listParticipants(roomName);
      return { active: participants.length > 0, participants: participants.length };
    } catch {
      return { active: false, participants: 0 };
    }
  }

  async getCallParticipants(roomId: number) {
    const roomName = `saubh_call_${roomId}`;
    try {
      const participants = await this.roomService.listParticipants(roomName);
      return participants.map(p => ({
        identity: p.identity,
        name: p.name,
        joinedAt: p.joinedAt ? new Date(Number(p.joinedAt) * 1000) : null,
      }));
    } catch {
      return [];
    }
  }

  async listActiveRooms() {
    try {
      const rooms = await this.roomService.listRooms();
      return rooms
        .filter(r => r.name.startsWith('saubh_call_'))
        .map(r => ({
          name: r.name,
          chatRoomId: parseInt(r.name.replace('saubh_call_', ''), 10),
          numParticipants: r.numParticipants,
        }));
    } catch (err) {
      this.logger.error('Failed to list rooms', err);
      return [];
    }
  }

  async getCallHistory(roomId: number, limit = 20) {
    return this.prisma.$queryRaw<any[]>`
      SELECT cl.*, u.name as caller_name
      FROM chat_call_log cl
      LEFT JOIN "User" u ON u.id = cl.caller_id
      WHERE cl.room_id = ${roomId}
      ORDER BY cl.started_at DESC
      LIMIT ${limit}
    `;
  }

  async getUserCallHistory(userId: number, limit = 30) {
    return this.prisma.$queryRaw<any[]>`
      SELECT cl.*, u.name as caller_name, cr.type as room_type
      FROM chat_call_log cl
      LEFT JOIN "User" u ON u.id = cl.caller_id
      LEFT JOIN chat_room cr ON cr.id = cl.room_id
      WHERE cl.room_id IN (
        SELECT room_id FROM chat_room_member WHERE user_id = ${userId}
      )
      ORDER BY cl.started_at DESC
      LIMIT ${limit}
    `;
  }

  async updateCallStatus(roomId: number, status: string, endReason?: string) {
    const roomName = `saubh_call_${roomId}`;
    let participants = 0;
    try {
      const ps = await this.roomService.listParticipants(roomName);
      participants = ps.length;
    } catch {}

    if (status === 'answered') {
      await this.prisma.$executeRaw`
        UPDATE chat_call_log SET status = 'answered', answered_at = now(), participants = ${participants}
        WHERE livekit_room = ${roomName} AND ended_at IS NULL
      `;
    } else if (status === 'ended') {
      await this.prisma.$executeRaw`
        UPDATE chat_call_log SET status = ${endReason || 'ended'}, ended_at = now(),
          participants = ${participants},
          duration = EXTRACT(EPOCH FROM (now() - COALESCE(answered_at, started_at)))::int
        WHERE livekit_room = ${roomName} AND ended_at IS NULL
      `;
    }
  }

  async endCall(userId: number, roomId: number) {
    const membership = await this.prisma.$queryRaw<any[]>`
      SELECT id FROM chat_room_member
      WHERE room_id = ${roomId} AND user_id = ${userId}
    `;
    if (!membership || membership.length === 0) {
      throw new ForbiddenException('Not a member of this room');
    }

    const roomName = `saubh_call_${roomId}`;
    await this.updateCallStatus(roomId, 'ended', 'user_ended');
    try {
      await this.roomService.deleteRoom(roomName);
      this.logger.log(`Call ended: ${roomName} by user ${userId}`);
    } catch (err) {
      this.logger.warn(`Room ${roomName} may not exist: ${err.message}`);
    }
  }
}
