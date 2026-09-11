import { defineField, defineType } from 'sanity';
import { voice } from '../../validation/rules';

/** One row of a festival day or a gala evening. */
export const scheduleItem = defineType({
  name: 'scheduleItem',
  title: 'Schedule row',
  type: 'object',
  fields: [
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      description: '"11:00". Leave empty for a row led by a day.',
      validation: voice.text,
    }),
    defineField({
      name: 'day',
      title: 'Day',
      type: 'string',
      description: '"Saturday", for a row led by a day instead of a time.',
      validation: voice.text,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'bilingual',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'detail', title: 'Detail', type: 'text', rows: 2, validation: voice.text }),
    defineField({ name: 'zone', title: 'Zone', type: 'reference', to: [{ type: 'zone' }] }),
  ],
  preview: {
    select: { time: 'time', day: 'day', en: 'title.en', yo: 'title.yo' },
    prepare: ({ time, day, en, yo }) => ({
      title: yo ? `${yo} • ${en}` : en,
      subtitle: time ?? day,
    }),
  },
});
