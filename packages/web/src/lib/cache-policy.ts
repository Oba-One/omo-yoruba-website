/**
 * What must never reach the CDN cache (ADR 0021): anything but a GET, a draft-mode request (the
 * perspective cookie), and every request on the preview host, the second hostname the owner can
 * point the Presentation tool at so an editor's iframe never meets the public copy (the CDN's
 * key ignores cookies, so on the public host a draft-mode request could be answered from the
 * cache). Pure, so the middleware and a test share one rule.
 */
export interface CachePolicyInput {
  method: string;
  /** The perspective cookie is present and names drafts or a release. */
  draft: boolean;
  /** The request's origin, `https://preview.example.org`. */
  origin: string;
  /** `PUBLIC_PREVIEW_ORIGIN` when the owner set one. */
  previewOrigin?: string;
}

/** Whether the request's host is the uncached preview host. */
export function isPreviewHost(origin: string, previewOrigin: string | undefined): boolean {
  if (!previewOrigin) return false;
  try {
    return new URL(origin).host === new URL(previewOrigin).host;
  } catch {
    return false;
  }
}

/** Why the response must not be cached, or undefined when the page's own rule applies. */
export function uncacheableReason({
  method,
  draft,
  origin,
  previewOrigin,
}: CachePolicyInput): 'method' | 'draft' | 'preview-host' | undefined {
  if (method.toUpperCase() !== 'GET') return 'method';
  if (draft) return 'draft';
  if (isPreviewHost(origin, previewOrigin)) return 'preview-host';
  return undefined;
}
