import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Lightbox.stories';

const { Default, LaterPhotograph, OwnCredit, OnePhoto, Closed } = composeStories(stories);

describe('Lightbox', () => {
  it('is a dialog named for the album, served open on the photo address with the element not yet wired', async () => {
    const body = await renderToBody(Default);
    const host = body.querySelector('oy-lightbox');
    expect(host?.id).toBe('album-lightbox');
    expect(host?.getAttribute('data-album-href')).toBe('/gallery/gala-2025');
    expect(host?.hasAttribute('data-ready')).toBe(false);
    const dialog = body.querySelector('dialog');
    expect(dialog?.classList.contains('oy-lightbox')).toBe(true);
    expect(dialog?.classList.contains('oy-dark')).toBe(true);
    expect(dialog?.getAttribute('aria-label')).toBe('End-of-Year Gala 2025');
    expect(dialog?.hasAttribute('open')).toBe(true);
  });

  it('holds every photograph as a frame, the one shown visible, loaded at once and first', async () => {
    const body = await renderToBody(Default);
    const frames = [...body.querySelectorAll('.oy-lb-frame')];
    expect(frames).toHaveLength(6);
    expect(frames.map((frame) => frame.hasAttribute('hidden'))).toEqual([
      false,
      true,
      true,
      true,
      true,
      true,
    ]);
    expect(frames.map((frame) => frame.getAttribute('data-position'))).toEqual([
      '1 of 6',
      '2 of 6',
      '3 of 6',
      '4 of 6',
      '5 of 6',
      '6 of 6',
    ]);
    const images = frames.map((frame) => frame.querySelector('img'));
    expect(images[0]?.getAttribute('loading')).toBe('eager');
    expect(images[0]?.getAttribute('fetchpriority')).toBe('high');
    expect(images.slice(1).every((img) => img?.getAttribute('loading') === 'lazy')).toBe(true);
    // The Lightbox keeps the photograph's own alt; its caption is in the bar.
    expect(images[0]?.getAttribute('alt')).toBe(
      'Three women in gold, green and copper gèlè and lace stand together in the hall',
    );
  });

  it('links previous, next and × to the neighbouring addresses and the album, drawing no glyph chevrons', async () => {
    const body = await renderToBody(Default);
    const previous = body.querySelector('a[data-prev]');
    const next = body.querySelector('a[data-next]');
    const close = body.querySelector('a[data-close]');
    expect(previous?.getAttribute('aria-label')).toBe('Previous photo');
    expect(previous?.getAttribute('href')).toBe('?photo=gala-2025-attendees-getting-food');
    expect(next?.getAttribute('aria-label')).toBe('Next photo');
    expect(next?.getAttribute('href')).toBe('?photo=gala-2025-three-friends-selfie');
    expect(close?.getAttribute('aria-label')).toBe('Close');
    expect(close?.getAttribute('href')).toBe('/gallery/gala-2025');
    for (const link of [previous, next, close])
      expect(link?.hasAttribute('data-astro-reload')).toBe(true);
    expect(body.innerHTML).not.toMatch(/[‹›]/);
  });

  it("shows the caption, the album's credit with its chip, and the count in lowercase", async () => {
    const body = await renderToBody(Default);
    const active = body.querySelectorAll('.oy-lb-cap > p[data-active="true"]');
    expect(active).toHaveLength(1);
    expect(text(active[0]?.querySelector('.oy-lb-caption'))).toBe(
      'Three women in gold, green and copper gèlè and lace stand together in the hall',
    );
    expect(text(active[0]?.querySelector('.oy-credit-line'))).toBe(
      'Photographs: Members and volunteers Pending: photographer credit to confirm',
    );
    expect(text(body.querySelector('.oy-lb-count'))).toBe('1 of 6');
    const status = body.querySelector('.oy-lb-status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
  });

  it('opens on a later photograph with its count and neighbours', async () => {
    const body = await renderToBody(LaterPhotograph);
    const frames = [...body.querySelectorAll('.oy-lb-frame')];
    expect(frames.findIndex((frame) => !frame.hasAttribute('hidden'))).toBe(4);
    expect(text(body.querySelector('.oy-lb-count'))).toBe('5 of 6');
    expect(body.querySelector('a[data-next]')?.getAttribute('href')).toBe(
      '?photo=gala-2025-attendees-getting-food',
    );
  });

  it("names a photograph's own unconfirmed credit with its own chip", async () => {
    const body = await renderToBody(OwnCredit);
    expect(text(body.querySelector('.oy-lb-cap .oy-credit-line'))).toBe(
      "Photographs: [ Photographer ] Pending: a photograph's own credit to confirm",
    );
  });

  it('draws no previous or next for one photograph, and renders closed without a photo address', async () => {
    const one = await renderToBody(OnePhoto);
    expect(one.querySelector('a[data-prev], a[data-next]')).toBeNull();
    const closed = await renderToBody(Closed);
    expect(closed.querySelector('dialog')?.hasAttribute('open')).toBe(false);
    expect(closed.querySelector('.oy-lb-frame img')?.getAttribute('loading')).toBe('lazy');
  });

  it('ships the element script with the history and swipe handling, guarded against a second copy', async () => {
    const script = (await renderToBody(Default)).querySelector('script');
    const source = script?.textContent ?? '';
    expect(source).toContain("customElements.get('oy-lightbox')");
    expect(source).toContain("history.pushState(null, '', addressFor(key))");
    expect(source).toContain('window.oyHistoryGuard = api.claims;');
    expect(source).not.toContain('astro:before-preparation');
    expect(source).toContain('const SWIPE = 40;');
    expect(source).toContain('window.visualViewport.scale > 1.01');
    expect(source).toContain("'lightbox_opened'");
  });
});
