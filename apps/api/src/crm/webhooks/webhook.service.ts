import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ContactsService } from '../contacts/contacts.service';
import { BotService } from '../bot/bot.service';

export interface InboundMessage {
  senderWhatsapp: string;
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

  constructor(
    private readonly prisma: PrismaService,
    private readonly contactsService: ContactsService,
    private readonly botService: BotService,
    private readonly config: ConfigService,
    @Inject('REDIS') private readonly redis: any,
  ) {
    if (this.redis && this.redis.status === 'ready') {
      this.logger.log('WebhookService Redis publisher ready');
    } else if (this.redis && this.redis.on) {
      this.redis.on('ready', () => this.logger.log('WebhookService Redis publisher ready'));
    }
  }

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

  // ─── Publish outbound message to Redis (called by webhook controller) ─
  async publishOutbound(conversationId: string, message: any, contact: any) {
    await this.publishEvent('message', conversationId, {
      conversationId,
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
  }

  async processInbound(msg: InboundMessage) {
    const contact = await this.contactsService.findOrCreate(
      msg.senderWhatsapp,
      msg.senderName,
    );

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

      await this.publishEvent('conversation:update', conversation.id, {
        conversationId: conversation.id,
        contact,
        status: 'OPEN',
        isBot: enableBot,
        isNew: true,
      });
    }

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

    await this.prisma.waConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    this.logger.log(
      `Inbound ${msg.senderWhatsapp} → conv ${conversation.id}: ${msg.body?.substring(0, 50) || '[media]'}`,
    );

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

    if (isNewConversation && conversation.isBot) {
      this.botService.sendGreeting(conversation.id).catch(err => {
        this.logger.error(`Bot greeting failed: ${err.message}`);
      });
    }

    if (!isNewConversation && msg.body && conversation.isBot) {
      this.botService.autoReply(conversation.id, msg.body).catch(err => {
        this.logger.error(`Bot auto-reply failed: ${err.message}`);
      });
    }

    return { contact, conversation, message };
  }
}
