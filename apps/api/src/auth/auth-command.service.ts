import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from './otp.service';

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
   * Normalize WhatsApp number: strip +, spaces, @s.whatsapp.net.
   * Result: 91XXXXXXXXXX (never +91).
   */
  normalizeWhatsapp(raw: string): string {
    let num = raw
      .replace(/@s\.whatsapp\.net$/i, '')
      .replace(/[+\s\-()]/g, '');
    return num;
  }

  /**
   * Check if inbound text is a Register or Passcode command.
   * Returns { handled: true, reply } if command matched, { handled: false } otherwise.
   */
  async handleCommand(
    rawWhatsapp: string,
    text: string,
    pushName?: string,
  ): Promise<CommandResult> {
    const trimmed = (text || '').trim();
    if (!trimmed) return { handled: false };

    const whatsapp = this.normalizeWhatsapp(rawWhatsapp);

    // ── "Register <Name>" command ──────────────────────────────────────
    const registerMatch = trimmed.match(/^register\s+(.+)$/i);
    if (registerMatch) {
      const name = registerMatch[1].trim();
      if (name) {
        return this.handleRegister(whatsapp, name);
      }
    }

    // ── "Passcode" command ─────────────────────────────────────────────
    if (trimmed.toLowerCase() === 'passcode') {
      return this.handlePasscode(whatsapp, pushName);
    }

    return { handled: false };
  }

  // ──────────────────────────────────────────────────────────────────────
  // Register: user NOT found → create + welcome | found → welcome back
  // ──────────────────────────────────────────────────────────────────────
  private async handleRegister(
    whatsapp: string,
    name: string,
  ): Promise<{ handled: true; reply: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { whatsapp },
    });

    if (!existing) {
      // New user
      await this.prisma.user.create({
        data: { whatsapp, fname: name, usertype: 'GW', status: 'A' },
      });
      const passcode = await this.otpService.generateOTP(whatsapp);
      this.logger.log(`Registered new user via WA: ${whatsapp} (${name})`);
      return {
        handled: true,
        reply: this.welcomeMessage(name, whatsapp, passcode),
      };
    }

    // Existing user → send passcode
    const passcode = await this.otpService.generateOTP(whatsapp);
    const displayName = existing.fname || name;
    this.logger.log(`Register command from existing user: ${whatsapp}`);
    return {
      handled: true,
      reply: this.welcomeBackMessage(displayName, passcode),
    };
  }

  // ──────────────────────────────────────────────────────────────────────
  // Passcode: user found → welcome back | NOT found → create + welcome
  // ──────────────────────────────────────────────────────────────────────
  private async handlePasscode(
    whatsapp: string,
    pushName?: string,
  ): Promise<{ handled: true; reply: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { whatsapp },
    });

    if (existing) {
      // Existing user → send passcode
      const passcode = await this.otpService.generateOTP(whatsapp);
      const displayName = existing.fname || 'User';
      this.logger.log(`Passcode command from existing user: ${whatsapp}`);
      return {
        handled: true,
        reply: this.welcomeBackMessage(displayName, passcode),
      };
    }

    // New user → create with pushName then welcome
    const name = pushName || 'User';
    await this.prisma.user.create({
      data: { whatsapp, fname: name, usertype: 'GW', status: 'A' },
    });
    const passcode = await this.otpService.generateOTP(whatsapp);
    this.logger.log(`Auto-registered user via Passcode command: ${whatsapp} (${name})`);
    return {
      handled: true,
      reply: this.welcomeMessage(name, whatsapp, passcode),
    };
  }

  // ── Message templates ─────────────────────────────────────────────────
  private welcomeMessage(name: string, whatsapp: string, passcode: string): string {
    return [
      `Welcome to Saubh.Tech, ${name}!\u{1F44B}`,
      `Your sign-in credentials are:`,
      `\u{1F517} URL: https://saubh.tech`,
      `\u{1F464} Login: ${whatsapp}`,
      `\u{1F510} Passcode: ${passcode}`,
    ].join('\n');
  }

  private welcomeBackMessage(name: string, passcode: string): string {
    return [
      `\u{1F44B} Welcome back, ${name}!`,
      `\u{1F522} Your one-time passcode is: ${passcode}`,
      `\u{23F0} Valid for 2 minutes only.`,
    ].join('\n');
  }
}
