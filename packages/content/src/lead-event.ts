/**
 * Which edition leads the homepage's event band (ROUTES sections 1 and 5): the `season` option
 * with its automatic default by date. An explicit `leadEvent` reference always wins. `gala` or
 * `odunde` picks that kind's nearest dated upcoming edition, or its newest undated one that is
 * still to come. `auto` picks the nearest dated upcoming edition of either kind; when nothing is
 * dated it follows the calendar (the festival leads from January to June, the Gala from July to
 * December). A past edition never leads. Undated editions are read against the calendar too:
 * "Odunde 2026" is over once July 2026 arrives, "Gala 2026" stays ahead until the year ends.
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

/** Still to come: a dated edition by its end (or start), an undated one by the calendar. */
function upcoming(event: LeadCandidate, now: Date): boolean {
  const kind = event.kind;
  if (!isLeadKind(kind)) return false;
  const ends = dateOf(event.end) ?? dateOf(event.start);
  if (ends) return ends.getTime() >= now.getTime();
  const edition = event.edition ?? 0;
  const year = now.getFullYear();
  if (edition > year) return true;
  if (edition < year) return false;
  return SEASON_MONTHS[kind].includes(now.getMonth());
}

function byStart<T extends LeadCandidate>(events: T[]): T | undefined {
  return [...events].sort(
    (a, b) => (dateOf(a.start)?.getTime() ?? 0) - (dateOf(b.start)?.getTime() ?? 0),
  )[0];
}

function newest<T extends LeadCandidate>(events: T[]): T | undefined {
  return [...events].sort((a, b) => (b.edition ?? 0) - (a.edition ?? 0))[0];
}

function leadOfKind<T extends LeadCandidate>(events: T[], kind: LeadKind): T | undefined {
  const ofKind = events.filter((event) => event.kind === kind);
  return byStart(ofKind.filter((event) => dateOf(event.start))) ?? newest(ofKind);
}

export function calendarKind(now: Date): LeadKind {
  return SEASON_MONTHS.festival.includes(now.getMonth()) ? 'festival' : 'gala';
}

export function leadEvent<T extends LeadCandidate>(
  events: readonly T[],
  { season, explicit, now = new Date() }: LeadEventOptions<T> = {},
): T | undefined {
  if (explicit) return explicit;
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
