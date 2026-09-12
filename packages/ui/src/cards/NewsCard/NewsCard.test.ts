import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import { monthYear } from './date';
import * as stories from './NewsCard.stories';

const { Default, WithLink, WithKicker, TitleOnly } = composeStories(stories);

describe('NewsCard', () => {
  it('writes the month and year, the title and the summary, with no link by default', async () => {
    const card = (await renderToBody(Default)).querySelector('.oy-card');
    expect(text(card?.querySelector('.oy-card-date'))).toBe('July 2026');
    expect(text(card?.querySelector('h3'))).toBe('Odunde 2026: the recap');
    expect(text(card?.querySelector('p'))).toContain('Four zones, one village.');
    expect(card?.querySelector('a')).toBeNull();
    expect(monthYear('2026-11-01')).toBe('November 2026');
    expect(monthYear('nope')).toBeUndefined();
  });

  it('adds Read more only with an href, and the kicker when the post has one', async () => {
    const link = (await renderToBody(WithLink)).querySelector('a.oy-btn--quiet');
    expect(link?.getAttribute('href')).toBe('/news/odunde-2026-recap');
    expect(text(link)).toContain('Read more');
    expect(text((await renderToBody(WithKicker)).querySelector('.oy-kicker'))).toBe(
      'Ẹ̀kọ́ èdè•Lessons',
    );
  });

  it('shows the title alone when the post has no date or summary yet', async () => {
    const card = (await renderToBody(TitleOnly)).querySelector('.oy-card');
    expect(text(card?.querySelector('h3'))).toBe('End-of-Year Gala');
    expect(card?.querySelector('.oy-card-date')).toBeNull();
    expect(card?.querySelector('p')).toBeNull();
    expect(card?.querySelector('.oy-pend')).toBeNull();
  });
});
