import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service';

/**
 * CRM WebSocket Gateway
 *
 * Clients join rooms by conversation ID.
 * Redis pub/sub bridges API inbound messages to connected WS clients.
 *
 * Events emitted to clients:
 *   crm:message    — new message in a conversation
 *   crm:update     — conversation status/metadata change
 *
 * Events from clients:
 *   crm:join       — join a conversation room
 *   crm:leave      — leave a conversation room
 *   crm:join:all   — join all-conversations feed (for inbox list)
 */
@WebSocketGateway({
  namespace: '/crm',
  cors: { origin: '*' },
})
export class CrmGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(CrmGateway.name);

  constructor(private readonly redis: RedisService) {}

  async onModuleInit() {
    // Subscribe to Redis channel for CRM events
    await this.redis.subscribe('crm:events', (raw: string) => {
      try {
        const event = JSON.parse(raw);
        this.handleRedisEvent(event);
      } catch (err) {
        this.logger.error(`Failed to parse Redis CRM event: ${err}`);
      }
    });

    this.logger.log('CRM Gateway initialized, subscribed to crm:events');
  }

  handleConnection(client: Socket) {
    this.logger.log(`CRM client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`CRM client disconnected: ${client.id}`);
  }

  // ─── Client joins a specific conversation room ────────────────────────
  @SubscribeMessage('crm:join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (data?.conversationId) {
      client.join(`conv:${data.conversationId}`);
      this.logger.debug(`${client.id} joined conv:${data.conversationId}`);
    }
  }

  // ─── Client leaves a conversation room ────────────────────────────────
  @SubscribeMessage('crm:leave')
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (data?.conversationId) {
      client.leave(`conv:${data.conversationId}`);
      this.logger.debug(`${client.id} left conv:${data.conversationId}`);
    }
  }

  // ─── Client joins inbox-wide feed (all conversations) ─────────────────
  @SubscribeMessage('crm:join:all')
  handleJoinAll(@ConnectedSocket() client: Socket) {
    client.join('crm:all');
    this.logger.debug(`${client.id} joined crm:all`);
  }

  // ─── Handle events from Redis pub/sub ─────────────────────────────────
  private handleRedisEvent(event: {
    type: string;
    conversationId: string;
    data: any;
  }) {
    switch (event.type) {
      case 'message':
        // Emit to specific conversation room
        this.server.to(`conv:${event.conversationId}`).emit('crm:message', event.data);
        // Also emit to all-inbox watchers
        this.server.to('crm:all').emit('crm:message', event.data);
        break;

      case 'conversation:update':
        this.server.to(`conv:${event.conversationId}`).emit('crm:update', event.data);
        this.server.to('crm:all').emit('crm:update', event.data);
        break;

      default:
        this.logger.warn(`Unknown CRM event type: ${event.type}`);
    }
  }
}
