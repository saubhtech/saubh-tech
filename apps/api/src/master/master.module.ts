import { Module } from '@nestjs/common';
import { MasterController } from './master.controller';
import { MasterGeoController } from './master-geo.controller';
import { MasterService } from './master.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MasterController, MasterGeoController],
  providers: [MasterService],
  exports: [MasterService],
})
export class MasterModule {}
