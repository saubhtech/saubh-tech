import {
  Injectable,
  Inject,
  Logger,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from './otp.service';
import { WhatsappSenderService } from '../whatsapp/whatsapp-sender.service';
import { normalizeWhatsApp } from './normalize-phone';
import * as jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';

@Injectable()
export class WhatsappAuthService {
  private readonly logger = new Logger(WhatsappAuthService.name);
  private readonly jwtSecret: string;
  private readonly jwtExpiry: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly whatsappSender: WhatsappSenderService,
  ) {
    this.jwtSecret = process.env.JWT_SECRET || 'changeme-not-secure';
    this.jwtExpiry = parseInt(process.env.JWT_EXPIRY || '86400', 10);
  }

  /**
   * Register or welcome-back a user via WhatsApp.
   *
   * NEW user: create in DB → await send welcome (with static passcode) via Evolution→WABA.
   * EXISTING user: generate Redis OTP → await send welcome-back (with OTP) via Evolution→WABA.
   *
   * Returns { user, isNew } so the controller can differentiate.
   * THROWS if WhatsApp send fails (both providers down).
   */
  async registerUser(
    whatsapp: string,
    fname: string,
    usertype: string,
  ): Promise<{ user: User; isNew: boolean }> {
    const normalized = normalizeWhatsApp(whatsapp);

    const existing = await this.prisma.user.findUnique({
      where: { whatsapp: normalized },
    });

    if (existing) {
      // Existing user → generate OTP and send welcome-back message
      const allowed = await this.otpService.checkRateLimit(normalized);
      if (!allowed) {
        throw new HttpException(
          'Too many requests. Please try again later.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      const otp = await this.otpService.generateOTP(normalized);
      const displayName = existing.fname || fname;

      // Await send — throws if both providers fail
      await this.whatsappSender.sendMessage(
        normalized,
        [
          `\u{1F44B} Welcome back, ${displayName}!`,
          `\u{1F510} Your one-time passcode is:`,
          `\u{1F522} ${otp}`,
          `\u{23F0} Valid for this login and 2 minutes only.`,
        ].join('\n'),
      );

      this.logger.log(`Register endpoint: existing user ${normalized} — OTP sent`);
      return { user: existing, isNew: false };
    }

    // New user — static passcode = last 4 digits of normalized whatsapp
    const staticPasscode = normalized.slice(-4);

    const user = await this.prisma.user.create({
      data: {
        whatsapp: normalized,
        fname,
        usertype,
        status: 'A',
        passcode: staticPasscode,
        passcodeExpiry: null,
      },
    });

    // Await send welcome — throws if both providers fail
    await this.whatsappSender.sendWelcome(normalized, fname, staticPasscode);

    this.logger.log(`Registered new user: ${normalized} (${fname})`);
    return { user, isNew: true };
  }

  /**
   * Request OTP for an existing user. Stores in Redis (120s TTL).
   * Awaits WhatsApp send — THROWS if send fails.
   * Never writes OTP to Prisma.
   */
  async requestOTP(whatsapp: string): Promise<void> {
    const normalized = normalizeWhatsApp(whatsapp);

    const user = await this.prisma.user.findUnique({
      where: { whatsapp: normalized },
      select: { userid: true, fname: true },
    });

    if (!user) {
      throw new NotFoundException(
        'WhatsApp number not registered. Please register first.',
      );
    }

    // Rate limit via Redis
    const allowed = await this.otpService.checkRateLimit(normalized);
    if (!allowed) {
      throw new HttpException(
        'Too many OTP requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const otp = await this.otpService.generateOTP(normalized);

    // Await send — throws if both providers fail
    await this.whatsappSender.sendOTP(normalized, otp);

    this.logger.log(`OTP sent to ${normalized} for user ${user.userid}`);
  }

  /**
   * Verify OTP/passcode and return JWT + user.
   * Priority: 1) Redis OTP → 2) Prisma static passcode.
   * NEVER clears Prisma passcode — it is permanent.
   */
  async loginWithOTP(
    whatsapp: string,
    code: string,
  ): Promise<{ token: string; user: User } | null> {
    const normalized = normalizeWhatsApp(whatsapp);

    const user = await this.prisma.user.findUnique({
      where: { whatsapp: normalized },
    });

    if (!user) return null;

    // 1) Check Redis OTP first
    const redisValid = await this.otpService.verifyOTP(normalized, code);
    if (redisValid) {
      return { token: this.issueJwt(user), user };
    }

    // 2) Fallback: check static passcode in Prisma (never cleared)
    if (user.passcode && user.passcode === code) {
      return { token: this.issueJwt(user), user };
    }

    // 3) Neither matched
    return null;
  }

  /**
   * Issue JWT token for a user (24h expiry).
   */
  private issueJwt(user: User): string {
    return jwt.sign(
      {
        sub: user.userid.toString(),
        whatsapp: user.whatsapp,
        usertype: user.usertype,
        fname: user.fname,
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiry },
    );
  }
}
