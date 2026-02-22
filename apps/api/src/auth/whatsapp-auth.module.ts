import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { OtpService } from './otp.service';
import { WhatsappAuthService } from './whatsapp-auth.service';
import { WhatsappAuthController } from './whatsapp-auth.controller';
import { AuthCommandService } from './auth-command.service';

@Module({
  imports: [PrismaModule, forwardRef(() => WhatsappModule)],
  controllers: [WhatsappAuthController],
  providers: [OtpService, WhatsappAuthService, AuthCommandService],
  exports: [WhatsappAuthService, AuthCommandService],
})
export class WhatsappAuthModule {}
