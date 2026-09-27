import { EVENT_PAGE_NAMES } from './routes';

/**
 * What each kind of event shows in the Studio (ADR 0042): the inputs that kind's pages read. A
 * plain module with no Sanity import, so the matrix is tested without the Studio.
 */
export const EVENT_KINDS = ['festival', 'gala', 'collective', 'other'] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

/** Kinds no new event takes; an event that still holds one keeps showing it (retired in part 5). */
export const RETIRED_EVENT_KINDS: readonly EventKind[] = ['other'];

export const ACTIVE_EVENT_KINDS = EVENT_KINDS.filter(
  (kind): kind is Exclude<EventKind, 'other'> => !RETIRED_EVENT_KINDS.includes(kind),
);

export const EVENT_KIND_TITLES: Record<EventKind, string> = {
  festival: EVENT_PAGE_NAMES.festival,
  gala: EVENT_PAGE_NAMES.gala,
  collective: 'Collective event',
  other: 'Other (no longer used)',
};

/** The Events lists, one per kind still in use. */
export const EVENT_LIST_TITLES: Record<(typeof ACTIVE_EVENT_KINDS)[number], string> = {
  festival: `${EVENT_PAGE_NAMES.festival} editions`,
  gala: `${EVENT_PAGE_NAMES.gala} editions`,
  collective: 'Collective events',
};

/** Every event input beyond kind, title, start, end, the venue's name and the summary, which all kinds read. */
export const EDITION_FIELDS = [
  'edition',
  'album',
  'venue.line',
  'venue.address',
  'doors',
  'dress',
  'ticketsUrl',
  'cost',
  'attendance',
  'schedule',
  'vendorsHosted',
  'vendorTerms',
] as const;
export type EditionField = (typeof EDITION_FIELDS)[number];

const SHOWN: Record<'festival' | 'gala' | 'collective', ReadonlySet<EditionField>> = {
  festival: new Set([
    'edition',
    'album',
    'venue.line',
    'cost',
    'attendance',
    'schedule',
    'vendorsHosted',
    'vendorTerms',
  ]),
  gala: new Set([
    'edition',
    'album',
    'venue.line',
    'venue.address',
    'doors',
    'dress',
    'ticketsUrl',
    'schedule',
  ]),
  // A Collective event lists its date, venue and summary. Its photographs are dated and linked on
  // the album itself, whose own date wins in the gallery.
  collective: new Set([]),
};

/** Whether the Studio shows an input for this kind; an event with no kind yet, or the retired kind, shows every input. */
export function editionFieldShown(kind: string | undefined, field: EditionField): boolean {
  if (kind !== 'festival' && kind !== 'gala' && kind !== 'collective') return true;
  return SHOWN[kind].has(field);
}
