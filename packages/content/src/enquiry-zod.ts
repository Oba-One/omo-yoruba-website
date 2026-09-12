/**
 * Zod schemas derived from the enquiry spec, for the Astro Actions (Phase 3). Messages follow the
 * voice: a sentence naming what is missing, never colour alone.
 */
import { z } from 'zod';
import {
  ENQUIRY_KINDS,
  ENQUIRY_SPECS,
  type EnquiryKind,
  type FieldSpec,
  requiredSentence,
} from './enquiry-kinds';

export const EMAIL_MESSAGE = 'That email address does not look right. Check it and send again.';
/** The shape the inline scripts check before a request (Zod's own check is the server's word). */
export const EMAIL_PATTERN = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$';
const TEXT_MAX = 300;
const AREA_MAX = 4000;

function fieldSchema(field: FieldSpec): z.ZodType {
  const phrase = requiredSentence(field.req ?? field.label.toLowerCase());
  if (field.kind === 'select') {
    const options = field.options ?? [];
    const schema = z.enum(options as [string, ...string[]], {
      error: `Choose ${field.label.toLowerCase()}.`,
    });
    return field.required ? schema : schema.optional().or(z.literal(''));
  }
  const max = field.kind === 'area' ? AREA_MAX : TEXT_MAX;
  const text = z
    .string({ error: phrase })
    .trim()
    .max(max, { error: `Keep ${field.label.toLowerCase()} under ${max} characters.` });
  if (field.type === 'email') {
    return text.min(1, { error: phrase }).pipe(z.email({ error: EMAIL_MESSAGE }));
  }
  return field.required ? text.min(1, { error: phrase }) : text.optional();
}

function buildSchema(kind: EnquiryKind) {
  const shape: Record<string, z.ZodType> = {};
  for (const field of ENQUIRY_SPECS[kind].fields) shape[field.id] = fieldSchema(field);
  return z.object(shape);
}

export const enquirySchemas = Object.fromEntries(
  ENQUIRY_KINDS.map((kind) => [kind, buildSchema(kind)]),
) as Record<EnquiryKind, z.ZodObject<Record<string, z.ZodType>>>;

export function parseEnquiry(kind: EnquiryKind, data: unknown) {
  return enquirySchemas[kind].safeParse(data);
}

/** The newsletter signup: one address, the same sentences as the enquiry email fields. */
export const subscriberSchema = z.object({
  email: z
    .string({ error: requiredSentence('an email address') })
    .trim()
    .min(1, { error: requiredSentence('an email address') })
    .pipe(z.email({ error: EMAIL_MESSAGE })),
});

export function parseSubscriber(data: unknown) {
  return subscriberSchema.safeParse(data);
}
