import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.AGENT360_API_URL ?? '';
const API_KEY = process.env.AGENT360_API_KEY ?? '';
const AGENT_NUMBER = process.env.AGENT360_AGENT_NUMBER ?? 'AGT-000004';

export async function POST(request: NextRequest) {
  // Return 200 silently if not configured — never break the CoverPath UI
  if (!BASE_URL || !API_KEY) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  try {
    const body = await request.json();
    const res = await fetch(`${BASE_URL}/api/public/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({ ...body, agent_number: AGENT_NUMBER }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
