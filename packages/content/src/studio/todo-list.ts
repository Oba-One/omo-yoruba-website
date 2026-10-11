/**
 * Missing content shares one live query per Studio and role. Its component resolves immediately,
 * so opening a document from search never waits for the count. Children resolve from stable ids,
 * so an editor stays open after its last missing detail is filled.
 */
import {
  catchError,
  concat,
  defer,
  map,
  type Observable,
  of,
  ReplaySubject,
  share,
  switchMap,
  timer,
} from 'rxjs';
import type { ListItemBuilder, StructureBuilder, StructureResolverContext } from 'sanity/structure';
import { STUDIO_API_VERSION } from '../api-version';
import { rowDocumentType } from '../pending';
import { MissingContentPane } from './missing-content-pane';
import { ADMIN_ONLY_TYPES } from './roles';
import {
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
export type Live =
  | { state: TodoState; result: TodoResult }
  | { error: string }
  | { counting: true };

/** After a failed count, the next try. */
export const RETRY_MS = 15_000;
/** How long the query stays open once no pane reads it: the Studio closes and reopens panes as it moves. */
export const KEEP_MS = 30_000;

/** One live query per Studio and role, shared by every open pane of the view. */
const queries = new WeakMap<object, Map<string, Observable<Live>>>();

export function liveTodo(context: StructureResolverContext, plan: TodoPlan, role: string) {
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
    map(
      (result: TodoResult | null): Live => ({
        state: todoState(plan, result ?? {}),
        result: result ?? {},
      }),
    ),
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

/** A single checklist pane resolves immediately, so document intents never wait on its query. */
export function todoItem(
  S: StructureBuilder,
  context: StructureResolverContext,
  administrator: boolean,
): ListItemBuilder {
  const plan = todoPlan(administrator ? [] : ADMIN_ONLY_TYPES);
  return S.listItem()
    .id('todo')
    .title('Missing content')
    .child(
      S.component()
        .id('todo')
        .title('Missing content')
        .component(MissingContentPane)
        .options({
          source: liveTodo(context, plan, administrator ? 'administrator' : 'member'),
          administrator,
        })
        .child((id) => {
          if (id.startsWith('document:')) {
            const [, type, ...parts] = id.split(':');
            const documentId = parts.join(':');
            if (
              !type ||
              !documentId ||
              !plan.rows.some(({ entry }) => rowDocumentType(entry) === type)
            )
              return undefined;
            return S.document()
              .id(`missing-${type}-${documentId}`)
              .schemaType(type)
              .documentId(documentId);
          }
          if (id === 'wording')
            return S.documentList()
              .id(id)
              .title('Wording to check')
              .schemaType('lintReport')
              .apiVersion(STUDIO_API_VERSION)
              .filter(wordingFilter(plan))
              .defaultOrdering([{ field: 'checkedAt', direction: 'desc' }])
              .initialValueTemplates([]);
          const add = plan.stillToAdd.find((candidate) => candidate.id === id);
          if (!add) return undefined;
          const list = S.documentList()
            .id(id)
            .title(add.title)
            .schemaType(add.type)
            .apiVersion(STUDIO_API_VERSION)
            .filter(`_type == "${add.type}"${add.filter ? ` && ${add.filter}` : ''}`);
          return add.template
            ? list.initialValueTemplates([S.initialValueTemplateItem(add.template)])
            : list;
        }),
    );
}
