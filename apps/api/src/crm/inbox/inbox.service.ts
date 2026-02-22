import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChannelService } from '../channels/channel.service';

@Injectable()
export class InboxService {
  private readonly logger = new Logger(InboxService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly channelService: ChannelService,
  ) {}

  // ─── List conversations (paginated) ───────────────────────────────────
  async listConversations(opts: {
    channelId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { channelId, status, page = 1, limit = 25 } = opts;
    const where: any = {};
    if (channelId) where.channelId = channelId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.waConversation.findMany({
        where,
        include: {
          contact: true,
          channel: true,
          messages: {
            orderBy: { sentAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.waConversation.count({ where }),
    ]);

    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  // ─── Get single conversation ──────────────────────────────────────────
  async getConversation(id: string) {
    const conv = await this.prisma.waConversation.findUnique({
      where: { id },
      include: { contact: true, channel: true },
    });
    if (!conv) throw new NotFoundException(`Conversation ${id} not found`);
    return conv;
  }

  // ─── List messages in a conversation ──────────────────────────────────
  async listMessages(conversationId: string, opts: { page?: number; limit?: number }) {
    const { page = 1, limit = 50 } = opts;

    // verify conversation exists
    await this.getConversation(conversationId);

    const [data, total] = await Promise.all([
      this.prisma.waMessage.findMany({
        where: { conversationId },
        orderBy: { sentAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.waMessage.count({ where: { conversationId } }),
    ]);

    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  // ─── Send a text message (outbound) ───────────────────────────────────
  async sendMessage(conversationId: string, body: string, mediaUrl?: string) {
    const conv = await this.getConversation(conversationId);

    // Send via provider
    const result = await this.channelService.sendMessage(conv.channelId, {
      to: conv.contact.whatsapp,
      body,
      mediaUrl,
    });

    // Save message record
    const message = await this.prisma.waMessage.create({
      data: {
        conversationId,
        direction: 'OUT',
        body,
        mediaUrl,
        status: result.success ? 'SENT' : 'FAILED',
        externalId: result.externalId,
      },
    });

    // Touch conversation updatedAt
    await this.prisma.waConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    this.logger.log(`Message sent in ${conversationId}: ${result.success ? 'OK' : 'FAILED'}`);
    return { message, sendResult: result };
  }

  // ─── Send a media message (outbound) ──────────────────────────────────
  async sendMediaMessage(
    conversationId: string,
    mediaUrl: string,
    mediaType: 'image' | 'video' | 'audio' | 'document',
    caption?: string,
    filename?: string,
  ) {
    const conv = await this.getConversation(conversationId);

    // Send via provider
    const result = await this.channelService.sendMediaMessage(conv.channelId, {
      to: conv.contact.whatsapp,
      mediaUrl,
      mediaType,
      caption,
      filename,
    });

    // Save message record
    const message = await this.prisma.waMessage.create({
      data: {
        conversationId,
        direction: 'OUT',
        body: caption || null,
        mediaUrl,
        mediaType,
        status: result.success ? 'SENT' : 'FAILED',
        externalId: result.externalId,
      },
    });

    await this.prisma.waConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    this.logger.log(`Media sent in ${conversationId} (${mediaType}): ${result.success ? 'OK' : 'FAILED'}`);
    return { message, sendResult: result };
  }

  // ─── Assign conversation to agent ─────────────────────────────────────
  async assign(conversationId: string, userId: bigint) {
    await this.getConversation(conversationId);
    return this.prisma.waConversation.update({
      where: { id: conversationId },
      data: { assignedTo: userId, status: 'ASSIGNED' },
    });
  }

  // ─── Resolve conversation ─────────────────────────────────────────────
  async resolve(conversationId: string) {
    await this.getConversation(conversationId);
    return this.prisma.waConversation.update({
      where: { id: conversationId },
      data: { status: 'RESOLVED' },
    });
  }

  // ─── Toggle bot on/off ────────────────────────────────────────────────
  async toggleBot(conversationId: string) {
    const conv = await this.getConversation(conversationId);
    return this.prisma.waConversation.update({
      where: { id: conversationId },
      data: { isBot: !conv.isBot },
    });
  }
}
