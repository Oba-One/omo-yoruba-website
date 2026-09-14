import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './AlbumGrid.stories';

const { Default, OneAlbum, TwoAlbums, FourAlbums, GridFour, CaptionsOnHover, Pending } =
  composeStories(stories);

describe('AlbumGrid', () => {
  it('lists the albums in order as a mosaic of three, the first leading and loading first', async () => {
    const body = await renderToBody(Default);
    const grid = body.querySelector('ul.oy-album-grid');
    expect(grid?.getAttribute('data-layout')).toBe('mosaic');
    expect(grid?.getAttribute('data-count')).toBe('3');
    expect(grid?.getAttribute('data-captions')).toBe('always');
    expect(grid?.classList.contains('oy-albums')).toBe(false);
    const tiles = [...body.querySelectorAll('li > a.oy-album')];
    expect(tiles.map((tile) => text(tile.querySelector('h2')))).toEqual([
      'Odunde 2026',
      'End-of-Year Gala 2025',
      'Summer camp',
    ]);
    expect(tiles.map((tile) => tile.getAttribute('data-size'))).toEqual(['lead', 'tile', 'tile']);
    const images = [...body.querySelectorAll('img')];
    expect(images[0]?.getAttribute('loading')).toBe('eager');
    expect(images[0]?.getAttribute('fetchpriority')).toBe('high');
    expect(images.slice(1).every((img) => img.getAttribute('loading') === 'lazy')).toBe(true);
  });

  it('marks the count the mosaic arranges by: one, two, and many from four', async () => {
    expect((await renderToBody(OneAlbum)).querySelector('ul')?.getAttribute('data-count')).toBe(
      '1',
    );
    const two = await renderToBody(TwoAlbums);
    expect(two.querySelector('ul')?.getAttribute('data-count')).toBe('2');
    // Both halves stand two rows tall, but only the first takes the lead's title.
    expect([...two.querySelectorAll('a')].map((tile) => tile.getAttribute('data-size'))).toEqual([
      'lead',
      'tile',
    ]);
    const four = await renderToBody(FourAlbums);
    expect(four.querySelector('ul')?.getAttribute('data-count')).toBe('many');
    expect(text(four.querySelectorAll('h2')[3])).toBe('[ Album title ]');
  });

  it("lays the grid at the port's density", async () => {
    const body = await renderToBody(GridFour);
    const grid = body.querySelector('ul');
    expect(grid?.classList.contains('oy-albums')).toBe(true);
    expect(grid?.getAttribute('data-cols')).toBe('4');
    expect(body.querySelectorAll('a[data-size="lead"]')).toHaveLength(0);
  });

  it('carries the captions option for the hover rule', async () => {
    const body = await renderToBody(CaptionsOnHover);
    expect(body.querySelector('ul')?.getAttribute('data-captions')).toBe('hover');
  });

  it("shows the registry's Pending line with no albums", async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('ul')).toBeNull();
    const line = body.querySelector('.oy-pend-line');
    expect(text(line?.querySelector('b'))).toBe('Pending from you');
    expect(text(line)).toContain('the photo albums');
  });
});
