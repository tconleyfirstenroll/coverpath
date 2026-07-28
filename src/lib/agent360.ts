import type { A360Product } from '@/types/agent360';

const BASE_URL = process.env.AGENT360_API_URL ?? '';
const API_KEY = process.env.AGENT360_API_KEY ?? '';
export const DEFAULT_AGENT_NUMBER = process.env.AGENT360_AGENT_NUMBER ?? 'AGT-000004';

function headers() {
  return {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  };
}

export async function fetchA360Products(): Promise<{ data: A360Product[]; agent_id: string | null }> {
  if (!BASE_URL || !API_KEY) return { data: [], agent_id: null };
  try {
    const res = await fetch(
      `${BASE_URL}/api/public/products?agent_number=${encodeURIComponent(DEFAULT_AGENT_NUMBER)}`,
      { headers: headers(), cache: 'no-store' }
    );
    if (!res.ok) return { data: [], agent_id: null };
    return res.json();
  } catch {
    return { data: [], agent_id: null };
  }
}

export async function fetchA360Product(id: string): Promise<A360Product | null> {
  if (!BASE_URL || !API_KEY) return null;
  try {
    // Fetch all and find by id — avoids needing a single-product endpoint
    const { data } = await fetchA360Products();
    return data.find((p) => p.id === id) ?? null;
  } catch {
    return null;
  }
}

export async function submitA360Quote(
  productId: string,
  consumerData: Record<string, unknown>
): Promise<{
  quote_id: string | null;
  rate: { final_rate: number; factors: { label: string; value: number }[]; breakdown: string } | null;
  plans: { id: string; name: string; base_premium: number | null }[];
  product_name: string;
} | null> {
  if (!BASE_URL || !API_KEY) return null;
  try {
    const res = await fetch(`${BASE_URL}/api/public/products/${productId}/quote`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        agent_number: DEFAULT_AGENT_NUMBER,
        consumer_data: consumerData,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? 'Quote failed');
    }
    return res.json();
  } catch (err) {
    throw err;
  }
}
