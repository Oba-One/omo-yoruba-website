/**
 * The ways in of a take-part band (CONTEXT, Way in; ADR 0025, ADR 0029) and what each opens: its
 * enquiry kind, the Give Dialog for `give`, or the newsletter form on the same page for `updates`. A
 * plain module with no Sanity import, so the schema, the seed and the site read one list.
 */
export const WAY_INS = [
  'vendor',
  'sponsor',
  'performer',
  'volunteer',
  'table',
  'give',
  'enrol',
  'member',
  'updates',
] as const;
export type WayIn = (typeof WAY_INS)[number];

/**
 * Where an Updates row sends the reader: the newsletter form's block, in the footer or in the
 * homepage's band, whichever the page draws.
 */
export const NEWSLETTER_ANCHOR = '#subscribe';

/** Whether a stored value is one of the ways in. */
export const isWayIn = (value: unknown): value is WayIn =>
  typeof value === 'string' && (WAY_INS as readonly string[]).includes(value);

export type WayAction =
  | { label: string; kind: 'enquiry'; enquiryKind: string }
  | { label: string; kind: 'give' }
  | { label: string; kind: 'anchor'; href: string };

/** The action a row's button takes: the way in decides what it opens, the row gives the label. */
export function wayAction(way: WayIn, label: string | null | undefined): WayAction | undefined {
  const text = label?.trim();
  if (!text) return undefined;
  if (way === 'give') return { label: text, kind: 'give' };
  if (way === 'updates') return { label: text, kind: 'anchor', href: NEWSLETTER_ANCHOR };
  return { label: text, kind: 'enquiry', enquiryKind: way };
}
