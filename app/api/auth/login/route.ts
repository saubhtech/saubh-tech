// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth-service';
import { userQueries } from '@/lib/db';
import { sign } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { whatsapp, password } = await request.json();

    // Validation
    if (!whatsapp || !password) {
      return NextResponse.json(
        { error: 'WhatsApp number and password are required' },
        { status: 400 }
      );
    }

    // Check rate limiting
    const canAttempt = await authService.checkLoginAttempts(whatsapp);
    if (!canAttempt) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    // Check if user exists
    const user = await userQueries.findByWhatsapp(whatsapp);

    if (!user) {
      await authService.incrementLoginAttempts(whatsapp);
      return NextResponse.json(
        { error: 'Invalid WhatsApp number or password' },
        { status: 401 }
      );
    }

    // Verify password from Vercel KV
    const isValid = await authService.verifyPassword(whatsapp, password);

    if (!isValid) {
      await authService.incrementLoginAttempts(whatsapp);
      return NextResponse.json(
        { error: 'Invalid WhatsApp number or password' },
        { status: 401 }
      );
    }

    // Clear login attempts on success
    await authService.clearLoginAttempts(whatsapp);

    // Create JWT token
    const token = sign(
      { 
        userid: user.userid,
        whatsapp: user.whatsapp,
        fname: user.fname
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        userid: user.userid,
        fname: user.fname,
        whatsapp: user.whatsapp
      }
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

export const maxDuration = 10;