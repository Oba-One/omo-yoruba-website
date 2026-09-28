/**
 * Where a sponsor level or a partner shows (ADR 0042): only the values a page reads. The Gala page
 * lists the Gala's levels and the organization's; the Odunde page lists the partners scoped to it,
 * and Impact lists every partner whatever its scope. A plain module, so the `scopes` migration reads
 * the same lists as the schema.
 */
export const SPONSOR_SCOPES = ['gala', 'org'] as const;
export const SPONSOR_SCOPE_TITLES = { gala: 'End-of-Year Gala', org: 'The organization' } as const;

export const PARTNER_SCOPES = ['odunde'] as const;
export const PARTNER_SCOPE_TITLES = { odunde: 'Odunde Festival page' } as const;
