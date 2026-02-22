import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from './otp.service';
import { normalizeWhatsApp } from './normalize-phone';

export interface CommandResult {
  handled: boolean;
  reply?: string;
}

@Injectable()
export class AuthCommandService {
  private readonly logger = new Logger(AuthCommandService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
  ) {}

  /**
   * Normalize WhatsApp number (delegates to shared utility).
   * Kept as public method for backward compat with webhook controllers.
   */
  normalizeWhatsapp(raw: string): string {
    return normalizeWhatsApp(raw);
  }

  /**
   * Check if inbound text is a Register, Passcode, Login, or OTP command.
   * Returns { handled: true, reply } if matched, { handled: false } otherwise.
   */
  async handleCommand(
    rawWhatsapp: string,
    text: string,
    pushName?: string,
  ): Promise<CommandResult> {
    const trimmed = (text || '').trim();
    if (!trimmed) return { handled: false };

    const whatsapp = normalizeWhatsApp(rawWhatsapp);
    const upper = trimmed.toUpperCase();

    // ── "Register <name>" command ──────────────────────────────────
    if (upper.startsWith('REGISTER')) {
      const namePart = trimmed.slice(8).trim();
      const name = namePart || pushName || 'Friend';
      return this.handleRegister(whatsapp, name);
    }

    // ── "Passcode" / "Login" / "OTP" command ────────────────────────
    if (upper === 'PASSCODE' || upper === 'LOGIN' || upper === 'OTP') {
      return this.handlePasscode(whatsapp, pushName);
    }

    return { handled: false };
  }

  // ──────────────────────────────────────────────────────────────────
  // Register: new → create with static passcode | existing → Redis OTP
  // ──────────────────────────────────────────────────────────────────
  private async handleRegister(
    whatsapp: string,
    name: string,
  ): Promise<{ handled: true; reply: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { whatsapp },
    });

    if (!existing) {
      // New user — static passcode = last 4 digits of whatsapp
      const staticPasscode = whatsapp.slice(-4);
      await this.prisma.user.create({
        data: {
          whatsapp,
          fname: name,
          usertype: 'GW',
          status: 'A',
          passcode: staticPasscode,
          passcodeExpiry: null,
        },
      });
      this.logger.log(`Registered new user via WA: ${whatsapp} (${name})`);
      return {
        handled: true,
        reply: this.welcomeMessage(name, whatsapp, staticPasscode),
      };
    }

    // Existing user → generate Redis OTP
    const allowed = await this.otpService.checkRateLimit(whatsapp);
    if (!allowed) {
      return {
        handled: true,
        reply: '\u23F3 Too many requests. Please try again in a minute.',
      };
    }
    const otp = await this.otpService.generateOTP(whatsapp);
    const displayName = existing.fname || name;
    this.logger.log(`Register command from existing user: ${whatsapp}`);
    return {
      handled: true,
      reply: this.welcomeBackMessage(displayName, otp),
    };
  }

  // ──────────────────────────────────────────────────────────────────
  // Passcode: existing → Redis OTP | new → register with static
  // ──────────────────────────────────────────────────────────────────
  private async handlePasscode(
    whatsapp: string,
    pushName?: string,
  ): Promise<{ handled: true; reply: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { whatsapp },
    });

    if (existing) {
      const allowed = await this.otpService.checkRateLimit(whatsapp);
      if (!allowed) {
        return {
          handled: true,
          reply: '\u23F3 Too many requests. Please try again in a minute.',
        };
      }
      const otp = await this.otpService.generateOTP(whatsapp);
      const displayName = existing.fname || 'User';
      this.logger.log(`Passcode command from existing user: ${whatsapp}`);
      return {
        handled: true,
        reply: this.welcomeBackMessage(displayName, otp),
      };
    }

    // New user → register with static passcode
    const name = pushName || 'Friend';
    return this.handleRegister(whatsapp, name);
  }

  // ── Message templates ─────────────────────────────────────────────
  private welcomeMessage(name: string, whatsapp: string, passcode: string): string {
    return [
      `Welcome to Saubh.Tech, ${name}!\u{1F44B}`,
      `Your sign-in credentials are:`,
      `\u{1F517} URL: https://saubh.tech`,
      `\u{1F464} Login: ${whatsapp}`,
      `\u{1F510} Passcode: ${passcode}`,
      ``,
      `This is your permanent passcode.`,
      `You can also type \"Passcode\" anytime to get a temporary OTP.`,
    ].join('\n');
  }

  private welcomeBackMessage(name: string, otp: string): string {
    return [
      `\u{1F44B} Welcome back, ${name}!`,
      `\u{1F522} Your one-time passcode is: ${otp}`,
      `\u{23F0} Valid for 2 minutes only.`,
    ].join('\n');
  }
}
