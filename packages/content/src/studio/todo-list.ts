/**
 * The To do view in the sidebar (ADR 0042): the lists of `todo.ts`, kept live. The whole view shares
 * one query, which counts again whenever a document of a counted type changes, so a row leaves its
 * page once its documents are fixed. Each list resolves its children from the registry by id, not
 * from the latest counts, so a pane stays open when the row that opened it is done.
 *
 * Opening a document from search walks the whole sidebar and waits for each pane's first answer, so
 * the view opens on a counting line: the walk finds nothing inside it and never waits for the count.
 */
import {
  catchError,
  concat,
  defer,
  distinctUntilChanged,
  map,
  type Observable,
  of,
  ReplaySubject,
  share,
  startWith,
  switchMap,
  timer,
} from 'rxjs';
import type {
  ListBuilder,
  ListItemBuilder,
  StructureBuilder,
  StructureResolverContext,
} from 'sanity/structure';
import { STUDIO_API_VERSION } from '../api-version';
import { pendingFilter, rowDocumentType } from '../pending';
import { SINGLETON_NAMES } from '../schema/singletons';
import { ADMIN_ONLY_TYPES } from './roles';
import {
  groupTitle,
  missingRowTitle,
  owedRowTitle,
  TODO_GROUPS,
  type TodoPlan,
  type TodoResult,
  type TodoState,
  todoListenQuery,
  todoPlan,
  todoQuery,
  todoState,
  wordingFilter,
} from './todo';

/** The view's state: the count, a failed count, or the first moment before any answer. */
type Live = { state: TodoState } | { error: string } | { counting: true };

interface View {
  S: StructureBuilder;
  plan: TodoPlan;
  live: () => Observable<Live>;
}

const STILL_TO_ADD = 'still-to-add';
const WORDING = 'wording';
const SINGLETONS: ReadonlySet<string> = new Set(SINGLETON_NAMES);
/** After a failed count, the next try. */
export const RETRY_MS = 15_000;
/** How long the query stays open once no pane reads it: the Studio closes and reopens panes as it moves. */
export const KEEP_MS = 30_000;

/** One live query per Studio and role, shared by every open pane of the view. */
const queries = new WeakMap<object, Map<string, Observable<Live>>>();

function liveTodo(context: StructureResolverContext, plan: TodoPlan, role: string) {
  const store = context.documentStore;
  const byRole = queries.get(store) ?? new Map<string, Observable<Live>>();
  queries.set(store, byRole);
  const known = byRole.get(role);
  if (known) return known;
  // Deferred, so each fresh connection and each retry asks the store again.
  const counted: Observable<Live> = defer(() =>
    store.listenQuery(
      { fetch: todoQuery(plan), listen: todoListenQuery(plan) },
      {},
      { apiVersion: STUDIO_API_VERSION, perspective: 'drafts', tag: 'todo' },
    ),
  ).pipe(
    map((result: TodoResult | null): Live => ({ state: todoState(plan, result ?? {}) })),
    // A failed count says so, then tries again: the stream never ends, so no pane keeps a failure.
    catchError((cause: unknown, again) =>
      concat(
        of<Live>({ error: cause instanceof Error ? cause.message : String(cause) }),
        timer(RETRY_MS).pipe(switchMap(() => again)),
      ),
    ),
    share({
      connector: () => new ReplaySubject<Live>(1),
      resetOnRefCountZero: () => timer(KEEP_MS),
    }),
  );
  byRole.set(role, counted);
  return counted;
}

/** The To do: the site's pages that owe something, what is still to add, and the wording to check. */
export function todoItem(
  S: StructureBuilder,
  context: StructureResolverContext,
  administrator: boolean,
): ListItemBuilder {
  const plan = todoPlan(administrator ? [] : ADMIN_ONLY_TYPES);
  const view: View = {
    S,
    plan,
    live: () => liveTodo(context, plan, administrator ? 'administrator' : 'member'),
  };
  return S.listItem()
    .id('todo')
    .title('To do')
    .child(() =>
      view.live().pipe(
        map((live) => todoList(view, live)),
        startWith(todoList(view, { counting: true })),
      ),
    );
}

/** What a pane says while it waits for the count, when the count failed, or when nothing is left. */
function notice(S: StructureBuilder, live: Live, empty: string) {
  if ('state' in live) return S.divider().title(empty);
  if ('error' in live) {
    return S.divider().title(`Could not count (${live.error}); trying again shortly.`);
  }
  return S.divider().title('Counting what is owed...');
}

function todoList(view: View, live: Live): ListBuilder {
  const { S } = view;
  const list = S.list()
    .id('todo')
    .title('To do')
    .child((id) => todoChild(view, id));
  if (!('state' in live)) return list.items([notice(S, live, '')]);
  const { groups, stillToAdd, wording } = live.state;
  const pages = groups.map((group) => S.listItem().id(group.id).title(groupTitle(group)));
  const more = [
    ...(stillToAdd.length > 0
      ? [S.listItem().id(STILL_TO_ADD).title(`Still to add (${stillToAdd.length})`)]
      : []),
    ...(wording > 0 ? [S.listItem().id(WORDING).title(`Wording to check (${wording})`)] : []),
  ];
  const items = [...pages, ...(pages.length > 0 && more.length > 0 ? [S.divider()] : []), ...more];
  return list.items(
    items.length > 0 ? items : [notice(S, live, 'Nothing owed: every page has what it needs.')],
  );
}

function todoChild(view: View, id: string) {
  const { S, plan, live } = view;
  if (id === WORDING) {
    return (
      S.documentList()
        .id(WORDING)
        .title('Wording to check')
        .schemaType('lintReport')
        .apiVersion(STUDIO_API_VERSION)
        .filter(wordingFilter(plan))
        .defaultOrdering([{ field: 'checkedAt', direction: 'desc' }])
        // The content-lint function writes these; nobody creates one here.
        .initialValueTemplates([])
    );
  }
  if (id === STILL_TO_ADD) return live().pipe(map((state) => stillToAddList(view, state)));
  const group = TODO_GROUPS.find((candidate) => candidate.id === id);
  if (!group) return undefined;
  return live().pipe(map((state) => groupList(view, group, state)));
}

function groupList(view: View, group: { id: string; title: string }, live: Live): ListBuilder {
  const { S } = view;
  const rows =
    'state' in live ? (live.state.groups.find(({ id }) => id === group.id)?.rows ?? []) : [];
  return S.list()
    .id(group.id)
    .title(group.title)
    .items(
      rows.length > 0
        ? rows.map((row) => S.listItem().id(row.row.id).title(owedRowTitle(row)))
        : [notice(S, live, 'Nothing owed here.')],
    )
    .child((rowId) => rowChild(view, rowId));
}

/**
 * A row opens what owes it: a page's own document, or the list of documents its filter finds. A row
 * bound to an edition lists only the documents of the edition the page shows, so its list follows
 * the count, and while the count fails it lists every document the filter finds.
 */
function rowChild(view: View, rowId: string) {
  const { S, plan, live } = view;
  const row = plan.rows.find(({ id }) => id === rowId);
  if (!row) return undefined;
  const { edition } = row.entry;
  const type = rowDocumentType(row.entry);
  // The pane keeps the row's id, so opening the page from search never lands in the To do.
  if (SINGLETONS.has(type)) return S.document().id(row.id).schemaType(type).documentId(type);
  const list = (ids?: readonly string[]) => {
    const documents = S.documentList()
      .id(row.id)
      .title(row.title)
      .schemaType(type)
      .apiVersion(STUDIO_API_VERSION);
    // A document stands as its draft where there is one: both ids, whichever the list reads.
    const narrowed = ids
      ? documents
          .filter(`${pendingFilter(row.entry)} && _id in $ids`)
          .params({ ids: ids.flatMap((id) => [id, `drafts.${id}`]) })
      : documents.filter(pendingFilter(row.entry));
    // Nothing is created from a to-do row. Last: the builder infers templates again on any later call.
    return narrowed.initialValueTemplates([]);
  };
  if (!edition) return list();
  return live().pipe(
    map((state) =>
      'state' in state
        ? (state.state.groups.flatMap((group) => group.rows).find((owed) => owed.row.id === rowId)
            ?.ids ?? [])
        : undefined,
    ),
    // A new list only when its documents change: the list reads them again each time.
    distinctUntilChanged((before, after) => before?.join() === after?.join()),
    map(list),
  );
}

function stillToAddList(view: View, live: Live): ListBuilder {
  const { S, plan } = view;
  const missing = 'state' in live ? live.state.stillToAdd : [];
  return S.list()
    .id(STILL_TO_ADD)
    .title('Still to add')
    .items(
      missing.length > 0
        ? missing.map((row) => S.listItem().id(row.add.id).title(missingRowTitle(row)))
        : [notice(S, live, 'Nothing to add.')],
    )
    .child((id) => {
      const add = plan.stillToAdd.find((candidate) => candidate.id === id);
      if (!add) return undefined;
      const list = S.documentList()
        .id(add.id)
        .title(add.title)
        .schemaType(add.type)
        .apiVersion(STUDIO_API_VERSION)
        .filter(`_type == "${add.type}"${add.filter ? ` && ${add.filter}` : ''}`);
      // Last, as above: new documents start from the kind's template where the type has several.
      return add.template
        ? list.initialValueTemplates([S.initialValueTemplateItem(add.template)])
        : list;
    });
}
