import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  // ─── List templates ─────────────────────────────────────────────────
  async list(channelId?: string) {
    return this.prisma.waTemplate.findMany({
      where: {
        isActive: true,
        ...(channelId && { channelId }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Get single template ────────────────────────────────────────────
  async get(id: string) {
    const template = await this.prisma.waTemplate.findUnique({ where: { id } });
    if (!template) throw new NotFoundException(`Template ${id} not found`);
    return template;
  }

  // ─── Create template + submit to Meta ───────────────────────────────
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

    // Submit to Meta Graph API
    const wabaBusinessId = this.config.get<string>('WABA_BUSINESS_ACCOUNT_ID', '');
    const accessToken = this.config.get<string>('WABA_ACCESS_TOKEN', '');

    if (wabaBusinessId && accessToken) {
      try {
        const components: any[] = [];

        // Header component
        if (data.header) {
          components.push({
            type: 'HEADER',
            format: 'TEXT',
            text: data.header,
          });
        }

        // Body component
        const bodyComponent: any = {
          type: 'BODY',
          text: data.body,
        };
        if (data.variables && data.variables.length > 0) {
          bodyComponent.example = {
            body_text: [data.variables.map((_, i) => `Sample ${i + 1}`)],
          };
        }
        components.push(bodyComponent);

        // Footer component
        if (data.footer) {
          components.push({
            type: 'FOOTER',
            text: data.footer,
          });
        }

        const url = `https://graph.facebook.com/v21.0/${wabaBusinessId}/message_templates`;
        const { data: metaRes } = await firstValueFrom(
          this.http.post(url, {
            name: template.name,
            language: template.language,
            category: template.category,
            components,
          }, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }),
        );

        // Update with Meta ID
        await this.prisma.waTemplate.update({
          where: { id: template.id },
          data: {
            metaId: metaRes.id,
            status: metaRes.status || 'PENDING',
          },
        });

        this.logger.log(`Template ${template.name} submitted to Meta: ${metaRes.id}`);
      } catch (err: any) {
        const errMsg = err?.response?.data?.error?.message || err.message;
        this.logger.error(`Meta template submit failed: ${errMsg}`);
        // Keep as PENDING — user can retry
      }
    }

    return this.prisma.waTemplate.findUnique({ where: { id: template.id } });
  }

  // ─── Soft delete template ───────────────────────────────────────────
  async remove(id: string) {
    const template = await this.get(id);

    // Delete from Meta if metaId exists
    const wabaBusinessId = this.config.get<string>('WABA_BUSINESS_ACCOUNT_ID', '');
    const accessToken = this.config.get<string>('WABA_ACCESS_TOKEN', '');

    if (template.metaId && wabaBusinessId && accessToken) {
      try {
        const url = `https://graph.facebook.com/v21.0/${wabaBusinessId}/message_templates?name=${template.name}`;
        await firstValueFrom(
          this.http.delete(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        );
        this.logger.log(`Template ${template.name} deleted from Meta`);
      } catch (err: any) {
        this.logger.error(`Meta template delete failed: ${err.message}`);
      }
    }

    return this.prisma.waTemplate.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ─── Send template message ──────────────────────────────────────────
  async send(id: string, to: string, variables: string[]) {
    const template = await this.get(id);

    if (template.status !== 'APPROVED') {
      throw new Error(`Template ${template.name} is not approved (status: ${template.status})`);
    }

    const phoneNumberId = this.config.get<string>('WABA_PHONE_NUMBER_ID', '');
    const accessToken = this.config.get<string>('WABA_ACCESS_TOKEN', '');

    if (!phoneNumberId || !accessToken) {
      throw new Error('WABA credentials not configured');
    }

    const components: any[] = [];
    if (variables.length > 0) {
      components.push({
        type: 'body',
        parameters: variables.map(v => ({ type: 'text', text: v })),
      });
    }

    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
    const body = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: template.name,
        language: { code: template.language },
        ...(components.length > 0 && { components }),
      },
    };

    const { data } = await firstValueFrom(
      this.http.post(url, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    const msgId = data?.messages?.[0]?.id;
    this.logger.log(`Template ${template.name} sent to ${to}: ${msgId}`);
    return { success: true, externalId: msgId };
  }
}
