import { NextRequest, NextResponse } from 'next/server';

// ─── Supported language codes (must match languages.ts) ───
const SUPPORTED = new Set([
  'en','hi','bn','ta','te','mr','gu','kn','ml','pa','or','as','ur','ne','sa',
  'mai','kok','doi','sd','ks','brx','sat','mni',
  'ar','zh','fr','de','ja','ko','pt','ru','es','th','vi','id','ms','tr',
]);

// ─── Accept-Language → best language code ───
function parseAcceptLanguage(header: string | null): string | null {
  if (!header) return null;

  const parts = header.split(',').map((p) => {
    const [tag, qStr] = p.trim().split(';q=');
    return { tag: tag.trim().toLowerCase(), q: qStr ? parseFloat(qStr) : 1.0 };
  });
  parts.sort((a, b) => b.q - a.q);

  for (const { tag } of parts) {
    // Extract primary subtag: "en-US" → "en", "zh-CN" → "zh"
    const primary = tag.split('-')[0];
    if (SUPPORTED.has(primary)) return primary;
  }
  return null;
}

// ─── IP → Language via saubh-lang detect API (best effort) ───
async function detectFromIP(ip: string): Promise<string | null> {
  try {
    const apiUrl = process.env.LANG_API_INTERNAL_URL || 'http://localhost:3100';
    const res = await fetch(`${apiUrl}/api/lang/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip }),
      signal: AbortSignal.timeout(500), // 500ms max — don't slow down page load
    });
    if (res.ok) {
      const data = await res.json();
      if (data.detected && SUPPORTED.has(data.detected)) {
        return data.detected;
      }
    }
  } catch {
    // saubh-lang API not available — that's fine, fall back
  }
  return null;
}

// ─── Middleware ───
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Skip if cookie already set (user has a preference)
  const existing = req.cookies.get('saubh-lang')?.value;
  if (existing && SUPPORTED.has(existing)) {
    return res;
  }

  // Skip for API routes, static files, etc.
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|mp4|webm|css|js|woff2?)$/)
  ) {
    return res;
  }

  // ─── Detection priority: URL ?lang= > IP geo > Accept-Language > default ───
  let detected: string | null = null;

  // 1. URL parameter
  const urlLang = req.nextUrl.searchParams.get('lang');
  if (urlLang && SUPPORTED.has(urlLang)) {
    detected = urlLang;
  }

  // 2. IP-based geo-detection (via saubh-lang API)
  if (!detected) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || req.ip
      || '';
    if (ip && ip !== '127.0.0.1' && ip !== '::1') {
      detected = await detectFromIP(ip);
    }
  }

  // 3. Accept-Language header
  if (!detected) {
    detected = parseAcceptLanguage(req.headers.get('accept-language'));
  }

  // 4. Default
  if (!detected) {
    detected = 'en';
  }

  // Set cookie (1 year expiry)
  res.cookies.set('saubh-lang', detected, {
    path: '/',
    maxAge: 365 * 24 * 60 * 60,
    sameSite: 'lax',
  });

  return res;
}

// Only run middleware on page routes (not API, static, etc.)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*)*)'],
};
