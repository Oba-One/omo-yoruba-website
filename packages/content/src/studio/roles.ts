import { type ConditionalPropertyCallback, type CurrentUser, userHasRole } from 'sanity';
import { type LayoutSpec, PAGE_LAYOUTS } from '../layout-options';

/**
 * Who does what in the Studio (ADR 0042). Members are Sanity Editors and edit details and facts;
 * administrators keep site settings, the Inbox, the Vision tool and the held-back switches. Any
 * role other than administrator, developer included, gets the member view. Hiding and locking shape
 * the Studio only: through the API an Editor can still read and change every document in the dataset.
 */
export function isAdministrator(user: Omit<CurrentUser, 'role'> | null | undefined): boolean {
  return user ? userHasRole(user, 'administrator') : false;
}

/** True for a member: `readOnly: forMembers` locks a document or field, `hidden: forMembers` hides it. */
export const forMembers: ConditionalPropertyCallback = ({ currentUser }) =>
  !isAdministrator(currentUser);

/** Tools only administrators get: Vision reads any document, enquiries and subscribers included. */
export const ADMIN_TOOLS: ReadonlySet<string> = new Set(['vision']);

/**
 * Documents only administrators change: Organization details (`siteSettings`) and the Inbox's
 * enquiries and subscribers. Members do not find them in the sidebar or the
 * to-do list, open them read-only anywhere else, and get no actions on them.
 */
export const ADMIN_ONLY_TYPES: ReadonlySet<string> = new Set([
  'siteSettings',
  'enquiry',
  'subscriber',
]);

/** Pages with a held-back switch. Restoring an old version could flip it, so members cannot. */
export const HELD_BACK_PAGES: ReadonlySet<string> = new Set(
  Object.entries(PAGE_LAYOUTS as Record<string, readonly LayoutSpec[]>)
    .filter(([, options]) => options.some((option) => option.heldBack))
    .map(([type]) => type),
);
