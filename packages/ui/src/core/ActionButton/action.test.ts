import { describe, expect, it } from 'vitest';
import { resolveAction, usableAction } from './action';

describe('resolveAction', () => {
  it('opens an enquiry kind through the modal trigger and the no-JavaScript link', () => {
    expect(
      resolveAction({ label: 'Become a member', kind: 'enquiry', enquiryKind: 'member' }),
    ).toEqual({
      ok: true,
      label: 'Become a member',
      attributes: { href: '?enquiry=member#enquiry', 'data-enquiry': 'member' },
    });
  });

  it('opens the Give Dialog', () => {
    expect(resolveAction({ label: 'Donate', kind: 'give' })).toEqual({
      ok: true,
      label: 'Donate',
      attributes: { href: '/donate#give', 'data-give': '' },
    });
  });

  it('links, in a new tab only when asked, and anchors on the page', () => {
    expect(
      resolveAction({ label: 'Tickets', kind: 'url', href: 'https://x.test', newTab: true }),
    ).toMatchObject({ attributes: { href: 'https://x.test', target: '_blank', rel: 'noopener' } });
    expect(resolveAction({ label: 'See', kind: 'url', href: '/odunde' })).toMatchObject({
      attributes: { href: '/odunde' },
    });
    expect(resolveAction({ label: 'Plan', kind: 'anchor', href: '#plan' })).toMatchObject({
      attributes: { href: '#plan' },
    });
  });

  it('picks the first action that renders, so a half-filled one never replaces a whole one', () => {
    const half = { label: 'Enrol a learner', kind: 'enquiry' };
    const whole = { label: 'See the Odunde Festival', kind: 'url', href: '/odunde' };
    expect(usableAction(half, whole)).toBe(whole);
    expect(usableAction(undefined, null, whole)).toBe(whole);
    expect(usableAction(half)).toBeUndefined();
  });

  it('names what is missing instead of guessing', () => {
    expect(resolveAction(undefined)).toBeUndefined();
    expect(resolveAction({ kind: 'give' })).toEqual({ ok: false, pending: 'the button label' });
    expect(resolveAction({ label: 'x', kind: 'enquiry' })).toEqual({
      ok: false,
      pending: 'which form this button opens',
    });
    expect(resolveAction({ label: 'x', kind: 'url' })).toEqual({ ok: false, pending: 'the link' });
    // A link written past the Studio's validation never becomes an href.
    expect(resolveAction({ label: 'x', kind: 'url', href: 'javascript:alert(1)' })).toEqual({
      ok: false,
      pending: 'the link',
    });
    expect(resolveAction({ label: 'x', kind: 'anchor', href: 'plan' })).toEqual({
      ok: false,
      pending: 'the section this button goes to',
    });
    expect(resolveAction({ label: 'x', kind: 'other' })).toEqual({
      ok: false,
      pending: 'what this button opens',
    });
  });
});
