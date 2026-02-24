import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';

@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  private readonly logger = new Logger(AuthRateLimitGuard.name);

  constructor(@Inject('REDIS') private readonly redis: any) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
    const path = request.route?.path || request.url || '';
    const whatsapp = request.body?.whatsapp || '';

    try {
      if (path.includes('register')) {
        await this.check(`rl:reg:${ip}`, 5, 600, 'Too many registrations. Try again in 10 minutes.');
      } else if (path.includes('request-otp')) {
        await this.check(`rl:otp:ip:${ip}`, 10, 60, 'Too many OTP requests from this IP.');
        await this.check(`rl:otp:num:${whatsapp}`, 3, 60, 'Too many OTP requests. Wait 1 minute.');
      } else if (path.includes('verify-otp')) {
        await this.check(`rl:verify:${whatsapp}`, 5, 300, 'Too many failed attempts. Try again in 5 minutes.');
        await this.check(`rl:verify:ip:${ip}`, 15, 300, 'Too many verification attempts from this IP.');
      }
      return true;
    } catch (err: any) {
      // Re-throw rate limit exceptions to the client
      if (err instanceof HttpException) throw err;
      // Only swallow Redis errors
      this.logger.error(`Rate limit check failed: ${err.message}`);
      return true;
    }
  }

  private async check(key: string, limit: number, windowSec: number, message: string): Promise<void> {
    const count = await this.redis.incr(key);
    if (count === 1) {
      await this.redis.expire(key, windowSec);
    }
    if (count > limit) {
      this.logger.warn(`Rate limited: ${key} (${count}/${limit})`);
      throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}
