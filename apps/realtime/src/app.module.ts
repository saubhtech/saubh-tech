import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ChatModule } from './chat/chat.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [HealthModule, ChatModule, RedisModule],
})
export class AppModule {}
