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
      const href = action.href?.trim();
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
