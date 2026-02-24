import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsappSenderService {
  private readonly logger = new Logger(WhatsappSenderService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Resolve Evolution instance name: DB first, env fallback.
   */
  private async getInstanceName(): Promise<string> {
    try {
      const channel = await this.prisma.waChannel.findFirst({
        where: { type: 'EVOLUTION', isActive: true },
        select: { instanceName: true },
      });
      if (channel?.instanceName) return channel.instanceName;
    } catch (err: any) {
      this.logger.warn(`Failed to get instance from DB: ${err.message}`);
    }
    return this.config.get<string>('EVOLUTION_INSTANCE', '');
  }

  /**
   * Send a plain text message via Evolution API.
   * Uses same config approach as CRM ChannelService (proven working).
   */
  async sendMessage(to: string, body: string): Promise<void> {
    const baseUrl = this.config.get<string>('EVOLUTION_API_URL', 'http://localhost:8081');
    const apiKey = this.config.get<string>('EVOLUTION_API_KEY', '');
    const instance = await this.getInstanceName();

    if (!instance) {
      this.logger.error('No Evolution instance configured — cannot send message');
      return;
    }

    try {
      const url = `${baseUrl}/message/sendText/${instance}`;

      const { data } = await firstValueFrom(
        this.http.post(
          url,
          { number: to, text: body },
          {
            headers: { apikey: apiKey, 'Content-Type': 'application/json' },
          },
        ),
      );

      this.logger.log(`Sent to ${to}: ${data?.key?.id || 'ok'}`);
    } catch (err: any) {
      this.logger.error(
        `Failed to send WhatsApp message to ${to}: ${err.message}`,
      );
    }
  }

  /**
   * Send OTP message via WhatsApp.
   */
  async sendOTP(to: string, otp: string): Promise<void> {
    const message = [
      `\u{1F522} Your Saubh login code is: ${otp}`,
      `\u{23F0} Valid for 2 minutes. Do not share.`,
    ].join('\n');
    await this.sendMessage(to, message);
  }

  /**
   * Send welcome message after registration.
   */
  async sendWelcome(
    to: string,
    name: string,
    passcode: string,
  ): Promise<void> {
    const message = [
      `Welcome to Saubh.Tech, ${name}!\u{1F44B}`,
      `\u{1F517} URL: https://saubh.tech`,
      `\u{1F464} Login: ${to}`,
      `\u{1F510} Passcode: ${passcode}`,
      ``,
      `This is your permanent passcode.`,
      `You can also type "Passcode" anytime to get a temporary OTP.`,
    ].join('\n');
    await this.sendMessage(to, message);
  }
}
