import { Module, forwardRef } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { EvolutionWebhookController } from './evolution-webhook.controller';
import { WabaWebhookController } from './waba-webhook.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ContactsModule } from '../contacts/contacts.module';
import { BotModule } from '../bot/bot.module';
import { WhatsappAuthModule } from '../../auth/whatsapp-auth.module';
import { ChannelModule } from '../channels/channel.module';

@Module({
  imports: [
    PrismaModule,
    ContactsModule,
    BotModule,
    forwardRef(() => WhatsappAuthModule),
    ChannelModule,
  ],
  controllers: [EvolutionWebhookController, WabaWebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhooksModule {}
