import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { ProfileController } from './profile.controller';

/**
 * ProfileModule — profile completion endpoints.
 * Imports PrismaModule for DB access and WhatsappModule for OTP delivery.
 * Does NOT modify WhatsappAuthModule or any existing module.
 */
@Module({
  imports: [PrismaModule, forwardRef(() => WhatsappModule)],
  controllers: [ProfileController],
})
export class ProfileModule {}
