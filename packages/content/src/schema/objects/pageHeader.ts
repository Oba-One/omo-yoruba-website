import { defineField, defineType } from 'sanity';
import { voice } from '../../validation/rules';

/** The top of every page: kicker, H1, one line, and a photo on the two event pages. */
export const pageHeader = defineType({
  name: 'pageHeader',
  title: 'Page header',
  type: 'object',
  fields: [
    defineField({ name: 'kicker', title: 'Kicker', type: 'bilingual' }),
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      validation: voice.requiredHeading,
    }),
    defineField({
      name: 'line',
      title: 'One line under the heading',
      type: 'text',
      rows: 2,
      validation: voice.text,
    }),
    defineField({
      name: 'image',
      title: 'Photo band image',
      type: 'oyImage',
      description: 'Only the two event pages show a photo band; the other headers are slim.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'line' } },
});
