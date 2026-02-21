import { Module } from '@nestjs/common';
import { ChannelModule } from './channels/channel.module';
import { InboxModule } from './inbox/inbox.module';
import { ContactsModule } from './contacts/contacts.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ChannelModule,
    InboxModule,
    ContactsModule,
    BroadcastModule,
    WebhooksModule,
    BotModule,
  ],
})
export class CrmModule {}
