import { NextRequest, NextResponse } from 'next/server';

// ─── Simple IP-to-language mapping ───
// Maps country-level IP ranges to likely languages
// This is a lightweight fallback — full geoip-lite will be in saubh-lang gateway
const COUNTRY_LANG: Record<string, string> = {
  IN: 'hi', BD: 'bn', LK: 'ta', NP: 'ne', PK: 'ur',
  SA: 'ar', AE: 'ar', QA: 'ar', KW: 'ar', BH: 'ar', OM: 'ar',
  CN: 'zh', TW: 'zh', HK: 'zh',
  JP: 'ja', KR: 'ko', TH: 'th', VN: 'vi', ID: 'id', MY: 'ms',
  FR: 'fr', DE: 'de', ES: 'es', PT: 'pt', BR: 'pt',
  RU: 'ru', TR: 'tr',
  MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es',
};

// ─── POST /api/lang/detect ───
// Called by middleware for IP-based geo-detection
// Body: { ip: string }
// Response: { detected: string | null }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ip } = body;

    if (!ip || ip === '127.0.0.1' || ip === '::1') {
      return NextResponse.json({ detected: null });
    }

    // Try Cloudflare/CDN country header (if behind reverse proxy)
    const cfCountry = req.headers.get('cf-ipcountry');
    if (cfCountry && COUNTRY_LANG[cfCountry]) {
      return NextResponse.json({ detected: COUNTRY_LANG[cfCountry] });
    }

    // For Indian IP ranges (most of our traffic), default to Hindi
    // Common Indian IP prefixes: 103.x, 106.x, 117.x, 122.x, 182.x, 223.x
    const firstOctet = parseInt(ip.split('.')[0], 10);
    const indianPrefixes = [49, 103, 106, 110, 112, 115, 117, 122, 136, 157, 171, 175, 182, 183, 202, 203, 223];
    if (indianPrefixes.includes(firstOctet)) {
      return NextResponse.json({ detected: 'hi' });
    }

    // No confident detection — return null (middleware falls back to Accept-Language)
    return NextResponse.json({ detected: null });
  } catch {
    return NextResponse.json({ detected: null });
  }
}
