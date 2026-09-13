/**
 * Which editions the site shows. The event pages show the next edition of their kind and past years
 * from the newest past one (`pageEdition`, `pastEdition`, ADR 0024); both read "still to come" the
 * way the homepage band does.
 *
 * Which edition leads the homepage's event band (ROUTES sections 1 and 5): the `season` option
 * with its automatic default by date. An explicit `leadEvent` reference wins while it is still
 * to come. `gala` or `odunde` picks that kind's nearest edition still to come, the same edition its
 * event page shows. `auto` picks the nearest dated upcoming edition of either kind; when nothing is
 * dated it follows the calendar (the festival leads from January to June, the Gala from July to
 * December). A past edition never leads. A dated edition is still to come until it ends, or, with
 * no end, until the end of the day it starts. Undated editions are read against the calendar: "Odunde
 * 2026" is over once July 2026 arrives, "Gala 2026" stays ahead until the year ends. Every calendar
 * reading is in Los Angeles time, whatever the server's zone.
 */
export type SeasonOption = 'auto' | 'gala' | 'odunde';
export type LeadKind = 'festival' | 'gala';

export interface LeadCandidate {
  kind?: string | null;
  edition?: number | null;
  start?: string | null;
  end?: string | null;
}

export interface LeadEventOptions<T> {
  season?: string | null;
  /** The `leadEvent` reference from the singleton, when the editor chose one. */
  explicit?: T | null;
  now?: Date;
}

/** The months (0 to 11) in which each kind is the one coming up. */
const SEASON_MONTHS: Record<LeadKind, readonly number[]> = {
  festival: [0, 1, 2, 3, 4, 5],
  gala: [6, 7, 8, 9, 10, 11],
};

/** The last month (0 to 11) of each kind's season: an undated edition is over once its year passes it. */
const SEASON_END: Record<LeadKind, number> = { festival: 5, gala: 11 };

const ZONE = 'America/Los_Angeles';
const zoneParts = new Intl.DateTimeFormat('en-US', {
  timeZone: ZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h23',
});

/** The Los Angeles calendar reading of an instant (month 0 to 11). */
function inLosAngeles(date: Date) {
  const parts = Object.fromEntries(
    zoneParts.formatToParts(date).map((part) => [part.type, Number(part.value)]),
  ) as Record<'year' | 'month' | 'day' | 'hour' | 'minute' | 'second', number>;
  return { ...parts, month: parts.month - 1 };
}

/** The last moment of the Los Angeles day an instant falls on. */
function endOfDay(date: Date): Date {
  const { year, month, day } = inLosAngeles(date);
  // Midnight UTC at the start of the next day, moved by the zone's offset there (no DST change falls
  // between that moment and Los Angeles midnight).
  const guess = Date.UTC(year, month, day + 1);
  const there = inLosAngeles(new Date(guess));
  const offset =
    Date.UTC(there.year, there.month, there.day, there.hour, there.minute, there.second) - guess;
  return new Date(guess - offset - 1);
}

const KIND_FOR_SEASON: Record<Exclude<SeasonOption, 'auto'>, LeadKind> = {
  gala: 'gala',
  odunde: 'festival',
};

function isLeadKind(kind: string | null | undefined): kind is LeadKind {
  return kind === 'festival' || kind === 'gala';
}

function dateOf(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * Still to come: a dated edition until its end, or until the end of its start day when it has no end
 * (the Gala's registry never asks for one); an undated one until its kind's season ends in its year.
 */
function upcoming(event: LeadCandidate, now: Date): boolean {
  const kind = event.kind;
  if (!isLeadKind(kind)) return false;
  const start = dateOf(event.start);
  const ends = dateOf(event.end) ?? (start ? endOfDay(start) : undefined);
  if (ends) return ends.getTime() >= now.getTime();
  const edition = event.edition ?? 0;
  const { year, month } = inLosAngeles(now);
  if (edition > year) return true;
  if (edition < year) return false;
  return month <= SEASON_END[kind];
}

function byStart<T extends LeadCandidate>(events: T[]): T | undefined {
  return [...events].sort(
    (a, b) => (dateOf(a.start)?.getTime() ?? 0) - (dateOf(b.start)?.getTime() ?? 0),
  )[0];
}

/** The nearest of a kind's editions by when they happen: one rule for the band and the event page. */
function leadOfKind<T extends LeadCandidate>(events: readonly T[], kind: LeadKind): T | undefined {
  return events.filter((event) => event.kind === kind).sort((a, b) => whenOf(a) - whenOf(b))[0];
}

export function calendarKind(now: Date): LeadKind {
  return SEASON_MONTHS.festival.includes(inLosAngeles(now).month) ? 'festival' : 'gala';
}

/** The frame an edition takes: the festival's or the Gala's (the default for anything else). */
export function leadKindOf(event: LeadCandidate | null | undefined): LeadKind {
  return event?.kind === 'festival' ? 'festival' : 'gala';
}

/** The kind's season in a year, for editions without a date: the festival in June, the Gala in November. */
const SEASON_START: Record<LeadKind, number> = { festival: 5, gala: 10 };

/** When an edition happens, for ordering: its start, else the first day of its kind's season. */
function whenOf(event: LeadCandidate & { kind?: string | null }): number {
  const start = dateOf(event.start);
  if (start) return start.getTime();
  const kind: LeadKind = event.kind === 'gala' ? 'gala' : 'festival';
  return Date.UTC(event.edition ?? 0, SEASON_START[kind], 1);
}

export interface EditionOptions<T> {
  now?: Date;
  /** Past years need photographs: the edition counts only when this answers true. */
  hasPhotos?: (event: T) => boolean;
}

/**
 * The next edition an event page shows (ADR 0024): the nearest edition of the page's kind still
 * to come, by the season rule's reading of "still to come" (a dated edition until it ends, an
 * undated one by the calendar), ordered by date or, undated, by the kind's season in its year. The
 * homepage band picks the same edition for the kind. Undefined when none is entered, and the page
 * shows its Pending chips for the next one.
 */
export function pageEdition<T extends LeadCandidate>(
  events: readonly T[],
  kind: LeadKind,
  { now = new Date() }: EditionOptions<T> = {},
): T | undefined {
  return leadOfKind(
    events.filter((event) => upcoming(event, now)),
    kind,
  );
}

/**
 * The edition past years show: the newest edition of the kind that is over and has photographs
 * (an album, unless `hasPhotos` says otherwise). Newest by date where it has one, else by the
 * kind's season in its year.
 */
export function pastEdition<T extends LeadCandidate & { album?: unknown }>(
  events: readonly T[],
  kind: LeadKind,
  { now = new Date(), hasPhotos = (event) => Boolean(event.album) }: EditionOptions<T> = {},
): T | undefined {
  return events
    .filter((event) => event.kind === kind && !upcoming(event, now) && hasPhotos(event))
    .sort((a, b) => whenOf(b) - whenOf(a))[0];
}

export function leadEvent<T extends LeadCandidate>(
  events: readonly T[],
  { season, explicit, now = new Date() }: LeadEventOptions<T> = {},
): T | undefined {
  if (explicit && upcoming(explicit, now)) return explicit;
  const ahead = events.filter((event) => upcoming(event, now));
  if (season === 'gala' || season === 'odunde') {
    const chosen = leadOfKind(ahead, KIND_FOR_SEASON[season]);
    if (chosen) return chosen;
  }
  const dated = byStart(ahead.filter((event) => dateOf(event.start)));
  if (dated) return dated;
  const kind = calendarKind(now);
  return leadOfKind(ahead, kind) ?? leadOfKind(ahead, kind === 'gala' ? 'festival' : 'gala');
}
