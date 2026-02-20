import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

const API_URL = process.env.API_INTERNAL_URL || 'http://localhost:3001';

async function proxyRequest(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { path } = await context.params;
  const target = `${API_URL}/api/master/${path.join('/')}`;
  const url = new URL(target);

  // Forward query params
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const headers: Record<string, string> = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  if (req.headers.get('content-type')) {
    headers['Content-Type'] = req.headers.get('content-type')!;
  }

  const fetchOpts: RequestInit = {
    method: req.method,
    headers,
  };

  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    fetchOpts.body = await req.text();
  }

  try {
    const res = await fetch(url.toString(), fetchOpts);
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Proxy error' },
      { status: 502 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
