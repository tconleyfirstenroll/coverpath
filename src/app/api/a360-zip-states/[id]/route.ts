import { NextResponse } from 'next/server';
import { fetchA360ZipStates } from '@/lib/agent360';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const map = await fetchA360ZipStates(params.id);
  return NextResponse.json({ map });
}
