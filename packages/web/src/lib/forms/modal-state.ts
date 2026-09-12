/**
 * What the layout renders into the Enquiry Modal and the footer without JavaScript (ADR 0019):
 * the `?enquiry=<kind>` trigger link, the `sent=1` success render after the redirect, and a
 * posted result echoed with its values. Pure, so the layout stays thin and the rules are tested.
 */
import {
  ENQUIRY_KINDS,
  type EnquiryKind,
  fallbackSentence,
  type SiteContact,
} from '@oy/content/enquiry-kinds';
import type { EnquiryModalState } from '@oy/ui/forms/EnquiryModal/EnquiryModal.astro';
import type { FormResult } from './result';

export interface ActionOutcome {
  data?: FormResult;
  error?: { message: string };
}

export interface EnquiryPageState {
  kind?: EnquiryKind;
  open: boolean;
  state: EnquiryModalState;
  values?: Record<string, string>;
  errors?: Record<string, string>;
  summary?: string;
  success?: { title: string; body: string };
}

export function enquiryKindFrom(value: string | null | undefined): EnquiryKind | undefined {
  return ENQUIRY_KINDS.find((kind) => kind === value);
}

const CLOSED: EnquiryPageState = { open: false, state: 'empty' };

/** The state a GET renders: the trigger link's kind, or the success block after the redirect. */
export function modalStateFromUrl(
  url: URL,
  copy: (kind: EnquiryKind) => { title: string; body: string },
): EnquiryPageState {
  const kind = enquiryKindFrom(url.searchParams.get('enquiry'));
  if (!kind) return CLOSED;
  if (url.searchParams.get('sent') === '1') {
    return { kind, open: true, state: 'success', success: copy(kind) };
  }
  return { kind, open: true, state: 'empty' };
}

/**
 * The state a POST re-renders: errors with the values kept. The middleware redirects a success
 * before the page renders; a success that still reaches here shows its block in place.
 */
export function modalStateFromResult(
  kind: EnquiryKind,
  outcome: ActionOutcome,
  site: SiteContact,
): EnquiryPageState {
  const data = outcome.data;
  if (data?.ok) {
    return { kind, open: true, state: 'success', success: { title: data.title, body: data.body } };
  }
  if (data && !data.ok) {
    return {
      kind,
      open: true,
      state: 'error',
      summary: data.summary,
      errors: data.fields,
      values: data.values,
    };
  }
  return {
    kind,
    open: true,
    state: 'error',
    summary: outcome.error?.message || fallbackSentence(site),
  };
}

/** Where a successful no-JS POST goes: the same page, the modal open on its success block. */
export function redirectAfterEnquiry(url: URL, kind: EnquiryKind): string {
  return `${url.pathname}?enquiry=${kind}&sent=1#enquiry`;
}

export type NewsletterPageState =
  | { state: 'idle' | 'success' }
  | { state: 'error'; error: string; value?: string };

/** The footer's newsletter state: `subscribed=1` after the redirect, or a posted error. */
export function newsletterStateFrom(
  url: URL,
  outcome?: ActionOutcome,
  site: SiteContact = {},
): NewsletterPageState {
  const data = outcome?.data;
  if (data && !data.ok) {
    return {
      state: 'error',
      error: data.fields?.email ?? data.summary,
      value: data.values?.email,
    } as const;
  }
  if (outcome && !data) {
    return { state: 'error', error: outcome.error?.message || fallbackSentence(site) } as const;
  }
  if (url.searchParams.get('subscribed') === '1') return { state: 'success' } as const;
  return { state: 'idle' } as const;
}

export function redirectAfterNewsletter(url: URL): string {
  return `${url.pathname}?subscribed=1#oy-newsletter`;
}
