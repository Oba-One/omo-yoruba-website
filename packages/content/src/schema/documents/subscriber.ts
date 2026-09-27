import { defineField, defineType } from 'sanity';
import { forMembers } from '../../studio/roles';
import { instantDate, LA_DATETIME } from '../format';

/** A newsletter signup, stored until a provider is chosen (wayfinder ticket 01, ADR 0004). */
export const subscriber = defineType({
  name: 'subscriber',
  title: 'Subscriber',
  type: 'document',
  // Personal data, as enquiries (ADR 0042).
  readOnly: forMembers,
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed',
      type: 'datetime',
      options: LA_DATETIME,
      readOnly: true,
    }),
    defineField({ name: 'source', title: 'Signed up from', type: 'string', readOnly: true }),
    defineField({
      name: 'exportedAt',
      title: 'Exported',
      type: 'datetime',
      options: LA_DATETIME,
      description: 'Set when the address has been copied to the newsletter provider.',
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'subscribedDesc',
      by: [{ field: 'subscribedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'email', subscribedAt: 'subscribedAt', exportedAt: 'exportedAt' },
    prepare: ({ title, subscribedAt, exportedAt }) => ({
      title,
      subtitle: [instantDate(subscribedAt), exportedAt ? 'exported' : 'not exported']
        .filter(Boolean)
        .join(' • '),
    }),
  },
});
