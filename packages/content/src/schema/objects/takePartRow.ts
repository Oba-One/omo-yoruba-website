import { defineField, defineType } from 'sanity';
import { takePartWords } from '../../editing-defaults';
import { KIND_TITLES } from '../../enquiry-kinds';
import { WAY_INS } from '../../take-part';
import { voice } from '../../validation/rules';
import { titled } from '../helpers';

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
  fieldsets: [
    {
      name: 'wording',
      title: 'Custom wording (optional)',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'way',
      title: 'Way in',
      type: 'string',
      options: {
        list: titled(WAY_INS, KIND_TITLES),
        layout: 'radio',
      },
      description:
        'The title and button wording are supplied for you. Give opens the donation form; Member opens the membership form; Updates goes to the newsletter signup on the page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'chip',
      fieldset: 'wording',
      title: 'Chip',
      type: 'string',
      description:
        'The label beside the row when it is not the way in\'s own: "Partner" on a sponsor row, "Skills" on a volunteer row. Empty uses the way in\'s.',
      validation: voice.text,
    }),
    defineField({
      name: 'title',
      fieldset: 'wording',
      title: 'Title',
      type: 'string',
      description: 'Optional. Empty uses the title supplied for this page and way in.',
      validation: voice.heading,
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
      fieldset: 'wording',
      title: 'Button label',
      type: 'string',
      description: 'Optional. Empty uses the button wording supplied for this page and way in.',
      validation: voice.heading,
    }),
  ],
  preview: {
    select: { title: 'title', way: 'way', label: 'label' },
    prepare: ({ title, way, label }) => ({
      title: title || takePartWords('', way)?.title,
      subtitle: [way, label || takePartWords('', way)?.label].filter(Boolean).join(' • '),
    }),
  },
});
