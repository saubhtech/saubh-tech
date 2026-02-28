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
            this.server.to(roomKey).emit('chat-event', event);
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
