import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as captionStories from './Captions.stories';
import * as openStories from './Open.stories';
import * as stateStories from './State.stories';

const Open = composeStories(openStories);
const Captions = composeStories(captionStories);
const State = composeStories(stateStories);

/** The prototype's copy the register would mark invented, which the pages never stand in for an owed fact. */
const INVENTIONS =
  /Citrus College|Red Carpet Media delivers|Signs at every entrance|written consent at registration|Many festival sets|omoyorubaofsocal\.org|Àgbàlá Ọmọde 2026/;

describe('the Gallery page-section stories', () => {
  it('state built: one h1, the three albums newest first, no gold action, and the credits owed', async () => {
    const root = (await renderToBody(State.Built)).querySelector('.oy-home');
    expect(root?.getAttribute('data-state')).toBe('built');
    expect(root?.querySelectorAll('h1')).toHaveLength(1);
    expect([...(root?.querySelectorAll('#albums h2') ?? [])].map((h) => text(h))).toEqual([
      'Odunde 2026',
      'End-of-Year Gala 2025',
      'Summer camp',
    ]);
    expect(root?.querySelectorAll('main .oy-btn--primary, .oy-btn--primary')).toHaveLength(0);
    const rows = [...(root?.querySelectorAll('#credit .oy-fact') ?? [])].map(
      (fact) => `${text(fact.querySelector('dt'))}: ${text(fact.querySelector('dd'))}`,
    );
    expect(rows).toEqual([
      'Credits: Given with each album, and with a photograph where it differs.',
      'Consent policy: Pending: your photo consent and removal policy',
      'Removal requests: Pending: the general inbox',
    ]);
    expect(root?.querySelector('#credit a[data-enquiry="contact"]')).not.toBeNull();
    expect(text(root)).not.toMatch(INVENTIONS);
  });

  it('state soon: the sentence and both event pages in place of the albums', async () => {
    const root = (await renderToBody(State.Soon)).querySelector('.oy-home');
    expect(root?.getAttribute('data-state')).toBe('soon');
    expect(root?.querySelector('.oy-album-grid')).toBeNull();
    expect(text(root?.querySelector('#albums'))).toContain(
      'The albums are being prepared. Until then, the Odunde and Gala pages carry their own photographs.',
    );
    expect(
      [...(root?.querySelectorAll('#albums a') ?? [])].map((link) => link.getAttribute('href')),
    ).toEqual(['/odunde', '/gala']);
    expect(root?.querySelector('#credit')).not.toBeNull();
  });

  it('open viewer: tiles lead to first photographs, and the album page arrives with the Lightbox open', async () => {
    const root = (await renderToBody(Open.Viewer)).querySelector('.oy-home');
    expect(root?.getAttribute('data-open')).toBe('viewer');
    expect(text(root?.querySelector('h1'))).toBe('End-of-Year Gala 2025');
    const dialog = root?.querySelector('dialog.oy-lightbox');
    expect(dialog?.hasAttribute('open')).toBe(true);
    expect(text(root?.querySelector('.oy-lb-count'))).toBe('1 of 6');
    // Nothing behind the Lightbox loads before the photograph on screen.
    expect(
      [...(root?.querySelectorAll('.oy-photo-grid img') ?? [])].every(
        (img) => img.getAttribute('loading') === 'lazy',
      ),
    ).toBe(true);
  });

  it('open grid: the album page with its photographs, the Lightbox closed, the credit owed', async () => {
    const root = (await renderToBody(Open.Grid)).querySelector('.oy-home');
    expect(root?.querySelector('dialog.oy-lightbox')?.hasAttribute('open')).toBe(false);
    expect(root?.querySelectorAll('.oy-photo-grid a[data-photo]')).toHaveLength(6);
    expect(text(root?.querySelector('p.oy-credit-line'))).toBe(
      'Photographs: Members and volunteers Pending: photographer credit to confirm',
    );
    expect(
      [...(root?.querySelectorAll('#photographs .oy-album-intro-links a') ?? [])].map((link) =>
        link.getAttribute('href'),
      ),
    ).toEqual(['/gallery', '/gala']);
  });

  it('captions: the tiles and the photographs carry the option', async () => {
    const hover = (await renderToBody(Captions.Hover)).querySelector('.oy-home');
    expect(hover?.getAttribute('data-captions')).toBe('hover');
    expect(hover?.querySelector('.oy-album-grid')?.getAttribute('data-captions')).toBe('hover');
    expect(hover?.querySelector('.oy-photo-grid')?.getAttribute('data-captions')).toBe('hover');
    const always = (await renderToBody(Captions.Always)).querySelector('.oy-home');
    expect(always?.querySelector('.oy-album-grid')?.getAttribute('data-captions')).toBe('always');
  });
});
