import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { exec as execCb } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

const BACKUP_DIR = '/data/backups';
const PLATFORM_DIR = '/data/projects/platform';
const ID_REGEX = /^\d{8}-\d{6}$/;

interface BackupStatus {
  id: string;
  createdAt: string;
  type: 'manual' | 'scheduled';
  status: 'running' | 'complete' | 'failed';
  codeFile: string;
  dbFile: string;
  codeSize: string;
  dbSize: string;
  totalSize: string;
  notes: string;
  error?: string;
}

interface ScheduleConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  dayOfWeek: number;
  dayOfMonth: number;
  keepLast: number;
}

interface RestoreJob {
  jobId: string;
  backupId: string;
  step: string;
  pct: number;
  error?: string;
}

/**
 * BackupService — creates, lists, downloads, restores, and schedules backups.
 *
 * Storage: /data/backups/YYYYMMDD-HHMMSS/
 *   - platform-YYYYMMDD-HHMMSS.tar.gz (code archive)
 *   - saubhtech-db-YYYYMMDD-HHMMSS.sql (database dump)
 *   - status.json (metadata)
 *
 * Schedule config: /data/backups/schedule.json
 *
 * Security: ALL id parameters validated with /^\d{8}-\d{6}$/ before file ops.
 * Background jobs: wrapped in try/catch, never crash API process.
 */
@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private restoreJobs = new Map<string, RestoreJob>();

  // ─── Helpers ────────────────────────────────────────────────────────────

  private validateId(id: string): void {
    if (!ID_REGEX.test(id)) {
      throw new BadRequestException(`Invalid backup ID format: ${id}`);
    }
  }

  private exec(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      execCb(command, { maxBuffer: 50 * 1024 * 1024, timeout: 600_000 }, (err, stdout, stderr) => {
        if (err) {
          reject(new Error(`${err.message}\n${stderr}`));
        } else {
          resolve(stdout);
        }
      });
    });
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
  }

  private generateId(): string {
    const now = new Date();
    const pad = (n: number, len = 2) => String(n).padStart(len, '0');
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  }

  private readStatus(id: string): BackupStatus | null {
    const statusPath = path.join(BACKUP_DIR, id, 'status.json');
    try {
      return JSON.parse(fs.readFileSync(statusPath, 'utf-8'));
    } catch {
      return null;
    }
  }

  private writeStatus(id: string, status: Partial<BackupStatus>): void {
    const dir = path.join(BACKUP_DIR, id);
    const statusPath = path.join(dir, 'status.json');
    let existing: any = {};
    try { existing = JSON.parse(fs.readFileSync(statusPath, 'utf-8')); } catch { /* new */ }
    fs.writeFileSync(statusPath, JSON.stringify({ ...existing, ...status }, null, 2));
  }

  private ensureBackupDir(): void {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
  }

  // ─── Create Backup ─────────────────────────────────────────────────────

  async createBackup(type: 'manual' | 'scheduled', notes?: string): Promise<{ id: string; status: string }> {
    this.ensureBackupDir();
    const id = this.generateId();
    const dir = path.join(BACKUP_DIR, id);
    fs.mkdirSync(dir, { recursive: true });

    const codeFile = `platform-${id}.tar.gz`;
    const dbFile = `saubhtech-db-${id}.sql`;

    const initialStatus: BackupStatus = {
      id,
      createdAt: new Date().toISOString(),
      type,
      status: 'running',
      codeFile,
      dbFile,
      codeSize: '0B',
      dbSize: '0B',
      totalSize: '0B',
      notes: notes || '',
    };

    this.writeStatus(id, initialStatus);
    this.logger.log(`Backup ${id} started (${type})`);

    // Run backup in background — never block the response
    this.runBackup(id, dir, codeFile, dbFile).catch((err) => {
      this.logger.error(`Backup ${id} background error: ${err.message}`);
    });

    return { id, status: 'running' };
  }

  private async runBackup(id: string, dir: string, codeFile: string, dbFile: string): Promise<void> {
    try {
      // Step 1: Code archive
      this.logger.log(`[${id}] Step 1: Creating code archive...`);
      const codePath = path.join(dir, codeFile);
      await this.exec(
        `tar` +
        ` --exclude='${PLATFORM_DIR}/node_modules'` +
        ` --exclude='${PLATFORM_DIR}/apps/*/node_modules'` +
        ` --exclude='${PLATFORM_DIR}/apps/*/.next'` +
        ` --exclude='${PLATFORM_DIR}/apps/*/dist'` +
        ` --exclude='${PLATFORM_DIR}/.git'` +
        ` -czf ${codePath}` +
        ` -C /data/projects platform`,
      );

      // Step 2: Database dump
      this.logger.log(`[${id}] Step 2: Dumping database...`);
      const dbPath = path.join(dir, dbFile);
      await this.exec(
        `docker exec saubh-postgres pg_dump -U postgres saubhtech > ${dbPath}`,
      );

      // Step 3: Get file sizes
      const codeBytes = fs.statSync(codePath).size;
      const dbBytes = fs.statSync(dbPath).size;

      // Step 4: Update status.json → complete
      this.writeStatus(id, {
        status: 'complete',
        codeSize: this.formatSize(codeBytes),
        dbSize: this.formatSize(dbBytes),
        totalSize: this.formatSize(codeBytes + dbBytes),
      });

      this.logger.log(`[${id}] Backup complete: code=${this.formatSize(codeBytes)} db=${this.formatSize(dbBytes)}`);

      // Step 5: Auto-delete old backups beyond keepLast
      await this.cleanupOldBackups();

    } catch (err: any) {
      this.logger.error(`[${id}] Backup failed: ${err.message}`);
      this.writeStatus(id, { status: 'failed', error: err.message });
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    try {
      const schedule = await this.getSchedule();
      const keepLast = schedule.keepLast || 10;
      const backups = await this.listBackups();
      const complete = backups.filter((b) => b.status === 'complete');

      if (complete.length > keepLast) {
        const toDelete = complete.slice(keepLast); // already sorted desc by createdAt
        for (const b of toDelete) {
          this.logger.log(`Auto-deleting old backup: ${b.id}`);
          await this.deleteBackup(b.id);
        }
      }
    } catch (err: any) {
      this.logger.error(`Cleanup error: ${err.message}`);
    }
  }

  // ─── List Backups ──────────────────────────────────────────────────────

  async listBackups(): Promise<BackupStatus[]> {
    this.ensureBackupDir();
    const entries = fs.readdirSync(BACKUP_DIR, { withFileTypes: true });
    const backups: BackupStatus[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory() || !ID_REGEX.test(entry.name)) continue;
      const status = this.readStatus(entry.name);
      if (status) backups.push(status);
    }

    // Sort by createdAt descending (most recent first)
    backups.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return backups;
  }

  // ─── Get Status ────────────────────────────────────────────────────────

  async getStatus(id: string): Promise<BackupStatus> {
    this.validateId(id);
    const status = this.readStatus(id);
    if (!status) {
      throw new NotFoundException(`Backup ${id} not found`);
    }
    return status;
  }

  // ─── Delete Backup ─────────────────────────────────────────────────────

  async deleteBackup(id: string): Promise<void> {
    this.validateId(id);
    const dir = path.join(BACKUP_DIR, id);
    if (!fs.existsSync(dir)) {
      throw new NotFoundException(`Backup ${id} not found`);
    }
    await this.exec(`rm -rf ${dir}`);
    this.logger.log(`Deleted backup: ${id}`);
  }

  // ─── Stream File Download ──────────────────────────────────────────────

  async streamFile(id: string, type: 'code' | 'db', res: Response): Promise<void> {
    this.validateId(id);
    const status = this.readStatus(id);
    if (!status) {
      throw new NotFoundException(`Backup ${id} not found`);
    }

    const filename = type === 'code' ? status.codeFile : status.dbFile;
    const filePath = path.join(BACKUP_DIR, id, filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File not found: ${filename}`);
    }

    const stat = fs.statSync(filePath);
    res.set({
      'Content-Type': type === 'code' ? 'application/gzip' : 'application/sql',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': stat.size.toString(),
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  }

  // ─── Restore Backup ────────────────────────────────────────────────────

  async restoreBackup(id: string): Promise<{ jobId: string; message: string }> {
    this.validateId(id);
    const status = this.readStatus(id);
    if (!status) {
      throw new NotFoundException(`Backup ${id} not found`);
    }
    if (status.status !== 'complete') {
      throw new BadRequestException(`Cannot restore: backup status is "${status.status}"`);
    }

    const jobId = `restore-${id}-${Date.now()}`;
    const job: RestoreJob = { jobId, backupId: id, step: 'queued', pct: 0 };
    this.restoreJobs.set(jobId, job);

    this.logger.warn(`RESTORE STARTED: ${id} (job: ${jobId})`);

    // Run restore in background
    this.runRestore(jobId, id, status).catch((err) => {
      this.logger.error(`Restore ${jobId} background error: ${err.message}`);
    });

    return { jobId, message: 'Restore started. Poll progress endpoint.' };
  }

  private async runRestore(jobId: string, id: string, status: BackupStatus): Promise<void> {
    const job = this.restoreJobs.get(jobId)!;
    const dir = path.join(BACKUP_DIR, id);

    try {
      // Step 1: Stop PM2 apps (except API itself)
      job.step = 'stopping'; job.pct = 10;
      this.logger.log(`[${jobId}] Stopping PM2 apps...`);
      await this.exec('pm2 stop web admin crmwhats realtime whatsapp-service 2>/dev/null || true');

      // Step 2: Extract code archive
      job.step = 'extracting'; job.pct = 25;
      this.logger.log(`[${jobId}] Extracting code archive...`);
      await this.exec(`tar -xzf ${path.join(dir, status.codeFile)} -C /data/projects/`);

      // Step 3: Restore database
      job.step = 'restoring-db'; job.pct = 50;
      this.logger.log(`[${jobId}] Restoring database...`);
      await this.exec(`docker exec -i saubh-postgres psql -U postgres saubhtech < ${path.join(dir, status.dbFile)}`);

      // Step 4: Install dependencies
      job.step = 'installing'; job.pct = 65;
      this.logger.log(`[${jobId}] Installing dependencies...`);
      await this.exec(`cd ${PLATFORM_DIR} && pnpm install --frozen-lockfile 2>/dev/null || pnpm install`);

      // Step 5: Build API
      job.step = 'building'; job.pct = 80;
      this.logger.log(`[${jobId}] Building API...`);
      await this.exec(`cd ${PLATFORM_DIR} && pnpm --filter @saubhtech/api build`);

      // Step 6: Restart all PM2 apps
      job.step = 'restarting'; job.pct = 90;
      this.logger.log(`[${jobId}] Restarting PM2 services...`);
      await this.exec('pm2 restart web admin crmwhats realtime whatsapp-service api 2>/dev/null || pm2 restart all');

      // Step 7: Complete
      job.step = 'complete'; job.pct = 100;
      this.logger.log(`[${jobId}] Restore complete!`);

    } catch (err: any) {
      this.logger.error(`[${jobId}] Restore failed at step "${job.step}": ${err.message}`);
      job.step = 'failed';
      job.error = err.message;

      // Try to restart services even on failure
      try {
        await this.exec('pm2 restart all 2>/dev/null || true');
      } catch { /* best effort */ }
    }
  }

  // ─── Get Restore Status ────────────────────────────────────────────────

  getRestoreStatus(jobId: string): RestoreJob {
    const job = this.restoreJobs.get(jobId);
    if (!job) {
      throw new NotFoundException(`Restore job ${jobId} not found`);
    }
    return job;
  }

  // ─── Schedule Management ───────────────────────────────────────────────

  async getSchedule(): Promise<ScheduleConfig> {
    const configPath = path.join(BACKUP_DIR, 'schedule.json');
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch {
      // Return default if file doesn't exist
      const defaults: ScheduleConfig = {
        enabled: false,
        frequency: 'weekly',
        time: '02:00',
        dayOfWeek: 0,
        dayOfMonth: 1,
        keepLast: 10,
      };
      return defaults;
    }
  }

  async saveSchedule(config: ScheduleConfig): Promise<void> {
    // Validate
    if (!['daily', 'weekly', 'monthly'].includes(config.frequency)) {
      throw new BadRequestException('frequency must be daily, weekly, or monthly');
    }
    if (!/^\d{2}:\d{2}$/.test(config.time)) {
      throw new BadRequestException('time must be HH:MM format');
    }
    if (config.dayOfWeek < 0 || config.dayOfWeek > 6) {
      throw new BadRequestException('dayOfWeek must be 0-6');
    }
    if (config.dayOfMonth < 1 || config.dayOfMonth > 28) {
      throw new BadRequestException('dayOfMonth must be 1-28');
    }
    if (config.keepLast < 3 || config.keepLast > 30) {
      throw new BadRequestException('keepLast must be 3-30');
    }

    this.ensureBackupDir();
    const configPath = path.join(BACKUP_DIR, 'schedule.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    this.logger.log(`Schedule saved: ${JSON.stringify(config)}`);
  }
}
