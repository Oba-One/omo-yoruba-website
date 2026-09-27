import { defineField, defineType } from 'sanity';
import { forMembers } from '../../studio/roles';
import { voice } from '../../validation/rules';
import { titled } from '../helpers';
import { layoutOption } from '../objects/layoutOption';

export const SOCIAL_NETWORKS = ['instagram', 'facebook', 'linkedin', 'youtube'] as const;

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  // Administrators only (ADR 0042): a member who reaches the settings sees them, locked.
  readOnly: forMembers,
  groups: [
    { name: 'org', title: 'Organization', default: true },
    { name: 'contacts', title: 'Contacts' },
    { name: 'footer', title: 'Footer' },
    { name: 'services', title: 'Services' },
  ],
  fields: [
    defineField({
      name: 'orgName',
      title: 'Organization name',
      type: 'string',
      group: 'org',
      validation: voice.requiredText,
    }),
    defineField({
      name: 'ein',
      title: 'EIN',
      type: 'string',
      description: 'The trust line shows XX-XXXXXXX until this is filled.',
      group: 'org',
      validation: (rule) =>
        rule
          .regex(/^\d{2}-\d{7}$/, { name: 'EIN', invert: false })
          .warning('An EIN looks like 12-3456789.'),
    }),
    defineField({
      name: 'address',
      title: 'Mailing address',
      type: 'text',
      rows: 3,
      group: 'org',
      validation: voice.text,
    }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', group: 'org' }),
    defineField({
      name: 'generalEmail',
      title: 'General email',
      type: 'string',
      description:
        'The fallback for every enquiry kind without a routing contact, and the footer address.',
      group: 'org',
      validation: (rule) => rule.email().error('Enter a full email address.'),
    }),
    defineField({
      name: 'contacts',
      title: 'Routing contacts',
      type: 'array',
      of: [{ type: 'contactRole' }],
      description:
        'One entry per role. Each form goes to its role; a role without an entry goes to the General contact, then to the general email.',
      group: 'contacts',
    }),
    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'object',
          name: 'social',
          fields: [
            defineField({
              name: 'network',
              title: 'Network',
              type: 'string',
              options: {
                list: titled(SOCIAL_NETWORKS, { linkedin: 'LinkedIn', youtube: 'YouTube' }),
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'network', subtitle: 'url' } },
        },
      ],
    }),
    defineField({
      name: 'newsletterTitle',
      title: 'Newsletter title',
      type: 'string',
      group: 'footer',
      validation: voice.heading,
    }),
    defineField({
      name: 'newsletterBlurb',
      title: 'Newsletter blurb',
      type: 'text',
      rows: 2,
      group: 'footer',
      validation: voice.text,
    }),
    defineField({
      name: 'zeffyEmbedUrl',
      title: 'Zeffy embed URL',
      type: 'url',
      description: 'The donation form every Donate button opens.',
      group: 'services',
    }),
    defineField({
      name: 'analyticsEnabled',
      title: 'Analytics on',
      type: 'boolean',
      description: 'Off pauses the visitor counts right away.',
      initialValue: true,
      group: 'services',
    }),
    {
      ...layoutOption(
        'theme',
        'Theme',
        [{ value: 'adire', title: 'Àdìrẹ' }, 'calm', 'festival'],
        'The colour theme across the site.',
      ),
      group: 'services',
    },
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
