/**
 * What must never reach the CDN cache (ADR 0021): anything but a GET, a draft-mode request (either
 * draft-mode cookie, verified or not), every request on the preview host, the second hostname the owner can
 * point the Presentation tool at so an editor's iframe never meets the public copy (the CDN's
 * key ignores cookies, so on the public host a draft-mode request could be answered from the
 * cache), and every request on a `vercel.app` host, which answers `noindex` (ADR 0060). Pure, so the
 * middleware and a test share one rule.
 */
export interface CachePolicyInput {
  method: string;
  /** The perspective cookie names drafts or a release, or the session cookie is present. */
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

/**
 * Whether the request's host is one of Vercel's own addresses for the deployment (`*.vercel.app`): the
 * project's address and each deployment's, which serve the same pages as the public host (ADR 0060).
 */
export function isDeploymentHost(origin: string): boolean {
  try {
    return new URL(origin).hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

/**
 * Whether search engines should leave the host's answers out: the preview host and the deployment
 * hosts. Each is also never cached, so the header never rides a cached copy the public host could serve.
 */
export function isUnlistedHost(origin: string, previewOrigin: string | undefined): boolean {
  return isPreviewHost(origin, previewOrigin) || isDeploymentHost(origin);
}

/** Why the response must not be cached, or undefined when the page's own rule applies. */
export function uncacheableReason({
  method,
  draft,
  origin,
  previewOrigin,
}: CachePolicyInput): 'method' | 'draft' | 'preview-host' | 'deployment-host' | undefined {
  if (method.toUpperCase() !== 'GET') return 'method';
  if (draft) return 'draft';
  if (isPreviewHost(origin, previewOrigin)) return 'preview-host';
  if (isDeploymentHost(origin)) return 'deployment-host';
  return undefined;
}
