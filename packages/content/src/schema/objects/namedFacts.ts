import { defineField } from 'sanity';
import type { KnownFact } from '../../known-facts';
import { voice } from '../../validation/rules';

/** A short value form; occasional notes stay collapsed. No factual defaults are inferred. */
export function namedFacts(name: string, title: string, spec: readonly KnownFact[]) {
  return defineField({
    name,
    title,
    type: 'object',
    description: 'Leave a value empty until confirmed. The website shows it as pending.',
    options: { collapsible: false },
    fields: [
      ...spec.map((field) =>
        defineField({
          name: field.name,
          title: field.label,
          type: 'string',
          validation: voice.text,
        }),
      ),
      defineField({
        name: 'notes',
        title: 'Additional notes (optional)',
        type: 'object',
        options: { collapsible: true, collapsed: true },
        fields: spec.map((field) =>
          defineField({
            name: field.name,
            title: field.label,
            type: 'string',
            validation: voice.text,
          }),
        ),
      }),
    ],
  });
}
