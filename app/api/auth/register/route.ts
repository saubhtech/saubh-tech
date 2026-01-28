// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth-service';
import { evolutionApiService } from '@/lib/evolution-api';
import { userQueries } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { fname, whatsapp } = await request.json();

    // Validation
    if (!fname || !whatsapp) {
      return NextResponse.json(
        { error: 'Name and WhatsApp number are required' },
        { status: 400 }
      );
    }

    if (!authService.validatePhoneNumber(whatsapp)) {
      return NextResponse.json(
        { error: 'Invalid WhatsApp number format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userQueries.findByWhatsapp(whatsapp);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already registered with this WhatsApp number' },
        { status: 409 }
      );
    }

    // Generate password
    const password = authService.generatePassword();
    
    // Create user in PostgreSQL
    const newUser = await userQueries.create(fname, whatsapp);

    // Store password in Vercel KV
    await authService.storePassword(whatsapp, password);

    // Send password via WhatsApp
    try {
      await evolutionApiService.sendPassword(whatsapp, newUser.userid, password);

      return NextResponse.json({
        success: true,
        message: 'Registration successful! Password sent to WhatsApp.',
        userid: newUser.userid
      });

    } catch (whatsappError: any) {
      console.error('WhatsApp send error:', whatsappError);
      
      // Rollback if WhatsApp fails
      await userQueries.deleteByUserId(newUser.userid);
      await authService.deletePassword(whatsapp);
      
      return NextResponse.json(
        { error: 'Failed to send password via WhatsApp. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}

export const maxDuration = 10;