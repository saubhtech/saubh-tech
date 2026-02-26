import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Supported Locales ───────────────────────────────────────────────────────
const supportedLocales = new Set([
  'en-in', 'hi-in', 'bn-in', 'ta-in', 'te-in', 'mr-in', 'gu-in',
  'kn-in', 'ml-in', 'pa-in', 'or-in', 'as-in', 'ur-in', 'ks-in',
  'sd-in', 'sa-in', 'ne-in', 'mai-in', 'kok-in', 'mni-in', 'doi-in',
  'sat-in', 'brx-in',
])

// ─── Language → Locale Mapping ───────────────────────────────────────────────
const langToLocale: Record<string, string> = {
  en: 'en-in', hi: 'hi-in', bn: 'bn-in', ta: 'ta-in', te: 'te-in',
  mr: 'mr-in', gu: 'gu-in', kn: 'kn-in', ml: 'ml-in', pa: 'pa-in',
  or: 'or-in', as: 'as-in', ur: 'ur-in', ks: 'ks-in', sd: 'sd-in',
  sa: 'sa-in', ne: 'ne-in', mai: 'mai-in', kok: 'kok-in', mni: 'mni-in',
  doi: 'doi-in', sat: 'sat-in', brx: 'brx-in',
  // International languages → default to en-in
  ar: 'en-in', zh: 'en-in', fr: 'en-in', de: 'en-in', ja: 'en-in',
  ko: 'en-in', pt: 'en-in', ru: 'en-in', es: 'en-in', th: 'en-in',
  vi: 'en-in', id: 'en-in', ms: 'en-in', tr: 'en-in', pl: 'en-in',
}

// ─── Locale → Language reverse mapping (for reference) ──────────────────────
const localeToLang: Record<string, string> = {}
for (const [lang, locale] of Object.entries(langToLocale)) {
  if (locale !== 'en-in' || lang === 'en') {
    localeToLang[locale] = lang
  }
}

// ─── Country → Locale Mapping (Cloudflare CF-IPCountry) ─────────────────────
const countryToLocale: Record<string, string> = {
  IN: 'hi-in', BD: 'bn-in', NP: 'ne-in', PK: 'ur-in', LK: 'ta-in',
  US: 'en-in', GB: 'en-in', AU: 'en-in', CA: 'en-in',
  SA: 'en-in', AE: 'en-in', EG: 'en-in', QA: 'en-in',
  CN: 'en-in', TW: 'en-in', HK: 'en-in', JP: 'en-in', KR: 'en-in',
  TH: 'en-in', VN: 'en-in', ID: 'en-in', MY: 'en-in',
  FR: 'en-in', DE: 'en-in', ES: 'en-in', MX: 'en-in', BR: 'en-in',
  PT: 'en-in', RU: 'en-in', TR: 'en-in', PL: 'en-in',
}

// ─── Constants ───────────────────────────────────────────────────────────────
const LOCALE_COOKIE = 'saubh_locale'

// ─── Protected Paths (require saubh_token cookie) ───────────────────────────
// CHANGE: Added "/gig" alongside "/dashboard"
const protectedPaths = ['/dashboard', '/gig']

// ─── Accept-Language Parser ──────────────────────────────────────────────────
function parseAcceptLanguage(header: string | null): string | null {
  if (!header) return null
  const parts = header.split(',').map((part) => {
    const [tag, q] = part.trim().split(';q=')
    return { tag: tag.trim().toLowerCase(), q: q ? parseFloat(q) : 1 }
  })
  parts.sort((a, b) => b.q - a.q)
  for (const { tag } of parts) {
    const locale = langToLocale[tag.split('-')[0]]
    if (locale && supportedLocales.has(locale)) return locale
  }
  return null
}

// ─── Locale Detection ────────────────────────────────────────────────────────
function detectLocale(request: NextRequest): string {
  // 1. Check saved cookie
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookieLocale && supportedLocales.has(cookieLocale)) return cookieLocale

  // 2. Parse Accept-Language header
  const langLocale = parseAcceptLanguage(request.headers.get('accept-language'))

  // 3. Check CF-IPCountry header (Cloudflare)
  const country = request.headers.get('cf-ipcountry')
  const countryLocale =
    country && country !== 'XX' && country !== 'T1'
      ? countryToLocale[country.toUpperCase()] ?? null
      : null

  // 4. Prefer non-en-in language detection over country
  if (langLocale && langLocale !== 'en-in') return langLocale

  // 5. Fallback chain: country → language → default
  return countryLocale || langLocale || 'en-in'
}

// ─── Middleware ───────────────────────────────────────────────────────────────
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip: static assets, API routes, well-known files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/sitemap') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|mp4|webm|css|js|woff2?|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  // Parse URL segments
  const segments = pathname.split('/')
  const firstSegment = segments[1] ?? ''

  // ─── URL already has a valid locale prefix ─────────────────────────────
  if (supportedLocales.has(firstSegment)) {
    const subPath = '/' + segments.slice(2).join('/')

    // Auth-check for protected paths
    if (
      protectedPaths.some((p) => subPath === p || subPath.startsWith(p + '/')) &&
      !request.cookies.get('saubh_token')?.value
    ) {
      const url = request.nextUrl.clone()
      url.pathname = `/${firstSegment}/login`
      return NextResponse.redirect(url, 302)
    }

    // Set locale cookie and pass through
    const response = NextResponse.next()
    response.cookies.set(LOCALE_COOKIE, firstSegment, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    })
    return response
  }

  // ─── No locale prefix → detect and redirect ───────────────────────────
  const locale = detectLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

  const response = NextResponse.redirect(url, 302)
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
  })
  return response
}

// ─── Matcher Config ──────────────────────────────────────────────────────────
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
