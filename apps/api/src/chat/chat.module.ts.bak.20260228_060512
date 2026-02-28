import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatTranslationProcessor } from './chat-translation.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'chat-translation' }),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatTranslationProcessor],
  exports: [ChatService],
})
export class ChatModule {}
