import { defineField, defineType } from 'sanity';
import { ENQUIRY_KINDS, KIND_TITLES } from '../../enquiry-kinds';
import { voice } from '../../validation/rules';
import { titled } from '../helpers';

export const CTA_KINDS = ['enquiry', 'give', 'join', 'url', 'anchor'] as const;

const OPENS: Record<(typeof CTA_KINDS)[number], string> = {
  enquiry: 'An enquiry form',
  give: 'The donation form',
  join: 'The Zeffy membership form',
  url: 'A link',
  anchor: 'A section on this page',
};

/**
 * A button: an enquiry kind, the Give Dialog, the Join Dialog, a link or an anchor on the page. No field has a
 * default: Sanity would then create a button on every new document that can hold one, and its
 * missing label would block Publish.
 */
export const cta = defineType({
  name: 'cta',
  title: 'Action',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Starts with a verb, sentence case ("Raise your hand").',
      validation: voice.requiredHeading,
    }),
    defineField({
      name: 'kind',
      title: 'Opens',
      type: 'string',
      options: { list: titled(CTA_KINDS, OPENS), layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'enquiryKind',
      title: 'Which form',
      type: 'string',
      options: { list: ENQUIRY_KINDS.map((kind) => ({ title: KIND_TITLES[kind], value: kind })) },
      hidden: ({ parent }) => parent?.kind !== 'enquiry',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { kind?: string } | undefined;
          if (parent?.kind === 'enquiry' && !value) return 'Choose which form this action opens.';
          return true;
        }),
    }),
    defineField({
      name: 'href',
      title: 'Link or anchor',
      type: 'string',
      description: 'A URL for a link, or "#section" for an anchor on this page.',
      hidden: ({ parent }) => parent?.kind !== 'url' && parent?.kind !== 'anchor',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { kind?: string } | undefined;
          if (parent?.kind === 'url' && !value) return 'Add the link.';
          if (parent?.kind === 'anchor' && !value?.startsWith('#'))
            return 'An anchor starts with #.';
          return true;
        }),
    }),
    defineField({
      name: 'newTab',
      title: 'Open in a new tab',
      type: 'boolean',
      hidden: ({ parent }) => parent?.kind !== 'url',
    }),
  ],
  preview: {
    select: { label: 'label', kind: 'kind', enquiryKind: 'enquiryKind', href: 'href' },
    prepare: ({ label, kind, enquiryKind, href }) => ({
      title: label,
      subtitle:
        kind === 'enquiry'
          ? `Form: ${KIND_TITLES[enquiryKind as keyof typeof KIND_TITLES] ?? 'not chosen'}`
          : (href ?? OPENS[kind as keyof typeof OPENS] ?? kind),
    }),
  },
});
