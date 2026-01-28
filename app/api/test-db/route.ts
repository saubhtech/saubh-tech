// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Test basic connection
    const timeResult = await db.query('SELECT NOW() as current_time');
    
    // Check if users.users table exists
    const tableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'users' AND table_name = 'users'
      );
    `);

    // Get user count
    const userCount = await db.query('SELECT COUNT(*) as count FROM users.users');

    // Get sample user (if any)
    const sampleUser = await db.query('SELECT userid, fname, whatsapp FROM users.users LIMIT 1');

    return NextResponse.json({
      success: true,
      database: 'saubh',
      schema: 'users',
      table: 'users',
      user: 'saubhtech',
      connection: 'OK',
      serverTime: timeResult.rows[0].current_time,
      userTableExists: tableCheck.rows[0].exists,
      totalUsers: userCount.rows[0].count,
      sampleUser: sampleUser.rows[0] || null,
    });

  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stack,
      database: 'saubh',
      schema: 'users',
      user: 'saubhtech'
    }, { status: 500 });
  }
}