import {
  ALL_FIELDS_GROUP,
  type ConditionalProperty,
  defineField,
  defineType,
  type FieldDefinition,
} from 'sanity';
import { fixedLayoutValue } from '../../editing-defaults';
import type { LayoutSpec } from '../../layout-options';
import { layoutOption } from '../objects/layoutOption';

export type { LayoutSpec };

export interface PageSpec {
  name: string;
  title: string;
  /** The page's own fields, shown first. */
  fields: FieldDefinition[];
  /** The tweak props from ROUTES section 5, same names and options as the prototype. */
  layout: readonly LayoutSpec[];
  /** Pages without a gold action skip the actions group. */
  actions?: boolean;
  /** Pages without a header object (the homepage has a hero instead). */
  header?: boolean;
  /** Where the page's other facts live, shown under its header (the event pages, ADR 0042). */
  pointer?: string;
  /** The whole page locked, for a page only an administrator changes (studio/roles.ts). */
  readOnly?: ConditionalProperty;
}

/**
 * A short everyday form, with supporting copy and publishing options under Advanced (ADR 0053).
 * Legacy presentation and action fields stay hidden so existing drafts keep their stored shape.
 */
export function definePage({
  name,
  title,
  fields,
  layout,
  actions = true,
  header = true,
  pointer,
  readOnly,
}: PageSpec) {
  const groups = [
    { ...ALL_FIELDS_GROUP, hidden: true },
    { name: 'content', title: 'Content', default: true },
    { name: 'advanced', title: 'Advanced' },
  ];
  const supportingFields: Readonly<Record<string, readonly string[]>> = {
    homepage: ['programsIntro', 'voicesIntro', 'voicesProverb'],
    festivalPage: ['zonesIntro', 'pastYearsIntro', 'partnersIntro'],
    galaPage: ['tiersIntro', 'sponsorIntro', 'honoreesIntro', 'pastIntro'],
    lessonsPage: ['teacherIntro'],
    impactPage: ['fundersIntro', 'nextYear'],
    storyPage: ['boardIntro', 'staffIntro', 'reachUs'],
    getInvolvedPage: ['fallback'],
  };
  return defineType({
    name,
    title,
    type: 'document',
    readOnly,
    groups,
    fields: [
      ...(header
        ? [
            defineField({
              name: 'header',
              title: 'Header',
              type: 'pageHeader',
              group: 'content',
              description: pointer,
            }),
          ]
        : []),
      ...fields.map((field) => ({
        ...field,
        group:
          field.group ?? (supportingFields[name]?.includes(field.name) ? 'advanced' : 'content'),
      })),
      ...(actions
        ? [
            defineField({
              name: 'primaryAction',
              title: 'Primary action',
              type: 'cta',
              description: 'The one gold button on the page.',
              hidden: true,
              readOnly: true,
            }),
            defineField({
              name: 'secondaryActions',
              title: 'Secondary actions',
              type: 'array',
              of: [{ type: 'cta' }],
              description: 'Outline buttons.',
              hidden: true,
              readOnly: true,
            }),
          ]
        : []),
      ...(layout.length > 0
        ? [
            defineField({
              name: 'layout',
              title: 'Sections and promotion',
              type: 'object',
              group: 'advanced',
              options: { collapsible: true, collapsed: true },
              fields: layout.map((option) =>
                layoutOption(option.name, option.title, option.options, option.description, {
                  heldBack: option.heldBack,
                  fixed: fixedLayoutValue(name, option.name),
                }),
              ),
            }),
          ]
        : []),
      defineField({
        name: 'seo',
        title: 'Search and sharing',
        type: 'seo',
        group: 'advanced',
        description:
          'Optional. The heading and introduction already supply the search title and description.',
        options: { collapsible: true, collapsed: true },
      }),
    ],
    preview: { prepare: () => ({ title }) },
  });
}
