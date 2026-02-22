import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { BotService } from './bot.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('crm/bot')
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly prisma: PrismaService,
  ) {}

  // ─── Get bot config for a channel ───────────────────────────────────────
  @Get('config/:channelId')
  async getConfig(@Param('channelId') channelId: string) {
    const config = await this.botService.getBotConfig(channelId);
    return config || {
      channelId,
      isEnabled: false,
      systemPrompt: null,
      handoffKeywords: ['agent', 'human', 'help', 'support', 'talk'],
      greetingMessage: null,
    };
  }

  // ─── Update bot config for a channel ────────────────────────────────────
  @Patch('config/:channelId')
  async updateConfig(
    @Param('channelId') channelId: string,
    @Body() body: {
      isEnabled?: boolean;
      systemPrompt?: string | null;
      handoffKeywords?: string[];
      greetingMessage?: string | null;
    },
  ) {
    const config = await this.botService.upsertBotConfig(channelId, body);

    // Sync defaultBotEnabled on channel
    if (body.isEnabled !== undefined) {
      await this.prisma.waChannel.update({
        where: { id: channelId },
        data: { defaultBotEnabled: body.isEnabled },
      });
    }

    return config;
  }

  // ─── Get all channels with bot status ───────────────────────────────────
  @Get('status')
  async getStatus() {
    const channels = await this.prisma.waChannel.findMany({
      where: { isActive: true },
      include: { botConfig: true },
      orderBy: { createdAt: 'asc' },
    });

    return channels.map(ch => ({
      channelId: ch.id,
      channelName: ch.name,
      phone: ch.phone,
      type: ch.type,
      defaultBotEnabled: ch.defaultBotEnabled,
      config: ch.botConfig || null,
    }));
  }
}
