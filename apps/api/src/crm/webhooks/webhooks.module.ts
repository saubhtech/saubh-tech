import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { EvolutionWebhookController } from './evolution-webhook.controller';
import { WabaWebhookController } from './waba-webhook.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ContactsModule } from '../contacts/contacts.module';
import { BotModule } from '../bot/bot.module';

@Module({
  imports: [PrismaModule, ContactsModule, BotModule],
  controllers: [EvolutionWebhookController, WabaWebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhooksModule {}
