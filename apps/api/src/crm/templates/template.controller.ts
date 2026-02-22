import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { TemplateService } from './template.service';

@Controller('crm/templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  // ─── List templates ─────────────────────────────────────────────────
  @Get()
  async list(@Query('channelId') channelId?: string) {
    return this.templateService.list(channelId);
  }

  // ─── Get single template ────────────────────────────────────────────
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.templateService.get(id);
  }

  // ─── Create template ────────────────────────────────────────────────
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

  // ─── Delete template ────────────────────────────────────────────────
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }

  // ─── Send template message ──────────────────────────────────────────
  @Post(':id/send')
  async send(
    @Param('id') id: string,
    @Body() body: { to: string; variables?: string[] },
  ) {
    return this.templateService.send(id, body.to, body.variables || []);
  }
}
