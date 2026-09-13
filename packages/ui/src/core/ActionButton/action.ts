/**
 * A Studio action (the `cta` object) turned into the attributes of its trigger. An enquiry opens
 * the Enquiry Modal through `data-enquiry` and links to the same page with the modal open without
 * JavaScript; the Give Dialog opens through `data-give` and links to `/donate#give`; a link and an
 * anchor are plain hrefs (ADR 0019, ADR 0020).
 */
export interface ActionLike {
  label?: string | null;
  kind?: string | null;
  enquiryKind?: string | null;
  href?: string | null;
  newTab?: boolean | null;
}

export interface ActionAttributes {
  href: string;
  'data-enquiry'?: string;
  'data-give'?: '';
  target?: '_blank';
  rel?: 'noopener';
}

export type ActionResolution =
  | { ok: true; label: string; attributes: ActionAttributes }
  | { ok: false; pending: string };

/**
 * A Studio link fit for an href: http, https, mailto or tel, or a path, fragment or query on this site.
 * The schema's `rule.uri` runs only in the Studio, so a value written through the API, the seed or the
 * MCP is checked again wherever it becomes a link; anything else (a `javascript:` URL) answers
 * undefined and the caller shows no link.
 */
export function safeHref(value: string | null | undefined): string | undefined {
  const raw = value?.trim() ?? '';
  return /^(https?:|mailto:|tel:)/i.test(raw) || /^(\/(?!\/)|#|\?)/.test(raw) ? raw : undefined;
}

/** The first of the actions that renders a button, so a half-filled one never replaces a whole one. */
export function usableAction<A extends ActionLike>(
  ...actions: (A | null | undefined)[]
): A | undefined {
  return actions.find((action): action is A => resolveAction(action)?.ok === true);
}

export function resolveAction(action: ActionLike | null | undefined): ActionResolution | undefined {
  if (!action) return undefined;
  const label = action.label?.trim();
  if (!label) return { ok: false, pending: 'the button label' };
  switch (action.kind) {
    case 'enquiry': {
      const kind = action.enquiryKind?.trim();
      if (!kind) return { ok: false, pending: 'which form this button opens' };
      return {
        ok: true,
        label,
        attributes: { href: `?enquiry=${kind}#enquiry`, 'data-enquiry': kind },
      };
    }
    case 'give':
      return { ok: true, label, attributes: { href: '/donate#give', 'data-give': '' } };
    case 'url': {
      const href = safeHref(action.href);
      if (!href) return { ok: false, pending: 'the link' };
      return {
        ok: true,
        label,
        attributes: action.newTab ? { href, target: '_blank', rel: 'noopener' } : { href },
      };
    }
    case 'anchor': {
      const href = action.href?.trim();
      if (!href?.startsWith('#')) return { ok: false, pending: 'the section this button goes to' };
      return { ok: true, label, attributes: { href } };
    }
    default:
      return { ok: false, pending: 'what this button opens' };
  }
}
