import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChannelService } from './channel.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
