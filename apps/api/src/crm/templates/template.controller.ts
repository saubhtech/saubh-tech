import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { TemplateService } from './template.service';

@Controller('crm/templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  // ─── List templates for a channel ───────────────────────────────────────
  @Get()
  async list(@Query('channelId') channelId: string) {
    if (!channelId) return [];
    return this.templateService.list(channelId);
  }

  // ─── Get single template ────────────────────────────────────────────────
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.templateService.getById(id);
  }

  // ─── Create template ────────────────────────────────────────────────────
  @Post()
  async create(@Body() body: {
    channelId: string;
    name: string;
    category: string;
    language?: string;
    body: string;
    header?: string;
    footer?: string;
    variables?: string[];
  }) {
    return this.templateService.create(body);
  }

  // ─── Update template ────────────────────────────────────────────────────
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: {
      body?: string;
      header?: string;
      footer?: string;
      variables?: string[];
      isActive?: boolean;
    },
  ) {
    return this.templateService.update(id, body);
  }

  // ─── Delete template ────────────────────────────────────────────────────
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }

  // ─── Sync templates from Meta ───────────────────────────────────────────
  @Post('sync/:channelId')
  async sync(@Param('channelId') channelId: string) {
    return this.templateService.syncFromMeta(channelId);
  }
}
