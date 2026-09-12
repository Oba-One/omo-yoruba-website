import { defineField, defineType } from 'sanity';
import { voice } from '../../validation/rules';

export const seo = defineType({
  name: 'seo',
  title: 'Search and sharing',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The browser tab and search result title. Empty uses the page heading.',
      validation: (rule) => [
        ...voice.text(rule),
        rule.max(70).warning('Keep it under 70 characters.'),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => [
        ...voice.text(rule),
        rule.max(160).warning('Keep it under 160 characters.'),
      ],
    }),
    defineField({ name: 'ogImage', title: 'Sharing image', type: 'oyImage' }),
  ],
});
