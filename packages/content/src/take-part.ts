/**
 * The ways in of a take-part band (CONTEXT, Way in; ADR 0025) and what each opens: its enquiry kind,
 * or the Give Dialog for `give`. A plain module with no Sanity import, so the schema, the seed and the
 * site read one list.
 */
export const WAY_INS = ['vendor', 'sponsor', 'performer', 'volunteer', 'table', 'give'] as const;
export type WayIn = (typeof WAY_INS)[number];

/** Whether a stored value is one of the ways in. */
export const isWayIn = (value: unknown): value is WayIn =>
  typeof value === 'string' && (WAY_INS as readonly string[]).includes(value);

export interface WayAction {
  label: string;
  kind: 'enquiry' | 'give';
  enquiryKind?: string;
}

/** The action a row's button takes: the way in decides what it opens, the row gives the label. */
export function wayAction(way: WayIn, label: string | null | undefined): WayAction | undefined {
  const text = label?.trim();
  if (!text) return undefined;
  return way === 'give'
    ? { label: text, kind: 'give' }
    : { label: text, kind: 'enquiry', enquiryKind: way };
}
