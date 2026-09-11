import type {
  DefaultDocumentNodeResolver,
  StructureBuilder,
  StructureResolver,
} from 'sanity/structure';
import { ENQUIRY_KINDS, KIND_TITLES } from '../enquiry-kinds';
import { PENDING, pendingFilter, pendingTitle } from '../pending';
import { EVENT_KINDS } from '../schema/documents';
import { singletonTypes } from '../schema/singletons';
import { STUDIO_API_VERSION } from './config';
import { isAdministrator, STUDIO_HIDDEN_TYPES } from './document-options';
import { PendingPresencePane } from './pending-pane';

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
    .filter((type) => administrator || type.name !== 'siteSettings')
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

function eventsItem(S: StructureBuilder) {
  const byKind = EVENT_KINDS.map((kind) =>
    S.listItem()
      .title(`${kind.charAt(0).toUpperCase()}${kind.slice(1)} editions`)
      .id(`events-${kind}`)
      .child(
        S.documentList()
          .title(`${kind} editions`)
          .schemaType('event')
          .apiVersion(STUDIO_API_VERSION)
          .filter('_type == "event" && kind == $kind')
          .params({ kind })
          .defaultOrdering([{ field: 'edition', direction: 'desc' }]),
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

function pendingItem(S: StructureBuilder) {
  const presence = S.listItem()
    .title('Missing entirely')
    .id('pending-presence')
    .child(S.component(PendingPresencePane).title('Missing entirely').id('pending-presence-pane'));
  const lint = S.listItem()
    .title('Voice findings on published documents')
    .id('pending-lint')
    .child(
      S.documentList()
        .title('Voice findings')
        .schemaType('lintReport')
        .apiVersion(STUDIO_API_VERSION)
        .filter('_type == "lintReport" && count(findings) > 0')
        .defaultOrdering([{ field: 'checkedAt', direction: 'desc' }]),
    );
  const rows = PENDING.map((entry, index) =>
    S.listItem()
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
 * docs/design/CONTENT-MODEL.md section 5 as amended by ADR 0013 and ADR 0014. Site settings and
 * the Inbox show for administrators only (the role fallback in document-options.ts).
 */
export const structure: StructureResolver = (S, context) => {
  const administrator = isAdministrator(context);
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
      pendingItem(S),
      S.divider(),
      // Anything registered later and not yet grouped still shows, so nothing is unreachable.
      ...S.documentTypeListItems().filter(
        (item) => !GROUPED.has(item.getId() ?? '') && !STUDIO_HIDDEN_TYPES.has(item.getId() ?? ''),
      ),
    ]);
};

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) => S.document();
