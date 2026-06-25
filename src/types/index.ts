export type PlanCategory =
  | 'short-term-medical'
  | 'hospital-indemnity'
  | 'cancer'
  | 'dental'
  | 'vision'
  | 'prescription'
  | 'critical-illness';

export interface PlanBenefit {
  label: string;
  value: string;
  included: boolean;
}

export interface Plan {
  id: string;
  category: PlanCategory;
  name: string;
  carrier: string;
  carrierLogo?: string;
  tier: 'basic' | 'standard' | 'premium';
  monthlyPremium: number;
  annualDeductible?: number;
  rating: number;        // 1-5
  reviewCount: number;
  tagline: string;
  highlights: string[];
  benefits: PlanBenefit[];
  waitingPeriod?: string;
  coinsurance?: string;
  maxBenefit?: string;
  availableStates: string[];
  popular?: boolean;
  badge?: string;
}

export interface CategoryMeta {
  slug: PlanCategory;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  longDescription: string;
  whoNeedsIt: string[];
  keyBenefits: string[];
  faqs: { question: string; answer: string }[];
}

export interface QuizAnswers {
  coverageTypes: PlanCategory[];
  householdSize: 'just-me' | 'me-spouse' | 'family';
  age: number;
  state: string;
  budget: number;
}
