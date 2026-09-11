import type { DocumentActionsResolver, NewDocumentOptionsResolver } from 'sanity';
import { SINGLETON_NAMES } from '../schema/singletons';

/** Types the Studio never creates: singletons (they exist), and the documents the site or a function writes. */
export const NO_CREATE = new Set<string>([
  ...SINGLETON_NAMES,
  'enquiry',
  'subscriber',
  'lintReport',
]);

/** Singletons cannot be deleted or duplicated either. */
const NO_DELETE = new Set<string>(SINGLETON_NAMES);

export const newDocumentOptions: NewDocumentOptionsResolver = (prev) =>
  prev.filter((item) => !NO_CREATE.has(item.templateId));

export const documentActions: DocumentActionsResolver = (prev, context) =>
  NO_DELETE.has(context.schemaType)
    ? prev.filter((action) => action.action !== 'delete' && action.action !== 'duplicate')
    : prev;
