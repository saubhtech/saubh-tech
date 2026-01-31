// middleware.ts - Update your existing middleware
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/api/auth', '/api/webhooks/whatsapp',];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('auth-token')?.value;

  // if (!token) {
  //   // Redirect to login if no token
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  try {
    // Verify JWT token
    const { payload } = await jwtVerify(token, SECRET_KEY);
    
    // Add user info to headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userid as string);
    requestHeaders.set('x-user-name', payload.name as string);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Token invalid or expired
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};