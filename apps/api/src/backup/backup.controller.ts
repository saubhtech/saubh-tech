import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BackupService } from './backup.service';
import { BackupScheduler } from './backup.scheduler';
import { BackupDriveService } from './backup.drive.service';

/**
 * BackupController — REST endpoints for backup management.
 *
 * All endpoints require X-Backup-Password header matching
 * BACKUP_MANAGER_PASSWORD env var.
 *
 * Routes:
 *   POST   /api/backup/create              — start backup
 *   GET    /api/backup/list                 — list all backups
 *   GET    /api/backup/status/:id           — get backup status
 *   DELETE /api/backup/:id                  — delete backup
 *   GET    /api/backup/download/:id/:type   — download file
 *   POST   /api/backup/restore/:id          — start restore
 *   GET    /api/backup/restore/progress/:jobId — restore progress
 *   GET    /api/backup/schedule             — get schedule config
 *   POST   /api/backup/schedule             — save schedule config
 */
@Controller('backup')
export class BackupController {
  private readonly logger = new Logger(BackupController.name);

  constructor(
    private readonly backupService: BackupService,
    private readonly backupScheduler: BackupScheduler,
    private readonly driveService: BackupDriveService,
  ) {}

  // ─── Password Check ─────────────────────────────────────────────────────

  private checkPassword(req: Request): void {
    const password = req.headers['x-backup-password'] as string;
    const expected = process.env.BACKUP_MANAGER_PASSWORD;

    if (!expected) {
      throw new UnauthorizedException('BACKUP_MANAGER_PASSWORD not configured on server.');
    }
    if (!password || password !== expected) {
      throw new UnauthorizedException('Invalid backup password.');
    }
  }

  // ─── POST /api/backup/create ────────────────────────────────────────────

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createBackup(@Req() req: Request, @Body() body: any) {
    this.checkPassword(req);
    const notes = body?.notes || '';
    const result = await this.backupService.createBackup('manual', notes);
    this.logger.log(`Manual backup initiated: ${result.id}`);
    return result;
  }

  // ─── GET /api/backup/list ───────────────────────────────────────────────

  @Get('list')
  async listBackups(@Req() req: Request) {
    this.checkPassword(req);
    return this.backupService.listBackups();
  }

  // ─── GET /api/backup/status/:id ─────────────────────────────────────────

  @Get('status/:id')
  async getStatus(@Req() req: Request, @Param('id') id: string) {
    this.checkPassword(req);
    return this.backupService.getStatus(id);
  }

  // ─── DELETE /api/backup/:id ─────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteBackup(@Req() req: Request, @Param('id') id: string) {
    this.checkPassword(req);
    await this.backupService.deleteBackup(id);
    return { success: true, deleted: id };
  }

  // ─── GET /api/backup/download/:id/:type ─────────────────────────────────

  @Get('download/:id/:type')
  async downloadFile(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Param('type') type: string,
  ) {
    this.checkPassword(req);
    if (type !== 'code' && type !== 'db') {
      throw new BadRequestException('type must be "code" or "db"');
    }
    await this.backupService.streamFile(id, type as 'code' | 'db', res);
  }

  // ─── POST /api/backup/restore/:id ──────────────────────────────────────

  @Post('restore/:id')
  @HttpCode(HttpStatus.OK)
  async restoreBackup(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    this.checkPassword(req);

    // Double confirmation required
    if (!body?.confirm || body.confirm !== 'RESTORE') {
      throw new BadRequestException('Must send { confirm: "RESTORE" } to proceed.');
    }
    if (!body?.confirmId || body.confirmId !== id) {
      throw new BadRequestException('confirmId must match the backup ID.');
    }

    const result = await this.backupService.restoreBackup(id);
    this.logger.warn(`Restore initiated for backup ${id}, job: ${result.jobId}`);
    return result;
  }

  // ─── GET /api/backup/restore/progress/:jobId ───────────────────────────

  @Get('restore/progress/:jobId')
  getRestoreProgress(@Req() req: Request, @Param('jobId') jobId: string) {
    this.checkPassword(req);
    return this.backupService.getRestoreStatus(jobId);
  }

  // ─── GET /api/backup/schedule ───────────────────────────────────────────

  @Get('schedule')
  async getSchedule(@Req() req: Request) {
    this.checkPassword(req);
    return this.backupService.getSchedule();
  }

  // ─── POST /api/backup/schedule ──────────────────────────────────────────

  @Post('schedule')
  @HttpCode(HttpStatus.OK)
  async saveSchedule(@Req() req: Request, @Body() body: any) {
    this.checkPassword(req);
    await this.backupService.saveSchedule(body);
    await this.backupScheduler.reload();
    return { success: true, message: 'Schedule saved.' };
  }

  // ─── GET /api/backup/drive/status ──────────────────────────────────────

  @Get('drive/status')
  getDriveStatus(@Req() req: Request) {
    this.checkPassword(req);
    return this.driveService.getConnectionStatus();
  }

  // ─── POST /api/backup/drive/upload/:id ─────────────────────────────────

  @Post('drive/upload/:id')
  @HttpCode(HttpStatus.OK)
  async uploadToDrive(@Req() req: Request, @Param('id') id: string) {
    this.checkPassword(req);
    return this.driveService.uploadBackup(id);
  }

  // ─── GET /api/backup/drive/progress/:jobKey ────────────────────────────

  @Get('drive/progress/:jobKey')
  getDriveProgress(@Req() req: Request, @Param('jobKey') jobKey: string) {
    this.checkPassword(req);
    const progress = this.driveService.getUploadProgress(jobKey);
    if (!progress) return { status: 'not_found' };
    return progress;
  }

  // ─── GET /api/backup/drive/files ───────────────────────────────────────

  @Get('drive/files')
  async listDriveFiles(@Req() req: Request) {
    this.checkPassword(req);
    return this.driveService.listFiles();
  }

  // ─── DELETE /api/backup/drive/file/:fileId ─────────────────────────────

  @Delete('drive/file/:fileId')
  @HttpCode(HttpStatus.OK)
  async deleteDriveFile(@Req() req: Request, @Param('fileId') fileId: string) {
    this.checkPassword(req);
    await this.driveService.deleteFile(fileId);
    return { success: true, deleted: fileId };
  }
}
