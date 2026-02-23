import { Module } from '@nestjs/common';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';
import { BackupScheduler } from './backup.scheduler';

/**
 * BackupModule — backup management endpoints + scheduled jobs.
 * Standalone module (not part of CRM).
 * No database/Prisma dependency — works with filesystem only.
 */
@Module({
  controllers: [BackupController],
  providers: [BackupService, BackupScheduler],
  exports: [BackupService],
})
export class BackupModule {}
