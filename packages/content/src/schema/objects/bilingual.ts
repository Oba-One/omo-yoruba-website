import { defineField, defineType } from 'sanity';
import { voice } from '../../validation/rules';

/** A kicker or a zone name: Yoruba with marks leads, English supports. English is always present. */
export const bilingual = defineType({
  name: 'bilingual',
  title: 'Yoruba and English',
  type: 'object',
  fields: [
    defineField({
      name: 'yo',
      title: 'Yoruba',
      type: 'string',
      description: 'With every mark. Leave empty for a single English kicker ("Coming up next").',
      validation: voice.text,
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
      validation: voice.requiredText,
    }),
  ],
  preview: {
    select: { yo: 'yo', en: 'en' },
    prepare: ({ yo, en }) => ({ title: yo ? `${yo} • ${en}` : en }),
  },
});
