/**
 * The doors (CONTEXT, Door; ADR 0013, ADR 0034): the ways in the homepage, Get Involved and Donate share
 * as documents, each with the chip it wears and the accent it borrows from the take-part rows' ways in. A
 * plain module with no Sanity import, so the schema, the seed and the site read one list.
 */
export const DOOR_KEYS = ['member', 'volunteer', 'vendor', 'partner', 'give'] as const;
export type DoorKey = (typeof DOOR_KEYS)[number];

/**
 * The chip each door wears, as the prototypes name them: "Membership" and "Partnership" from the homepage
 * rows, "Volunteer" and "Give" from the take-part rows, "Vendors" from `13 Get Involved.dc.html`. One chip
 * per door across the site, so Get Involved's card reads "Volunteer" where its prototype wrote
 * "Volunteering".
 */
export const DOOR_CHIPS: Readonly<Record<DoorKey, string>> = {
  member: 'Membership',
  volunteer: 'Volunteer',
  vendor: 'Vendors',
  partner: 'Partnership',
  give: 'Give',
};

/** The accent each door borrows from a way in (the member door takes the performer accent, as drawn). */
export const DOOR_ACCENTS: Readonly<Record<DoorKey, string>> = {
  member: 'performer',
  volunteer: 'volunteer',
  vendor: 'vendor',
  partner: 'sponsor',
  give: 'give',
};

/** Whether a stored value is one of the door keys. */
export const isDoorKey = (value: unknown): value is DoorKey =>
  typeof value === 'string' && (DOOR_KEYS as readonly string[]).includes(value);
