import { NextRequest, NextResponse } from 'next/server';

// ─── Pre-computed translation imports ───
// Add new language imports here as files are created in src/lib/i18n/strings/
import hi from '@/lib/i18n/strings/hi';

const TRANSLATIONS: Record<string, Record<string, string>> = {
  hi,
};

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

    const strings = TRANSLATIONS[target];

    if (strings) {
      return NextResponse.json(
        { strings, lang: target, source: 'precomputed' },
        { status: 200 }
      );
    }

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

export async function GET() {
  const available = Object.keys(TRANSLATIONS);
  return NextResponse.json({
    status: 'ok',
    service: 'saubh-lang-lite',
    available_languages: ['en', ...available],
    total: available.length + 1,
  });
}
