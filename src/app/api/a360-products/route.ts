import { NextResponse } from 'next/server';
import { fetchA360Products } from '@/lib/agent360';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await fetchA360Products();
  return NextResponse.json(result);
}
