import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatTranslationProcessor } from './chat-translation.processor';
import { CallController } from './call.controller';
import { CallService } from './call.service';
import { CallSubtitleService } from './call-subtitle.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'chat-translation' }),
  ],
  controllers: [ChatController, CallController],
  providers: [ChatService, ChatTranslationProcessor, CallService, CallSubtitleService],
  exports: [ChatService],
})
export class ChatModule {}
