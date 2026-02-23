import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const BACKUP_DIR = '/data/backups';
const SERVICE_ACCOUNT_PATH = '/data/backups/google-service-account.json';

export interface DriveFileInfo {
  id: string;
  name: string;
  size: string;
  mimeType: string;
  createdTime: string;
  webViewLink: string;
}

export interface UploadProgress {
  backupId: string;
  status: 'uploading' | 'complete' | 'failed';
  step: string;
  codeFileId?: string;
  dbFileId?: string;
  error?: string;
}

/**
 * BackupDriveService — uploads backups to Google Drive using a service account.
 *
 * Requires:
 *   - /data/backups/google-service-account.json (service account key)
 *   - GDRIVE_FOLDER_ID env var (shared folder ID)
 */
@Injectable()
export class BackupDriveService {
  private readonly logger = new Logger(BackupDriveService.name);
  private uploadJobs = new Map<string, UploadProgress>();

  // ─── Auth ───────────────────────────────────────────────────────────────

  private getDrive(): drive_v3.Drive | null {
    try {
      if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
        this.logger.warn('Service account key not found at ' + SERVICE_ACCOUNT_PATH);
        return null;
      }

      const auth = new google.auth.GoogleAuth({
        keyFile: SERVICE_ACCOUNT_PATH,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });

      return google.drive({ version: 'v3', auth });
    } catch (err: any) {
      this.logger.error(`Drive auth error: ${err.message}`);
      return null;
    }
  }

  private getFolderId(): string {
    return process.env.GDRIVE_FOLDER_ID || '';
  }

  // ─── Status ─────────────────────────────────────────────────────────────

  getConnectionStatus(): { connected: boolean; email: string; folderId: string } {
    const hasKey = fs.existsSync(SERVICE_ACCOUNT_PATH);
    const folderId = this.getFolderId();
    let email = '';

    if (hasKey) {
      try {
        const key = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'));
        email = key.client_email || '';
      } catch { /* ignore */ }
    }

    return {
      connected: hasKey && !!folderId,
      email,
      folderId,
    };
  }

  // ─── Upload ─────────────────────────────────────────────────────────────

  async uploadBackup(backupId: string): Promise<{ jobKey: string; message: string }> {
    const drive = this.getDrive();
    if (!drive) {
      throw new BadRequestException('Google Drive not configured. Place service account JSON at ' + SERVICE_ACCOUNT_PATH);
    }

    const folderId = this.getFolderId();
    if (!folderId) {
      throw new BadRequestException('GDRIVE_FOLDER_ID not set in environment.');
    }

    // Read backup status
    const statusPath = path.join(BACKUP_DIR, backupId, 'status.json');
    if (!fs.existsSync(statusPath)) {
      throw new BadRequestException(`Backup ${backupId} not found.`);
    }
    const status = JSON.parse(fs.readFileSync(statusPath, 'utf-8'));
    if (status.status !== 'complete') {
      throw new BadRequestException(`Backup ${backupId} is not complete.`);
    }

    const jobKey = `drive-${backupId}`;
    const progress: UploadProgress = {
      backupId,
      status: 'uploading',
      step: 'starting',
    };
    this.uploadJobs.set(jobKey, progress);

    // Run upload in background
    this.runUpload(drive, folderId, backupId, status, progress).catch((err) => {
      this.logger.error(`Drive upload background error: ${err.message}`);
    });

    return { jobKey, message: 'Upload started.' };
  }

  private async runUpload(
    drive: drive_v3.Drive,
    folderId: string,
    backupId: string,
    status: any,
    progress: UploadProgress,
  ): Promise<void> {
    try {
      const backupDir = path.join(BACKUP_DIR, backupId);

      // Step 1: Upload code archive
      const codeFilePath = path.join(backupDir, status.codeFile);
      if (fs.existsSync(codeFilePath)) {
        progress.step = 'uploading-code';
        this.logger.log(`[${backupId}] Uploading code archive to Drive...`);

        const codeRes = await drive.files.create({
          requestBody: {
            name: status.codeFile,
            parents: [folderId],
            description: `Saubh.Tech backup ${backupId} — code archive. Notes: ${status.notes || 'none'}`,
          },
          media: {
            mimeType: 'application/gzip',
            body: fs.createReadStream(codeFilePath),
          },
          fields: 'id',
        });

        progress.codeFileId = codeRes.data.id || undefined;
        this.logger.log(`[${backupId}] Code uploaded: ${codeRes.data.id}`);
      }

      // Step 2: Upload database dump
      const dbFilePath = path.join(backupDir, status.dbFile);
      if (fs.existsSync(dbFilePath)) {
        progress.step = 'uploading-db';
        this.logger.log(`[${backupId}] Uploading database dump to Drive...`);

        const dbRes = await drive.files.create({
          requestBody: {
            name: status.dbFile,
            parents: [folderId],
            description: `Saubh.Tech backup ${backupId} — database dump. Notes: ${status.notes || 'none'}`,
          },
          media: {
            mimeType: 'application/sql',
            body: fs.createReadStream(dbFilePath),
          },
          fields: 'id',
        });

        progress.dbFileId = dbRes.data.id || undefined;
        this.logger.log(`[${backupId}] DB uploaded: ${dbRes.data.id}`);
      }

      progress.status = 'complete';
      progress.step = 'done';
      this.logger.log(`[${backupId}] Drive upload complete!`);

    } catch (err: any) {
      this.logger.error(`[${backupId}] Drive upload failed: ${err.message}`);
      progress.status = 'failed';
      progress.step = 'failed';
      progress.error = err.message;
    }
  }

  getUploadProgress(jobKey: string): UploadProgress | null {
    return this.uploadJobs.get(jobKey) || null;
  }

  // ─── List files in Drive folder ─────────────────────────────────────────

  async listFiles(): Promise<DriveFileInfo[]> {
    const drive = this.getDrive();
    if (!drive) return [];

    const folderId = this.getFolderId();
    if (!folderId) return [];

    try {
      const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, size, mimeType, createdTime, webViewLink)',
        orderBy: 'createdTime desc',
        pageSize: 50,
      });

      return (res.data.files || []).map((f) => ({
        id: f.id || '',
        name: f.name || '',
        size: f.size ? formatBytes(Number(f.size)) : '—',
        mimeType: f.mimeType || '',
        createdTime: f.createdTime || '',
        webViewLink: f.webViewLink || '',
      }));
    } catch (err: any) {
      this.logger.error(`Drive list error: ${err.message}`);
      return [];
    }
  }

  // ─── Delete file from Drive ─────────────────────────────────────────────

  async deleteFile(fileId: string): Promise<void> {
    const drive = this.getDrive();
    if (!drive) throw new BadRequestException('Drive not configured.');

    try {
      await drive.files.delete({ fileId });
      this.logger.log(`Deleted Drive file: ${fileId}`);
    } catch (err: any) {
      this.logger.error(`Drive delete error: ${err.message}`);
      throw new BadRequestException(`Failed to delete: ${err.message}`);
    }
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
}
