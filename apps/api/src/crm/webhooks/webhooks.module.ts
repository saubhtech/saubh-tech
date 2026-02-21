import { Module } from '@nestjs/common';
import { EvolutionWebhookController } from './evolution-webhook.controller';
import { WabaWebhookController } from './waba-webhook.controller';
import { WebhookService } from './webhook.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ContactsModule } from '../contacts/contacts.module';

@Module({
  imports: [PrismaModule, ContactsModule],
  controllers: [EvolutionWebhookController, WabaWebhookController],
  providers: [WebhookService],
})
export class WebhooksModule {}
