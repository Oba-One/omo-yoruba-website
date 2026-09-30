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
import { ORGANIZATION } from './todo';
import { todoItem } from './todo-list';

/*
 * The sidebar follows the site (ADR 0042, its names ADR 0047, no news ADR 0048; the tree in
 * docs/tickets/studio-simplification/spec.md): To do, Events, Photos, People, Pages.
 * Administrators also get Organization details and the Inbox (`studio/roles.ts`).
 */

const FESTIVAL_LISTS = ['zone'];
const GALA_LISTS = ['ticketTier', 'sponsorLevel', 'honoree'];
const PHOTOS = ['album', 'photographer'];
const PEOPLE = ['person', 'testimonial', 'hometownAssociation'];

/**
 * The documents that open beside a page, one document each: Programs lists every program, Get Involved
 * the ways to get involved, and Impact the headline figures, the partners and the governance documents. The
 * homepage, Donate and the Odunde page pick from the same documents. A page's own lists (initiatives,
 * outcomes, the timeline, the giving levels) live in its form (ADR 0042).
 */
const PAGE_LISTS: Partial<Record<SitePage, readonly string[]>> = {
  programsPage: ['program'],
  getInvolvedPage: ['door'],
  impactPage: ['stat', 'partner', 'governanceDoc'],
};

/** Each list's title, the documents it holds: a type's own title names one of them. */
const LIST_TITLES: Readonly<Record<string, string>> = {
  zone: 'Festival zones',
  ticketTier: 'Ticket tiers',
  sponsorLevel: 'Sponsor levels',
  honoree: 'Honorees',
  album: 'Albums',
  photographer: 'Photographers',
  person: 'People',
  testimonial: 'Member voices',
  hometownAssociation: 'Hometown associations',
  program: 'Programs',
  door: 'Ways to get involved',
  stat: 'Headline figures',
  partner: 'Partners',
  governanceDoc: 'Governance documents',
  subscriber: 'Subscribers',
};

/** Every type the tree places; a type added later and placed nowhere still shows at the end. */
const PLACED: ReadonlySet<string> = new Set([
  'event',
  ...FESTIVAL_LISTS,
  ...GALA_LISTS,
  ...PHOTOS,
  ...PEOPLE,
  ...Object.values(PAGE_LISTS).flat(),
]);

/** A type's documents under the list's title, which its pane takes too. */
function typeList(S: StructureBuilder, type: string) {
  const item = S.documentTypeListItem(type);
  const title = LIST_TITLES[type];
  return title ? item.title(title) : item;
}

function typesItem(S: StructureBuilder, id: string, title: string, types: readonly string[]) {
  return S.listItem()
    .id(id)
    .title(title)
    .child(
      S.list()
        .id(id)
        .title(title)
        .items(types.map((type) => typeList(S, type))),
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
        .items([editionsItem(S, kind, 'Editions'), ...types.map((type) => typeList(S, type))]),
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
          // One list, titled as its pane, so it never reads as the Collective's page under Pages.
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
function pagesItem(S: StructureBuilder) {
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
            ...lists.map((list) => typeList(S, list)),
          ]),
      );
  });
  return S.listItem()
    .id('pages')
    .title('Pages')
    .child(S.list().id('pages').title('Pages').items(pages));
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
        .items([unhandled, S.divider(), ...byKind, S.divider(), typeList(S, 'subscriber')]),
    );
}

export const structure: StructureResolver = (S, context) => {
  const administrator = isAdministrator(context.currentUser);
  const forAdministrators: ListItemBuilder[] = administrator
    ? [singletonItem(S, 'siteSettings', ORGANIZATION.title), inboxItem(S)]
    : [];
  return S.list()
    .title('Content')
    .items([
      todoItem(S, context, administrator),
      S.divider(),
      eventsItem(S),
      typesItem(S, 'photos', 'Photos', PHOTOS),
      typesItem(S, 'people', 'People', PEOPLE),
      S.divider(),
      pagesItem(S),
      ...(forAdministrators.length > 0 ? [S.divider(), ...forAdministrators] : []),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId() ?? '';
        return !PLACED.has(id) && !STUDIO_HIDDEN_TYPES.has(id);
      }),
    ]);
};

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) => S.document();
