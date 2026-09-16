import { NextResponse } from 'next/server';
import { initA360Journey } from '@/lib/agent360';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const info = await initA360Journey(params.slug);
  if (!info) return NextResponse.json({ error: 'Journey unavailable' }, { status: 404 });
  return NextResponse.json(info);
}
