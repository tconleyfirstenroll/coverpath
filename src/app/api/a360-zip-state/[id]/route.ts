import { NextRequest, NextResponse } from 'next/server';
import { fetchA360ZipState } from '@/lib/agent360';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const zip = new URL(request.url).searchParams.get('zip');
  if (!zip) return NextResponse.json({ error: 'zip is required' }, { status: 400 });
  const state = await fetchA360ZipState(params.id, zip);
  return NextResponse.json({ state });
}
