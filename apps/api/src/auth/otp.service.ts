import { Injectable, Inject, Logger } from '@nestjs/common';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(@Inject('REDIS') private readonly redis: any) {}

  /**
   * Generate a 4-digit OTP and store in Redis with 120s TTL.
   * Returns the code string (zero-padded).
   * NEVER writes to Prisma — OTP is Redis-only.
   */
  async generateOTP(whatsapp: string): Promise<string> {
    const code = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    try {
      await this.redis.set(`otp:wa:${whatsapp}`, code, 'EX', 120);
    } catch (err: any) {
      this.logger.error(`Redis SET otp:wa:${whatsapp} failed: ${err.message}`);
      // Don't throw — caller sends OTP via WhatsApp anyway,
      // login will fall back to static passcode in Prisma
    }

    return code;
  }

  /**
   * Verify OTP from Redis. Returns true if valid, false otherwise.
   * On success, deletes the key (one-time use).
   */
  async verifyOTP(whatsapp: string, code: string): Promise<boolean> {
    try {
      const stored = await this.redis.get(`otp:wa:${whatsapp}`);
      if (!stored) return false;
      if (stored !== code) return false;

      // Valid — delete to prevent reuse
      await this.redis.del(`otp:wa:${whatsapp}`);
      return true;
    } catch (err: any) {
      this.logger.error(`Redis OTP verify failed for ${whatsapp}: ${err.message}`);
      return false; // fallback to static passcode in caller
    }
  }

  /**
   * Rate limit: max 3 OTP requests per minute per number.
   * Returns true if allowed, false if rate limited.
   */
  async checkRateLimit(whatsapp: string): Promise<boolean> {
    const key = `ratelimit:otp:${whatsapp}`;
    try {
      const count = await this.redis.incr(key);
      if (count === 1) {
        await this.redis.expire(key, 60);
      }
      return count <= 3;
    } catch (err: any) {
      this.logger.error(`Redis rate limit check failed: ${err.message}`);
      return true; // allow on Redis failure
    }
  }

  /**
   * Webhook dedupe: returns true if NEW message, false if duplicate.
   */
  async dedupeCheck(key: string): Promise<boolean> {
    try {
      const result = await this.redis.set(`dedupe:${key}`, '1', 'EX', 120, 'NX');
      return result === 'OK';
    } catch (err: any) {
      this.logger.error(`Redis dedupe check failed: ${err.message}`);
      return true; // process on Redis failure
    }
  }
}
