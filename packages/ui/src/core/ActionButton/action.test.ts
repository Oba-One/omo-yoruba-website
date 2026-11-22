import { URL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { resolveAction, safeHref, usableAction } from './action';

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

  it('opens the Join Dialog, and the member enquiry where there is no dialog to open', () => {
    // Without JavaScript, or while Organization details hold no membership form, the link is all there is.
    expect(resolveAction({ label: 'Become a member', kind: 'join' })).toEqual({
      ok: true,
      label: 'Become a member',
      attributes: {
        href: '?enquiry=member#enquiry',
        'data-join': '',
        'data-astro-reload': '',
      },
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
    const half = { label: 'Enroll a learner', kind: 'enquiry' };
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

describe('safeHref', () => {
  const SITE = 'https://omoyorubasocal.org';
  /** Where a browser takes an href from a page of the site, by the address parser browsers share. */
  const opens = (href: string) => new URL(href, `${SITE}/gala`);
  const char = (code: number) => String.fromCharCode(code);
  const shown = (value: unknown) => JSON.stringify(value);

  it('keeps a web, mail or phone address, and a path, fragment or query on this site', () => {
    for (const href of [
      'https://www.zeffy.com/ticketing/gala',
      'HTTP://example.org',
      // A space cannot move a link, so it stays: a browser writes it as %20.
      'mailto:hello@example.org?subject=Hello there',
      // Marks are no control characters.
      'mailto:hello@example.org?subject=Ẹ káàbọ̀',
      'tel:+13235550100',
      '/',
      '#',
      '?',
      '/odunde',
      '/gallery/gala-2025?photo=first-dance',
      '#plan',
      '?enquiry=member#enquiry',
    ]) {
      expect(safeHref(href), href).toBe(href);
    }
    expect(safeHref('  /odunde\n')).toBe('/odunde');
  });

  it('answers nothing for an empty value, a bare word, or a scheme that runs or embeds something', () => {
    for (const value of [
      undefined,
      null,
      '',
      '   ',
      'odunde',
      'www.example.org',
      'javascript:alert(1)',
      'JaVaScRiPt:alert(1)',
      ' javascript:alert(1)',
      `${char(1)}javascript:alert(1)`,
      'java\tscript:alert(1)',
      'java\nscript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
      `blob:${SITE}/1`,
    ]) {
      expect(safeHref(value), shown(value)).toBeUndefined();
    }
  });

  it('refuses a path that a browser opens on another site', () => {
    // Two slashes name a host. A browser reads a backslash as a slash, and drops a tab or a newline
    // wherever it sits, so each of these is "//evil.example" by the time it is followed.
    for (const href of [
      '//evil.example',
      '/\\evil.example/path',
      '/\t/evil.example',
      '/\n/evil.example',
      '/\r/evil.example',
      '/\r\n/evil.example',
      '/\t\\evil.example',
      '/\\\tevil.example',
    ]) {
      expect(opens(href).host, shown(href)).toBe('evil.example');
      expect(safeHref(href), shown(href)).toBeUndefined();
    }
  });

  it('refuses an ASCII control character inside a value', () => {
    for (const href of [
      `/gala${char(0)}`,
      `/ga${char(7)}la`,
      `https://example.org/${char(0x1f)}`,
      `mailto:hello@example.org${char(0x7f)}`,
      `#plan${char(0x0b)}1`,
      '?a=1\tb',
      // A path on this site once the browser drops the tab, refused for the tab alone.
      '/\tjavascript:alert(1)',
    ]) {
      expect(safeHref(href), shown(href)).toBeUndefined();
    }
  });

  it('never lets a path, fragment or query leave the site, whatever follows its first character', () => {
    // Every ASCII character, then a few others a parser might fold into a slash or drop: a no-break
    // space, a line separator, a zero width space, a byte order mark, a full width slash and backslash.
    const second = [
      ...Array.from({ length: 128 }, (_, code) => char(code)),
      ...[0xa0, 0x2028, 0x200b, 0xfeff, 0xff0f, 0xff3c].map(char),
    ];
    const third = ['', '/', '\\', '\t', '\n', '\r', ' ', char(0)];
    const rest = ['evil.example', '/evil.example', '\\evil.example', '\t/evil.example'];
    const escapes: string[] = [];
    for (const first of ['/', '#', '?']) {
      for (const b of second) {
        for (const c of third) {
          for (const tail of rest) {
            const href = safeHref(`${first}${b}${c}${tail}`);
            if (href === undefined) continue;
            let origin: string;
            try {
              origin = opens(href).origin;
            } catch {
              origin = 'unreadable';
            }
            if (origin !== SITE) escapes.push(shown(href));
          }
        }
      }
    }
    expect(escapes).toEqual([]);
  });
});
