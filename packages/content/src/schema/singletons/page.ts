import { defineField, defineType, type FieldDefinition } from 'sanity';
import type { LayoutSpec } from '../../layout-options';
import { layoutOption } from '../objects/layoutOption';

export type { LayoutSpec };

export interface PageSpec {
  name: string;
  title: string;
  /** The page's own fields, shown first. */
  fields: FieldDefinition[];
  /** The tweak props from ROUTES section 5, same names and options as the prototype. */
  layout: LayoutSpec[];
  /** Pages without a gold action (the news page) skip the actions group. */
  actions?: boolean;
  /** Pages without a header object (the homepage has a hero instead). */
  header?: boolean;
}

/**
 * One page singleton: content fields, the header, one primary action with secondary actions
 * (the gold rule, CONTENT-MODEL principle 5), the layout options (ADR 0006) and SEO.
 */
export function definePage({
  name,
  title,
  fields,
  layout,
  actions = true,
  header = true,
}: PageSpec) {
  const groups = [
    { name: 'content', title: 'Content', default: true },
    ...(actions ? [{ name: 'actions', title: 'Actions' }] : []),
    ...(layout.length > 0 ? [{ name: 'layout', title: 'Layout' }] : []),
    { name: 'seo', title: 'Search and sharing' },
  ];
  return defineType({
    name,
    title,
    type: 'document',
    groups,
    fields: [
      ...(header
        ? [defineField({ name: 'header', title: 'Header', type: 'pageHeader', group: 'content' })]
        : []),
      ...fields.map((field) => ({ ...field, group: field.group ?? 'content' })),
      ...(actions
        ? [
            defineField({
              name: 'primaryAction',
              title: 'Primary action',
              type: 'cta',
              description: 'The one gold button on the page.',
              group: 'actions',
            }),
            defineField({
              name: 'secondaryActions',
              title: 'Secondary actions',
              type: 'array',
              of: [{ type: 'cta' }],
              description: 'Outline buttons.',
              group: 'actions',
            }),
          ]
        : []),
      ...(layout.length > 0
        ? [
            defineField({
              name: 'layout',
              title: 'Layout options',
              type: 'object',
              group: 'layout',
              options: { collapsible: false },
              fields: layout.map((option) =>
                layoutOption(option.name, option.title, option.options, option.description),
              ),
            }),
          ]
        : []),
      defineField({ name: 'seo', title: 'Search and sharing', type: 'seo', group: 'seo' }),
    ],
    preview: { prepare: () => ({ title }) },
  });
}
