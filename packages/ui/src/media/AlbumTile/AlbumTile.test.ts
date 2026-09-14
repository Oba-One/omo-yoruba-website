import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './AlbumTile.stories';

const { Default, Lead, WithYear, YearPending, Pending } = composeStories(stories);

describe('AlbumTile', () => {
  it('is one link to the album, named by its heading and its line', async () => {
    const body = await renderToBody(Default);
    const links = body.querySelectorAll('a');
    expect(links).toHaveLength(1);
    const link = links[0];
    expect(link?.getAttribute('href')).toBe(
      '/gallery/odunde-2026?photo=odunde-2026-kid-playing-with-elder',
    );
    expect(text(link?.querySelector('h2'))).toBe('Odunde 2026');
    expect(text(link?.querySelector('.oy-album-line'))).toBe('43 photographs');
    expect(link?.querySelector('.oy-pend')).toBeNull();
  });

  it("leaves the cover's alt empty, frames it lazily, and sets the title at 19px or the lead's size", async () => {
    const body = await renderToBody(Default);
    const img = body.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('');
    expect(img?.getAttribute('loading')).toBe('lazy');
    expect(img?.getAttribute('decoding')).toBe('async');
    expect(body.querySelector('a')?.getAttribute('data-size')).toBe('tile');
    const lead = await renderToBody(Lead);
    expect(lead.querySelector('a')?.getAttribute('data-size')).toBe('lead');
  });

  it('reads a year the title does not carry before the count, joined by the dot', async () => {
    const body = await renderToBody(WithYear);
    const line = body.querySelector('.oy-album-line');
    expect(text(line)).toBe('2025 • 6 photographs');
    expect(line?.querySelector('.oy-album-dot')?.getAttribute('aria-hidden')).toBe('true');
  });

  it("shows the registry's chip after the count where the year is owed", async () => {
    const body = await renderToBody(YearPending);
    const line = body.querySelector('.oy-album-line');
    expect(text(line)).toBe('19 photographs Pending: the year of the album');
    expect(line?.querySelector('.oy-album-dot')).toBeNull();
    // The meta sits in the dark scope, so the chip takes its on-dark colours.
    expect(body.querySelector('.oy-album-meta')?.classList.contains('oy-dark')).toBe(true);
  });

  it('names the missing cover in the placeholder', async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('img')).toBeNull();
    expect(body.querySelector('.oy-ph')?.getAttribute('aria-label')).toBe(
      'Placeholder for the album cover',
    );
  });
});
