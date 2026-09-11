import type { DocumentActionsResolver, NewDocumentOptionsResolver } from 'sanity';

// Singletons cannot be created, deleted or duplicated; enquiries, subscribers and lint reports
// cannot be created from the Studio. Filled in tickets 05 and 07.
export const newDocumentOptions: NewDocumentOptionsResolver = (prev) => prev;

export const documentActions: DocumentActionsResolver = (prev) => prev;
