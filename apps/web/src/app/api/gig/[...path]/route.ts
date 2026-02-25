import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.INTERNAL_API_URL || 'http://127.0.0.1:3001';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const url = `${API_URL}/gig/${path.join('/')}${req.nextUrl.search}`;
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  const data = await res.text();
  return new NextResponse(data, { status: res.status, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const body = await req.text();
  const res = await fetch(`${API_URL}/gig/${path.join('/')}`, {
    method: 'POST', body, headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.text();
  return new NextResponse(data, { status: res.status, headers: { 'Content-Type': 'application/json' } });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const body = await req.text();
  const res = await fetch(`${API_URL}/gig/${path.join('/')}`, {
    method: 'PUT', body, headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.text();
  return new NextResponse(data, { status: res.status, headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const res = await fetch(`${API_URL}/gig/${path.join('/')}`, { method: 'DELETE' });
  return new NextResponse(null, { status: res.status });
}
