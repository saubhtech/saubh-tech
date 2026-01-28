// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { userQueries } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as {
      userid: number;
      whatsapp: string;
      fname: string;
    };

    const user = await userQueries.findByUserId(decoded.userid);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        userid: user.userid,
        fname: user.fname,
        whatsapp: user.whatsapp,
        email: user.email,
        pic: user.pic
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}