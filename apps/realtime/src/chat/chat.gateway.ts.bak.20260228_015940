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

// TODO [S12]: Import RedisService for pub/sub fanout
// import { RedisService } from '../redis/redis.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') ?? [
      'http://localhost:3000',
      'http://localhost:3003',
    ],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  // ─── Connection ─────────────────────────────────────────────────────
  // Validate JWT from handshake auth token
  // TODO [S12]: Verify token with Keycloak instead of stub

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    this.logger.log(
      `Client connected: ${client.id} | token: ${token ? 'present' : 'missing'}`,
    );

    // TODO [S12]: Verify JWT with Keycloak
    // If invalid, disconnect:
    // if (!isValid) {
    //   client.emit('error', { message: 'Unauthorized' });
    //   client.disconnect(true);
    // }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // ─── authenticate ───────────────────────────────────────────────────
  // Client sends { token } after connect for explicit auth

  @SubscribeMessage('authenticate')
  handleAuthenticate(
    @MessageBody() data: { token: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Authenticate request from ${client.id}`);

    // TODO [S12]: Verify token with Keycloak
    const isValid = !!data.token; // stub: any non-empty token passes

    if (isValid) {
      client.emit('authenticated', { userId: 'stub-user-id' });
    } else {
      client.emit('error', { message: 'Invalid token' });
      client.disconnect(true);
    }
  }

  // ─── join-room ──────────────────────────────────────────────────────
  // Client joins a Socket.io room by conversationId

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId } = data;
    client.join(conversationId);
    this.logger.log(`${client.id} joined room: ${conversationId}`);

    client.emit('joined-room', { conversationId });
  }

  // ─── send-message ───────────────────────────────────────────────────
  // Broadcast message to all members of the conversation room

  @SubscribeMessage('send-message')
  handleSendMessage(
    @MessageBody() data: { conversationId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId, content } = data;

    const message = {
      id: `msg-${Date.now()}`,
      conversationId,
      content,
      senderId: client.id, // TODO [S12]: Use actual userId from JWT
      timestamp: new Date().toISOString(),
    };

    this.logger.log(
      `Message in ${conversationId} from ${client.id}: ${content.slice(0, 50)}`,
    );

    // Broadcast to room (including sender)
    this.server.to(conversationId).emit('new-message', message);

    // TODO: Redis pub/sub fanout for multi-instance scaling
    // this.redisService.publish(`chat:${conversationId}`, JSON.stringify(message));
  }

  // ─── ping / pong (keepalive) ────────────────────────────────────────

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }
}
