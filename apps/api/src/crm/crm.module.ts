import { Module } from '@nestjs/common';
import { ChannelModule } from './channels/channel.module';

@Module({
  imports: [ChannelModule],
  exports: [ChannelModule],
})
export class CrmModule {}
