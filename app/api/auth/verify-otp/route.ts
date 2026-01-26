import { NextRequest, NextResponse } from 'next/server';
import { otpService } from '@/lib/redis';
import { authService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json();

    // Validate inputs
    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    // Normalize phone number
    const normalizedPhone = authService.normalizePhoneNumber(phoneNumber);

    // Verify OTP
    const isValid = await otpService.verifyOTP(normalizedPhone, otp);
    
    if (!isValid) {
      const remainingAttempts = await otpService.getRemainingAttempts(normalizedPhone);
      
      return NextResponse.json(
        { 
          error: 'Invalid or expired OTP',
          remainingAttempts 
        },
        { status: 400 }
      );
    }

    // Generate JWT token (without database)
    const token = authService.generateToken({
      userId: normalizedPhone, // Use phone as userId temporarily
      phoneNumber: normalizedPhone,
      role: 'USER',
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: normalizedPhone,
        phoneNumber: normalizedPhone,
        name: null,
        role: 'USER',
      },
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}