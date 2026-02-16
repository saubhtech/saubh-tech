import { NextRequest, NextResponse } from 'next/server';

// ─── Pre-computed translation imports ───
// Add more languages here as they become available
import hi from '@/lib/i18n/strings/hi';

const TRANSLATIONS: Record<string, Record<string, string>> = {
  hi,
};

// ─── POST /api/lang/page ───
// Called by TranslationProvider to fetch translated strings
// Body: { url: string, target: string, format: 'json' }
// Response: { strings: Record<string, string>, lang: string, source: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target } = body;

    if (!target || target === 'en') {
      return NextResponse.json(
        { strings: null, lang: 'en', source: 'default' },
        { status: 200 }
      );
    }

    // Check if we have pre-computed translations for this language
    const strings = TRANSLATIONS[target];

    if (strings) {
      return NextResponse.json(
        { strings, lang: target, source: 'precomputed' },
        { status: 200 }
      );
    }

    // Language not yet available — return empty (frontend falls back to English)
    return NextResponse.json(
      { strings: null, lang: target, source: 'unavailable' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// ─── GET /api/lang/page — health check ───
export async function GET() {
  const available = Object.keys(TRANSLATIONS);
  return NextResponse.json({
    status: 'ok',
    service: 'saubh-lang-lite',
    available_languages: ['en', ...available],
    total: available.length + 1,
  });
}
