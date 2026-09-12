import { defineField, defineType } from 'sanity';
import { voice } from '../../validation/rules';

export const faqItem = defineType({
  name: 'faqItem',
  title: 'Question',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: voice.requiredText,
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'blockContent',
      description: 'Leave empty until the answer is yours; the site shows a Pending chip.',
    }),
  ],
  preview: { select: { title: 'question' } },
});
