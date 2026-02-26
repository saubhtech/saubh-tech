import { GigModule } from './gig/gig.module';
import { Module } from '@nestjs/common';
import { I18nModule } from './i18n/i18n.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { MasterModule } from './master/master.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { WhatsappAuthModule } from './auth/whatsapp-auth.module';
import { CrmModule } from './crm/crm.module';
import { ProfileModule } from './auth/profile.module';
import { BackupModule } from './backup/backup.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),
    PrismaModule,
    HealthModule,
    UserModule,
    WebhookModule,
    AuthModule,
    AdminModule,
    MasterModule,
    WhatsappModule,
    WhatsappAuthModule,
    CrmModule,
    ProfileModule,
    BackupModule,
    I18nModule,
    GigModule,
  ],
})
export class AppModule {}
