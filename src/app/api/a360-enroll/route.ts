import { NextRequest, NextResponse } from 'next/server';

const A360_BASE_URL = process.env.AGENT360_API_URL || '';
const A360_API_KEY = process.env.AGENT360_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, ...enrollBody } = body;

    if (!product_id) {
      return NextResponse.json({ error: 'Missing product_id' }, { status: 400 });
    }

    if (!A360_BASE_URL || !A360_API_KEY) {
      return NextResponse.json({ error: 'Enrollment service not configured' }, { status: 503 });
    }

    const res = await fetch(`${A360_BASE_URL}/api/public/products/${product_id}/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': A360_API_KEY,
      },
      body: JSON.stringify(enrollBody),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error || 'Enrollment failed' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[a360-enroll] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
