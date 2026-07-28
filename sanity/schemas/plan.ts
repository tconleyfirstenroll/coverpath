import { defineType, defineField, defineArrayMember } from 'sanity';

const CATEGORIES = [
  { title: 'Short Term Medical', value: 'short-term-medical' },
  { title: 'Hospital Indemnity', value: 'hospital-indemnity' },
  { title: 'Cancer', value: 'cancer' },
  { title: 'Dental', value: 'dental' },
  { title: 'Vision', value: 'vision' },
  { title: 'Prescription', value: 'prescription' },
  { title: 'Critical Illness', value: 'critical-illness' },
];

export const planSchema = defineType({
  name: 'plan',
  title: 'Plan',
  type: 'document',
  fields: [
    defineField({
      name: 'planId',
      title: 'Plan ID',
      type: 'slug',
      description: 'Unique identifier used in URLs (e.g. stm-basic). Auto-generated from name.',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'carrier', title: 'Carrier', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: CATEGORIES, layout: 'radio' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tier',
      title: 'Tier',
      type: 'string',
      options: { list: ['basic', 'standard', 'premium'], layout: 'radio' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'monthlyPremium', title: 'Monthly Premium ($)', type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'annualDeductible', title: 'Annual Deductible ($)', type: 'number' }),
    defineField({ name: 'rating', title: 'Rating (1–5)', type: 'number', validation: (r) => r.min(1).max(5) }),
    defineField({ name: 'reviewCount', title: 'Review Count', type: 'number' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Short bullet points shown on the plan card (3 max)',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'included', title: 'Included?', type: 'boolean', initialValue: true }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value', included: 'included' },
            prepare({ title, subtitle, included }) {
              return { title: `${included ? '✓' : '✗'} ${title}`, subtitle };
            },
          },
        }),
      ],
    }),
    defineField({ name: 'coinsurance', title: 'Coinsurance', type: 'string', description: 'e.g. 80/20' }),
    defineField({ name: 'maxBenefit', title: 'Max Benefit', type: 'string' }),
    defineField({ name: 'waitingPeriod', title: 'Waiting Period', type: 'string', description: 'e.g. 30 days' }),
    defineField({
      name: 'availableStates',
      title: 'Available States',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Two-letter state codes. Leave empty to mean all states.',
    }),
    defineField({ name: 'popular', title: 'Popular / Featured?', type: 'boolean', initialValue: false }),
    defineField({ name: 'badge', title: 'Badge Text', type: 'string', description: 'e.g. "Most Popular" or "Best Value"' }),
    defineField({ name: 'displayOrder', title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'carrier', category: 'category', premium: 'monthlyPremium' },
    prepare({ title, subtitle, category, premium }) {
      return { title, subtitle: `${subtitle} · ${category} · $${premium}/mo` };
    },
  },
  orderings: [
    { title: 'Category', name: 'categoryAsc', by: [{ field: 'category', direction: 'asc' }, { field: 'displayOrder', direction: 'asc' }] },
    { title: 'Price (low → high)', name: 'priceAsc', by: [{ field: 'monthlyPremium', direction: 'asc' }] },
  ],
});
