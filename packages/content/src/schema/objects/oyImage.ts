import { type ConditionalPropertyCallback, defineField, defineType } from 'sanity';
import { photoCreditShown } from '../../hidden-inputs';
import { voice } from '../../validation/rules';

/** Only an album's photographs show a credit of their own, so the credit inputs show only there (ADR 0042). */
const creditHidden: ConditionalPropertyCallback = ({ document, path }) =>
  !photoCreditShown(document?._type, path[0]);

/**
 * Every image on the site: hotspot, alt (required once there is a picture), caption, credit. On an
 * album the credit fields usually stay empty because the album's credit applies to every photo
 * (ADR 0013). No field has a default: Sanity would then create the image on every new document,
 * with no picture, and the site and the to-do list would count it as present.
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
      // Asked for once there is a picture; an image slot left empty asks for nothing.
      validation: (rule) => [
        ...voice.text(rule),
        rule.custom((alt, context) =>
          (context.parent as { asset?: unknown } | undefined)?.asset && !alt?.trim()
            ? 'Add the alt text: who, doing what, where.'
            : true,
        ),
      ],
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
      hidden: creditHidden,
    }),
    defineField({
      name: 'creditNote',
      title: 'Credit, when no photographer fits',
      type: 'string',
      hidden: creditHidden,
      validation: voice.text,
    }),
    defineField({
      name: 'creditConfirmed',
      title: 'Credit confirmed',
      type: 'boolean',
      description: 'Tick only once the photographer has confirmed the credit.',
      hidden: creditHidden,
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
