import type { A360Product, A360QuoteResult, A360JourneyInfo, A360QuickQuoteResult, A360RefineResult, A360FinalizeResult } from '@/types/agent360';

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

/** Whole zip3-prefix -> state map for a product, fetched once and cached
 * client-side rather than round-tripping per ZIP the consumer types. */
export async function fetchA360ZipStates(productId: string): Promise<Record<string, string>> {
  if (!BASE_URL || !API_KEY) return {};
  try {
    const res = await fetch(
      `${BASE_URL}/api/public/products/${productId}/zip-states?agent_number=${encodeURIComponent(DEFAULT_AGENT_NUMBER)}`,
      { headers: headers(), cache: 'no-store' }
    );
    if (!res.ok) return {};
    const json = await res.json();
    return json.map ?? {};
  } catch {
    return {};
  }
}

// ─────────────────────────────────────────────
// Phased quote journeys — session-based (/api/quote/[slug]/[agentId]/*),
// not the x-api-key public API the calls above use. /api/public/journey/
// [slug] resolves our agent_number to that agent's real UUID (the session
// routes are keyed by UUID in the URL, not agent_number); every call after
// that is a plain fetch against the session route with no auth header —
// matches how a real consumer's browser would hit the same endpoints
// directly, just proxied server-side here like everything else in this file.
// ─────────────────────────────────────────────

export async function initA360Journey(slug: string): Promise<A360JourneyInfo | null> {
  if (!BASE_URL || !API_KEY) return null;
  try {
    const resolveRes = await fetch(
      `${BASE_URL}/api/public/journey/${slug}?agent_number=${encodeURIComponent(DEFAULT_AGENT_NUMBER)}`,
      { headers: headers(), cache: 'no-store' }
    );
    if (!resolveRes.ok) return null;
    const { agent_id } = await resolveRes.json();

    const initRes = await fetch(`${BASE_URL}/api/quote/${slug}/${agent_id}`, { cache: 'no-store' });
    if (!initRes.ok) return null;
    const init = await initRes.json();

    return { agent_id, session_token: init.session_token, journey: init.journey, agent: init.agent };
  } catch {
    return null;
  }
}

export async function submitA360QuickQuote(
  slug: string,
  agentId: string,
  sessionToken: string,
  consumerData: Record<string, unknown>
): Promise<A360QuickQuoteResult> {
  const res = await fetch(`${BASE_URL}/api/quote/${slug}/${agentId}/quick-quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_token: sessionToken, consumer_data: consumerData }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Failed to get quotes');
  return json;
}

export async function submitA360Refine(
  slug: string,
  agentId: string,
  sessionToken: string,
  selectedPlanId: string,
  consumerData: Record<string, unknown>
): Promise<A360RefineResult> {
  const res = await fetch(`${BASE_URL}/api/quote/${slug}/${agentId}/refine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_token: sessionToken, selected_plan_id: selectedPlanId, consumer_data: consumerData }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Failed to compute rate');
  return json;
}

export async function submitA360Finalize(
  slug: string,
  agentId: string,
  sessionToken: string,
  member: Record<string, unknown>,
  spouse: Record<string, unknown> | null
): Promise<A360FinalizeResult> {
  const res = await fetch(`${BASE_URL}/api/quote/${slug}/${agentId}/finalize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_token: sessionToken, member, spouse }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Failed to submit application');
  return json;
}

export async function submitA360Quote(
  productId: string,
  consumerData: Record<string, unknown>
): Promise<A360QuoteResult | null> {
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
