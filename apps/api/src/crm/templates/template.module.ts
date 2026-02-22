import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
