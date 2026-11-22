/**
 * What a partner is to the organization. One list for the Studio's choices, the order Impact lists its
 * partners in (funders first) and the kicker a partner's card wears, so a kind added here reaches all
 * three. A plain module, as `scopes.ts` is, so `@oy/ui` reads it without the schema.
 */
export const PARTNER_KINDS = ['funder', 'partner', 'sponsor'] as const;

export type PartnerKind = (typeof PARTNER_KINDS)[number];

/** The kind in the site's words: the Studio's choice and the card's kicker. */
export const PARTNER_KIND_TITLES: Readonly<Record<PartnerKind, string>> = {
  funder: 'Funder',
  partner: 'Partner',
  sponsor: 'Sponsor',
};

/** A stored kind as one of the list's, or undefined for a value the list does not hold. */
export function partnerKind(value: string | null | undefined): PartnerKind | undefined {
  const stored = value?.trim();
  return PARTNER_KINDS.find((kind) => kind === stored);
}

/** Where a kind stands in Impact's list; a partner of no known kind comes last. */
export function partnerKindRank(value: string | null | undefined): number {
  const kind = partnerKind(value);
  return kind ? PARTNER_KINDS.indexOf(kind) : PARTNER_KINDS.length;
}
