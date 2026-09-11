import { defineField, defineType } from 'sanity';
import { CONTACT_ROLES, ROLE_TITLES } from '../../enquiry-kinds';
import { voice } from '../../validation/rules';

/** A routing contact: who receives an enquiry kind and how the success copy names them (ADR 0016). */
export const contactRole = defineType({
  name: 'contactRole',
  title: 'Routing contact',
  type: 'object',
  fields: [
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: { list: CONTACT_ROLES.map((role) => ({ title: ROLE_TITLES[role], value: role })) },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: "Named in the form's success copy. Empty names the role instead.",
      validation: voice.text,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Where enquiries of this kind are sent.',
      validation: (rule) => rule.email().error('Enter a full email address.'),
    }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({
      name: 'responds',
      title: 'Responds',
      type: 'string',
      description: 'Completes "writes ..." in the success copy: "within five working days".',
      validation: voice.text,
    }),
  ],
  preview: {
    select: { role: 'role', name: 'name', email: 'email' },
    prepare: ({ role, name, email }) => ({
      title: ROLE_TITLES[role as keyof typeof ROLE_TITLES] ?? role,
      subtitle: [name, email].filter(Boolean).join(' • ') || 'Pending',
    }),
  },
});
