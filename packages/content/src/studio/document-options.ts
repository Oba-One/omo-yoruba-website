import type {
  ConfigContext,
  DocumentActionsResolver,
  NewDocumentOptionsResolver,
  Tool,
} from 'sanity';
import { SINGLETON_NAMES } from '../schema/singletons';
import { ADMIN_ONLY_TYPES, ADMIN_TOOLS, HELD_BACK_PAGES, isAdministrator } from './roles';

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

export const newDocumentOptions: NewDocumentOptionsResolver = (prev) =>
  prev.filter((item) => !NO_CREATE.has(item.templateId));

/**
 * Sanity's custom roles need an Enterprise plan, so members are held back by the sidebar, read-only
 * documents and these actions (ADR 0042): nothing on an administrator's documents, and no Restore
 * on a page whose held-back switch an old version could flip.
 */
export const documentActions: DocumentActionsResolver = (prev, context) => {
  const administrator = isAdministrator(context.currentUser);
  if (ADMIN_ONLY_TYPES.has(context.schemaType) && !administrator) return [];
  if (HELD_BACK_PAGES.has(context.schemaType) && !administrator) {
    prev = prev.filter((action) => action.action !== 'restore');
  }
  // The content-lint function writes lint reports: members change nothing, and an administrator
  // may only delete one whose document is gone (the function never removes it).
  if (context.schemaType === 'lintReport') {
    return administrator ? prev.filter((action) => action.action === 'delete') : [];
  }
  return NO_DELETE.has(context.schemaType)
    ? prev.filter((action) => action.action !== 'delete' && action.action !== 'duplicate')
    : prev;
};

/** The Vision tool is for administrators only; members get the structure and Presentation. */
export const studioTools = (prev: Tool[], context: ConfigContext): Tool[] =>
  isAdministrator(context.currentUser) ? prev : prev.filter((tool) => !ADMIN_TOOLS.has(tool.name));
