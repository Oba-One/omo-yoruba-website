import { defineField, defineType } from 'sanity';
import { WAY_INS } from '../../take-part';
import { voice } from '../../validation/rules';

/**
 * One row of a take-part band (ADR 0025): the way in, which decides the chip, the accent and what the
 * button opens, then the row's own title, one line and the button label. Facts never go in the
 * line: the festival's vendor row adds the edition's vendor terms itself.
 */
export const takePartRow = defineType({
  name: 'takePartRow',
  title: 'Take-part row',
  type: 'object',
  fields: [
    defineField({
      name: 'way',
      title: 'Way in',
      type: 'string',
      options: { list: WAY_INS.map((way) => ({ title: way, value: way })), layout: 'radio' },
      description:
        'Vendor, sponsor, performer, volunteer and table open their form; give opens the Give Dialog.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: voice.requiredHeading,
    }),
    defineField({
      name: 'line',
      title: 'One line',
      type: 'text',
      rows: 2,
      description: 'What it asks of the reader. No prices or dates: those come from the edition.',
      validation: voice.text,
    }),
    defineField({
      name: 'label',
      title: 'Button label',
      type: 'string',
      description: 'Starts with a verb, sentence case ("Apply for a booth").',
      validation: voice.requiredHeading,
    }),
  ],
  preview: {
    select: { title: 'title', way: 'way', label: 'label' },
    prepare: ({ title, way, label }) => ({
      title,
      subtitle: [way, label].filter(Boolean).join(' • '),
    }),
  },
});
