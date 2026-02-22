import { Module, forwardRef, Logger } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { OtpService } from './otp.service';
import { WhatsappAuthService } from './whatsapp-auth.service';
import { WhatsappAuthController } from './whatsapp-auth.controller';
import { AuthCommandService } from './auth-command.service';

/**
 * Redis provider — uses same env vars as BullMQ (REDIS_HOST, REDIS_PORT, REDIS_PASSWORD).
 * Gracefully handles connection errors (logs, does not crash).
 */
const RedisProvider = {
  provide: 'REDIS',
  useFactory: async () => {
    const logger = new Logger('RedisProvider');
    try {
      // ioredis is available via bullmq transitive dependency
      const Redis = (await import('ioredis')).default;
      const redis = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        db: 0,
        lazyConnect: false,
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => Math.min(times * 200, 5000),
      });
      redis.on('error', (err: any) => {
        logger.error(`Redis connection error: ${err.message}`);
      });
      redis.on('connect', () => {
        logger.log('Redis connected for OTP service');
      });
      return redis;
    } catch (err: any) {
      // If ioredis is not available, return a no-op stub
      logger.error(`Failed to initialize Redis: ${err.message}. OTP will only work via static passcode.`);
      return {
        set: async () => null,
        get: async () => null,
        del: async () => 0,
        incr: async () => 1,
        expire: async () => 0,
      };
    }
  },
};

@Module({
  imports: [PrismaModule, forwardRef(() => WhatsappModule)],
  controllers: [WhatsappAuthController],
  providers: [RedisProvider, OtpService, WhatsappAuthService, AuthCommandService],
  exports: [WhatsappAuthService, AuthCommandService, 'REDIS'],
})
export class WhatsappAuthModule {}
