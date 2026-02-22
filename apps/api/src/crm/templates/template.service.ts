import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private readonly wabaToken: string;
  private readonly wabaPhoneId: string;
  private readonly wabaBizId: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.wabaToken = this.config.get<string>('WABA_TOKEN', '');
    this.wabaPhoneId = this.config.get<string>('WABA_PHONE_NUMBER_ID', '');
    this.wabaBizId = this.config.get<string>('WABA_BUSINESS_ID', '');
  }

  // ─── List templates for a channel ───────────────────────────────────────
  async list(channelId: string) {
    return this.prisma.waTemplate.findMany({
      where: { channelId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Get single template ────────────────────────────────────────────────
  async getById(id: string) {
    return this.prisma.waTemplate.findUnique({ where: { id } });
  }

  // ─── Create template (local + submit to Meta if WABA) ───────────────────
  async create(data: {
    channelId: string;
    name: string;
    category: string;
    language?: string;
    body: string;
    header?: string;
    footer?: string;
    variables?: string[];
  }) {
    const channel = await this.prisma.waChannel.findUnique({
      where: { id: data.channelId },
    });

    if (!channel) throw new Error('Channel not found');

    // Normalize name: lowercase, underscores only
    const normalizedName = data.name.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_');

    // Save to local DB
    const template = await this.prisma.waTemplate.create({
      data: {
        channelId: data.channelId,
        name: normalizedName,
        category: data.category,
        language: data.language || 'en',
        body: data.body,
        header: data.header || null,
        footer: data.footer || null,
        variables: data.variables || [],
        status: 'PENDING',
      },
    });

    // Submit to Meta Graph API if WABA channel
    if (channel.type === 'WABA' && this.wabaToken && this.wabaBizId) {
      try {
        const metaResult = await this.submitToMeta(template);
        if (metaResult.id) {
          await this.prisma.waTemplate.update({
            where: { id: template.id },
            data: { metaId: metaResult.id, status: metaResult.status || 'PENDING' },
          });
        }
      } catch (err: any) {
        this.logger.error(`Meta template submission failed: ${err.message}`);
        await this.prisma.waTemplate.update({
          where: { id: template.id },
          data: { status: 'REJECTED' },
        });
      }
    }

    return this.prisma.waTemplate.findUnique({ where: { id: template.id } });
  }

  // ─── Update template ────────────────────────────────────────────────────
  async update(id: string, data: {
    body?: string;
    header?: string;
    footer?: string;
    variables?: string[];
    isActive?: boolean;
  }) {
    return this.prisma.waTemplate.update({
      where: { id },
      data: {
        ...(data.body !== undefined && { body: data.body }),
        ...(data.header !== undefined && { header: data.header }),
        ...(data.footer !== undefined && { footer: data.footer }),
        ...(data.variables !== undefined && { variables: data.variables }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  // ─── Delete template ────────────────────────────────────────────────────
  async remove(id: string) {
    const template = await this.prisma.waTemplate.findUnique({ where: { id } });
    if (!template) return;

    // Delete from Meta if exists
    if (template.metaId && this.wabaToken && this.wabaBizId) {
      try {
        await this.deleteFromMeta(template.name);
      } catch (err: any) {
        this.logger.warn(`Meta template delete failed: ${err.message}`);
      }
    }

    return this.prisma.waTemplate.delete({ where: { id } });
  }

  // ─── Sync status from Meta ──────────────────────────────────────────────
  async syncFromMeta(channelId: string) {
    if (!this.wabaToken || !this.wabaBizId) return [];

    try {
      const url = `https://graph.facebook.com/v21.0/${this.wabaBizId}/message_templates`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${this.wabaToken}` },
      });
      const json = await res.json();
      const metaTemplates = json.data || [];

      // Update local records with Meta status
      for (const mt of metaTemplates) {
        const local = await this.prisma.waTemplate.findFirst({
          where: { channelId, name: mt.name, language: mt.language },
        });
        if (local) {
          await this.prisma.waTemplate.update({
            where: { id: local.id },
            data: { metaId: mt.id, status: mt.status?.toUpperCase() || local.status },
          });
        }
      }

      return this.list(channelId);
    } catch (err: any) {
      this.logger.error(`Meta sync failed: ${err.message}`);
      return this.list(channelId);
    }
  }

  // ─── Submit template to Meta Graph API ──────────────────────────────────
  private async submitToMeta(template: any): Promise<{ id?: string; status?: string }> {
    const url = `https://graph.facebook.com/v21.0/${this.wabaBizId}/message_templates`;

    const components: any[] = [];

    if (template.header) {
      components.push({ type: 'HEADER', format: 'TEXT', text: template.header });
    }

    components.push({ type: 'BODY', text: template.body });

    if (template.footer) {
      components.push({ type: 'FOOTER', text: template.footer });
    }

    const payload = {
      name: template.name,
      category: template.category,
      language: template.language,
      components,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.wabaToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error?.message || 'Meta API error');
    }

    return { id: json.id, status: json.status };
  }

  // ─── Delete template from Meta ──────────────────────────────────────────
  private async deleteFromMeta(name: string): Promise<void> {
    const url = `https://graph.facebook.com/v21.0/${this.wabaBizId}/message_templates?name=${name}`;
    await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.wabaToken}` },
    });
  }
}
