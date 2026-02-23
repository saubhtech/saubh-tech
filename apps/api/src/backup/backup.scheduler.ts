import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { BackupService } from './backup.service';
import * as cron from 'node-cron';

/**
 * BackupScheduler — runs scheduled backups via node-cron.
 *
 * On startup: reads /data/backups/schedule.json → registers cron if enabled.
 * When schedule is saved via API: cancels old cron → registers new one.
 */
@Injectable()
export class BackupScheduler implements OnModuleInit {
  private readonly logger = new Logger(BackupScheduler.name);
  private activeTask: cron.ScheduledTask | null = null;

  constructor(private readonly backupService: BackupService) {}

  async onModuleInit(): Promise<void> {
    try {
      const config = await this.backupService.getSchedule();
      if (config.enabled) {
        this.registerCron(config);
        this.logger.log(`Scheduled backup active: ${config.frequency} at ${config.time}`);
      } else {
        this.logger.log('Scheduled backup disabled.');
      }
    } catch (err: any) {
      this.logger.error(`Failed to init schedule: ${err.message}`);
    }
  }

  /**
   * Called by BackupService.saveSchedule() to reload the cron job.
   */
  async reload(): Promise<void> {
    try {
      this.cancelCron();
      const config = await this.backupService.getSchedule();
      if (config.enabled) {
        this.registerCron(config);
        this.logger.log(`Schedule reloaded: ${config.frequency} at ${config.time}`);
      } else {
        this.logger.log('Schedule disabled — cron stopped.');
      }
    } catch (err: any) {
      this.logger.error(`Failed to reload schedule: ${err.message}`);
    }
  }

  private registerCron(config: { frequency: string; time: string; dayOfWeek: number; dayOfMonth: number }): void {
    this.cancelCron();

    const [hour, minute] = config.time.split(':').map(Number);
    let expression: string;

    switch (config.frequency) {
      case 'daily':
        // Every day at HH:MM
        expression = `${minute} ${hour} * * *`;
        break;
      case 'weekly':
        // Every week on dayOfWeek at HH:MM (0 = Sunday)
        expression = `${minute} ${hour} * * ${config.dayOfWeek}`;
        break;
      case 'monthly':
        // Every month on dayOfMonth at HH:MM
        expression = `${minute} ${hour} ${config.dayOfMonth} * *`;
        break;
      default:
        this.logger.warn(`Unknown frequency: ${config.frequency}`);
        return;
    }

    if (!cron.validate(expression)) {
      this.logger.error(`Invalid cron expression: ${expression}`);
      return;
    }

    this.activeTask = cron.schedule(expression, async () => {
      this.logger.log('Scheduled backup triggered by cron.');
      try {
        await this.backupService.createBackup('scheduled', 'Automatic scheduled backup');
      } catch (err: any) {
        this.logger.error(`Scheduled backup failed: ${err.message}`);
      }
    });

    this.logger.log(`Cron registered: "${expression}" (${config.frequency})`);
  }

  private cancelCron(): void {
    if (this.activeTask) {
      this.activeTask.stop();
      this.activeTask = null;
    }
  }
}
