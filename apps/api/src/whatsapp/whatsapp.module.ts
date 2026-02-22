import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { WhatsappSenderService } from './whatsapp-sender.service';
import { WhatsappWebhookController } from './whatsapp-webhook.controller';
import { WhatsappAuthModule } from '../auth/whatsapp-auth.module';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    forwardRef(() => WhatsappAuthModule),
  ],
  controllers: [WhatsappWebhookController],
  providers: [WhatsappSenderService],
  exports: [WhatsappSenderService],
})
export class WhatsappModule {}
