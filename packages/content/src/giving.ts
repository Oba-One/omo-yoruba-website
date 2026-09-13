/**
 * The other ways to give Donate lists besides the Give Dialog (CONTEXT, Other way to give; ADR 0035): each
 * way's kind decides what the page adds from the site settings, so the mailing address and the EIN are
 * typed once. A plain module with no Sanity import, so the schema and the site read one list.
 */
export const OTHER_WAY_KINDS = ['check', 'matching', 'inKind', 'daf', 'other'] as const;
export type OtherWayKind = (typeof OTHER_WAY_KINDS)[number];

/** Each kind as the Studio names it. */
export const OTHER_WAY_TITLES: Readonly<Record<OtherWayKind, string>> = {
  check: 'By check',
  matching: 'Employer matching',
  inKind: 'In-kind goods',
  daf: 'Donor-advised fund',
  other: 'Another way',
};

/** What a way adds from the settings: the mailing address for a check, the EIN for matching and a fund. */
export function otherWaySetting(kind: string | undefined): 'address' | 'ein' | undefined {
  if (kind === 'check') return 'address';
  if (kind === 'matching' || kind === 'daf') return 'ein';
  return undefined;
}
