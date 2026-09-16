import { NextRequest, NextResponse } from 'next/server';
import { submitA360Refine } from '@/lib/agent360';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { slug, agent_id, session_token, selected_plan_id, consumer_data } = await request.json();
    const result = await submitA360Refine(slug, agent_id, session_token, selected_plan_id, consumer_data);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to compute rate' }, { status: 500 });
  }
}
