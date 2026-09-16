import { NextRequest, NextResponse } from 'next/server';
import { submitA360QuickQuote } from '@/lib/agent360';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { slug, agent_id, session_token, consumer_data } = await request.json();
    const result = await submitA360QuickQuote(slug, agent_id, session_token, consumer_data);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to get quotes' }, { status: 500 });
  }
}
