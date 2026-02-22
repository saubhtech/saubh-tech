import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ContactsService } from '../contacts/contacts.service';
import { BotService } from '../bot/bot.service';

export interface InboundMessage {
  senderWhatsapp: string;  // e.g. '918800607598'
  senderName?: string;
  body?: string;
  mediaUrl?: string;
  mediaType?: string;
  externalId?: string;
  channelId: string;
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private redis: any = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly contactsService: ContactsService,
    private readonly botService: BotService,
    private readonly config: ConfigService,
  ) {
    const redisUrl = this.config.get<string>('REDIS_URL');
    if (redisUrl) {
      try {
        const IORedis = require('ioredis');
        this.redis = new IORedis(redisUrl);
        this.redis.on('error', (err: any) =>
          this.logger.error(`Redis pub error: ${err.message}`),
        );
        this.logger.log('WebhookService Redis publisher connected');
      } catch (err: any) {
        this.logger.warn(`Redis not available for pub/sub: ${err.message}`);
      }
    } else {
      this.logger.warn('REDIS_URL not configured — real-time pub/sub disabled');
    }
  }

  // ─── Publish CRM event to Redis for real-time fanout ──────────────────
  private async publishEvent(type: string, conversationId: string, data: any) {
    if (!this.redis) return;
    try {
      await this.redis.publish(
        'crm:events',
        JSON.stringify({ type, conversationId, data }),
      );
    } catch (err: any) {
      this.logger.error(`Redis publish failed: ${err.message}`);
    }
  }

  // ─── Process inbound message (shared by both providers) ───────────────
  async processInbound(msg: InboundMessage) {
    // 1. Find or create contact
    const contact = await this.contactsService.findOrCreate(
      msg.senderWhatsapp,
      msg.senderName,
    );

    // 2. Find or create conversation for this channel + contact
    let conversation = await this.prisma.waConversation.findFirst({
      where: {
        channelId: msg.channelId,
        contactId: contact.id,
        status: { not: 'RESOLVED' },
      },
      include: { channel: true },
    });

    let isNewConversation = false;

    if (!conversation) {
      // Check if channel has defaultBotEnabled
      const channel = await this.prisma.waChannel.findUnique({
        where: { id: msg.channelId },
      });

      const enableBot = channel?.defaultBotEnabled ?? false;

      conversation = await this.prisma.waConversation.create({
        data: {
          channelId: msg.channelId,
          contactId: contact.id,
          status: 'OPEN',
          isBot: enableBot,
        },
        include: { channel: true },
      });

      isNewConversation = true;
      this.logger.log(`New conversation ${conversation.id} for ${msg.senderWhatsapp} (bot: ${enableBot})`);

      // Publish new conversation event
      await this.publishEvent('conversation:update', conversation.id, {
        conversationId: conversation.id,
        contact,
        status: 'OPEN',
        isBot: enableBot,
        isNew: true,
      });
    }

    // 3. Save inbound message
    const message = await this.prisma.waMessage.create({
      data: {
        conversationId: conversation.id,
        direction: 'IN',
        body: msg.body || null,
        mediaUrl: msg.mediaUrl || null,
        mediaType: msg.mediaType || null,
        status: 'DELIVERED',
        externalId: msg.externalId || null,
      },
    });

    // 4. Touch conversation updatedAt
    await this.prisma.waConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    this.logger.log(
      `Inbound ${msg.senderWhatsapp} → conv ${conversation.id}: ${msg.body?.substring(0, 50) || '[media]'}`,
    );

    // 5. Publish message event to Redis for real-time delivery
    await this.publishEvent('message', conversation.id, {
      conversationId: conversation.id,
      message: {
        id: message.id,
        direction: message.direction,
        body: message.body,
        mediaUrl: message.mediaUrl,
        mediaType: message.mediaType,
        status: message.status,
        sentAt: message.sentAt,
      },
      contact: {
        id: contact.id,
        whatsapp: contact.whatsapp,
        name: contact.name,
      },
    });

    // 6. Bot: send greeting on NEW conversation if bot enabled
    if (isNewConversation && conversation.isBot) {
      this.botService.sendGreeting(conversation.id).catch(err => {
        this.logger.error(`Bot greeting failed: ${err.message}`);
      });
    }

    // 7. Bot: auto-reply on existing conversation if bot enabled
    if (!isNewConversation && msg.body && conversation.isBot) {
      this.botService.autoReply(conversation.id, msg.body).catch(err => {
        this.logger.error(`Bot auto-reply failed: ${err.message}`);
      });
    }

    return { contact, conversation, message };
  }
}
