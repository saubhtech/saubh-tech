import { NextRequest, NextResponse } from 'next/server';
import {
  isValidLocale,
  localeFromAcceptLanguage,
  localeFromCountry,
  DEFAULT_LOCALE,
} from './lib/i18n/locale-map';

const COOKIE_NAME = 'saubh_locale';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

// ─── Protected routes that require auth ─────────────────────────────
const PROTECTED_PATHS = ['/dashboard'];

// ─── Proxy (Next.js 16 convention, replaces middleware.ts) ──────────
// Locale-in-URL routing: every page lives under /{locale}/...
//
// Detection priority (per PROJECT_MASTER.md):
//   1. Cookie saubh_locale (if valid)
//   2. Accept-Language header (non-English Indian languages prioritised)
//   3. Cloudflare cf-ipcountry (IN → hi-in)
//   4. Accept-Language header (English fallback for non-Indian users)
//   5. Default: en-in
//
// Behavior:
//   - Path has no locale prefix → 302 redirect to /{locale}/path
//   - Path has valid locale prefix → pass through, set cookie
//   - API routes, static files, etc. → skip entirely
//   - Protected paths → check saubh_token cookie, redirect to login if missing

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ─── Skip: static assets, API, internal Next.js routes ──────────
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/sitemap') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|mp4|webm|css|js|woff2?|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // ─── Check if path already has a valid locale prefix ────────────
  // Matches: /en-in, /hi-in/about, /mai-in/language, etc.
  const segments = pathname.split('/');
  const firstSegment = segments[1] ?? ''; // e.g. "hi-in"

  if (isValidLocale(firstSegment)) {
    // ─── Auth check for protected routes ──────────────────────────
    const restPath = '/' + segments.slice(2).join('/');
    const isProtected = PROTECTED_PATHS.some(
      (p) => restPath === p || restPath.startsWith(p + '/'),
    );

    if (isProtected) {
      const token = req.cookies.get('saubh_token')?.value;
      if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = `/${firstSegment}/login`;
        return NextResponse.redirect(url, 302);
      }
    }

    // Valid locale in URL — pass through and persist in cookie
    const res = NextResponse.next();
    res.cookies.set(COOKIE_NAME, firstSegment, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
    return res;
  }

  // ─── No locale in URL — detect and redirect ────────────────────
  const detected = detectLocale(req);

  // Build redirect URL: /{locale}/original/path?query
  const url = req.nextUrl.clone();
  url.pathname = `/${detected}${pathname === '/' ? '' : pathname}`;

  const res = NextResponse.redirect(url, 302);
  res.cookies.set(COOKIE_NAME, detected, {
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  return res;
}

// ─── Locale detection chain ─────────────────────────────────────────

function detectLocale(req: NextRequest): string {
  // 1. Cookie (returning user — honour their previous choice)
  const cookieLocale = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLang = req.headers.get('accept-language');
  const fromHeader = localeFromAcceptLanguage(acceptLang);
  const country = req.headers.get('cf-ipcountry');

  // 2. Accept-Language — if a *non-English* language is detected, use it
  //    e.g. Bengali user's browser sends "bn-IN,bn;q=0.9,en;q=0.8" → bn-in
  if (fromHeader && fromHeader !== 'en-in') {
    return fromHeader;
  }

  // 3. Geo-detection (Cloudflare cf-ipcountry)
  //    For India: default to Hindi (regional users already matched in step 2)
  //    For other countries: use country-specific mapping
  const fromCountry = localeFromCountry(country);
  if (fromCountry) {
    return fromCountry;
  }

  // 4. Accept-Language English fallback (non-Indian users with English browser)
  if (fromHeader) {
    return fromHeader;
  }

  // 5. Default
  return DEFAULT_LOCALE;
}

// ─── Matcher ────────────────────────────────────────────────────────
// Run on all routes except internal Next.js and static assets.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
