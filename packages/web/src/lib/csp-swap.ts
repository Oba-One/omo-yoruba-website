/**
 * Keeps an enforced CSP from refusing scripts across a deploy (ADR 0062). The ClientRouter runs the next page's
 * scripts under the policy of the page it swapped from, and that policy names inline scripts by hash: after a
 * deploy that changed one, a tab opened before it would refuse the new body. Every page names its policy in a
 * meta tag, and a swap to a page whose policy differs becomes a full load, which brings the new policy with it.
 * Imported by the layout's bundled script, so it runs in the browser: no Node API here.
 */

/** The meta tag's name; its content is `cspFingerprint()` from csp.ts. */
export const CSP_META = 'oy-csp';

const fingerprint = (doc: Document) =>
  doc.querySelector(`meta[name="${CSP_META}"]`)?.getAttribute('content') ?? '';

/** Whether the next page answers under a different policy from this one; a page without the tag counts as one. */
export function policyChanged(current: Document, next: Document): boolean {
  return fingerprint(next) === '' || fingerprint(next) !== fingerprint(current);
}
