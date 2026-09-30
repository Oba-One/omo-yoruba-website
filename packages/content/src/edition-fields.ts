import { COLLECTIVE_NAME, EVENT_PAGE_NAMES } from './routes';

/**
 * What each kind of event shows in the Studio (ADR 0042): the inputs that kind's pages read. A
 * plain module with no Sanity import, so the matrix is tested without the Studio.
 */
/** The kinds of event: each has its page, its list in the Studio and its starting template. `other` retired (ADR 0042). */
export const EVENT_KINDS = ['festival', 'gala', 'collective'] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

export const EVENT_KIND_TITLES: Record<EventKind, string> = {
  festival: EVENT_PAGE_NAMES.festival,
  gala: EVENT_PAGE_NAMES.gala,
  collective: `${COLLECTIVE_NAME} event`,
};

/** The Events lists, one per kind. */
export const EVENT_LIST_TITLES: Record<EventKind, string> = {
  festival: `${EVENT_PAGE_NAMES.festival} editions`,
  gala: `${EVENT_PAGE_NAMES.gala} editions`,
  collective: `${COLLECTIVE_NAME} events`,
};

/** Every event input beyond kind, title, start, end, the venue's name and the summary, which all kinds read. */
export const EDITION_FIELDS = [
  'edition',
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

const SHOWN: Record<EventKind, ReadonlySet<EditionField>> = {
  festival: new Set([
    'edition',
    'venue.line',
    'cost',
    'attendance',
    'schedule',
    'vendorsHosted',
    'vendorTerms',
  ]),
  gala: new Set([
    'edition',
    'venue.line',
    'venue.address',
    'doors',
    'dress',
    'ticketsUrl',
    'schedule',
  ]),
  // A Collective event lists its date, venue and summary; its photographs' album names it and carries
  // their date.
  collective: new Set([]),
};

const isEventKind = (kind: string | undefined): kind is EventKind =>
  (EVENT_KINDS as readonly (string | undefined)[]).includes(kind);

/** Whether the Studio shows an input for this kind; an event with no kind yet, or one no longer listed, shows every input. */
export function editionFieldShown(kind: string | undefined, field: EditionField): boolean {
  return isEventKind(kind) ? SHOWN[kind].has(field) : true;
}
