import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET ||
  '5b2f4599cde72efec54317986c02afd3d1718c5ed9dc0f154cc709c1594652d1';

/**
 * Saubh Chat WebSocket Gateway
 *
 * Events IN (client → server):
 *   join-room   { conversationId }   — join a chat room
 *   leave-room  { conversationId }   — leave a chat room
 *   typing      { conversationId }   — broadcast typing indicator
 *   ping        {}                   — keepalive
 *
 * Events OUT (server → client):
 *   authenticated  { userId }
 *   joined-room    { conversationId }
 *   chat-event     { type, room_id, event_id, sender, content, ... }
 *     type: 'new_message' | 'translation_ready' | 'stt_ready' | 'voice_note'
 *   user-typing    { conversationId, userId }
 *   pong           { timestamp }
 *   error          { message }
 *
 * Auth: JWT token passed in handshake.auth.token
 * Redis: Subscribes to `chat:{roomId}` channels for cross-service events
 */
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') ?? [
      'http://localhost:3000',
      'https://saubh.tech',
    ],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  /** userId → Set<socketId> (one user can have multiple tabs) */
  private userSockets = new Map<string, Set<string>>();

  /** Tracks which Redis channels we've already subscribed to */
  private subscribedRooms = new Set<string>();

  constructor(private readonly redisService: RedisService) {}

  // ─── Connection lifecycle ───────────────────────────────────

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token) {
      client.emit('error', { message: 'Missing auth token' });
      client.disconnect(true);
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const userId = String(decoded.sub);
      (client as any).userId = userId;

      // Track socket
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);

      client.emit('authenticated', { userId });
      // Auto-join personal notification channel so user receives calls/messages from ANY page
      client.join(`user:${userId}`);
      this.logger.log(`Connected: ${client.id} (user ${userId})`);
    } catch {
      client.emit('error', { message: 'Invalid token' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client as any).userId as string | undefined;
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) this.userSockets.delete(userId);
      }
    }
    this.logger.log(`Disconnected: ${client.id}`);
  }

  // ─── Room management ────────────────────────────────────────

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId } = data;
    const roomKey = `room:${conversationId}`;
    client.join(roomKey);
    this.logger.log(`${(client as any).userId} joined ${roomKey}`);
    client.emit('joined-room', { conversationId });

    // Subscribe to Redis channel once per room
    if (!this.subscribedRooms.has(conversationId)) {
      this.subscribedRooms.add(conversationId);
      this.redisService.subscribe(
        `chat:${conversationId}`,
        (message: string) => {
          try {
            const event = JSON.parse(message);
            // Send to room (for chat page)
            this.server.to(roomKey).emit('chat-event', event);
            // Also send to personal channels for global notifications
            if (event.type === 'new_message') {
              // Notify all connected users via personal channel
              for (const [uid, sockets] of this.userSockets.entries()) {
                if (sockets.size > 0 && String(uid) !== String(event.sender_id)) {
                  this.server.to(`user:${uid}`).emit('global:new_message', {
                    conversationId,
                    senderId: event.sender_id,
                    senderName: event.sender_name || 'Someone',
                    content: event.content?.body?.substring(0, 100) || '',
                    type: event.content_type || 'text',
                    timestamp: event.timestamp || new Date().toISOString(),
                  });
                }
              }
            }
          } catch {}
        },
      );
      this.logger.log(`Redis subscribed: chat:${conversationId}`);
    }
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`room:${data.conversationId}`);
    this.logger.log(`${(client as any).userId} left room:${data.conversationId}`);
  }

  // ─── Typing indicator ──────────────────────────────────────

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = (client as any).userId;
    if (!userId) return;
    client
      .to(`room:${data.conversationId}`)
      .emit('user-typing', { conversationId: data.conversationId, userId });
  }

  // ─── Keepalive ──────────────────────────────────────────────

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }


  // ─── Call signaling ─────────────────────────────────────────

  @SubscribeMessage('subscribe-notifications')
  handleSubscribeNotifications(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomIds: string[] },
  ) {
    const userId = (client as any).userId;
    if (!userId || !data?.roomIds) return;
    // Join all room channels so user gets notifications
    for (const rid of data.roomIds) {
      const roomKey = `room:${rid}`;
      client.join(roomKey);
      // Subscribe to Redis if not already
      if (!this.subscribedRooms.has(rid)) {
        this.subscribedRooms.add(rid);
        this.redisService.subscribe(
          `chat:${rid}`,
          (message: string) => {
            try {
              const event = JSON.parse(message);
              this.server.to(roomKey).emit('chat-event', event);
              if (event.type === 'new_message') {
                for (const [uid, sockets] of this.userSockets.entries()) {
                  if (sockets.size > 0 && String(uid) !== String(event.sender_id)) {
                    this.server.to(`user:${uid}`).emit('global:new_message', {
                      conversationId: rid,
                      senderId: event.sender_id,
                      senderName: event.sender_name || 'Someone',
                      content: event.content?.body?.substring(0, 100) || '',
                      type: event.content_type || 'text',
                      timestamp: event.timestamp || new Date().toISOString(),
                    });
                  }
                }
              }
            } catch {}
          },
        );
      }
    }
    this.logger.log(`User ${userId} subscribed to ${data.roomIds.length} rooms for notifications`);
    client.emit('notifications-subscribed', { count: data.roomIds.length });
  }

  @SubscribeMessage('call:start')
  handleCallStart(
    @MessageBody() data: { conversationId: string; callerName: string; callType: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = (client as any).userId;
    if (!userId) return;
    const roomKey = `room:${data.conversationId}`;
    this.logger.log(`Call started by user ${userId} in ${roomKey} (${data.callType})`);
    client.to(roomKey).emit('call:incoming', {
      conversationId: data.conversationId,
      callerId: userId,
      callerName: data.callerName || `User ${userId}`,
      callType: data.callType || 'video',
      timestamp: new Date().toISOString(),
    });

    // Also notify via personal channels (for users not on chat page)
    for (const [uid, sockets] of this.userSockets.entries()) {
      if (uid !== userId && sockets.size > 0) {
        this.server.to(`user:${uid}`).emit('global:call:incoming', {
          conversationId: data.conversationId,
          callerId: userId,
          callerName: data.callerName || `User ${userId}`,
          callType: data.callType || 'video',
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  @SubscribeMessage('call:decline')
  handleCallDecline(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = (client as any).userId;
    if (!userId) return;
    const roomKey = `room:${data.conversationId}`;
    this.logger.log(`Call declined by user ${userId} in ${roomKey}`);
    client.to(roomKey).emit('call:declined', {
      conversationId: data.conversationId,
      userId,
    });
  }

  @SubscribeMessage('call:end')
  handleCallEnd(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = (client as any).userId;
    if (!userId) return;
    const roomKey = `room:${data.conversationId}`;
    this.logger.log(`Call ended by user ${userId} in ${roomKey}`);
    this.server.to(roomKey).emit('call:ended', {
      conversationId: data.conversationId,
      endedBy: userId,
    });
  }

  // ─── Helpers ────────────────────────────────────────────────

  /** Get count of online users */
  getOnlineCount(): number {
    return this.userSockets.size;
  }

  /** Check if a user is online */
  isOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}
