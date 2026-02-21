import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContactsService } from '../contacts/contacts.service';

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

  constructor(
    private readonly prisma: PrismaService,
    private readonly contactsService: ContactsService,
  ) {}

  // ─── Process inbound message (shared by both providers) ───────────────────
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
    });

    if (!conversation) {
      conversation = await this.prisma.waConversation.create({
        data: {
          channelId: msg.channelId,
          contactId: contact.id,
          status: 'OPEN',
        },
      });
      this.logger.log(`New conversation ${conversation.id} for ${msg.senderWhatsapp}`);
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

    return { contact, conversation, message };
  }
}
