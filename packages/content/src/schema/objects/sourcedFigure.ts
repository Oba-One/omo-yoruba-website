import { defineField, defineType } from 'sanity';
import { voice } from '../../validation/rules';

/** A number the site shows with where it comes from. Empty source means Pending. */
export const sourcedFigure = defineType({
  name: 'sourcedFigure',
  title: 'Sourced figure',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'As shown: "29", "3,000+", "4".',
      validation: voice.requiredText,
    }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: voice.requiredText }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'How it was counted and for which year ("Gate count by volunteers, 2026").',
      validation: voice.text,
    }),
    defineField({ name: 'asOf', title: 'As of', type: 'date' }),
  ],
  preview: {
    select: { value: 'value', label: 'label', source: 'source' },
    prepare: ({ value, label, source }) => ({
      title: `${value} ${label}`,
      subtitle: source ?? 'Source pending',
    }),
  },
});
