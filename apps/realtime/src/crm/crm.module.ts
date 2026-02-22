import { Module } from '@nestjs/common';
import { CrmGateway } from './crm.gateway';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [CrmGateway],
})
export class CrmModule {}
