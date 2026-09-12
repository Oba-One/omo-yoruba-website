import { defineArrayMember, defineField, defineType } from 'sanity';
import { voice } from '../../validation/rules';

/** A pull quote inside body copy: the one embedded object Portable Text allows. */
export const pullQuote = defineType({
  name: 'pullQuote',
  title: 'Pull quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: voice.requiredText,
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.text }),
    defineField({ name: 'relation', title: 'Relation', type: 'string', validation: voice.text }),
  ],
  preview: { select: { title: 'quote', subtitle: 'name' } },
});

/** Minimal Portable Text: normal, h3, blockquote; strong, em, link; pullQuote (CONTENT-MODEL principle 7). */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Link',
                type: 'url',
                validation: (rule) =>
                  rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: 'pullQuote' }),
  ],
  validation: voice.blocks,
});
