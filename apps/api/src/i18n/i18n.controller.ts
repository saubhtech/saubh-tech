import { Controller, Get } from '@nestjs/common';
import * as fs from 'fs';

@Controller('i18n')
export class I18nController {
  @Get('status')
  getStatus() {
    try {
      const data = fs.readFileSync('/data/scripts/i18n/status.json', 'utf8');
      return JSON.parse(data);
    } catch {
      return { error: 'Status not generated. Run: node /data/scripts/i18n/i18n-status.mjs' };
    }
  }

  @Get('coverage')
  getCoverage() {
    try {
      const data = JSON.parse(fs.readFileSync('/data/scripts/i18n/status.json', 'utf8'));
      const langs: Record<string, any> = {};
      for (const [lang, info] of Object.entries(data.languages) as any[]) {
        langs[lang] = { coverage: info.coverage, pending: info.pending, missing: info.missing };
      }
      return { generatedAt: data.generatedAt, totalKeys: data.totalKeys, languages: langs };
    } catch {
      return { error: 'Run status generation first' };
    }
  }
}
