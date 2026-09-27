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
  type DocumentListBuilder,
  type InitialValueTemplateItemBuilder,
  type ListBuilder,
  type ListItemBuilder,
} from 'sanity/structure';
import { describe, expect, it } from 'vitest';
import { EVENT_LIST_TITLES } from '../edition-fields';
import { PENDING } from '../pending';
import { schemaTypes } from '../schema';
import { documentActions, newDocumentOptions, studioTools } from './document-options';
import { ADMIN_ONLY_TYPES, HELD_BACK_PAGES, isAdministrator } from './roles';
import { structure } from './structure';
import { studioTemplates } from './templates';

// What an administrator and a member see (ADR 0042), built from the real structure without a
// browser: the Sanity structure builder runs on the compiled schema and templates.

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

const sidebars = new Map<CurrentUser, ListBuilder>();

/** The sidebar a user sees, built once per user. */
function sidebar(currentUser: CurrentUser): ListBuilder {
  const built = sidebars.get(currentUser);
  if (built) return built;
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
  const list = structure(S, { ...source, perspectiveStack: ['drafts'] } as never) as ListBuilder;
  sidebars.set(currentUser, list);
  return list;
}

type Item = ListItemBuilder;
const items = (list: ListBuilder): Item[] =>
  (list.getItems() ?? []).filter((item): item is Item => 'getId' in (item as object)) as Item[];
const ids = (list: ListBuilder) => items(list).map((item) => item.getId());
const child = (list: ListBuilder, id: string) =>
  items(list)
    .find((item) => item.getId() === id)
    ?.getChild() as unknown as ListBuilder;

describe('who is an administrator', () => {
  it('reads the administrator role, and nothing else', () => {
    expect(isAdministrator(ADMIN)).toBe(true);
    expect(isAdministrator(EDITOR)).toBe(false);
    expect(isAdministrator(user('developer'))).toBe(false);
    expect(isAdministrator(null)).toBe(false);
  });
});

describe('the sidebar per role', () => {
  it('gives administrators the Inbox, and members everything else', () => {
    expect(ids(sidebar(ADMIN))).toEqual([
      'pages',
      'events',
      'programs',
      'people',
      'impact',
      'news',
      'gallery',
      'inbox',
      'pending',
    ]);
    expect(ids(sidebar(EDITOR))).toEqual(ids(sidebar(ADMIN)).filter((id) => id !== 'inbox'));
  });

  it('keeps site settings and the News page from members', () => {
    const admin = ids(child(sidebar(ADMIN), 'pages'));
    const editor = ids(child(sidebar(EDITOR), 'pages'));
    expect(admin).toContain('siteSettings');
    expect(admin).toContain('newsPage');
    expect(editor).not.toContain('siteSettings');
    expect(editor).not.toContain('newsPage');
    expect(editor).toHaveLength(11);
  });

  it('lists events by the three kinds in use, each starting new events of its kind', () => {
    const events = child(sidebar(EDITOR), 'events');
    const kinds = items(events).filter((item) => item.getId()?.startsWith('events-'));
    expect(kinds.map((item) => item.getId())).toEqual([
      'events-festival',
      'events-gala',
      'events-collective',
    ]);
    for (const item of kinds) {
      const kind = item.getId()?.replace('events-', '') as keyof typeof EVENT_LIST_TITLES;
      expect(item.getTitle()).toBe(EVENT_LIST_TITLES[kind]);
      const list = item.getChild() as unknown as DocumentListBuilder;
      expect(list.getParams()).toEqual({ kind });
      const spec = list.getSpec() as { initialValueTemplates?: InitialValueTemplateItemBuilder[] };
      expect(spec.initialValueTemplates?.map((t) => t.getTemplateId())).toEqual([`event-${kind}`]);
    }
  });

  it('shows members only the to-do rows they can act on', () => {
    const settingsRows = PENDING.filter((row) => ADMIN_ONLY_TYPES.has(row.type)).length;
    const admin = items(child(sidebar(ADMIN), 'pending')).filter((item) =>
      /^pending-\d+$/.test(item.getId() ?? ''),
    );
    const editor = items(child(sidebar(EDITOR), 'pending')).filter((item) =>
      /^pending-\d+$/.test(item.getId() ?? ''),
    );
    expect(settingsRows).toBe(11);
    expect(admin).toHaveLength(PENDING.length);
    expect(editor).toHaveLength(PENDING.length - settingsRows);
  });

  it("keeps the wording to check on an administrator's documents from members", () => {
    const lint = (currentUser: CurrentUser) => {
      const item = items(child(sidebar(currentUser), 'pending')).find(
        (entry) => entry.getId() === 'pending-lint',
      );
      if (!item) throw new Error('the Pending view has no wording to check');
      const list = item.getChild() as unknown as DocumentListBuilder;
      return { filter: list.getFilter(), params: list.getParams() };
    };
    expect(lint(ADMIN).params).toEqual({ hidden: [] });
    expect(lint(EDITOR).params).toEqual({ hidden: [...ADMIN_ONLY_TYPES] });
    expect(lint(EDITOR).filter).toContain('!(documentType in $hidden)');
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
