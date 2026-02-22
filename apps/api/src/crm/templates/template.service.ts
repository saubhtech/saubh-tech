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

  // ─── List ALL templates across channels ─────────────────────────────────
  async listAll(status?: string) {
    return this.prisma.waTemplate.findMany({
      where: {
        ...(status && status !== 'ALL' ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── List templates for a channel ───────────────────────────────────────
  async list(channelId: string, status?: string) {
    return this.prisma.waTemplate.findMany({
      where: {
        channelId,
        ...(status && status !== 'ALL' ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Get single template ────────────────────────────────────────────────
  async get(id: string) {
    return this.prisma.waTemplate.findUnique({ where: { id } });
  }

  // ─── Create template (save locally + submit to Meta if WABA) ────────────
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
    // Save to DB first
    const template = await this.prisma.waTemplate.create({
      data: {
        channelId: data.channelId,
        name: data.name.toLowerCase().replace(/\s+/g, '_'),
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
    const channel = await this.prisma.waChannel.findUnique({ where: { id: data.channelId } });
    if (channel?.type === 'WABA' && this.wabaBizId && this.wabaToken) {
      try {
        const metaResult = await this.submitToMeta(template);
        if (metaResult.id) {
          await this.prisma.waTemplate.update({
            where: { id: template.id },
            data: { metaId: metaResult.id, status: metaResult.status || 'PENDING' },
          });
        }
      } catch (err: any) {
        this.logger.error(`Meta template submit failed: ${err.message}`);
        await this.prisma.waTemplate.update({
          where: { id: template.id },
          data: { status: 'REJECTED' },
        });
      }
    } else {
      // Non-WABA channels: auto-approve
      await this.prisma.waTemplate.update({
        where: { id: template.id },
        data: { status: 'APPROVED' },
      });
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
  async delete(id: string) {
    const template = await this.prisma.waTemplate.findUnique({ where: { id } });
    if (!template) return null;

    // Delete from Meta if WABA
    if (template.metaId && this.wabaBizId && this.wabaToken) {
      try {
        await fetch(
          `https://graph.facebook.com/v21.0/${this.wabaBizId}/message_templates?name=${template.name}`,
          { method: 'DELETE', headers: { Authorization: `Bearer ${this.wabaToken}` } },
        );
      } catch (err: any) {
        this.logger.warn(`Meta template delete failed: ${err.message}`);
      }
    }

    return this.prisma.waTemplate.delete({ where: { id } });
  }

  // ─── Sync templates from Meta ───────────────────────────────────────────
  async syncFromMeta(channelId: string) {
    if (!this.wabaBizId || !this.wabaToken) {
      return { synced: 0, message: 'WABA credentials not configured' };
    }

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${this.wabaBizId}/message_templates?limit=100`,
      { headers: { Authorization: `Bearer ${this.wabaToken}` } },
    );
    const json = await res.json();
    const metaTemplates = json.data || [];

    let synced = 0;
    for (const mt of metaTemplates) {
      const body = mt.components?.find((c: any) => c.type === 'BODY')?.text || '';
      const header = mt.components?.find((c: any) => c.type === 'HEADER')?.text || null;
      const footer = mt.components?.find((c: any) => c.type === 'FOOTER')?.text || null;

      await this.prisma.waTemplate.upsert({
        where: { id: mt.id },
        create: {
          channelId,
          name: mt.name,
          category: mt.category,
          language: mt.language || 'en',
          body,
          header,
          footer,
          metaId: mt.id,
          status: mt.status || 'APPROVED',
        },
        update: {
          body,
          header,
          footer,
          status: mt.status || 'APPROVED',
        },
      });
      synced++;
    }

    return { synced, message: `Synced ${synced} templates from Meta` };
  }

  // ─── Submit template to Meta Graph API ──────────────────────────────────
  private async submitToMeta(template: {
    name: string;
    category: string;
    language: string;
    body: string;
    header?: string | null;
    footer?: string | null;
  }): Promise<{ id?: string; status?: string }> {
    const components: any[] = [];

    if (template.header) {
      components.push({ type: 'HEADER', format: 'TEXT', text: template.header });
    }
    components.push({ type: 'BODY', text: template.body });
    if (template.footer) {
      components.push({ type: 'FOOTER', text: template.footer });
    }

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${this.wabaBizId}/message_templates`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.wabaToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: template.name,
          category: template.category,
          language: template.language,
          components,
        }),
      },
    );

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error?.message || 'Meta API error');
    }
    return { id: json.id, status: json.status };
  }
}
