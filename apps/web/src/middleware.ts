import { NextRequest, NextResponse } from 'next/server';

// TODO S7: migrate to locale-in-URL routing (/hi-in/, /en-in/ etc.)
// Current approach uses cookie-based locale without URL prefix.

// ─── Supported language codes (must match languages.ts) ───
const SUPPORTED = new Set([
  'en','hi','bn','ta','te','mr','gu','kn','ml','pa','or','as','ur','ne','sa',
  'mai','kok','doi','sd','ks','brx','sat','mni',
  'ar','zh','fr','de','ja','ko','pt','ru','es','th','vi','id','ms','tr',
]);

// ─── Cloudflare country → default language mapping ───
// Used as a fast first-pass before hitting the saubh-lang API.
const CF_COUNTRY_TO_LANG: Record<string, string> = {
  IN: 'hi', BD: 'bn', PK: 'ur', NP: 'ne', LK: 'ta',
  SA: 'ar', AE: 'ar', EG: 'ar', QA: 'ar', KW: 'ar',
  CN: 'zh', TW: 'zh', HK: 'zh',
  JP: 'ja', KR: 'ko', TH: 'th', VN: 'vi', ID: 'id', MY: 'ms',
  FR: 'fr', DE: 'de', ES: 'es', MX: 'es', AR: 'es', CO: 'es',
  PT: 'pt', BR: 'pt', RU: 'ru', TR: 'tr', PL: 'pl',
};

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

// ─── Extract real client IP (Cloudflare → Caddy → Next.js) ───
// Cloudflare sets cf-connecting-ip with the true client IP.
// x-forwarded-for may contain multiple IPs when behind multiple proxies.
function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    ''
  );
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

  // ─── Detection priority: URL ?lang= > Cloudflare country > IP geo > Accept-Language > default ───
  let detected: string | null = null;

  // 1. URL parameter
  const urlLang = req.nextUrl.searchParams.get('lang');
  if (urlLang && SUPPORTED.has(urlLang)) {
    detected = urlLang;
  }

  // 2. Cloudflare cf-ipcountry header (fast, no API call needed)
  if (!detected) {
    const cfCountry = req.headers.get('cf-ipcountry');
    if (cfCountry && cfCountry !== 'XX' && cfCountry !== 'T1') {
      const mapped = CF_COUNTRY_TO_LANG[cfCountry.toUpperCase()];
      if (mapped && SUPPORTED.has(mapped)) {
        detected = mapped;
      }
    }
  }

  // 3. IP-based geo-detection (via saubh-lang API — fallback if Cloudflare header missing)
  if (!detected) {
    const ip = getClientIP(req);
    if (ip && ip !== '127.0.0.1' && ip !== '::1') {
      detected = await detectFromIP(ip);
    }
  }

  // 4. Accept-Language header
  if (!detected) {
    detected = parseAcceptLanguage(req.headers.get('accept-language'));
  }

  // 5. Default
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
