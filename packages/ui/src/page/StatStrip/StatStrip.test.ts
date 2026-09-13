import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './StatStrip.stories';

const {
  Four,
  Six,
  WithSources,
  WithOneSource,
  Pending,
  Framed,
  FramedSix,
  FramedSourcesHidden,
  FramedPending,
} = composeStories(stories);

describe('StatStrip', () => {
  it('renders the four figures with their labels and the corner fields', async () => {
    const band = (await renderToBody(Four)).querySelector('.oy-stat-band');
    expect(band?.querySelectorAll('.v2-corner')).toHaveLength(2);
    const strip = band?.querySelector('.oy-stat-strip');
    expect(strip?.getAttribute('data-columns')).toBe('4');
    const stats = Array.from(strip?.querySelectorAll('.oy-stat') ?? []);
    expect(stats.map((s) => text(s.querySelector('b')))).toEqual(['29', '3,000+', '4', '9']);
    expect(text(stats[0]?.querySelector('span'))).toBe('years serving SoCal');
    expect(band?.querySelector('.oy-source')).toBeNull();
  });

  it('goes six across for six figures', async () => {
    expect(
      (await renderToBody(Six)).querySelector('.oy-stat-strip')?.getAttribute('data-columns'),
    ).toBe('6');
  });

  it('shows the registry chip for a missing source and the line when one exists', async () => {
    const sources = Array.from((await renderToBody(WithSources)).querySelectorAll('.oy-source'));
    expect(sources).toHaveLength(4);
    expect(text(sources[0]?.querySelector('.oy-pend'))).toBe(
      'Pending: a source line under the figure',
    );
    const one = Array.from((await renderToBody(WithOneSource)).querySelectorAll('.oy-source'));
    expect(text(one[0])).toBe('Founding date, 1997');
    expect(one[1]?.querySelector('.oy-pend')).not.toBeNull();
  });

  it('renders the Pending line without figures', async () => {
    const band = (await renderToBody(Pending)).querySelector('.oy-stat-band');
    expect(band?.querySelector('.oy-stat')).toBeNull();
    expect(text(band?.querySelector('.oy-pend-line'))).toContain('the headline figures');
  });

  it("frames Impact's four figures in the grid, each with its source line's chip", async () => {
    const grid = (await renderToBody(Framed)).querySelector('.oy-stat-grid');
    expect(grid?.closest('.oy-stat-band')).toBeNull();
    expect(grid?.getAttribute('data-columns')).toBe('4');
    const cells = Array.from(grid?.querySelectorAll('.oy-stat') ?? []);
    expect(cells.map((cell) => text(cell.querySelector('span')))).toEqual([
      'years serving Southern California',
      'Yoruba community in Southern California',
      'hometown associations in the community',
      'festival zones at Odunde',
    ]);
    expect(cells.map((cell) => text(cell.querySelector('.oy-source')))).toEqual(
      Array(4).fill('Pending: a source line under the figure'),
    );
  });

  it('fills six cells with the chip for the two figures the grid waits for', async () => {
    const grid = (await renderToBody(FramedSix)).querySelector('.oy-stat-grid');
    expect(grid?.getAttribute('data-columns')).toBe('6');
    const owed = Array.from(grid?.querySelectorAll('.oy-stat--owed') ?? []);
    expect(owed.map((cell) => text(cell))).toEqual(
      Array(2).fill('Pending: attendance and learners served, with their sources'),
    );
  });

  it('draws no source line with sources hidden, and the Pending line with no figures', async () => {
    expect(
      (await renderToBody(FramedSourcesHidden)).querySelector('.oy-stat-grid .oy-source'),
    ).toBeNull();
    const empty = await renderToBody(FramedPending);
    expect(empty.querySelector('.oy-stat-grid')).toBeNull();
    expect(text(empty.querySelector('.oy-pend-line'))).toContain('the headline figures');
  });
});
