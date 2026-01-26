import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const decoded = authService.getUserFromRequest(request);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return user info from token
    return NextResponse.json({ 
      user: {
        id: decoded.userId,
        phoneNumber: decoded.phoneNumber,
        role: decoded.role,
        isVerified: true,
      }
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user information' },
      { status: 500 }
    );
  }
}