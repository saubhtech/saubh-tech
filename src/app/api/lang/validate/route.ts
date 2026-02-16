import { NextResponse } from 'next/server';
import en, { TOTAL_KEYS } from '@/lib/i18n/strings/en';
import hi from '@/lib/i18n/strings/hi';

// Add new language imports here as they're created
const TRANSLATIONS: Record<string, Record<string, string>> = { hi };

/**
 * GET /api/lang/validate
 * Runtime validation: check all languages have complete keys.
 * Returns coverage report for each language.
 */
export async function GET() {
  const enKeys = Object.keys(en);
  const report: Record<string, { total: number; present: number; missing: string[]; coverage: string }> = {};

  for (const [lang, strings] of Object.entries(TRANSLATIONS)) {
    const langKeys = new Set(Object.keys(strings));
    const missing = enKeys.filter(k => !langKeys.has(k));
    report[lang] = {
      total: TOTAL_KEYS,
      present: langKeys.size,
      missing,
      coverage: `${((langKeys.size / TOTAL_KEYS) * 100).toFixed(1)}%`,
    };
  }

  const allComplete = Object.values(report).every(r => r.missing.length === 0);

  return NextResponse.json({
    status: allComplete ? 'ok' : 'incomplete',
    master_keys: TOTAL_KEYS,
    languages: report,
  });
}
