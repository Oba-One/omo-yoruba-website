import { defineField, defineType } from 'sanity';

/** A newsletter signup, stored until a provider is chosen (wayfinder ticket 01, ADR 0004). */
export const subscriber = defineType({
  name: 'subscriber',
  title: 'Subscriber',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required().email(),
    }),
    defineField({ name: 'subscribedAt', title: 'Subscribed', type: 'datetime', readOnly: true }),
    defineField({ name: 'source', title: 'Signed up from', type: 'string', readOnly: true }),
    defineField({
      name: 'exportedAt',
      title: 'Exported',
      type: 'datetime',
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
      subtitle: [
        subscribedAt ? new Date(subscribedAt).toLocaleDateString('en-GB') : '',
        exportedAt ? 'exported' : 'not exported',
      ]
        .filter(Boolean)
        .join(' • '),
    }),
  },
});
