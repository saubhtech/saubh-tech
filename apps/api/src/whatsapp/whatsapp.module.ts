import { Module, forwardRef } from '@nestjs/common';
import { WhatsappSenderService } from './whatsapp-sender.service';
import { WhatsappWebhookController } from './whatsapp-webhook.controller';
import { WhatsappAuthModule } from '../auth/whatsapp-auth.module';

@Module({
  imports: [forwardRef(() => WhatsappAuthModule)],
  controllers: [WhatsappWebhookController],
  providers: [WhatsappSenderService],
  exports: [WhatsappSenderService],
})
export class WhatsappModule {}
