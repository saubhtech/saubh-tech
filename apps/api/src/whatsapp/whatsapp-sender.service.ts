import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

type Provider = 'evolution' | 'waba';

interface SendResult {
  success: boolean;
  provider: Provider;
  externalId?: string;
  error?: string;
}

/**
 * WhatsApp message sender with automatic failover.
 *
 * PRIMARY provider is controlled by env WHATSAPP_PRIMARY (default: evolution).
 * If primary fails, automatically falls back to secondary.
 * Circuit breaker: after CIRCUIT_THRESHOLD consecutive failures on a provider,
 * that provider is marked "open" (skipped) for CIRCUIT_RESET_MS.
 *
 * To switch primary instantly (e.g. after ban):
 *   1. Set WHATSAPP_PRIMARY=waba in .env
 *   2. pm2 restart api
 *
 * To swap Evolution number:
 *   1. Create new instance in Evolution API
 *   2. Update EVOLUTION_INSTANCE + scan QR
 *   3. pm2 restart api
 */
@Injectable()
export class WhatsappSenderService {
  private readonly logger = new Logger(WhatsappSenderService.name);

  // ── Circuit breaker state ──────────────────────────────────────────
  private readonly CIRCUIT_THRESHOLD = 1;   // failures before circuit opens
  private readonly CIRCUIT_RESET_MS = 5 * 60 * 1000; // 5 minutes

  private circuitState: Record<Provider, {
    failures: number;
    openUntil: number; // timestamp when circuit closes again
  }> = {
    evolution: { failures: 0, openUntil: 0 },
    waba: { failures: 0, openUntil: 0 },
  };

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  // ── Public API ─────────────────────────────────────────────────────

  /**
   * Send a plain text message with automatic failover.
   * Tries primary provider first, falls back to secondary on failure.
   * THROWS if both providers fail — callers must handle the error.
   */
  async sendMessage(to: string, body: string): Promise<void> {
    const primary = this.getPrimary();
    const secondary: Provider = primary === 'evolution' ? 'waba' : 'evolution';

    // Try primary (if circuit is closed)
    if (!this.isCircuitOpen(primary)) {
      const result = await this.sendVia(primary, to, body);
      if (result.success) {
        this.recordSuccess(primary);
        this.logger.log(`[${primary.toUpperCase()}] Sent to ${to}: ${result.externalId || 'ok'}`);
        return;
      }
      this.recordFailure(primary);
      this.logger.warn(`[${primary.toUpperCase()}] Failed for ${to}: ${result.error} — trying ${secondary.toUpperCase()}`);
    } else {
      this.logger.warn(`[${primary.toUpperCase()}] Circuit OPEN — skipping, using ${secondary.toUpperCase()}`);
    }

    // Try secondary (if circuit is closed)
    if (!this.isCircuitOpen(secondary)) {
      const result = await this.sendVia(secondary, to, body);
      if (result.success) {
        this.recordSuccess(secondary);
        this.logger.log(`[${secondary.toUpperCase()}] Fallback sent to ${to}: ${result.externalId || 'ok'}`);
        return;
      }
      this.recordFailure(secondary);
      const errMsg = `Both WhatsApp providers failed for ${to}. Primary: ${primary}, Secondary: ${secondary} — ${result.error}`;
      this.logger.error(errMsg);
      throw new Error(errMsg);
    } else {
      const errMsg = `BOTH providers have circuit OPEN — message to ${to} DROPPED`;
      this.logger.error(errMsg);
      throw new Error(errMsg);
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
  async sendWelcome(to: string, name: string, passcode: string): Promise<void> {
    const message = [
      `Welcome to Saubh.Tech, ${name}!\u{1F44B}`,
      `Your sign-in credentials are:`,
      `\u{1F517} URL: https://saubh.tech`,
      `\u{1F464} Login: ${to}`,
      `\u{1F510} Passcode: ${passcode}`,
      ``,
      `This is your permanent passcode.`,
      `You can also type "Passcode" anytime to get a temporary OTP.`,
    ].join('\n');
    await this.sendMessage(to, message);
  }

  /**
   * Get current provider health status (for health endpoints / monitoring).
   */
  getProviderStatus() {
    const now = Date.now();
    return {
      primary: this.getPrimary(),
      evolution: {
        circuitOpen: this.isCircuitOpen('evolution'),
        consecutiveFailures: this.circuitState.evolution.failures,
        opensAt: this.circuitState.evolution.openUntil > now
          ? new Date(this.circuitState.evolution.openUntil).toISOString()
          : null,
      },
      waba: {
        circuitOpen: this.isCircuitOpen('waba'),
        consecutiveFailures: this.circuitState.waba.failures,
        opensAt: this.circuitState.waba.openUntil > now
          ? new Date(this.circuitState.waba.openUntil).toISOString()
          : null,
      },
    };
  }

  /**
   * Manually reset circuit breaker for a provider (e.g. after fixing issue).
   */
  resetCircuit(provider: Provider) {
    this.circuitState[provider] = { failures: 0, openUntil: 0 };
    this.logger.log(`Circuit breaker RESET for ${provider.toUpperCase()}`);
  }

  // ── Provider routing ───────────────────────────────────────────────

  private getPrimary(): Provider {
    const env = this.config.get<string>('WHATSAPP_PRIMARY', 'evolution');
    return env === 'waba' ? 'waba' : 'evolution';
  }

  private async sendVia(provider: Provider, to: string, body: string): Promise<SendResult> {
    if (provider === 'evolution') {
      return this.sendViaEvolution(to, body);
    }
    return this.sendViaWaba(to, body);
  }

  // ── Circuit breaker logic ──────────────────────────────────────────

  private isCircuitOpen(provider: Provider): boolean {
    const state = this.circuitState[provider];
    if (state.openUntil === 0) return false;
    if (Date.now() >= state.openUntil) {
      // Circuit timeout expired — half-open, allow retry
      this.circuitState[provider] = { failures: 0, openUntil: 0 };
      this.logger.log(`[${provider.toUpperCase()}] Circuit HALF-OPEN — retrying`);
      return false;
    }
    return true;
  }

  private recordSuccess(provider: Provider) {
    if (this.circuitState[provider].failures > 0) {
      this.circuitState[provider] = { failures: 0, openUntil: 0 };
    }
  }

  private recordFailure(provider: Provider) {
    const state = this.circuitState[provider];
    state.failures++;
    if (state.failures >= this.CIRCUIT_THRESHOLD) {
      state.openUntil = Date.now() + this.CIRCUIT_RESET_MS;
      this.logger.error(
        `[${provider.toUpperCase()}] Circuit OPEN after ${state.failures} consecutive failures. ` +
        `Will retry at ${new Date(state.openUntil).toISOString()}`
      );
    }
  }

  // ── Evolution API sender ───────────────────────────────────────────

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

  private async sendViaEvolution(to: string, body: string): Promise<SendResult> {
    const baseUrl = this.config.get<string>('EVOLUTION_API_URL', 'http://localhost:8081');
    const apiKey = this.config.get<string>('EVOLUTION_API_KEY', '');
    const instance = await this.getInstanceName();

    if (!instance) {
      return { success: false, provider: 'evolution', error: 'No Evolution instance configured' };
    }

    try {
      const url = `${baseUrl}/message/sendText/${instance}`;
      const { data } = await firstValueFrom(
        this.http.post(
          url,
          { number: to, text: body },
          {
            headers: { apikey: apiKey, 'Content-Type': 'application/json' },
            timeout: 10000,
          },
        ),
      );
      return { success: true, provider: 'evolution', externalId: data?.key?.id };
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      return { success: false, provider: 'evolution', error: errMsg };
    }
  }

  // ── WABA (Meta Cloud API) sender ───────────────────────────────────

  private async sendViaWaba(to: string, body: string): Promise<SendResult> {
    const phoneNumberId = this.config.get<string>('WABA_PHONE_NUMBER_ID', '');
    const accessToken = this.config.get<string>('WABA_ACCESS_TOKEN', '');

    if (!phoneNumberId || !accessToken) {
      return { success: false, provider: 'waba', error: 'WABA credentials not configured' };
    }

    try {
      const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
      const { data } = await firstValueFrom(
        this.http.post(
          url,
          {
            messaging_product: 'whatsapp',
            to,
            type: 'text',
            text: { body },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            timeout: 15000,
          },
        ),
      );
      const msgId = data?.messages?.[0]?.id;
      return { success: true, provider: 'waba', externalId: msgId };
    } catch (err: any) {
      const errMsg = err?.response?.data?.error?.message || err.message;
      return { success: false, provider: 'waba', error: errMsg };
    }
  }
}
