import { defineField, defineType } from 'sanity';
import { headerPhotoShown } from '../../hidden-inputs';
import { voice } from '../../validation/rules';

/** The top of every page: kicker, H1, one line, and a photo on the two event pages. */
export const pageHeader = defineType({
  name: 'pageHeader',
  title: 'Page header',
  type: 'object',
  fieldsets: [
    {
      name: 'identity',
      title: 'Heading and kicker',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({ name: 'kicker', title: 'Kicker', type: 'bilingual', fieldset: 'identity' }),
    defineField({
      name: 'title',
      fieldset: 'identity',
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
    // Only the two event pages draw a photo band; the other headers are slim (ADR 0042).
    defineField({
      name: 'image',
      title: 'Photo band image',
      type: 'oyImage',
      hidden: ({ document }) => !headerPhotoShown(document?._type),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'line' } },
});
