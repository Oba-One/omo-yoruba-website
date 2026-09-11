/**
 * The pure half of enquiry-notify: which routing contact receives a kind, and the plain text
 * email built from the spec's field labels (ADR 0015, ADR 0016). Imports stay relative so the
 * deploy bundle carries the spec (docs/research/phase-2-sanity-functions-blueprints-resend.md).
 */
import {
  ENQUIRY_SPECS,
  type EnquiryKind,
  KIND_TITLES,
  KIND_TO_ROLE,
  replyToField,
  SENDER_FIELDS,
} from '../../src/enquiry-kinds';

export interface Contact {
  role: string;
  name?: string;
  email?: string;
  phone?: string;
  responds?: string;
}

export interface Route {
  to: string;
  contact?: Contact;
}

export interface EnquiryDocument {
  _id: string;
  _type: string;
  _rev?: string;
  kind: EnquiryKind;
  submittedAt?: string;
  source?: string;
  [details: string]: unknown;
}

export interface Email {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
}

const hasEmail = (contact: Contact | undefined): contact is Contact & { email: string } =>
  typeof contact?.email === 'string' && contact.email.trim() !== '';

/** The role's entry, then the general entry, then the general email; undefined when nothing routes. */
export function routeFor(
  kind: EnquiryKind,
  contacts: Contact[] | undefined,
  generalEmail: string | undefined,
): Route | undefined {
  const list = contacts ?? [];
  const forRole = list.find((contact) => contact.role === KIND_TO_ROLE[kind]);
  if (hasEmail(forRole)) return { to: forRole.email, contact: forRole };
  const general = list.find((contact) => contact.role === 'general');
  if (hasEmail(general)) return { to: general.email, contact: general };
  if (generalEmail?.trim()) return { to: generalEmail.trim() };
  return undefined;
}

function detailsOf(enquiry: EnquiryDocument): Record<string, unknown> {
  const details = enquiry[enquiry.kind];
  return details && typeof details === 'object' ? (details as Record<string, unknown>) : {};
}

function text(value: unknown): string {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : 'not given';
}

/** Who sent it, for the subject: the first name-like field the kind has. */
function senderOf(enquiry: EnquiryDocument): string | undefined {
  const details = detailsOf(enquiry);
  for (const id of SENDER_FIELDS) {
    const value = details[id];
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
  }
  return undefined;
}

export function buildEmail(enquiry: EnquiryDocument, route: Route): Email {
  const spec = ENQUIRY_SPECS[enquiry.kind];
  const details = detailsOf(enquiry);
  const sender = senderOf(enquiry);
  const reply = details[replyToField(enquiry.kind).id];
  const lines = [
    `A new ${enquiry.kind} enquiry arrived through omoyorubaofsocal.org.`,
    '',
    ...spec.fields.map((field) => `${field.label}: ${text(details[field.id])}`),
    '',
    `Sent from: ${text(enquiry.source)}`,
    `Submitted: ${text(enquiry.submittedAt)}`,
    `Reply to this email to answer them. The enquiry is also in the Studio inbox (id ${enquiry._id}).`,
  ];
  return {
    to: route.to,
    replyTo: typeof reply === 'string' && reply.trim() !== '' ? reply.trim() : undefined,
    subject: sender
      ? `${KIND_TITLES[enquiry.kind]} enquiry from ${sender}`
      : `${KIND_TITLES[enquiry.kind]} enquiry`,
    text: lines.join('\n'),
  };
}
