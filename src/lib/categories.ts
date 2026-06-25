import type { CategoryMeta } from '@/types';

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'short-term-medical',
    name: 'Short Term Medical',
    shortName: 'Short Term',
    icon: '🏥',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Flexible coverage for gaps between major medical plans.',
    longDescription:
      'Short term medical plans provide temporary health coverage when you\'re between jobs, waiting for employer benefits to begin, or simply need a bridge until open enrollment. These plans cover doctor visits, urgent care, emergency services, and hospitalization at a fraction of traditional insurance costs.',
    whoNeedsIt: [
      'Recently unemployed or between jobs',
      'Waiting for employer benefits to start',
      'Early retirees under 65',
      'Young adults aging off parents\' plan',
      'Missed open enrollment window',
    ],
    keyBenefits: [
      'Same-day or next-day coverage available',
      'Nationwide network of doctors and hospitals',
      'Flexible term lengths (30 days to 12 months)',
      'No enrollment period restrictions',
    ],
    faqs: [
      {
        question: 'How quickly can coverage begin?',
        answer: 'Many short term plans can begin as early as the next day after approval.',
      },
      {
        question: 'Are pre-existing conditions covered?',
        answer: 'Most short term plans exclude pre-existing conditions. Check the plan details for specific exclusions.',
      },
      {
        question: 'Can I renew my plan?',
        answer: 'Yes, many short term plans are renewable up to 36 months depending on your state regulations.',
      },
    ],
  },
  {
    slug: 'hospital-indemnity',
    name: 'Hospital Indemnity',
    shortName: 'Hospital',
    icon: '🏨',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    description: 'Cash benefits paid directly to you during a hospital stay.',
    longDescription:
      'Hospital indemnity plans pay you a fixed daily or lump-sum cash benefit when you\'re admitted to the hospital. The money goes directly to you — use it for medical bills, lost wages, childcare, or any other expense. This coverage works alongside your primary health insurance to fill in the gaps.',
    whoNeedsIt: [
      'Anyone with a high-deductible health plan',
      'Self-employed individuals',
      'Those concerned about out-of-pocket costs',
      'People in high-risk occupations',
    ],
    keyBenefits: [
      'Cash paid directly to you, no restrictions',
      'Benefits paid regardless of other insurance',
      'Covers ICU, surgery, and outpatient care',
      'No network restrictions — use any hospital',
    ],
    faqs: [
      {
        question: 'Can I use the benefit money for anything?',
        answer: 'Yes! Cash benefits are paid directly to you with no restrictions on how you spend the money.',
      },
      {
        question: 'Does this replace my health insurance?',
        answer: 'No. Hospital indemnity is a supplemental plan designed to work alongside your primary insurance.',
      },
    ],
  },
  {
    slug: 'cancer',
    name: 'Cancer Plans',
    shortName: 'Cancer',
    icon: '🎗️',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    description: 'Financial protection specifically designed for cancer diagnosis and treatment.',
    longDescription:
      'Cancer insurance provides a lump-sum benefit or ongoing payments if you are diagnosed with cancer. The benefit can be used for treatment costs, travel to specialists, household bills during recovery, or any other expense. With 1 in 2 men and 1 in 3 women facing a cancer diagnosis in their lifetime, this coverage offers critical peace of mind.',
    whoNeedsIt: [
      'Anyone with a family history of cancer',
      'Those in high-risk professions or environments',
      'People with high-deductible health plans',
      'Anyone seeking extra financial protection',
    ],
    keyBenefits: [
      'Lump-sum payout on initial cancer diagnosis',
      'Covers all stages from skin cancer to internal organ cancers',
      'Benefits for chemotherapy, radiation, and surgery',
      'Survivor benefit and return of premium options',
    ],
    faqs: [
      {
        question: 'What types of cancer are covered?',
        answer: 'Most plans cover internal cancers, lymphoma, leukemia, and more. Skin cancers may have separate benefit levels.',
      },
      {
        question: 'When does coverage begin?',
        answer: 'There is typically a 30-day waiting period before cancer benefits become payable.',
      },
    ],
  },
  {
    slug: 'dental',
    name: 'Dental Plans',
    shortName: 'Dental',
    icon: '🦷',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    description: 'Comprehensive dental coverage from cleanings to major procedures.',
    longDescription:
      'Dental insurance helps cover the cost of routine preventive care, basic procedures like fillings, and major work such as crowns and root canals. Regular dental care is critical to overall health, and these plans make it affordable to stay on top of your oral hygiene without surprise bills.',
    whoNeedsIt: [
      'Anyone without employer dental benefits',
      'Families with children',
      'Adults over 50 with increased dental needs',
      'Those with ongoing dental work or orthodontic needs',
    ],
    keyBenefits: [
      '100% coverage on preventive cleanings and X-rays',
      'Large nationwide network of dentists',
      'No waiting period on preventive care',
      'Orthodontia coverage available on select plans',
    ],
    faqs: [
      {
        question: 'Is there a waiting period for major work?',
        answer: 'Preventive care typically has no waiting period. Basic work may have a 3-month wait, and major procedures up to 12 months on some plans.',
      },
      {
        question: 'Can I see any dentist?',
        answer: 'PPO plans allow you to see any dentist, though in-network providers offer better rates.',
      },
    ],
  },
  {
    slug: 'vision',
    name: 'Vision Plans',
    shortName: 'Vision',
    icon: '👁️',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    description: 'Eye exam coverage and allowances for glasses or contacts.',
    longDescription:
      'Vision insurance makes routine eye care affordable. Plans typically cover annual eye exams and provide allowances toward prescription glasses or contact lenses. Premium plans may include coverage for LASIK and designer frame options.',
    whoNeedsIt: [
      'Anyone who wears glasses or contacts',
      'Those with a family history of eye disease',
      'Adults over 40 experiencing vision changes',
      'Parents covering children\'s vision needs',
    ],
    keyBenefits: [
      'Annual eye exam covered at 100%',
      'Frame or contact lens allowance up to $300',
      'Access to LensCrafters, Target Optical, and 30,000+ providers',
      'LASIK discount of 15-40% with premium plans',
    ],
    faqs: [
      {
        question: 'How often can I get new glasses?',
        answer: 'Most plans allow new frames or lenses once per year (every 12 months).',
      },
      {
        question: 'Are contacts covered instead of glasses?',
        answer: 'Yes, most plans let you choose between glasses or contacts each benefit period.',
      },
    ],
  },
  {
    slug: 'prescription',
    name: 'Prescription Plans',
    shortName: 'Rx',
    icon: '💊',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Savings on generic and brand-name medications.',
    longDescription:
      'Prescription drug plans reduce the out-of-pocket cost of your medications at the pharmacy. Plans use a tier system — generics cost the least, preferred brand-names a bit more, and specialty medications have higher copays. Many plans also include mail-order pharmacy options for 90-day supplies at a discount.',
    whoNeedsIt: [
      'Anyone taking regular prescription medications',
      'Those with chronic conditions (diabetes, hypertension, etc.)',
      'People without employer prescription benefits',
      'Anyone looking to reduce their drug costs',
    ],
    keyBenefits: [
      'Low copays on Tier 1 generics ($0–$10)',
      '60,000+ participating pharmacies nationwide',
      '90-day mail-order supply at reduced cost',
      'Mobile app to compare drug prices and find savings',
    ],
    faqs: [
      {
        question: 'What is a drug formulary?',
        answer: 'A formulary is the list of covered drugs. Tier 1 drugs cost the least, with costs increasing for Tier 2 (preferred brand) and Tier 3 (non-preferred/specialty).',
      },
      {
        question: 'Can I use this at any pharmacy?',
        answer: 'Plans include a large network. Using in-network pharmacies like CVS, Walgreens, and Walmart gives you the best pricing.',
      },
    ],
  },
  {
    slug: 'critical-illness',
    name: 'Critical Illness',
    shortName: 'Critical Illness',
    icon: '❤️',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Lump-sum cash benefit when diagnosed with a qualifying serious illness.',
    longDescription:
      'Critical illness insurance pays a lump-sum cash benefit if you are diagnosed with a covered serious illness such as a heart attack, stroke, organ failure, or certain cancers. The payout is immediate and unrestricted — use it to cover medical bills, mortgage payments, daily expenses, or anything else during your recovery.',
    whoNeedsIt: [
      'Anyone with a family history of heart disease or stroke',
      'Breadwinners who need income protection',
      'Those with limited savings for emergencies',
      'Anyone with a high-deductible health plan',
    ],
    keyBenefits: [
      'Lump-sum benefit of $10,000–$100,000',
      'Covers heart attack, stroke, kidney failure, and more',
      'No restrictions on how you spend the benefit',
      'Waiver of premium if disabled',
    ],
    faqs: [
      {
        question: 'What conditions are covered?',
        answer: 'Common covered conditions include heart attack, stroke, major organ transplant, end-stage renal failure, blindness, paralysis, and certain cancers.',
      },
      {
        question: 'Is there a survival period required?',
        answer: 'Some plans require you to survive a set number of days (e.g., 30 days) after diagnosis to receive the benefit. Check the plan details.',
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
