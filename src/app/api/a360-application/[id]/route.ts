import { NextRequest, NextResponse } from 'next/server';

const A360_BASE_URL = process.env.AGENT360_API_URL || '';
const A360_API_KEY = process.env.AGENT360_API_KEY || '';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!A360_BASE_URL || !A360_API_KEY) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const res = await fetch(`${A360_BASE_URL}/api/public/applications/${params.id}`, {
    headers: { 'x-api-key': A360_API_KEY },
    cache: 'no-store',
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.error || 'Not found' }, { status: res.status });
  return NextResponse.json(data);
}
