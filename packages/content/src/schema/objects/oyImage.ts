import { defineField, defineType } from 'sanity';
import { voice } from '../../validation/rules';

/**
 * Every image on the site: hotspot, required alt, caption, credit. On an album the credit fields
 * usually stay empty because the album's credit applies to every photo (ADR 0013).
 */
export const oyImage = defineType({
  name: 'oyImage',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Who, doing what, where. Yoruba names with marks. Never "image of".',
      validation: voice.requiredText,
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Yoruba first where there is a Yoruba name for the moment.',
      validation: voice.text,
    }),
    defineField({
      name: 'credit',
      title: 'Photographer',
      type: 'reference',
      to: [{ type: 'photographer' }],
    }),
    defineField({
      name: 'creditNote',
      title: 'Credit, when no photographer fits',
      type: 'string',
      validation: voice.text,
    }),
    defineField({
      name: 'creditConfirmed',
      title: 'Credit confirmed',
      type: 'boolean',
      description: 'Tick only once the photographer has confirmed the credit.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { alt: 'alt', caption: 'caption', media: 'asset' },
    prepare: ({ alt, caption, media }) => ({
      title: caption ?? alt,
      subtitle: caption ? alt : undefined,
      media,
    }),
  },
});
