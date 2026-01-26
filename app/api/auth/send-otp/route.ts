import { NextRequest, NextResponse } from 'next/server';
import { evolutionApiService } from '@/lib/evolution-api';
import { otpService } from '@/lib/redis';
import { authService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!authService.validatePhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    const otp = authService.generateOTP();
    await otpService.storeOTP(phoneNumber, otp);
    await evolutionApiService.sendOTP(phoneNumber, otp);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}