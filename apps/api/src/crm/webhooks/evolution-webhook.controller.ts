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

      // Only process incoming messages
      if (event !== 'messages.upsert') {
        return { status: 'ignored', event };
      }

      const data = payload?.data;
      if (!data) return { status: 'no_data' };

      const messageData = data;
      const key = messageData?.key;

      // Skip outgoing messages
      if (key?.fromMe) {
        return { status: 'outgoing_ignored' };
      }

      // Extract sender number (remove @s.whatsapp.net)
      const remoteJid = key?.remoteJid || '';
      const senderWhatsapp = remoteJid.replace('@s.whatsapp.net', '');

      if (!senderWhatsapp) {
        return { status: 'no_sender' };
      }

      // Extract message content
      const msg = messageData?.message;
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

      // Find SIM channel (EVOLUTION type)
      const channel = await this.prisma.waChannel.findFirst({
        where: { type: 'EVOLUTION', isActive: true },
      });

      if (!channel) {
        this.logger.warn('No active EVOLUTION channel found');
        return { status: 'no_channel' };
      }

      // ── Auth command interception (Register / Passcode) ──────────────
      if (body) {
        try {
          const cmdResult = await this.authCommand.handleCommand(
            senderWhatsapp,
            body,
            messageData?.pushName,
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

      // ── CRM processing (always — so message appears in inbox) ────────
      const result = await this.webhookService.processInbound({
        senderWhatsapp,
        senderName: messageData?.pushName || undefined,
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
}
