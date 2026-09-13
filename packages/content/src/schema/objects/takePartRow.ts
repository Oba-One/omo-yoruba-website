import { defineField, defineType } from 'sanity';
import { WAY_INS } from '../../take-part';
import { voice } from '../../validation/rules';

/**
 * One row of a take-part band (ADR 0025, ADR 0029): the way in, which decides the accent and what the
 * button opens, an optional chip replacing the way in's own on this page, then the row's title, one
 * line and the button label. Facts never go in the line: the festival's vendor row adds the edition's
 * vendor terms itself.
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
        'Vendor, sponsor, performer, volunteer, table, enrol and member open their form; give opens the Give Dialog; updates goes to the newsletter form on the page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'chip',
      title: 'Chip',
      type: 'string',
      description:
        'The label beside the row when it is not the way in\'s own: "Partner" on a sponsor row, "Skills" on a volunteer row. Empty uses the way in\'s.',
      validation: voice.text,
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
