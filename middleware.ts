import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Public routes
const publicRoutes = [
  '/login',
  '/register',
  '/api/auth',
  '/api/admin',              // ✅ Admin APIs
  '/dashboard/admin'         // ✅ YEH ADD KARO - Dashboard pages
];
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get token
  const token = request.cookies.get('auth-token')?.value;

  // 🔴 IMPORTANT FIX: token missing
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // ✅ token is guaranteed string here
    const { payload } = await jwtVerify(token, SECRET_KEY);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', String(payload.userid));
    requestHeaders.set('x-user-name', String(payload.name));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Invalid / expired token
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
