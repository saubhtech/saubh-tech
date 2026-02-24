import { Controller, Post, Body, HttpCode, Logger } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthCommandService } from '../../auth/auth-command.service';
import { ChannelService } from '../channels/channel.service';

@Controller('crm/webhooks/evolution')
export class EvolutionWebhookController {
  private readonly logger = new Logger(EvolutionWebhookController.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly prisma: PrismaService,
    private readonly authCommand: AuthCommandService,
    private readonly channelService: ChannelService,
  ) {}

  @Post()
  @HttpCode(200)
  async handleEvolutionWebhook(@Body() payload: any) {
    try {
      const event = payload?.event;

      // Handle outgoing messages (SEND_MESSAGE or fromMe)
      if (event === 'send.message' || event === 'SEND_MESSAGE') {
        return this.handleOutbound(payload);
      }

      // Only process incoming messages
      if (event !== 'messages.upsert') {
        return { status: 'ignored', event };
      }

      const data = payload?.data;
      if (!data) return { status: 'no_data' };

      const key = data?.key;

      // Outgoing via messages.upsert (fromMe)
      if (key?.fromMe) {
        return this.handleOutbound(payload);
      }

      // ── Inbound message processing ────────────────────────────────
      const remoteJid = key?.remoteJid || '';
      const senderWhatsapp = remoteJid.replace('@s.whatsapp.net', '');

      if (!senderWhatsapp) {
        return { status: 'no_sender' };
      }

      const msg = data?.message;
      const body =
        msg?.conversation ||
        msg?.extendedTextMessage?.text ||
        msg?.imageMessage?.caption ||
        msg?.videoMessage?.caption ||
        '';

      const mediaUrl = msg?.imageMessage?.url || msg?.videoMessage?.url || msg?.audioMessage?.url || undefined;
      const mediaType = msg?.imageMessage
        ? 'image'
        : msg?.videoMessage
          ? 'video'
          : msg?.audioMessage
            ? 'audio'
            : msg?.documentMessage
              ? 'document'
              : undefined;

      const channel = await this.prisma.waChannel.findFirst({
        where: { type: 'EVOLUTION', isActive: true },
      });

      if (!channel) {
        this.logger.warn('No active EVOLUTION channel found');
        return { status: 'no_channel' };
      }

      // ── Auth command interception ─────────────────────────────────
      if (body) {
        try {
          const cmdResult = await this.authCommand.handleCommand(
            senderWhatsapp,
            body,
            data?.pushName,
          );
          if (cmdResult.handled && cmdResult.reply) {
            const normalizedSender = this.authCommand.normalizeWhatsapp(senderWhatsapp);
            await this.channelService.sendMessage(channel.id, {
              to: normalizedSender,
              body: cmdResult.reply,
            });
            this.logger.log(`Auth command handled for ${normalizedSender} via EVOLUTION`);
          }
        } catch (err: any) {
          this.logger.error(`Auth command error: ${err.message}`);
        }
      }

      // ── CRM processing ────────────────────────────────────────────
      const result = await this.webhookService.processInbound({
        senderWhatsapp,
        senderName: data?.pushName || undefined,
        body: body || undefined,
        mediaUrl,
        mediaType,
        externalId: key?.id,
        channelId: channel.id,
      });

      return { status: 'ok', conversationId: result.conversation.id };
    } catch (err: any) {
      this.logger.error(`Evolution webhook error: ${err.message}`, err.stack);
      return { status: 'error' };
    }
  }

  // ── Handle outbound messages (fromMe / SEND_MESSAGE) ────────────────
  private async handleOutbound(payload: any) {
    try {
      const data = payload?.data;
      if (!data) return { status: 'no_data' };

      const key = data?.key;
      const remoteJid = key?.remoteJid || '';
      const recipientWhatsapp = remoteJid.replace('@s.whatsapp.net', '');

      if (!recipientWhatsapp || recipientWhatsapp.includes('g.us')) {
        return { status: 'skip_group' };
      }

      const externalId = key?.id;

      // Skip if we already saved this message (sent from CRM inbox)
      if (externalId) {
        const existing = await this.prisma.waMessage.findFirst({
          where: { externalId },
        });
        if (existing) {
          return { status: 'already_saved' };
        }
      }

      // Find Evolution channel
      const channel = await this.prisma.waChannel.findFirst({
        where: { type: 'EVOLUTION', isActive: true },
      });
      if (!channel) return { status: 'no_channel' };

      // Find existing conversation with this contact
      const contact = await this.prisma.waContact.findFirst({
        where: { whatsapp: recipientWhatsapp },
      });
      if (!contact) {
        this.logger.debug(`Outbound to unknown contact ${recipientWhatsapp} — skipping CRM save`);
        return { status: 'no_contact' };
      }

      let conversation = await this.prisma.waConversation.findFirst({
        where: {
          channelId: channel.id,
          contactId: contact.id,
          
        },
      });

      // Reopen RESOLVED conversation if outbound message sent
      if (conversation && conversation.status === 'RESOLVED') {
        await this.prisma.waConversation.update({
          where: { id: conversation.id },
          data: { status: 'OPEN', updatedAt: new Date() },
        });
        this.logger.log(`Reopened RESOLVED conversation ${conversation.id} for outbound`);
      }
      if (!conversation) {
        this.logger.debug(`No open conversation for ${recipientWhatsapp} — skipping`);
        return { status: 'no_conversation' };
      }

      // Extract message content
      const msg = data?.message;
      const body =
        msg?.conversation ||
        msg?.extendedTextMessage?.text ||
        msg?.imageMessage?.caption ||
        msg?.videoMessage?.caption ||
        '';

      const mediaUrl = msg?.imageMessage?.url || msg?.videoMessage?.url || msg?.audioMessage?.url || undefined;
      const mediaType = msg?.imageMessage
        ? 'image'
        : msg?.videoMessage
          ? 'video'
          : msg?.audioMessage
            ? 'audio'
            : msg?.documentMessage
              ? 'document'
              : undefined;

      // Save outbound message
      const message = await this.prisma.waMessage.create({
        data: {
          conversationId: conversation.id,
          direction: 'OUT',
          body: body || null,
          mediaUrl: mediaUrl || null,
          mediaType: mediaType || null,
          status: 'SENT',
          externalId: externalId || null,
        },
      });

      // Touch conversation
      await this.prisma.waConversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      });

      // Publish to realtime via Redis
      await this.webhookService.publishOutbound(conversation.id, message, contact);

      this.logger.log(`Outbound synced → conv ${conversation.id}: ${body?.substring(0, 50) || '[media]'}`);
      return { status: 'outbound_saved', conversationId: conversation.id };
    } catch (err: any) {
      this.logger.error(`Outbound sync error: ${err.message}`);
      return { status: 'error' };
    }
  }
}
