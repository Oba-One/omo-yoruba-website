import { defineField, defineType } from 'sanity';
import { ENQUIRY_KINDS, KIND_TITLES } from '../../enquiry-kinds';
import { voice } from '../../validation/rules';

export const CTA_KINDS = ['enquiry', 'give', 'url', 'anchor'] as const;

/** A button: an enquiry kind, the Give Dialog, a link or an anchor on the page. */
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
      options: {
        list: [
          { title: 'An enquiry form', value: 'enquiry' },
          { title: 'The Give Dialog', value: 'give' },
          { title: 'A link', value: 'url' },
          { title: 'A section on this page', value: 'anchor' },
        ],
        layout: 'radio',
      },
      initialValue: 'enquiry',
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
      initialValue: false,
      hidden: ({ parent }) => parent?.kind !== 'url',
    }),
  ],
  preview: {
    select: { label: 'label', kind: 'kind', enquiryKind: 'enquiryKind', href: 'href' },
    prepare: ({ label, kind, enquiryKind, href }) => ({
      title: label,
      subtitle: kind === 'enquiry' ? `Form: ${enquiryKind ?? 'not chosen'}` : (href ?? kind),
    }),
  },
});
