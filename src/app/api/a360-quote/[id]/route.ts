import { NextRequest, NextResponse } from 'next/server';
import { submitA360Quote } from '@/lib/agent360';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as { consumer_data: Record<string, unknown> };
    if (!body.consumer_data) {
      return NextResponse.json({ error: 'consumer_data is required' }, { status: 400 });
    }
    const result = await submitA360Quote(params.id, body.consumer_data);
    if (!result) return NextResponse.json({ error: 'Quoting service unavailable' }, { status: 503 });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
