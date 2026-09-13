import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './PhotoGrid.stories';

const { Default, CaptionsOnHover, UnderTheLightbox, Pending } = composeStories(stories);

describe('PhotoGrid', () => {
  it("lists every photograph as a link to its photo address, naming the album's Lightbox", async () => {
    const body = await renderToBody(Default);
    const links = [...body.querySelectorAll('ul.oy-photo-grid > li > a.oy-photo-link')];
    expect(links).toHaveLength(6);
    const first = links[0];
    expect(first?.getAttribute('href')).toBe('?photo=gala-2025-attendees-group-photo');
    expect(first?.getAttribute('data-lightbox')).toBe('album-lightbox');
    expect(first?.getAttribute('data-photo')).toBe('gala-2025-attendees-group-photo');
    // The router leaves the links to the Lightbox.
    expect(first?.hasAttribute('data-astro-reload')).toBe(true);
    expect(body.querySelector('ul')?.getAttribute('data-captions')).toBe('always');
  });

  it('reads each caption once: the tile leaves its alt empty beside a caption that says the same', async () => {
    const body = await renderToBody(Default);
    const first = body.querySelector('a.oy-photo-link');
    expect(first?.querySelector('img')?.getAttribute('alt')).toBe('');
    expect(text(first?.querySelector('figcaption'))).toBe(
      'Three women in gold, green and copper gèlè and lace stand together in the hall',
    );
  });

  it('loads the first row at once and the first photograph first, the rest lazily', async () => {
    const body = await renderToBody(Default);
    const images = [...body.querySelectorAll('img')];
    expect(images.map((img) => img.getAttribute('loading'))).toEqual([
      'eager',
      'eager',
      'eager',
      'lazy',
      'lazy',
      'lazy',
    ]);
    expect(images[0]?.getAttribute('fetchpriority')).toBe('high');
    expect(images.slice(1).some((img) => img.hasAttribute('fetchpriority'))).toBe(false);
  });

  it('loads nothing at once under a Lightbox served open', async () => {
    const body = await renderToBody(UnderTheLightbox);
    const images = [...body.querySelectorAll('img')];
    expect(images.every((img) => img.getAttribute('loading') === 'lazy')).toBe(true);
    expect(images.some((img) => img.hasAttribute('fetchpriority'))).toBe(false);
  });

  it('carries the captions option, and shows the Pending line with no photographs', async () => {
    expect(
      (await renderToBody(CaptionsOnHover)).querySelector('ul')?.getAttribute('data-captions'),
    ).toBe('hover');
    const body = await renderToBody(Pending);
    expect(body.querySelector('ul')).toBeNull();
    expect(text(body.querySelector('.oy-pend-line'))).toContain('the photographs');
  });
});
