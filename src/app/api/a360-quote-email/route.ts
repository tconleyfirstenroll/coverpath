import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.AGENT360_API_URL ?? '';
const API_KEY = process.env.AGENT360_API_KEY ?? '';

export async function POST(request: NextRequest) {
  if (!BASE_URL || !API_KEY) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
  }

  try {
    const body = await request.json() as { quote_id: string; email: string };

    if (!body.quote_id || !body.email) {
      return NextResponse.json({ error: 'quote_id and email are required' }, { status: 400 });
    }

    const res = await fetch(`${BASE_URL}/api/public/quotes/${body.quote_id}/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({ email: body.email }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to send quote' }, { status: 500 });
  }
}
