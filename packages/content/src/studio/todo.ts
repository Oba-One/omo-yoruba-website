/**
 * The To do view's model (ADR 0042): what the site still owes, by page, with counts. It reads the
 * Pending registry (ADR 0014) the way the site does: an event row counts only the edition its page
 * shows (`lead-event.ts`), a presence row only while its documents fall short, and site settings
 * rows gather under Organization details, where they are fixed. A plain module with no Sanity
 * import: the Studio's lists (`todo-list.ts`) run its one query and build panes from its state, and
 * the tests run both against the seed.
 */
import { collectiveEvents, type LeadCandidate, pageEdition, pastEdition } from '../lead-event';
import {
  type Edition,
  PENDING,
  type PendingEntry,
  PRESENCE,
  type PresenceEntry,
  pendingFilter,
  pendingTitle,
  presenceFilter,
} from '../pending';
import { EVENT_PAGE_NAMES } from '../routes';
import { SITE_PAGES, type SitePage } from './site-pages';

/** Site settings rows gather here, whichever page shows them: the settings are fixed in one place. */
export const ORGANIZATION = { id: 'organization', title: 'Organization details' } as const;

/** The groups of the To do, in its order: the site's pages as the navigation walks them, then the settings. */
export const TODO_GROUPS: readonly { id: string; title: string }[] = [
  ...SITE_PAGES.map(({ type, title }) => ({ id: type, title })),
  ORGANIZATION,
];

/** The register's page labels (a Where column's words before its first comma) and the page each names. */
const REGISTER_PAGES: Readonly<Record<string, SitePage>> = {
  Homepage: 'homepage',
  Odunde: 'festivalPage',
  Gala: 'galaPage',
  Sponsorship: 'galaPage',
  Programs: 'programsPage',
  Lessons: 'lessonsPage',
  Collective: 'collectivePage',
  'Get Involved': 'getInvolvedPage',
  Doors: 'getInvolvedPage',
  Impact: 'impactPage',
  'Our Story': 'storyPage',
  Donate: 'donatePage',
  Gallery: 'galleryPage',
};

/** The event kinds whose page shows one next edition; the To do asks for it while none is entered. */
const NEXT_EDITION_KINDS = ['festival', 'gala'] as const;

export interface TodoRow {
  /** Stable while the row's filter is, whatever its wording, so an open pane keeps its row. */
  id: string;
  entry: PendingEntry;
  /** The group it gathers under: a site page's singleton type, or Organization details. */
  group: string;
  title: string;
}

/** Something the site needs more documents of: a presence row, or a next edition not yet entered. */
export interface StillToAdd {
  id: string;
  title: string;
  /** The list it opens: documents of this type, narrowed by the filter. */
  type: string;
  filter?: string;
  /** The starting template for new documents, where the type's own would not do (an event's kind). */
  template?: string;
  minimum: number;
  /** The presence row that counts it; a next edition has none, since the site's rules find it. */
  presence?: PresenceEntry;
  nextEdition?: (typeof NEXT_EDITION_KINDS)[number];
}

/** What one role's To do counts: members never see an administrator's documents (`ADMIN_ONLY_TYPES`). */
export interface TodoPlan {
  rows: TodoRow[];
  stillToAdd: StillToAdd[];
  /** Document types left out, from the wording to check too. */
  hidden: string[];
}

interface EditionFacts extends LeadCandidate {
  _id: string;
  /** The photographs in the edition's album: past years count an edition only with some. */
  photos?: number | null;
}

/** A document a row or a presence entry finds, with the edition it belongs to, if any. */
export interface Found {
  _id: string;
  edition?: string | null;
}

/** What `todoQuery` answers. */
export interface TodoResult {
  editions?: (EditionFacts | null)[] | null;
  /** Per row, the documents its filter finds. */
  rows?: Record<string, (Found | null)[] | null> | null;
  /** Per presence entry, the documents it counts. */
  presence?: Record<string, (Found | null)[] | null> | null;
  /** Lint reports with something to fix. */
  wording?: number | null;
}

export interface OwedRow {
  row: TodoRow;
  /** The documents that owe it, by published id. */
  ids: string[];
}

export interface OwedGroup {
  id: string;
  title: string;
  /** The documents owed across its rows. */
  count: number;
  rows: OwedRow[];
}

export interface MissingRow {
  add: StillToAdd;
  count: number;
}

export interface TodoState {
  /** Only the groups that owe something, in the To do's order. */
  groups: OwedGroup[];
  stillToAdd: MissingRow[];
  wording: number;
}

const sentence = (text: string) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

/** FNV-1a in base 36: short, and the same for the same text. */
function hash(text: string): string {
  let value = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 0x01000193);
  }
  return (value >>> 0).toString(36);
}

/** The group a row gathers under: its register label's page, or Organization details for site settings. */
export function todoGroup(entry: PendingEntry): string {
  if (entry.type === 'siteSettings') return ORGANIZATION.id;
  const page = REGISTER_PAGES[entry.where.split(',')[0] ?? ''];
  if (!page) throw new Error(`The To do has no page for the register's "${entry.where}".`);
  return page;
}

/** A row's title inside its page: "At a glance: the date". Organization rows keep where they show. */
export function todoRowTitle(entry: PendingEntry): string {
  const [, ...section] = entry.where.split(', ');
  if (entry.type === 'siteSettings' || section.length === 0) return sentence(pendingTitle(entry));
  return sentence(`${section.join(', ')}: ${entry.what}`);
}

export const todoRowId = (entry: PendingEntry) => `${entry.type}-${hash(pendingFilter(entry))}`;

/** The kind a filter names (`kind == "collective" && ...`): new documents start as that kind. */
const kindOf = (filter: string | undefined) => /\bkind == "([^"]+)"/.exec(filter ?? '')?.[1];

export function todoPlan(hidden: Iterable<string> = []): TodoPlan {
  const left = new Set(hidden);
  const nextEditions = NEXT_EDITION_KINDS.map(
    (kind): StillToAdd => ({
      id: `next-${kind}`,
      title: `${EVENT_PAGE_NAMES[kind]}: the next edition`,
      type: 'event',
      filter: `kind == "${kind}"`,
      template: `event-${kind}`,
      minimum: 1,
      nextEdition: kind,
    }),
  );
  const presence = PRESENCE.filter((entry) => !left.has(entry.type)).map((entry): StillToAdd => {
    const kind = entry.type === 'event' ? kindOf(entry.filter) : undefined;
    return {
      id: `add-${entry.type}-${hash(presenceFilter(entry))}`,
      title: pendingTitle(entry),
      type: entry.type,
      filter: entry.filter,
      template: kind ? `event-${kind}` : undefined,
      minimum: entry.minimum,
      presence: entry,
    };
  });
  return {
    rows: PENDING.filter((entry) => !left.has(entry.type)).map((entry) => ({
      id: todoRowId(entry),
      entry,
      group: todoGroup(entry),
      title: todoRowTitle(entry),
    })),
    stillToAdd: [...nextEditions, ...presence],
    hidden: [...left],
  };
}

/** The lint reports the wording to check lists, without an administrator's documents for members. */
export function wordingFilter(plan: TodoPlan): string {
  return `_type == "lintReport" && count(findings) > 0 && !(documentType in ${JSON.stringify(plan.hidden)})`;
}

/** The edition a document belongs to: an event is one, a ticket tier or sponsor level names one. */
const EDITION_OF = 'select(_type == "event" => _id, event._ref)';
const found = (filter: string) => `*[${filter}]{_id, "edition": ${EDITION_OF}}`;

/**
 * The To do's one query, run with the `drafts` perspective so a document counts once, as it stands
 * in the Studio: every row's documents, every presence entry's, the wording to check, and the
 * editions the site's rules read to pick the ones its pages show.
 */
export function todoQuery(plan: TodoPlan): string {
  const rows = plan.rows.map((row) => `"${row.id}": ${found(pendingFilter(row.entry))}`);
  const presence = plan.stillToAdd.flatMap(({ id, presence }) =>
    presence ? [`"${id}": ${found(presenceFilter(presence))}`] : [],
  );
  return `{
  "editions": *[_type == "event"]{_id, kind, edition, start, end, "photos": count(*[_type == "album" && event._ref == ^._id].photos[])},
  "rows": {${rows.join(', ')}},
  "presence": {${presence.join(', ')}},
  "wording": count(*[${wordingFilter(plan)}])
}`;
}

/** What the To do listens to: a change to a document of any of these types counts again. */
export function todoListenQuery(plan: TodoPlan): string {
  const types = new Set(['event', 'album', 'lintReport']);
  for (const { entry } of plan.rows) types.add(entry.type);
  for (const { type } of plan.stillToAdd) types.add(type);
  return `*[_type in ${JSON.stringify([...types].sort())}]`;
}

/** The To do as the site stands: what each page owes, what is still to add, and the wording to check. */
export function todoState(plan: TodoPlan, result: TodoResult, now = new Date()): TodoState {
  const editions = (result.editions ?? []).filter((edition): edition is EditionFacts =>
    Boolean(edition),
  );
  const hasPhotos = (edition: EditionFacts) => (edition.photos ?? 0) > 0;
  const ids = (picked: (EditionFacts | undefined)[]) =>
    new Set(picked.flatMap((edition) => (edition ? [edition._id] : [])));
  const shown: Record<Edition, Set<string>> = {
    next: ids([
      ...NEXT_EDITION_KINDS.map((kind) => pageEdition(editions, kind, { now })),
      ...collectiveEvents(editions, { now }),
    ]),
    past: ids(NEXT_EDITION_KINDS.map((kind) => pastEdition(editions, kind, { now, hasPhotos }))),
  };
  /** The documents the site shows: all of them, or those of the edition the entry asks about. */
  const onSite = (
    { edition, everyEdition }: { edition?: Edition; everyEdition?: boolean },
    documents: (Found | null)[] | null | undefined,
  ) =>
    (documents ?? []).filter((document): document is Found => {
      if (!document) return false;
      if (!edition) return true;
      return document.edition ? shown[edition].has(document.edition) : Boolean(everyEdition);
    });

  const owed = plan.rows.flatMap((row): OwedRow[] => {
    const owing = onSite(row.entry, result.rows?.[row.id]).map(({ _id }) => _id);
    return owing.length > 0 ? [{ row, ids: owing }] : [];
  });
  const groups = TODO_GROUPS.map(({ id, title }) => {
    const rows = owed.filter(({ row }) => row.group === id);
    return { id, title, rows, count: rows.reduce((sum, row) => sum + row.ids.length, 0) };
  }).filter((group) => group.count > 0);

  const stillToAdd = plan.stillToAdd.flatMap((add): MissingRow[] => {
    const count = add.nextEdition
      ? Number(Boolean(pageEdition(editions, add.nextEdition, { now })))
      : onSite(add.presence ?? {}, result.presence?.[add.id]).length;
    return count < add.minimum ? [{ add, count }] : [];
  });

  return { groups, stillToAdd, wording: result.wording ?? 0 };
}

/** Titles with their counts: "Odunde Festival (4)", a row only when more than one document owes it. */
export const groupTitle = ({ title, count }: OwedGroup) => `${title} (${count})`;
export const owedRowTitle = ({ row, ids }: OwedRow) =>
  ids.length > 1 ? `${row.title} (${ids.length})` : row.title;
export const missingRowTitle = ({ add, count }: MissingRow) =>
  add.minimum > 1 ? `${add.title} (${count} of ${add.minimum})` : add.title;
