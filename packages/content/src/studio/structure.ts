import type {
  DefaultDocumentNodeResolver,
  ListItemBuilder,
  StructureBuilder,
  StructureResolver,
} from 'sanity/structure';
import { STUDIO_API_VERSION } from '../api-version';
import { EVENT_LIST_TITLES } from '../edition-fields';
import { ENQUIRY_KINDS, KIND_TITLES } from '../enquiry-kinds';
import { EVENT_PAGE_NAMES } from '../routes';
import { STUDIO_HIDDEN_TYPES } from './document-options';
import { isAdministrator } from './roles';
import { SITE_PAGES, type SitePage } from './site-pages';
import { todoItem } from './todo-list';

/*
 * The sidebar follows the site (ADR 0042; the tree in docs/tickets/studio-simplification/spec.md):
 * To do, News posts, Events, Photos, People, Pages, Used on several pages. Administrators also get
 * Site settings, the News page and the Inbox (`studio/roles.ts`).
 */

const FESTIVAL_LISTS = ['zone'];
const GALA_LISTS = ['ticketTier', 'sponsorLevel', 'honoree'];
const PHOTOS = ['album', 'photographer'];
const PEOPLE = ['person', 'testimonial', 'hometownAssociation'];
/** Documents more than one page reads. */
const SHARED = ['program', 'stat', 'door', 'partner'];

/** The documents a page lists, kept beside the page until they become its own lists (part 5, S14). */
const PAGE_LISTS: Partial<Record<SitePage, readonly string[]>> = {
  collectivePage: ['initiative'],
  impactPage: ['outcome', 'governanceDoc'],
  storyPage: ['timelineEntry'],
  donatePage: ['givingLevel'],
};

/** Every type the tree places; a type added later and placed nowhere still shows at the end. */
const PLACED: ReadonlySet<string> = new Set([
  'newsPost',
  'event',
  ...FESTIVAL_LISTS,
  ...GALA_LISTS,
  ...PHOTOS,
  ...PEOPLE,
  ...Object.values(PAGE_LISTS).flat(),
  ...SHARED,
]);

function typesItem(S: StructureBuilder, id: string, title: string, types: readonly string[]) {
  return S.listItem()
    .id(id)
    .title(title)
    .child(
      S.list()
        .id(id)
        .title(title)
        .items(types.map((type) => S.documentTypeListItem(type))),
    );
}

/** One kind's events, each new one starting as that kind. */
function editionsItem(
  S: StructureBuilder,
  kind: keyof typeof EVENT_LIST_TITLES,
  title: string = EVENT_LIST_TITLES[kind],
) {
  return S.listItem()
    .id(`events-${kind}`)
    .title(title)
    .child(
      S.documentList()
        .id(`events-${kind}`)
        .title(EVENT_LIST_TITLES[kind])
        .schemaType('event')
        .apiVersion(STUDIO_API_VERSION)
        .filter('_type == "event" && kind == $kind')
        .params({ kind })
        .defaultOrdering([
          { field: kind === 'collective' ? 'start' : 'edition', direction: 'desc' },
        ])
        // Last: the builder infers templates again on any later call, dropping these.
        .initialValueTemplates([S.initialValueTemplateItem(`event-${kind}`)]),
    );
}

/** An event with its editions and the documents that belong to them. */
function eventItem(
  S: StructureBuilder,
  id: string,
  kind: 'festival' | 'gala',
  types: readonly string[],
) {
  const title = EVENT_PAGE_NAMES[kind];
  return S.listItem()
    .id(id)
    .title(title)
    .child(
      S.list()
        .id(id)
        .title(title)
        .items([
          editionsItem(S, kind, 'Editions'),
          ...types.map((type) => S.documentTypeListItem(type)),
        ]),
    );
}

function eventsItem(S: StructureBuilder) {
  return S.listItem()
    .id('events')
    .title('Events')
    .child(
      S.list()
        .id('events')
        .title('Events')
        .items([
          eventItem(S, 'odunde', 'festival', FESTIVAL_LISTS),
          eventItem(S, 'gala', 'gala', GALA_LISTS),
          editionsItem(S, 'collective'),
        ]),
    );
}

function singletonItem(S: StructureBuilder, type: string, title: string) {
  return S.listItem()
    .id(type)
    .title(title)
    .child(S.document().schemaType(type).documentId(type).title(title));
}

/** Each page opens its document; a page that lists documents of its own opens them beside it. */
function pagesItem(S: StructureBuilder, administrator: boolean) {
  const pages = SITE_PAGES.map(({ type, title }) => {
    const lists = PAGE_LISTS[type];
    if (!lists) return singletonItem(S, type, title);
    return S.listItem()
      .id(type)
      .title(title)
      .child(
        S.list()
          .id(type)
          .title(title)
          .items([
            singletonItem(S, type, `${title} page`),
            ...lists.map((list) => S.documentTypeListItem(list)),
          ]),
      );
  });
  // No News page before launch (D22): only an administrator changes its document.
  const news = administrator ? [singletonItem(S, 'newsPage', 'News & Events page')] : [];
  return S.listItem()
    .id('pages')
    .title('Pages')
    .child(
      S.list()
        .id('pages')
        .title('Pages')
        .items([...pages, ...news]),
    );
}

function inboxItem(S: StructureBuilder) {
  const unhandled = S.listItem()
    .title('Unhandled enquiries')
    .id('inbox-unhandled')
    .child(
      S.documentList()
        .title('Unhandled enquiries')
        .schemaType('enquiry')
        .apiVersion(STUDIO_API_VERSION)
        .filter('_type == "enquiry" && handled != true')
        .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
    );
  const byKind = ENQUIRY_KINDS.map((kind) =>
    S.listItem()
      .title(KIND_TITLES[kind])
      .id(`inbox-${kind}`)
      .child(
        S.documentList()
          .title(KIND_TITLES[kind])
          .schemaType('enquiry')
          .apiVersion(STUDIO_API_VERSION)
          .filter('_type == "enquiry" && kind == $kind')
          .params({ kind })
          .defaultOrdering([
            { field: 'handled', direction: 'asc' },
            { field: 'submittedAt', direction: 'desc' },
          ]),
      ),
  );
  return S.listItem()
    .title('Inbox')
    .id('inbox')
    .child(
      S.list()
        .title('Inbox')
        .items([
          unhandled,
          S.divider(),
          ...byKind,
          S.divider(),
          S.documentTypeListItem('subscriber'),
        ]),
    );
}

export const structure: StructureResolver = (S, context) => {
  const administrator = isAdministrator(context.currentUser);
  const forAdministrators: ListItemBuilder[] = administrator
    ? [singletonItem(S, 'siteSettings', 'Site settings'), inboxItem(S)]
    : [];
  return S.list()
    .title('Content')
    .items([
      todoItem(S, context, administrator),
      S.divider(),
      S.documentTypeListItem('newsPost').title('News posts'),
      eventsItem(S),
      typesItem(S, 'photos', 'Photos', PHOTOS),
      typesItem(S, 'people', 'People', PEOPLE),
      S.divider(),
      pagesItem(S, administrator),
      typesItem(S, 'shared', 'Used on several pages', SHARED),
      ...(forAdministrators.length > 0 ? [S.divider(), ...forAdministrators] : []),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId() ?? '';
        return !PLACED.has(id) && !STUDIO_HIDDEN_TYPES.has(id);
      }),
    ]);
};

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) => S.document();
