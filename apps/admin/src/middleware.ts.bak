import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';

// Routes that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/api/auth',
  '/api/healthz',
  '/_next',
  '/favicon.ico',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_PATHS.some((path) => pathname.includes(path))) {
    return NextResponse.next();
  }

  // Check for session cookie
  const session = req.cookies.get(AUTH_COOKIE);

  if (!session) {
    // Extract locale from path (e.g., /en/dashboard → en)
    const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
    const locale = localeMatch?.[1] || 'en';
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // Basic expiry check (middleware can't parse JSON securely in edge,
  // but we do a best-effort check)
  try {
    const data = JSON.parse(session.value);
    if (data.expiresAt && Date.now() >= data.expiresAt) {
      const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
      const locale = localeMatch?.[1] || 'en';
      const response = NextResponse.redirect(new URL(`/${locale}/login?error=Session+expired`, req.url));
      response.cookies.delete(AUTH_COOKIE);
      return response;
    }
  } catch {
    // If cookie is malformed, redirect to login
    const response = NextResponse.redirect(new URL('/en/login', req.url));
    response.cookies.delete(AUTH_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
