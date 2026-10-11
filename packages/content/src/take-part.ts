/**
 * The ways in of a take-part band (CONTEXT, Way in; ADR 0025, ADR 0029) and what each opens: its
 * enquiry kind, the Give Dialog for `give`, the Join Dialog for `member` (ADR 0050), or the newsletter
 * form on the same page for `updates`. A plain module with no Sanity import, so the schema, the seed
 * and the site read one list.
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

/** The chip each way in wears, as the prototypes name them; a row's own chip replaces it. */
export const WAY_CHIPS: Readonly<Record<WayIn, string>> = {
  vendor: 'Vendors',
  sponsor: 'Sponsors',
  performer: 'Performers',
  volunteer: 'Volunteers',
  table: 'Tables',
  give: 'Give',
  enrol: 'Enroll',
  member: 'Membership',
  updates: 'Updates',
};

/** The ways in that never carry a band's gold action: they ask nothing of a form. */
const SUPPORTING_WAYS: readonly WayIn[] = ['give', 'updates'];

/**
 * Whether a way in may carry its band's one gold action. Give and updates never do: their button is an
 * outline like every other row's, wherever the row stands (ADR 0055: one button shape in a band, where
 * the prototypes drew those two as text links).
 */
export const canCarryGold = (way: WayIn | undefined): boolean =>
  way !== undefined && !SUPPORTING_WAYS.includes(way);

/** Whether a stored value is one of the ways in. */
export const isWayIn = (value: unknown): value is WayIn =>
  typeof value === 'string' && (WAY_INS as readonly string[]).includes(value);

export type WayAction =
  | { label: string; kind: 'enquiry'; enquiryKind: string }
  | { label: string; kind: 'give' }
  | { label: string; kind: 'join' }
  | { label: string; kind: 'anchor'; href: string };

/** The action a row's button takes: the way in decides what it opens, the row gives the label. */
export function wayAction(way: WayIn, label: string | null | undefined): WayAction | undefined {
  const text = label?.trim();
  if (!text) return undefined;
  if (way === 'give') return { label: text, kind: 'give' };
  // The membership form, as the member door opens it; its trigger falls back to the member enquiry
  // while Organization details hold no form (ADR 0050; the owner, 11 October 2026).
  if (way === 'member') return { label: text, kind: 'join' };
  if (way === 'updates') return { label: text, kind: 'anchor', href: NEWSLETTER_ANCHOR };
  return { label: text, kind: 'enquiry', enquiryKind: way };
}
