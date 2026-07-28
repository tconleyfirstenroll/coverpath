import { NextRequest, NextResponse } from 'next/server';
import { fetchA360Product } from '@/lib/agent360';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await fetchA360Product(params.id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: product });
}
