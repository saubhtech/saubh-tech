import { NextRequest, NextResponse } from 'next/server';
import {
  SUPPORTED_LOCALES_SET,
  DEFAULT_LOCALE,
  COOKIE_NAME,
} from '@saubhtech/shared';

const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year
const AUTH_COOKIE = 'saubh_admin_session';

// ─── Lang code → URL locale (Indian languages only for now) ─────────
const LANG_TO_LOCALE: Record<string, string> = {
  en: 'en-in', hi: 'hi-in', bn: 'bn-in', ta: 'ta-in', te: 'te-in',
  mr: 'mr-in', gu: 'gu-in', kn: 'kn-in', ml: 'ml-in', pa: 'pa-in',
  or: 'or-in', as: 'as-in', ur: 'ur-in', ks: 'ks-in', sd: 'sd-in',
  sa: 'sa-in', ne: 'ne-in', mai: 'mai-in', kok: 'kok-in',
  mni: 'mni-in', doi: 'doi-in', sat: 'sat-in', brx: 'brx-in',
};

// ─── Cloudflare cf-ipcountry → URL locale ───────────────────────────
const CF_COUNTRY_TO_LOCALE: Record<string, string> = {
  IN: 'en-in', BD: 'bn-in', NP: 'ne-in', PK: 'ur-in', LK: 'ta-in',
};

// ─── Public paths that don't require auth ───────────────────────────
const PUBLIC_PATHS = ['/login', '/api/auth'];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.includes(path));
}

// ─── Proxy (Next.js 16 convention, replaces middleware.ts) ──────────
// Handles both locale-in-URL routing and Keycloak auth checks.
//
// Locale detection priority:
//   1. Cookie saubh_locale (if valid)
//   2. Accept-Language header
//   3. Cloudflare cf-ipcountry
//   4. Default: en-in

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ─── Skip: static assets, internal Next.js routes ───────────────
  if (
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // ─── Skip auth check for API routes (they handle their own auth) ─
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // ─── Check if path already has a valid locale prefix ────────────
  const firstSegment = pathname.split('/')[1] ?? '';
  const hasLocale = SUPPORTED_LOCALES_SET.has(firstSegment);

  if (hasLocale) {
    // ─── Auth check (skip for public paths like /login) ───────────
    if (!isPublicPath(pathname)) {
      const authResult = checkAuth(req, firstSegment);
      if (authResult) return authResult;
    }

    const res = NextResponse.next();
    res.cookies.set(COOKIE_NAME, firstSegment, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
    return res;
  }

  // ─── Short lang code redirect: /en/login → /en-in/login ────────
  const mappedLocale = LANG_TO_LOCALE[firstSegment];
  if (mappedLocale && SUPPORTED_LOCALES_SET.has(mappedLocale)) {
    const rest = pathname.slice(firstSegment.length + 1); // strip /en
    const url = req.nextUrl.clone();
    url.pathname = `/${mappedLocale}${rest || ''}`;
    return NextResponse.redirect(url, 302);
  }

  // ─── No locale in URL — detect and redirect ────────────────────
  const detected = detectLocale(req);

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

// ─── Auth check ─────────────────────────────────────────────────────
function checkAuth(
  req: NextRequest,
  locale: string,
): NextResponse | null {
  const session = req.cookies.get(AUTH_COOKIE);

  // No session → redirect to login
  if (!session) {
    return NextResponse.redirect(
      new URL(`/${locale}/login`, req.url),
    );
  }

  // Check token expiry
  try {
    const data = JSON.parse(session.value);
    if (data.expiresAt && Date.now() >= data.expiresAt) {
      const response = NextResponse.redirect(
        new URL(`/${locale}/login?error=Session+expired`, req.url),
      );
      response.cookies.delete(AUTH_COOKIE);
      return response;
    }
  } catch {
    // Malformed cookie → clear and redirect
    const response = NextResponse.redirect(
      new URL(`/${locale}/login`, req.url),
    );
    response.cookies.delete(AUTH_COOKIE);
    return response;
  }

  return null; // Auth OK, continue
}

// ─── Locale detection chain ─────────────────────────────────────────

function detectLocale(req: NextRequest): string {
  // 1. Cookie
  const cookieVal = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieVal && SUPPORTED_LOCALES_SET.has(cookieVal)) {
    return cookieVal;
  }

  // 2. Accept-Language header
  const acceptLang = req.headers.get('accept-language');
  if (acceptLang) {
    const parts = acceptLang.split(',').map((p) => {
      const [tag, qStr] = p.trim().split(';q=');
      return { tag: tag.trim().toLowerCase(), q: qStr ? parseFloat(qStr) : 1.0 };
    });
    parts.sort((a, b) => b.q - a.q);
    for (const { tag } of parts) {
      const primary = tag.split('-')[0];
      const mapped = LANG_TO_LOCALE[primary];
      if (mapped && SUPPORTED_LOCALES_SET.has(mapped)) {
        return mapped;
      }
    }
  }

  // 3. Cloudflare cf-ipcountry header
  const country = req.headers.get('cf-ipcountry');
  if (country && country !== 'XX' && country !== 'T1') {
    const mapped = CF_COUNTRY_TO_LOCALE[country.toUpperCase()];
    if (mapped) return mapped;
  }

  // 4. Default
  return DEFAULT_LOCALE;
}

// ─── Matcher ────────────────────────────────────────────────────────
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
