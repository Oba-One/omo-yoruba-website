import { defineField, defineType } from 'sanity';
import { voice } from '../../validation/rules';

/** One item of a glance strip or a plan-your-visit list: a label, a value, a note. */
export const fact = defineType({
  name: 'fact',
  title: 'Fact',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: voice.requiredHeading,
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'Leave empty until confirmed; the site shows a Pending chip.',
      validation: voice.text,
    }),
    defineField({ name: 'note', title: 'Note', type: 'string', validation: voice.text }),
  ],
  preview: {
    select: { label: 'label', value: 'value' },
    prepare: ({ label, value }) => ({ title: label, subtitle: value ?? 'Pending' }),
  },
});
