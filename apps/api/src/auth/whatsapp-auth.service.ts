import {
  Injectable,
  Logger,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from './otp.service';
import { WhatsappSenderService } from '../whatsapp/whatsapp-sender.service';
import * as jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';

/** In-memory rate limit store: whatsapp → list of request timestamps */
const otpRateLimit = new Map<string, number[]>();

@Injectable()
export class WhatsappAuthService {
  private readonly logger = new Logger(WhatsappAuthService.name);
  private readonly jwtSecret: string;
  private readonly jwtExpiry: number;
  private readonly otpMaxPerHour: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly whatsappSender: WhatsappSenderService,
  ) {
    this.jwtSecret = process.env.JWT_SECRET || 'changeme-not-secure';
    this.jwtExpiry = parseInt(process.env.JWT_EXPIRY || '86400', 10);
    this.otpMaxPerHour = parseInt(process.env.OTP_MAX_PER_HOUR || '3', 10);
  }

  /**
   * Register a new user via WhatsApp. Idempotent — returns existing user if already registered.
   */
  async registerUser(
    whatsapp: string,
    fname: string,
    usertype: string,
  ): Promise<User> {
    // Check if user already exists
    const existing = await this.prisma.user.findUnique({
      where: { whatsapp },
    });

    if (existing) {
      return existing;
    }

    // Create new user
    const user = await this.prisma.user.create({
      data: {
        whatsapp,
        fname,
        usertype,
        status: 'A',
      },
    });

    // Send welcome message (fire-and-forget)
    this.whatsappSender.sendWelcome(whatsapp, fname).catch((err) => {
      this.logger.error('Failed to send welcome message', err);
    });

    return user;
  }

  /**
   * Request OTP for an existing user.
   * Throws 404 if not registered. Throws 429 if rate limited.
   */
  async requestOTP(whatsapp: string): Promise<void> {
    // Check user exists
    const user = await this.prisma.user.findUnique({
      where: { whatsapp },
      select: { userid: true },
    });

    if (!user) {
      throw new NotFoundException(
        'WhatsApp number not registered. Please register first.',
      );
    }

    // Rate limit: max N requests per number per hour
    this.enforceRateLimit(whatsapp);

    // Generate and send OTP
    const otp = await this.otpService.generateOTP(whatsapp);

    // Send via WhatsApp (fire-and-forget)
    this.whatsappSender.sendOTP(whatsapp, otp).catch((err) => {
      this.logger.error('Failed to send OTP via WhatsApp', err);
    });
  }

  /**
   * Verify OTP and return JWT + user on success, or null on failure.
   */
  async loginWithOTP(
    whatsapp: string,
    code: string,
  ): Promise<{ token: string; user: User } | null> {
    const valid = await this.otpService.verifyOTP(whatsapp, code);

    if (!valid) return null;

    const user = await this.prisma.user.findUnique({
      where: { whatsapp },
    });

    if (!user) return null;

    // Generate JWT (24hr expiry)
    const token = jwt.sign(
      {
        sub: user.userid.toString(),
        whatsapp: user.whatsapp,
        usertype: user.usertype,
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiry },
    );

    return { token, user };
  }

  /**
   * Enforce rate limit: max OTP_MAX_PER_HOUR requests per WhatsApp number per hour.
   * Throws 429 if exceeded.
   */
  private enforceRateLimit(whatsapp: string): void {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    // Get existing timestamps, filter to last hour
    const timestamps = (otpRateLimit.get(whatsapp) || []).filter(
      (t) => t > oneHourAgo,
    );

    if (timestamps.length >= this.otpMaxPerHour) {
      throw new HttpException(
        'Too many OTP requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    timestamps.push(now);
    otpRateLimit.set(whatsapp, timestamps);
  }
}
