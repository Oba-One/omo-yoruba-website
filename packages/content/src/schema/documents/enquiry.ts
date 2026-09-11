import { defineField, defineType } from 'sanity';
import {
  ENQUIRY_KINDS,
  ENQUIRY_SPECS,
  type EnquiryKind,
  type FieldSpec,
  KIND_TITLES,
} from '../../enquiry-kinds';

/** The object type name that holds one kind's fields. */
export function enquiryFieldsType(kind: EnquiryKind): string {
  return `enquiry${kind.charAt(0).toUpperCase()}${kind.slice(1)}Fields`;
}

function fieldFromSpec(field: FieldSpec) {
  return defineField({
    name: field.id,
    title: field.label,
    type: field.kind === 'area' ? 'text' : 'string',
    options: field.kind === 'select' && field.options ? { list: [...field.options] } : undefined,
    readOnly: true,
  });
}

/** One read-only object per kind, generated from the spec (ADR 0015). */
export const enquiryFieldTypes = ENQUIRY_KINDS.map((kind) =>
  defineType({
    name: enquiryFieldsType(kind),
    title: `${KIND_TITLES[kind]} fields`,
    type: 'object',
    fields: ENQUIRY_SPECS[kind].fields.map(fieldFromSpec),
  }),
);

/** The name the Inbox shows for an enquiry: the first name-like field of its kind. */
export function enquiryTitleField(kind: EnquiryKind): string {
  const ids = ENQUIRY_SPECS[kind].fields.map((f) => f.id);
  return (
    ['org', 'biz', 'group', 'name', 'learner'].find((id) => ids.includes(id)) ?? (ids[0] as string)
  );
}

const previewSelect: Record<string, string> = {
  kind: 'kind',
  submittedAt: 'submittedAt',
  handled: 'handled',
  ...Object.fromEntries(
    ENQUIRY_KINDS.map((kind) => [`${kind}Title`, `${kind}.${enquiryTitleField(kind)}`]),
  ),
};

/**
 * An owned form submission. Written by the Astro Actions with the write token; the Studio can
 * mark it handled and add notes, nothing else (ADR 0015).
 */
export const enquiry = defineType({
  name: 'enquiry',
  title: 'Enquiry',
  type: 'document',
  fields: [
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: { list: ENQUIRY_KINDS.map((kind) => ({ title: KIND_TITLES[kind], value: kind })) },
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    ...ENQUIRY_KINDS.map((kind) =>
      defineField({
        name: kind,
        title: `${KIND_TITLES[kind]} details`,
        type: enquiryFieldsType(kind),
        hidden: ({ document }) => document?.kind !== kind,
        readOnly: true,
      }),
    ),
    defineField({ name: 'submittedAt', title: 'Submitted', type: 'datetime', readOnly: true }),
    defineField({
      name: 'source',
      title: 'Sent from',
      type: 'string',
      description: 'The page path the form was opened on.',
      readOnly: true,
    }),
    defineField({
      name: 'notifiedAt',
      title: 'Email sent',
      type: 'datetime',
      description: 'Set by the enquiry-notify function once the email is away.',
      readOnly: true,
    }),
    defineField({
      name: 'notifyError',
      title: 'Email problem',
      type: 'string',
      description: 'Set by the enquiry-notify function when the email could not be sent.',
      readOnly: true,
    }),
    defineField({ name: 'handled', title: 'Handled', type: 'boolean', initialValue: false }),
    defineField({ name: 'notes', title: 'Notes', type: 'text', rows: 4 }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'submittedDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: previewSelect,
    prepare: (selection: Record<string, unknown>) => {
      const kind = selection.kind as EnquiryKind | undefined;
      const title = kind ? (selection[`${kind}Title`] as string | undefined) : undefined;
      const when = selection.submittedAt
        ? new Date(selection.submittedAt as string).toLocaleDateString('en-GB')
        : '';
      return {
        title: title ?? (kind ? KIND_TITLES[kind] : 'Enquiry'),
        subtitle: [kind ? KIND_TITLES[kind] : '', when, selection.handled ? 'handled' : 'unhandled']
          .filter(Boolean)
          .join(' • '),
      };
    },
  },
});
