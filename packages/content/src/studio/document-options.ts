import type { ConfigContext, DocumentActionsResolver, NewDocumentOptionsResolver } from 'sanity';
import { SINGLETON_NAMES } from '../schema/singletons';

/** Types the Studio never creates: singletons (they exist), and the documents the site or a function writes. */
export const NO_CREATE = new Set<string>([
  ...SINGLETON_NAMES,
  'enquiry',
  'subscriber',
  'lintReport',
]);

/** Types the generic lists never show; each has its own place in the structure. */
export const STUDIO_HIDDEN_TYPES = NO_CREATE;

/** Singletons cannot be deleted or duplicated either. */
const NO_DELETE = new Set<string>(SINGLETON_NAMES);

/**
 * Only the owner touches site settings and the inbox (CONTENT-MODEL section 5). Sanity's roles
 * depend on the plan (wayfinder ticket 22), so until a custom role exists the fallback is
 * structure visibility plus document actions: an editor can open these documents but cannot
 * publish, delete or duplicate them.
 */
export const OWNER_ONLY = new Set<string>(['siteSettings', 'enquiry', 'subscriber']);

export function isAdministrator(context: Pick<ConfigContext, 'currentUser'>): boolean {
  return context.currentUser?.roles.some((role) => role.name === 'administrator') ?? false;
}

export const newDocumentOptions: NewDocumentOptionsResolver = (prev) =>
  prev.filter((item) => !NO_CREATE.has(item.templateId));

export const documentActions: DocumentActionsResolver = (prev, context) => {
  if (OWNER_ONLY.has(context.schemaType) && !isAdministrator(context)) return [];
  return NO_DELETE.has(context.schemaType)
    ? prev.filter((action) => action.action !== 'delete' && action.action !== 'duplicate')
    : prev;
};
