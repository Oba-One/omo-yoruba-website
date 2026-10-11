import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './ZoneGrid.stories';

const { Mosaic, Three, Five, Grid, List, Pending } = composeStories(stories);

describe('ZoneGrid', () => {
  it('draws the named zones in order, then placeholders up to the confirmed three', async () => {
    const grid = (await renderToBody(Mosaic)).querySelector('.oy-zones');
    expect(grid?.getAttribute('data-layout')).toBe('mosaic');
    const cards = Array.from(grid?.querySelectorAll('article.oy-zone') ?? []);
    expect(cards).toHaveLength(3);
    expect(cards.map((card) => text(card.querySelector('h3')) ?? null)).toEqual([
      'Ọjà Balógun',
      'Àgbàlá Ọmọde',
      null,
    ]);
    expect(cards.slice(2).every((card) => card.classList.contains('oy-zone--pending'))).toBe(true);
  });

  it('passes the layout to the tokens for five, grid and list', async () => {
    for (const [story, layout] of [
      [Five, 'five'],
      [Grid, 'grid'],
      [List, 'list'],
    ] as const) {
      const grid = (await renderToBody(story)).querySelector('.oy-zones');
      expect(grid?.getAttribute('data-layout')).toBe(layout);
    }
  });

  it('renders three placeholders when no zone exists', async () => {
    const grid = (await renderToBody(Pending)).querySelector('.oy-zones');
    expect(grid?.querySelectorAll('article.oy-zone--pending')).toHaveLength(3);
  });

  it('draws all three zones with no placeholder once the Studio names them', async () => {
    const grid = (await renderToBody(Three)).querySelector('.oy-zones');
    // The count the tokens' three-zone mosaic reads: the cards the block draws, placeholders included.
    expect(grid?.getAttribute('data-count')).toBe('3');
    expect(
      (await renderToBody(Mosaic)).querySelector('.oy-zones')?.getAttribute('data-count'),
    ).toBe('3');
    const cards = Array.from(grid?.querySelectorAll('article.oy-zone') ?? []);
    expect(cards.map((card) => text(card.querySelector('h3')))).toEqual([
      'Ọjà Balógun',
      'Àgbàlá Ọmọde',
      'Ẹgbẹ́ Ìbílẹ̀',
    ]);
    expect(grid?.querySelector('.oy-zone--pending')).toBeNull();
  });
});
