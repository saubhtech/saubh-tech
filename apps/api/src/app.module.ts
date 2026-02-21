import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { MasterModule } from './master/master.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { WhatsappAuthModule } from './auth/whatsapp-auth.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    UserModule,
    WebhookModule,
    AuthModule,
    AdminModule,
    MasterModule,
    WhatsappModule,
    WhatsappAuthModule,
  ],
})
export class AppModule {}
