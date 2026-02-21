import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

export interface SendMessagePayload {
  to: string;       // e.g. '918800607598'
  body: string;
  mediaUrl?: string;
}

export interface SendResult {
  success: boolean;
  externalId?: string;
  error?: string;
}

@Injectable()
export class ChannelService {
  private readonly logger = new Logger(ChannelService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  // ─── Get all channels ───────────────────────────────────────────────
  async getChannels() {
    return this.prisma.waChannel.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ─── Get single channel ─────────────────────────────────────────────
  async getChannel(channelId: string) {
    const channel = await this.prisma.waChannel.findUnique({
      where: { id: channelId },
    });
    if (!channel) throw new NotFoundException(`Channel ${channelId} not found`);
    return channel;
  }

  // ─── Send message via correct provider ──────────────────────────────
  async sendMessage(channelId: string, payload: SendMessagePayload): Promise<SendResult> {
    const channel = await this.getChannel(channelId);

    if (channel.type === 'EVOLUTION') {
      return this.sendViaEvolution(channel.instanceName!, payload);
    }

    if (channel.type === 'WABA') {
      return this.sendViaWaba(payload);
    }

    return { success: false, error: `Unknown channel type: ${channel.type}` };
  }

  // ─── Evolution API (SIM-based) ──────────────────────────────────────
  private async sendViaEvolution(
    instanceName: string,
    payload: SendMessagePayload,
  ): Promise<SendResult> {
    const baseUrl = this.config.get<string>('EVOLUTION_API_URL', 'http://localhost:8081');
    const apiKey = this.config.get<string>('EVOLUTION_API_KEY', '');

    try {
      // Text message
      const url = `${baseUrl}/message/sendText/${instanceName}`;
      const body = {
        number: payload.to,
        text: payload.body,
      };

      const { data } = await firstValueFrom(
        this.http.post(url, body, {
          headers: { apikey: apiKey, 'Content-Type': 'application/json' },
        }),
      );

      this.logger.log(`Evolution sent to ${payload.to}: ${data?.key?.id || 'ok'}`);
      return { success: true, externalId: data?.key?.id };
    } catch (err: any) {
      this.logger.error(`Evolution send failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  // ─── Meta WABA (WhatsApp Business Cloud API) ────────────────────────
  private async sendViaWaba(payload: SendMessagePayload): Promise<SendResult> {
    const phoneNumberId = this.config.get<string>('WABA_PHONE_NUMBER_ID', '');
    const accessToken = this.config.get<string>('WABA_ACCESS_TOKEN', '');

    if (!phoneNumberId || !accessToken || phoneNumberId === 'PLACEHOLDER') {
      this.logger.warn('WABA credentials not configured — skipping send');
      return { success: false, error: 'WABA not configured' };
    }

    try {
      const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
      const body = {
        messaging_product: 'whatsapp',
        to: payload.to,
        type: 'text',
        text: { body: payload.body },
      };

      const { data } = await firstValueFrom(
        this.http.post(url, body, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      const msgId = data?.messages?.[0]?.id;
      this.logger.log(`WABA sent to ${payload.to}: ${msgId || 'ok'}`);
      return { success: true, externalId: msgId };
    } catch (err: any) {
      const errMsg = err?.response?.data?.error?.message || err.message;
      this.logger.error(`WABA send failed: ${errMsg}`);
      return { success: false, error: errMsg };
    }
  }
}
