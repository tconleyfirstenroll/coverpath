import { defineType, defineField, defineArrayMember } from 'sanity';

export const categorySchema = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL slug (e.g. short-term-medical). Must match plan category values.',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'shortName', title: 'Short Name', type: 'string', description: 'Used in nav/filter chips' }),
    defineField({ name: 'icon', title: 'Icon (emoji)', type: 'string', description: 'Single emoji character' }),
    defineField({ name: 'color', title: 'Color Class', type: 'string', description: 'Tailwind text color class e.g. text-blue-600' }),
    defineField({ name: 'bgColor', title: 'BG Color Class', type: 'string', description: 'Tailwind bg color class e.g. bg-blue-50' }),
    defineField({ name: 'description', title: 'Short Description', type: 'string', description: 'Shown on category cards' }),
    defineField({ name: 'longDescription', title: 'Long Description', type: 'text', description: 'Shown on category detail page' }),
    defineField({
      name: 'whoNeedsIt',
      title: 'Who Needs It',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Bullet points for the sidebar',
    }),
    defineField({
      name: 'keyBenefits',
      title: 'Key Benefits',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Highlighted benefits shown on the hero',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'question' } },
        }),
      ],
    }),
    defineField({ name: 'displayOrder', title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'name', icon: 'icon', slug: 'slug' },
    prepare({ title, icon, slug }) {
      return { title: `${icon ?? ''} ${title}`, subtitle: slug?.current };
    },
  },
  orderings: [
    { title: 'Display Order', name: 'displayOrderAsc', by: [{ field: 'displayOrder', direction: 'asc' }] },
  ],
});
