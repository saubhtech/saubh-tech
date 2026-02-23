import { Module } from '@nestjs/common';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';
import { BackupScheduler } from './backup.scheduler';
import { BackupDriveService } from './backup.drive.service';

/**
 * BackupModule — backup management endpoints + scheduled jobs + Google Drive.
 * Standalone module (not part of CRM).
 * No database/Prisma dependency — works with filesystem only.
 */
@Module({
  controllers: [BackupController],
  providers: [BackupService, BackupScheduler, BackupDriveService],
  exports: [BackupService],
})
export class BackupModule {}
