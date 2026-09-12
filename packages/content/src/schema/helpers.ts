import { defineArrayMember, defineField } from 'sanity';
import { voice } from '../validation/rules';

/** A text field with the voice rules. */
export const text = (name: string, title: string, rows = 3, description?: string) =>
  defineField({ name, title, type: 'text', rows, description, validation: voice.text });

/** An array of references to one type. */
export const refs = (name: string, title: string, to: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [{ type: 'reference', to: [{ type: to }] }],
    description,
  });

/** An array of glance strip facts. */
export const facts = (name: string, title: string, description?: string) =>
  defineField({ name, title, type: 'array', of: [{ type: 'fact' }], description });

/** An array of short strings, each under the voice rules. */
export const lines = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [defineArrayMember({ type: 'string', validation: voice.text })],
    description,
  });

export const order = defineField({
  name: 'order',
  title: 'Order',
  type: 'number',
  description: 'Lower shows first.',
});

export const slug = (source: string) =>
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    options: { source, maxLength: 96 },
    validation: (rule) => rule.required(),
  });
