import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { WhatsappAuthService } from '../auth/whatsapp-auth.service';

@Controller('webhooks/whatsapp')
export class WhatsappWebhookController {
  private readonly logger = new Logger(WhatsappWebhookController.name);

  constructor(private readonly authService: WhatsappAuthService) {}

  /**
   * POST /webhooks/whatsapp
   * Receives incoming messages from Evolution API webhook.
   * Always returns 200. Never throws.
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() body: any) {
    try {
      // Evolution API sends different event types
      const data = body?.data;
      if (!data) return { received: true };

      const message = data?.message;
      if (!message) return { received: true };

      // Extract sender number (remove @s.whatsapp.net suffix)
      const remoteJid = data.key?.remoteJid || '';
      const sender = remoteJid.replace('@s.whatsapp.net', '');

      if (!sender) return { received: true };

      // Normalize to E.164 format if needed
      const whatsapp = sender.startsWith('+') ? sender : `+${sender}`;

      // Get message text (conversation for plain text, extendedTextMessage for quoted/forwarded)
      const text =
        message.conversation ||
        message.extendedTextMessage?.text ||
        '';

      if (!text) return { received: true };

      const trimmed = text.trim();

      // Handle "Register <name>" command
      if (trimmed.toLowerCase().startsWith('register ')) {
        const fname = trimmed.substring(9).trim();
        if (fname) {
          await this.authService.registerUser(whatsapp, fname, 'GW');
          this.logger.log(`Registered user via webhook: ${whatsapp} (${fname})`);
        }
        return { received: true };
      }

      // Handle "Login" command
      if (trimmed.toLowerCase() === 'login') {
        try {
          await this.authService.requestOTP(whatsapp);
          this.logger.log(`OTP requested via webhook: ${whatsapp}`);
        } catch (err) {
          // Log but don't throw — user may not be registered or rate limited
          this.logger.warn(
            `OTP request failed for ${whatsapp}: ${err.message}`,
          );
        }
        return { received: true };
      }

      return { received: true };
    } catch (error) {
      // Never throw from webhook — always return 200
      this.logger.error('Webhook processing error', error);
      return { received: true };
    }
  }
}
