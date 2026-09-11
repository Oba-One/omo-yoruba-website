import type { DefaultDocumentNodeResolver, StructureResolver } from 'sanity/structure';

// docs/design/CONTENT-MODEL.md section 5: singletons first, then the groups, then Inbox and
// Pending. Filled in ticket 07.
export const structure: StructureResolver = (S) => S.list().title('Content').items([]);

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) => S.document();
