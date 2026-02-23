import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const BACKUP_DIR = '/data/backups';
const TOKEN_PATH = '/data/backups/gdrive-token.json';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

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
 * BackupDriveService — uploads backups to Google Drive using OAuth2.
 *
 * Flow:
 *   1. Admin clicks "Connect Google Drive" → redirected to Google consent
 *   2. Google redirects back with auth code → exchanged for refresh token
 *   3. Refresh token stored at /data/backups/gdrive-token.json
 *   4. All future uploads use refresh token (auto-refreshes access token)
 *
 * Requires env vars:
 *   - GDRIVE_CLIENT_ID
 *   - GDRIVE_CLIENT_SECRET
 *   - GDRIVE_FOLDER_ID
 */
@Injectable()
export class BackupDriveService {
  private readonly logger = new Logger(BackupDriveService.name);
  private uploadJobs = new Map<string, UploadProgress>();

  // ─── OAuth2 Client ──────────────────────────────────────────────────────

  private getOAuth2Client(): any | null {
    const clientId = process.env.GDRIVE_CLIENT_ID;
    const clientSecret = process.env.GDRIVE_CLIENT_SECRET;
    const redirectUri = process.env.GDRIVE_REDIRECT_URI || 'https://admin.saubh.tech/api/auth/gdrive/callback';

    if (!clientId || !clientSecret) {
      return null;
    }

    return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  }

  private async getAuthedDrive(): Promise<drive_v3.Drive | null> {
    const oauth2 = this.getOAuth2Client();
    if (!oauth2) return null;

    // Load stored token
    if (!fs.existsSync(TOKEN_PATH)) return null;

    try {
      const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
      oauth2.setCredentials(tokens);

      // Auto-refresh if expired
      const { credentials } = await oauth2.getAccessToken();
      if (credentials && credentials !== tokens.access_token) {
        // Token was refreshed — save new tokens
        const updatedTokens = oauth2.credentials;
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(updatedTokens, null, 2));
      }

      return google.drive({ version: 'v3', auth: oauth2 });
    } catch (err: any) {
      this.logger.error(`Drive auth error: ${err.message}`);
      return null;
    }
  }

  private getFolderId(): string {
    return process.env.GDRIVE_FOLDER_ID || '';
  }

  // ─── OAuth Flow ─────────────────────────────────────────────────────────

  getAuthUrl(): string | null {
    const oauth2 = this.getOAuth2Client();
    if (!oauth2) return null;

    return oauth2.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: SCOPES,
    });
  }

  async handleCallback(code: string): Promise<void> {
    const oauth2 = this.getOAuth2Client();
    if (!oauth2) {
      throw new BadRequestException('OAuth2 not configured.');
    }

    const { tokens } = await oauth2.getToken(code);
    if (!tokens.refresh_token) {
      this.logger.warn('No refresh_token received — user may have already granted access. Re-prompting with consent.');
    }

    // Save tokens
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    this.logger.log('Google Drive OAuth tokens saved.');
  }

  // ─── Status ─────────────────────────────────────────────────────────────

  getConnectionStatus(): { connected: boolean; hasCredentials: boolean; hasToken: boolean; folderId: string } {
    const oauth2 = this.getOAuth2Client();
    const hasCredentials = !!oauth2;
    const hasToken = fs.existsSync(TOKEN_PATH);
    const folderId = this.getFolderId();

    return {
      connected: hasCredentials && hasToken && !!folderId,
      hasCredentials,
      hasToken,
      folderId,
    };
  }

  // ─── Upload ─────────────────────────────────────────────────────────────

  async uploadBackup(backupId: string): Promise<{ jobKey: string; message: string }> {
    const drive = await this.getAuthedDrive();
    if (!drive) {
      throw new BadRequestException('Google Drive not connected. Please authorize first.');
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
    const drive = await this.getAuthedDrive();
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
    const drive = await this.getAuthedDrive();
    if (!drive) throw new BadRequestException('Drive not connected.');

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
