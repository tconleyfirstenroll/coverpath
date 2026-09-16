import { NextRequest, NextResponse } from 'next/server';
import { submitA360Finalize } from '@/lib/agent360';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { slug, agent_id, session_token, member, spouse } = await request.json();
    const result = await submitA360Finalize(slug, agent_id, session_token, member, spouse ?? null);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to submit application' }, { status: 500 });
  }
}
