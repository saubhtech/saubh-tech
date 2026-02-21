import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/api/', '/healthz', '/_next/', '/favicon.ico'];
const SUPPORTED_LOCALES = ['en-in', 'hi-in', 'bn-in', 'ta-in', 'te-in', 'mr-in', 'gu-in', 'kn-in', 'ml-in', 'pa-in', 'or-in', 'as-in', 'ur-in'];
const DEFAULT_LOCALE = 'en-in';
const ALLOWED_USERTYPES = ['BO', 'GW'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // --- Locale detection ---
  // Check if pathname already has a locale segment
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || '';
  const hasLocale = SUPPORTED_LOCALES.includes(firstSegment);

  if (!hasLocale) {
    // Read locale from cookie or default
    const cookieLocale = request.cookies.get('saubh_locale')?.value;
    const locale = SUPPORTED_LOCALES.includes(cookieLocale || '') ? cookieLocale! : DEFAULT_LOCALE;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === '/' ? '/inbox' : pathname}`;
    return NextResponse.redirect(url);
  }

  // --- Auth check ---
  const token = request.cookies.get('saubh_token')?.value;

  if (!token) {
    // Redirect to main site login
    const locale = firstSegment || DEFAULT_LOCALE;
    const loginUrl = new URL(`https://saubh.tech/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  // Decode JWT payload (base64, no verification — server verifies)
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );

    const usertype = payload.usertype || payload.ut;

    // Only BO and GW allowed (SA/AD use admin panel)
    if (usertype && !ALLOWED_USERTYPES.includes(usertype)) {
      const locale = firstSegment || DEFAULT_LOCALE;
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/unauthorized`;
      return NextResponse.rewrite(url);
    }

    // Check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      const locale = firstSegment || DEFAULT_LOCALE;
      const loginUrl = new URL(`https://saubh.tech/${locale}/login`, request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.href);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    // Invalid token — redirect to login
    const locale = firstSegment || DEFAULT_LOCALE;
    const loginUrl = new URL(`https://saubh.tech/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
