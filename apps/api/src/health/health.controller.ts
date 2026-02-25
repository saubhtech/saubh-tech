import { Controller, Get, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async check() {
    const result: Record<string, any> = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      postgres: 'unknown',
      memory: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
    };

    // Check Postgres
    try {
      await this.prisma.$queryRawUnsafe('SELECT 1');
      result.postgres = 'connected';
    } catch (err: any) {
      result.postgres = 'disconnected';
      result.status = 'degraded';
      this.logger.error(`Health check: Postgres down — ${err.message}`);
    }

    return result;
  }

  // Keep old path working too
  @Get('healthz')
  async checkLegacy() {
    return this.check();
  }
}
