export interface A360QuotingField {
  id: string;
  field_key: string;
  field_label: string;
  field_type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea' | 'email' | 'phone';
  is_required: boolean;
  display_order: number;
  options: string[] | { value: string; label: string }[];
  /** Optional expanded explanation shown in a mouseover tooltip next to the label. */
  help_text?: string | null;
  /** Only render this field when the sibling field with this key currently holds one of depends_on_values. */
  depends_on_field_key?: string | null;
  depends_on_values?: string[] | null;
  /** Only render this field when the ZIP entered so far resolves to this state. */
  depends_on_state?: string | null;
}

export interface A360Plan {
  id: string;
  name: string;
  status: string;
  base_premium: number | null;
}

export interface A360Carrier {
  id: string;
  name: string;
}

export interface A360Product {
  id: string;
  name: string;
  code: string;
  category: string;
  product_type: string;
  status: string;
  carrier: A360Carrier | null;
  plans: A360Plan[];
  quoting_fields: A360QuotingField[];
  /** Slug of an active phased quote journey for this product, if one
   * exists — lets the product card offer a guided quick-quote walkthrough
   * (/journey/[slug]) instead of the flat /live-quote form. */
  journey_slug: string | null;
}

export interface A360PlanResult {
  plan_id: string;
  plan_name: string;
  base_premium: number | null;
  deductible: number | null;
  coverage_details: Record<string, string>;
  rate: number | null;
  factors: { label: string; value: number }[];
  breakdown: string;
  error?: string;
}

// ─────────────────────────────────────────────
// Phased quote journeys (quick quote -> refine -> identity/submit)
// ─────────────────────────────────────────────

export interface A360JourneyPhase {
  phase_number: number;
  phase_type: 'quick_quote' | 'refine' | 'identity_submit';
  title: string | null;
  description: string | null;
  fields: A360QuotingField[];
}

export interface A360JourneyInfo {
  agent_id: string;
  session_token: string;
  journey: {
    name: string;
    public_title: string | null;
    public_description: string | null;
    collect_email: boolean;
    collect_phone: boolean;
    collect_address: boolean;
    collect_ssn: boolean;
    product_id: string | null;
    phases: A360JourneyPhase[];
  };
  agent: {
    first_name: string;
    last_name: string;
    agent_number: string;
    email: string;
    phone: string;
  };
}

export interface A360PlanCard {
  plan_id: string;
  plan_name: string;
  plan_code: string;
  term_days: number;
  state: string;
  cheapest_rate: number;
}

export interface A360QuickQuoteResult {
  plans: A360PlanCard[];
  zip_state: string | null;
}

export interface A360RefineResult {
  rate: number;
  rate_breakdown: string;
  issue_tier: string;
  declined: boolean;
  declined_reason?: string;
}

export interface A360FinalizeResult {
  application_id: string;
  application_number: string;
  status: string;
  agent: { first_name: string; last_name: string; email: string; phone: string } | null;
}

export interface A360QuoteResult {
  quote_id: string | null;
  product_name: string;
  plan_results: A360PlanResult[];
  /** Set when the product could not be quoted at all — a knockout answer, a
   * state/ZIP restriction, or another eligibility/configuration issue.
   * `message` is a ready-to-display "We are unable to quote this product
   * because of ..." sentence; render it instead of plan_results/results UI. */
  declined?: boolean;
  unavailable?: boolean;
  message?: string;
  reason?: string;
  failed_field_labels?: string[];
}
