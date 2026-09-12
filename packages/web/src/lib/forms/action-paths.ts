/**
 * Where the owned forms post without JavaScript: the page itself with Astro's form query
 * parameter (`?_action=<name>`, what `String(actions.<name>)` renders and what
 * `getActionContext` reads in the middleware, ADR 0019). Written here rather than imported from
 * `astro:actions` because a page that imports the server actions module also inherits, through
 * the actions runtime's chunk and the manifest it carries, the stylesheets of every route in the
 * manifest, the Studio's included (24 KB of CSS on every content page). The no-JavaScript
 * Playwright specs post through this path, so a drift in the parameter fails them.
 */
import { ENQUIRY_KINDS, type EnquiryKind } from '@oy/content/enquiry-kinds';

export const ACTION_PARAM = '_action';

export const formActionPath = (name: string): string => `?${ACTION_PARAM}=${name}`;

export const NEWSLETTER_ACTION = formActionPath('newsletter');

export const ENQUIRY_ACTIONS: Record<EnquiryKind, string> = Object.fromEntries(
  ENQUIRY_KINDS.map((kind) => [kind, formActionPath(`enquiry.${kind}`)]),
) as Record<EnquiryKind, string>;

/** The outcome of a form posted without JavaScript, as the middleware leaves it in locals. */
export interface FormOutcome {
  /** `enquiry.<kind>` or `newsletter`. */
  name: string;
  data?: unknown;
  error?: { message: string };
}
