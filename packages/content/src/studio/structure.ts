import type {
  DefaultDocumentNodeResolver,
  StructureBuilder,
  StructureResolver,
} from 'sanity/structure';
import { ACTIVE_EVENT_KINDS, EVENT_LIST_TITLES } from '../edition-fields';
import { ENQUIRY_KINDS, KIND_TITLES } from '../enquiry-kinds';
import { PENDING, pendingFilter, pendingTitle } from '../pending';
import { singletonTypes } from '../schema/singletons';
import { STUDIO_API_VERSION } from './config';
import { STUDIO_HIDDEN_TYPES } from './document-options';
import { PendingPresencePane } from './pending-pane';
import { ADMIN_ONLY_TYPES, isAdministrator } from './roles';

const GROUPS: { title: string; types: string[] }[] = [
  { title: 'Events', types: ['event', 'zone', 'ticketTier', 'sponsorLevel', 'honoree'] },
  { title: 'Programs', types: ['program', 'initiative', 'givingLevel'] },
  {
    title: 'People',
    types: ['person', 'testimonial', 'photographer', 'partner', 'hometownAssociation', 'door'],
  },
  { title: 'Impact', types: ['stat', 'outcome', 'governanceDoc', 'timelineEntry'] },
  { title: 'News', types: ['newsPost'] },
  { title: 'Gallery', types: ['album'] },
];

const GROUPED = new Set(GROUPS.flatMap((group) => group.types));

function singletonItems(S: StructureBuilder, administrator: boolean) {
  return singletonTypes
    .filter((type) => administrator || !ADMIN_ONLY_TYPES.has(type.name))
    .map((type) =>
      S.listItem()
        .title(type.title ?? type.name)
        .id(type.name)
        .child(
          S.document()
            .schemaType(type.name)
            .documentId(type.name)
            .title(type.title ?? type.name),
        ),
    );
}

function groupItem(S: StructureBuilder, title: string, types: string[]) {
  return S.listItem()
    .title(title)
    .id(title.toLowerCase())
    .child(
      S.list()
        .title(title)
        .items(types.map((type) => S.documentTypeListItem(type))),
    );
}

/** One list per kind still in use, each starting new events of its kind (ADR 0042). */
function eventsItem(S: StructureBuilder) {
  const byKind = ACTIVE_EVENT_KINDS.map((kind) =>
    S.listItem()
      .title(EVENT_LIST_TITLES[kind])
      .id(`events-${kind}`)
      .child(
        S.documentList()
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
      ),
  );
  return S.listItem()
    .title('Events')
    .id('events')
    .child(
      S.list()
        .title('Events')
        .items([
          ...byKind,
          S.divider(),
          ...['zone', 'ticketTier', 'sponsorLevel', 'honoree'].map((type) =>
            S.documentTypeListItem(type),
          ),
        ]),
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

/**
 * The Pending view. Members see only what they can act on: the rows and the wording to check of an
 * administrator's documents are left out (ADR 0042). Row ids keep the registry index, so both roles
 * share them.
 */
function pendingItem(S: StructureBuilder, administrator: boolean) {
  const presence = S.listItem()
    .title('Missing entirely')
    .id('pending-presence')
    .child(S.component(PendingPresencePane).title('Missing entirely').id('pending-presence-pane'));
  const lint = S.listItem()
    .title('Wording to check on published pages')
    .id('pending-lint')
    .child(
      S.documentList()
        .title('Wording to check')
        .schemaType('lintReport')
        .apiVersion(STUDIO_API_VERSION)
        .filter('_type == "lintReport" && count(findings) > 0 && !(documentType in $hidden)')
        .params({ hidden: administrator ? [] : [...ADMIN_ONLY_TYPES] })
        .defaultOrdering([{ field: 'checkedAt', direction: 'desc' }]),
    );
  const rows = PENDING.flatMap((entry, index) =>
    !administrator && ADMIN_ONLY_TYPES.has(entry.type)
      ? []
      : S.listItem()
          .title(pendingTitle(entry))
          .id(`pending-${index}`)
          .child(
            S.documentList()
              .title(pendingTitle(entry))
              .schemaType(entry.type)
              .apiVersion(STUDIO_API_VERSION)
              .filter(pendingFilter(entry)),
          ),
  );
  return S.listItem()
    .title('Pending')
    .id('pending')
    .child(
      S.list()
        .title('Pending')
        .items([presence, lint, S.divider(), ...rows]),
    );
}

/**
 * docs/design/CONTENT-MODEL.md section 5 as amended by ADR 0013, ADR 0014 and ADR 0042. Site
 * settings, the News page and the Inbox show for administrators only (`ADMIN_ONLY_TYPES`).
 */
export const structure: StructureResolver = (S, context) => {
  const administrator = isAdministrator(context.currentUser);
  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .id('pages')
        .child(S.list().title('Pages').items(singletonItems(S, administrator))),
      S.divider(),
      eventsItem(S),
      ...GROUPS.filter((group) => group.title !== 'Events').map((group) =>
        groupItem(S, group.title, group.types),
      ),
      S.divider(),
      ...(administrator ? [inboxItem(S)] : []),
      pendingItem(S, administrator),
      S.divider(),
      // Anything registered later and not yet grouped still shows, so nothing is unreachable.
      ...S.documentTypeListItems().filter(
        (item) => !GROUPED.has(item.getId() ?? '') && !STUDIO_HIDDEN_TYPES.has(item.getId() ?? ''),
      ),
    ]);
};

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) => S.document();
