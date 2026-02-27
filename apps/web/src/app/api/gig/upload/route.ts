import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://127.0.0.1:3001';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Forward multipart form data directly to API
    const body = await req.arrayBuffer();
    const res = await fetch(API_URL + '/api/gig/upload', {
      method: 'POST',
      headers: { 'content-type': contentType },
      body: body,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
