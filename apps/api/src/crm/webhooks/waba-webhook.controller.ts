import { Controller, Post, Get, Body, Query, Req, HttpCode, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebhookService } from './webhook.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthCommandService } from '../../auth/auth-command.service';
import { ChannelService } from '../channels/channel.service';
import * as crypto from 'crypto';

@Controller('crm/webhooks/waba')
export class WabaWebhookController {
  private readonly logger = new Logger(WabaWebhookController.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly authCommand: AuthCommandService,
    private readonly channelService: ChannelService,
  ) {}

  // ─── Meta verification endpoint ───────────────────────────────────────────
  @Get()
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const verifyToken = this.config.get<string>('WABA_VERIFY_TOKEN', '');

    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('WABA webhook verified');
      return parseInt(challenge, 10) || challenge;
    }

    this.logger.warn('WABA webhook verification failed');
    return 'Forbidden';
  }

  // ─── Inbound message handler ──────────────────────────────────────────────
  @Post()
  @HttpCode(200)
  async handleWabaWebhook(@Body() payload: any, @Req() req: any) {
    try {
      // Verify signature
      if (!this.verifySignature(req)) {
        this.logger.warn('WABA webhook signature verification failed');
        return { status: 'invalid_signature' };
      }

      const entries = payload?.entry;
      if (!entries || !Array.isArray(entries)) {
        return { status: 'no_entries' };
      }

      for (const entry of entries) {
        const changes = entry?.changes;
        if (!changes) continue;

        for (const change of changes) {
          if (change?.field !== 'messages') continue;

          const value = change?.value;
          const messages = value?.messages;
          if (!messages) continue;

          // Find WABA channel
          const channel = await this.prisma.waChannel.findFirst({
            where: { type: 'WABA', isActive: true },
          });

          if (!channel) {
            this.logger.warn('No active WABA channel found');
            continue;
          }

          const contacts = value?.contacts || [];

          for (const msg of messages) {
            const senderWhatsapp = msg?.from;
            if (!senderWhatsapp) continue;

            // Get sender name from contacts array
            const senderContact = contacts.find((c: any) => c.wa_id === senderWhatsapp);
            const senderName = senderContact?.profile?.name;

            // Extract body
            const body =
              msg?.text?.body ||
              msg?.image?.caption ||
              msg?.video?.caption ||
              '';

            const mediaId = msg?.image?.id || msg?.video?.id || msg?.audio?.id || msg?.document?.id;
            const mediaUrl = mediaId ? `waba-media:${mediaId}` : undefined;
            const mediaType = msg?.type === 'text' ? undefined : msg?.type || undefined;

            // ── Auth command interception (Register / Passcode) ────────
            if (body) {
              try {
                const cmdResult = await this.authCommand.handleCommand(
                  senderWhatsapp,
                  body,
                  senderName,
                );
                if (cmdResult.handled && cmdResult.reply) {
                  const normalizedSender = this.authCommand.normalizeWhatsapp(senderWhatsapp);
                  await this.channelService.sendMessage(channel.id, {
                    to: normalizedSender,
                    body: cmdResult.reply,
                  });
                  this.logger.log(`Auth command handled for ${normalizedSender} via WABA`);
                }
              } catch (err: any) {
                this.logger.error(`Auth command error (WABA): ${err.message}`);
              }
            }

            // ── CRM processing (always) ───────────────────────────────
            await this.webhookService.processInbound({
              senderWhatsapp,
              senderName,
              body: body || undefined,
              mediaUrl,
              mediaType,
              externalId: msg?.id,
              channelId: channel.id,
            });
          }
        }
      }

      return { status: 'ok' };
    } catch (err: any) {
      this.logger.error(`WABA webhook error: ${err.message}`, err.stack);
      return { status: 'error' };
    }
  }

  // ─── Verify X-Hub-Signature-256 ───────────────────────────────────────────
  private verifySignature(req: any): boolean {
    const appSecret = this.config.get<string>('WABA_APP_SECRET', '');
    if (!appSecret) return true; // skip if not configured

    const signature = req.headers?.['x-hub-signature-256'] as string;
    if (!signature) return false;

    const rawBody = req.rawBody;
    if (!rawBody) return true; // skip if raw body not available

    const expected = 'sha256=' + crypto
      .createHmac('sha256', appSecret)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );
  }
}
