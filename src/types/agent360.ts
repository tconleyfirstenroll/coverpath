export interface A360QuotingField {
  id: string;
  field_key: string;
  field_label: string;
  field_type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea' | 'email' | 'phone';
  is_required: boolean;
  display_order: number;
  options: string[];
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
}

export interface A360QuoteResult {
  quote_id: string | null;
  rate: {
    final_rate: number;
    factors: { label: string; value: number }[];
    breakdown: string;
  } | null;
  plans: { id: string; name: string; base_premium: number | null }[];
  product_name: string;
}
