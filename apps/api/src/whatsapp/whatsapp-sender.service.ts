import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WhatsappSenderService {
  private readonly logger = new Logger(WhatsappSenderService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly instance: string;

  constructor() {
    this.apiUrl = process.env.EVOLUTION_API_URL || '';
    this.apiKey = process.env.EVOLUTION_API_KEY || '';
    this.instance = process.env.EVOLUTION_INSTANCE || '';
  }

  /**
   * Send a plain text message via Evolution API.
   * On failure: logs error only, does NOT throw.
   */
  async sendMessage(to: string, body: string): Promise<void> {
    try {
      const url = `${this.apiUrl}/message/sendText/${this.instance}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: this.apiKey,
        },
        body: JSON.stringify({
          number: to,
          text: body,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        this.logger.error(
          `Evolution API error [${response.status}]: ${text}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp message to ${to}`, error);
    }
  }

  /**
   * Send OTP message via WhatsApp.
   */
  async sendOTP(to: string, otp: string): Promise<void> {
    const message = `Your Saubh login code is: ${otp}\nValid for 2 minutes. Do not share.`;
    await this.sendMessage(to, message);
  }

  /**
   * Send welcome message after registration.
   */
  async sendWelcome(to: string, name: string): Promise<void> {
    const message = `Welcome to Saubh, ${name}!\nYou are now registered.`;
    await this.sendMessage(to, message);
  }
}
