import {
  concat,
  firstValueFrom,
  NEVER,
  type Observable,
  of,
  Subject,
  skip,
  throwError,
} from 'rxjs';
import {
  type CurrentUser,
  createSchema,
  type DocumentActionComponent,
  defaultTemplatesForSchema,
  prepareTemplates,
  type Tool,
} from 'sanity';
import {
  createStructureBuilder,
  type DocumentBuilder,
  type DocumentListBuilder,
  type InitialValueTemplateItemBuilder,
  type ListBuilder,
  type ListItemBuilder,
} from 'sanity/structure';
import { describe, expect, it, vi } from 'vitest';
import { EVENT_LIST_TITLES } from '../edition-fields';
import { documentTypes, schemaTypes } from '../schema';
import { documentActions, newDocumentOptions, studioTools } from './document-options';
import { ADMIN_ONLY_TYPES, HELD_BACK_PAGES, isAdministrator } from './roles';
import { SITE_PAGES } from './site-pages';
import { structure } from './structure';
import { studioTemplates } from './templates';
import { type TodoResult, todoListenQuery, todoPlan, todoQuery } from './todo';
import { KEEP_MS, RETRY_MS } from './todo-list';

// What an administrator and a member see (ADR 0042), built from the real structure without a
// browser: the Sanity structure builder runs on the compiled schema and templates, and the To do
// reads a document store that answers with a fixed result.

const user = (role: string): CurrentUser => ({
  id: role,
  name: role,
  email: `${role}@example.org`,
  role,
  roles: [{ name: role, title: role }],
});
const ADMIN = user('administrator');
const EDITOR = user('editor');

const schema = createSchema({ name: 'test', types: schemaTypes });
const templates = prepareTemplates(schema, studioTemplates(defaultTemplatesForSchema(schema)));

/** The sidebar a user sees, with a document store that answers the To do's query with `answer`. */
function sidebar(currentUser: CurrentUser, answer: () => Observable<TodoResult> = () => of({})) {
  const source = {
    projectId: 'test',
    dataset: 'test',
    schema,
    templates,
    currentUser,
    i18n: { t: (key: string) => key },
    getClient: () => {
      throw new Error('no client in tests');
    },
    document: { resolveNewDocumentOptions: () => [] },
  };
  const S = createStructureBuilder({ source, perspectiveStack: ['drafts'] } as never);
  // A store per sidebar: the To do shares one query per store and role.
  const documentStore = { listenQuery: answer };
  return structure(S, {
    ...source,
    perspectiveStack: ['drafts'],
    documentStore,
  } as never) as ListBuilder;
}
const SIDEBARS = new Map([ADMIN, EDITOR].map((role) => [role, sidebar(role)]));
const cached = (role: CurrentUser) => SIDEBARS.get(role) as ListBuilder;

type Item = ListItemBuilder;
const items = (list: ListBuilder): Item[] =>
  (list.getItems() ?? []).filter((item): item is Item => 'getId' in (item as object)) as Item[];
const ids = (list: ListBuilder) => items(list).map((item) => item.getId());
const child = (list: ListBuilder, id: string) =>
  items(list)
    .find((item) => item.getId() === id)
    ?.getChild() as unknown as ListBuilder;
const templateIds = (list: DocumentListBuilder) =>
  (
    list.getSpec() as { initialValueTemplates?: InitialValueTemplateItemBuilder[] }
  ).initialValueTemplates?.map((template) => template.getTemplateId());

/**
 * The document type each item of a list opens, and those of the lists below it. A type's own list
 * resolves lazily, so its item names the type; the To do's panes are dynamic and name none.
 */
function placements(list: ListBuilder): string[] {
  const found: string[] = [];
  for (const item of items(list)) {
    const next = item.getChild() as unknown;
    if (next && typeof next === 'object' && 'getItems' in next) {
      found.push(...placements(next as ListBuilder));
      continue;
    }
    const opened =
      next && typeof next === 'object'
        ? (next as DocumentListBuilder | DocumentBuilder).getSchemaType?.()
        : undefined;
    const type = opened ?? item.getSchemaType();
    const name = typeof type === 'string' ? type : type?.name;
    if (name) found.push(name);
  }
  return found;
}

describe('who is an administrator', () => {
  it('reads the administrator role, and nothing else', () => {
    expect(isAdministrator(ADMIN)).toBe(true);
    expect(isAdministrator(EDITOR)).toBe(false);
    expect(isAdministrator(user('developer'))).toBe(false);
    expect(isAdministrator(null)).toBe(false);
  });
});

describe('the sidebar follows the site', () => {
  it('opens with the To do, then the site, then what administrators keep', () => {
    expect(ids(cached(EDITOR))).toEqual([
      'todo',
      'newsPost',
      'events',
      'photos',
      'people',
      'pages',
      'shared',
    ]);
    expect(ids(cached(ADMIN))).toEqual([...ids(cached(EDITOR)), 'siteSettings', 'inbox']);
  });

  it('places every document type once, the To do holding the wording to check', () => {
    const everything = documentTypes.map(({ name }) => name).sort();
    const placed = (role: CurrentUser) => placements(cached(role));
    // Events list by kind and the Inbox enquiries by kind; every other type opens one list.
    const byKind = new Set(['event', 'enquiry']);
    for (const role of [ADMIN, EDITOR]) {
      const once = placed(role).filter((type) => !byKind.has(type));
      expect(new Set(once).size, role.role).toBe(once.length);
      expect(
        placed(role).filter((type) => type === 'event'),
        role.role,
      ).toHaveLength(3);
    }
    expect(placed(ADMIN).filter((type) => type === 'enquiry')).toHaveLength(9);
    expect(placed(EDITOR)).not.toContain('enquiry');
    expect([...new Set(placed(ADMIN)), 'lintReport'].sort()).toEqual(everything);
    expect([...new Set(placed(EDITOR)), 'lintReport', ...ADMIN_ONLY_TYPES].sort()).toEqual(
      everything,
    );
  });

  it('lists each event with its editions, and each kind starts new events as itself', () => {
    const events = child(cached(EDITOR), 'events');
    expect(ids(events)).toEqual(['odunde', 'gala', 'events-collective']);
    expect(ids(child(events, 'odunde'))).toEqual(['events-festival', 'zone']);
    expect(ids(child(events, 'gala'))).toEqual([
      'events-gala',
      'ticketTier',
      'sponsorLevel',
      'honoree',
    ]);
    const lists = [
      child(child(events, 'odunde'), 'events-festival'),
      child(child(events, 'gala'), 'events-gala'),
      child(events, 'events-collective'),
    ] as unknown as DocumentListBuilder[];
    for (const [index, kind] of (['festival', 'gala', 'collective'] as const).entries()) {
      const list = lists[index] as DocumentListBuilder;
      expect(list.getTitle()).toBe(EVENT_LIST_TITLES[kind]);
      expect(list.getParams()).toEqual({ kind });
      expect(templateIds(list)).toEqual([`event-${kind}`]);
    }
  });

  it('lists the pages as the site does, Impact with its governance filings beside it', () => {
    const pages = child(cached(EDITOR), 'pages');
    expect(ids(pages)).toEqual(SITE_PAGES.map(({ type }) => type));
    expect(items(pages).map((item) => item.getTitle())).toEqual(
      SITE_PAGES.map(({ title }) => title),
    );
    expect(ids(child(pages, 'impactPage'))).toEqual(['impactPage', 'governanceDoc']);
    // A page's own lists (initiatives, the timeline, the giving levels) are in its form.
    for (const page of ['storyPage', 'donatePage', 'collectivePage']) {
      expect((child(pages, page) as unknown as DocumentBuilder).getDocumentId()).toBe(page);
    }
    const homepage = child(pages, 'homepage') as unknown as DocumentBuilder;
    expect(homepage.getDocumentId()).toBe('homepage');
    expect(ids(child(cached(ADMIN), 'pages'))).toEqual([
      ...SITE_PAGES.map(({ type }) => type),
      'newsPage',
    ]);
  });

  it('groups photos, people and the documents several pages read', () => {
    expect(ids(child(cached(EDITOR), 'photos'))).toEqual(['album', 'photographer']);
    expect(ids(child(cached(EDITOR), 'people'))).toEqual([
      'person',
      'testimonial',
      'hometownAssociation',
    ]);
    expect(ids(child(cached(EDITOR), 'shared'))).toEqual(['program', 'stat', 'door', 'partner']);
  });
});

describe('the To do in the sidebar', () => {
  const plan = todoPlan(ADMIN_ONLY_TYPES);
  const row = (where: string, what: string) => {
    const found = plan.rows.find(({ entry }) => entry.where === where && entry.what === what);
    if (!found) throw new Error(`no row ${where}: ${what}`);
    return found;
  };
  const whatItIs = row('Odunde, what the day is', 'what Odunde is, in your words');
  const bio = row('Our Story, board', 'a short bio');
  const cost = row('Odunde, at a glance', 'the cost');
  const zones = plan.stillToAdd.find(({ presence }) => presence?.type === 'zone');
  const collective = plan.stillToAdd.find(({ presence }) => presence?.type === 'event');
  // Far from any calendar edge: 2099's editions are the next ones whatever today is.
  const festival = { _id: 'event-odunde-2099', kind: 'festival', start: '2099-06-13T17:00:00Z' };
  const gala = { _id: 'event-gala-2099', kind: 'gala', start: '2099-11-20T02:00:00Z' };
  /** Every presence entry with its minimum of documents, of the next Gala where it asks, but for the counts given. */
  const present = (counts: Record<string, number> = {}) =>
    Object.fromEntries(
      plan.stillToAdd.flatMap(({ id, presence, minimum }) =>
        presence
          ? [
              [
                id,
                Array.from({ length: counts[id] ?? minimum }, (_, n) => ({
                  _id: `${id}-${n}`,
                  edition: presence.edition ? gala._id : undefined,
                })),
              ],
            ]
          : [],
      ),
    );
  const answer: TodoResult = {
    editions: [festival, gala],
    rows: {
      [whatItIs.id]: [{ _id: 'festivalPage' }],
      [bio.id]: [{ _id: 'person-a' }, { _id: 'person-b' }],
      [cost.id]: [{ _id: festival._id, edition: festival._id }],
    },
    presence: present({ [zones?.id ?? '']: 2, [collective?.id ?? '']: 0 }),
    wording: 1,
  };

  /** Resolves a pane the way the structure tool does: a function is called, an observable read once. */
  async function open(parent: ListBuilder, id: string): Promise<unknown> {
    const spec = (parent.serialize({ path: [] }) as { child: unknown }).child;
    const resolved =
      typeof spec === 'function'
        ? (spec as (id: string, options: unknown) => unknown)(id, {})
        : spec;
    return resolved && typeof resolved === 'object' && 'subscribe' in resolved
      ? firstValueFrom(resolved as Observable<unknown>)
      : resolved;
  }
  const rootOf = (role: CurrentUser, result: () => Observable<TodoResult>) => {
    const item = items(sidebar(role, result)).find((entry) => entry.getId() === 'todo');
    if (!item) throw new Error('the sidebar has no To do');
    return (item.getChild() as unknown as () => Observable<ListBuilder>)();
  };
  /** The To do once counted: the view opens on its counting line, then the count. */
  const todo = (role: CurrentUser, result: () => Observable<TodoResult> = () => of(answer)) =>
    firstValueFrom(rootOf(role, result).pipe(skip(1)));
  const shown = (list: ListBuilder) => JSON.stringify(list.serialize({ path: [] }).items);

  it('opens on a counting line, so opening a document from search never waits for the count', async () => {
    const first = await firstValueFrom(rootOf(EDITOR, () => NEVER));
    expect(items(first)).toEqual([]);
    expect(shown(first)).toContain('Counting what is owed...');
  });

  it('lists the pages that owe something with their counts, then what is still to add', async () => {
    const list = await todo(EDITOR);
    expect(items(list).map((item) => item.getTitle())).toEqual([
      'Odunde Festival (2)',
      'Our Story (2)',
      'Still to add (2)',
      'Wording to check (1)',
    ]);
  });

  it('opens a page on its rows, and a row on the page or the documents that owe it', async () => {
    const list = await todo(EDITOR);
    const odunde = (await open(list, 'festivalPage')) as ListBuilder;
    expect(items(odunde).map((item) => item.getTitle())).toEqual([
      'At a glance: the cost',
      'What the day is: what Odunde is, in your words',
    ]);
    const page = (await open(odunde, whatItIs.id)) as DocumentBuilder;
    expect(page.getDocumentId()).toBe('festivalPage');
    // Its own pane id: opening the page from search matches the page under Pages, not this row.
    expect(page.getId()).toBe(whatItIs.id);
    const edition = (await open(odunde, cost.id)) as DocumentListBuilder;
    expect(edition.getParams()).toEqual({
      ids: ['event-odunde-2099', 'drafts.event-odunde-2099'],
    });
    expect(templateIds(edition)).toEqual([]);
    const story = (await open(list, 'storyPage')) as ListBuilder;
    expect(items(story).map((item) => item.getTitle())).toEqual(['Board: a short bio (2)']);
    const people = (await open(story, bio.id)) as DocumentListBuilder;
    expect(people.getFilter()).toContain('group == "board"');
  });

  it('opens what is still to add on its list, new events starting as their kind', async () => {
    const list = await todo(EDITOR, () => of({ ...answer, editions: [festival] }));
    const still = (await open(list, 'still-to-add')) as ListBuilder;
    expect(items(still).map((item) => item.getTitle())).toEqual([
      'End-of-Year Gala: the next edition',
      'Odunde, zones: the unnamed zones (2 of 4)',
      'Gala, seats and tables: three prices and what each includes',
      'Sponsorship: level names and amounts',
      'Collective, events: the next Collective events',
    ]);
    const next = (await open(still, 'next-gala')) as DocumentListBuilder;
    expect(templateIds(next)).toEqual(['event-gala']);
    const events = (await open(still, collective?.id ?? '')) as DocumentListBuilder;
    expect(templateIds(events)).toEqual(['event-collective']);
  });

  it("keeps an administrator's documents out of a member's wording to check", async () => {
    const wording = async (role: CurrentUser) =>
      ((await open(await todo(role), 'wording')) as DocumentListBuilder).getFilter();
    expect(await wording(EDITOR)).toContain(JSON.stringify([...ADMIN_ONLY_TYPES]));
    expect(await wording(ADMIN)).toContain('!(documentType in [])');
  });

  it('gives administrators the settings rows under Organization details', async () => {
    const admin = todoPlan();
    const ein = admin.rows.find(({ entry }) => entry.what === 'EIN');
    const list = await todo(ADMIN, () =>
      of({ ...answer, rows: { [ein?.id ?? '']: [{ _id: 'siteSettings' }] } }),
    );
    expect(items(list).map((item) => item.getTitle())).toContain('Organization details (1)');
    const settings = (await open(list, 'organization')) as ListBuilder;
    const opened = (await open(settings, ein?.id ?? '')) as DocumentBuilder;
    expect(opened.getDocumentId()).toBe('siteSettings');
  });

  it('asks the document store once for the whole view, with drafts, and counts again on change', async () => {
    const calls: { query: { fetch: string; listen: string }; options: object }[] = [];
    const results = new Subject<TodoResult>();
    const store = (query: { fetch: string; listen: string }, _: object, options: object) => {
      calls.push({ query, options });
      return results;
    };
    const roots: ListBuilder[] = [];
    const rootWatch = rootOf(EDITOR, store as never).subscribe((list) => roots.push(list));
    results.next(answer);
    const list = roots.at(-1);
    if (!list) throw new Error('no To do yet');
    const spec = (list.serialize({ path: [] }) as { child: (id: string, o: unknown) => unknown })
      .child;
    const pages: ListBuilder[] = [];
    const pageWatch = (spec('storyPage', {}) as Observable<ListBuilder>).subscribe((page) =>
      pages.push(page),
    );
    expect(calls).toHaveLength(1);
    expect(calls[0]?.query).toEqual({ fetch: todoQuery(plan), listen: todoListenQuery(plan) });
    expect(calls[0]?.options).toMatchObject({ perspective: 'drafts' });
    expect(items(pages.at(-1) as ListBuilder).map((entry) => entry.getTitle())).toEqual([
      'Board: a short bio (2)',
    ]);
    // A member fills both bios: the row leaves Our Story, and its documents still open.
    results.next({ ...answer, rows: { ...answer.rows, [bio.id]: [] } });
    expect(items(pages.at(-1) as ListBuilder)).toEqual([]);
    expect(items(roots.at(-1) as ListBuilder).map((entry) => entry.getTitle())).toEqual([
      'Odunde Festival (2)',
      'Still to add (2)',
      'Wording to check (1)',
    ]);
    const stillOpen = await open(pages.at(-1) as ListBuilder, bio.id);
    expect((stillOpen as DocumentListBuilder).getFilter()).toContain('group == "board"');
    rootWatch.unsubscribe();
    pageWatch.unsubscribe();
  });

  it('says when the count fails, tries again, and keeps the query open while the Studio moves', async () => {
    vi.useFakeTimers();
    try {
      let calls = 0;
      const store = () => {
        calls += 1;
        return calls === 1 ? throwError(() => new Error('offline')) : concat(of(answer), NEVER);
      };
      const roots: ListBuilder[] = [];
      const root = rootOf(EDITOR, store);
      let watch = root.subscribe((list) => roots.push(list));
      expect(shown(roots.at(-1) as ListBuilder)).toContain(
        'Could not count (offline); trying again shortly.',
      );
      await vi.advanceTimersByTimeAsync(RETRY_MS);
      expect(calls).toBe(2);
      expect(items(roots.at(-1) as ListBuilder).map((item) => item.getTitle())).toContain(
        'Our Story (2)',
      );
      // The Studio closes and reopens panes as it moves: the query stays open for a while.
      watch.unsubscribe();
      watch = root.subscribe((list) => roots.push(list));
      expect(calls).toBe(2);
      watch.unsubscribe();
      await vi.advanceTimersByTimeAsync(KEEP_MS);
      watch = root.subscribe((list) => roots.push(list));
      expect(calls).toBe(3);
      watch.unsubscribe();
    } finally {
      vi.useRealTimers();
    }
  });

  it('says so when nothing is owed', async () => {
    const done = await todo(EDITOR, () => of({ editions: [festival, gala], presence: present() }));
    expect(items(done)).toEqual([]);
    expect(shown(done)).toContain('Nothing owed: every page has what it needs.');
  });
});

describe('tools, actions and templates per role', () => {
  const tools = [{ name: 'structure' }, { name: 'presentation' }, { name: 'vision' }] as Tool[];

  it('gives the Vision tool to administrators only', () => {
    const names = (currentUser: CurrentUser) =>
      studioTools(tools, { currentUser } as never).map((tool) => tool.name);
    expect(names(ADMIN)).toEqual(['structure', 'presentation', 'vision']);
    expect(names(EDITOR)).toEqual(['structure', 'presentation']);
  });

  const action = (name: string) => ({ action: name }) as unknown as DocumentActionComponent;
  const defaults = ['publish', 'discardChanges', 'unpublish', 'duplicate', 'delete', 'restore'].map(
    action,
  );
  const allowed = (schemaType: string, currentUser: CurrentUser) =>
    (documentActions(defaults, { schemaType, currentUser } as never) as { action?: string }[]).map(
      (a) => a.action,
    );

  it("lets only administrators act on an administrator's documents", () => {
    expect([...ADMIN_ONLY_TYPES]).toEqual(['siteSettings', 'newsPage', 'enquiry', 'subscriber']);
    for (const type of ADMIN_ONLY_TYPES) expect(allowed(type, EDITOR), type).toEqual([]);
    expect(allowed('enquiry', ADMIN)).toContain('publish');
  });

  it('lets no member restore an old version of a page with a held-back switch', () => {
    expect([...HELD_BACK_PAGES].sort()).toEqual(['galaPage', 'galleryPage', 'storyPage']);
    for (const type of HELD_BACK_PAGES) {
      expect(allowed(type, EDITOR), type).not.toContain('restore');
      expect(allowed(type, ADMIN), type).toContain('restore');
    }
    expect(allowed('homepage', EDITOR)).toContain('restore');
  });

  it('leaves lint reports to the function: members nothing, administrators delete', () => {
    expect(allowed('lintReport', EDITOR)).toEqual([]);
    expect(allowed('lintReport', ADMIN)).toEqual(['delete']);
  });

  it('never deletes or duplicates a page', () => {
    expect(allowed('homepage', EDITOR)).toEqual([
      'publish',
      'discardChanges',
      'unpublish',
      'restore',
    ]);
  });

  it('starts events by kind, never without one', () => {
    const ids = templates.map((template) => template.id);
    expect(ids).not.toContain('event');
    expect(ids).toEqual(
      expect.arrayContaining(['event-festival', 'event-gala', 'event-collective']),
    );
    const collective = templates.find((template) => template.id === 'event-collective');
    expect(collective?.value).toEqual({ kind: 'collective' });
  });

  it('keeps singletons and the written documents out of the Create menu', () => {
    const offered = newDocumentOptions(
      templates.map((template) => ({ templateId: template.id })) as never,
      {} as never,
    ).map((item) => item.templateId);
    for (const id of ['siteSettings', 'homepage', 'enquiry', 'subscriber', 'lintReport']) {
      expect(offered).not.toContain(id);
    }
    expect(offered).toContain('event-collective');
  });
});

describe('what members see but cannot change', () => {
  type Def = {
    name: string;
    description?: string;
    readOnly?: unknown;
    fields?: Def[];
    __experimental_omnisearch_visibility?: boolean;
  };
  const byName = (name: string) => (schemaTypes as unknown as Def[]).find((t) => t.name === name);
  const lockedFor = (property: unknown, currentUser: CurrentUser) =>
    typeof property === 'function'
      ? (property as (context: object) => boolean)({ currentUser, document: undefined })
      : property;

  it("locks an administrator's documents for members, and no other document", () => {
    const locked = (schemaTypes as unknown as (Def & { type?: string })[])
      .filter((type) => type.type === 'document' && lockedFor(type.readOnly, EDITOR) === true)
      .map((type) => type.name);
    expect(locked.sort()).toEqual([...ADMIN_ONLY_TYPES].sort());
    for (const type of ADMIN_ONLY_TYPES)
      expect(lockedFor(byName(type)?.readOnly, ADMIN), type).toBe(false);
  });

  it('keeps enquiries and subscribers out of search', () => {
    expect(byName('enquiry')?.__experimental_omnisearch_visibility).toBe(false);
    expect(byName('subscriber')?.__experimental_omnisearch_visibility).toBe(false);
  });

  it('locks the three held-back switches, and only those, and says so', () => {
    const locked: string[] = [];
    for (const type of schemaTypes as unknown as Def[]) {
      const layout = type.fields?.find((field) => field.name === 'layout');
      for (const option of layout?.fields ?? []) {
        if (lockedFor(option.readOnly, EDITOR) === true) {
          expect(lockedFor(option.readOnly, ADMIN), option.name).toBe(false);
          expect(option.description, option.name).toMatch(/ Only an administrator changes it\.$/);
          locked.push(`${type.name}.${option.name}`);
        }
      }
    }
    expect(locked.sort()).toEqual(['galaPage.awards', 'galleryPage.state', 'storyPage.timeline']);
  });
});
