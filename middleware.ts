import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  phoneNumber: string;
  role: string;
  iat: number;
  exp: number;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  let user: DecodedToken | null = null;
  
  if (token) {
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';
      user = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
      user = null;
    }
  }

  const protectedPaths = ['/dashboard', '/profile', '/jobs/create'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (request.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/jobs/create', '/login'],
};