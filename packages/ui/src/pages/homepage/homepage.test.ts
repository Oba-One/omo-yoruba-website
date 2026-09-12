import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as gallery from './Gallery.stories';
import * as highlight from './Highlight.stories';
import * as involved from './Involved.stories';
import * as motion from './Motion.stories';
import * as newsletter from './Newsletter.stories';
import * as pattern from './Pattern.stories';
import * as season from './Season.stories';

const Season = composeStories(season);
const Highlight = composeStories(highlight);
const Gallery = composeStories(gallery);
const Involved = composeStories(involved);
const Newsletter = composeStories(newsletter);
const Pattern = composeStories(pattern);
const Motion = composeStories(motion);

describe('the homepage page-section stories', () => {
  it('season: the root carries the option and the band the matching edition', async () => {
    const auto = (await renderToBody(Season.Auto)).querySelector('.oy-home');
    expect(auto?.getAttribute('data-season')).toBe('auto');
    expect(text(auto?.querySelector('.oy-event-band h2'))).toBe('End-of-Year Gala 2026');
    const odunde = (await renderToBody(Season.Odunde)).querySelector('.oy-home');
    expect(odunde?.querySelector('.oy-event-band')?.getAttribute('data-kind')).toBe('festival');
  });

  it('highlight: the root attribute reaches the four program cards', async () => {
    const root = (await renderToBody(Highlight.Lessons)).querySelector('.oy-home');
    expect(root?.getAttribute('data-highlight')).toBe('school');
    expect(root?.querySelectorAll('[data-columns="4"] .oy-card')).toHaveLength(4);
    expect(root?.querySelector('.v2-prog--school')).not.toBeNull();
  });

  it('gallery: seven, five and three tiles', async () => {
    for (const [story, count] of [
      [Gallery.Seven, 7],
      [Gallery.Five, 5],
      [Gallery.Three, 3],
    ] as const) {
      const root = (await renderToBody(story)).querySelector('.oy-home');
      expect(root?.getAttribute('data-gallery')).toBe(String(count));
      expect(root?.querySelectorAll('figure.v2-mo')).toHaveLength(count);
    }
  });

  it('involved: two door cards or two path rows, one gold action either way', async () => {
    const doors = (await renderToBody(Involved.Doors)).querySelector('.oy-home');
    expect(doors?.querySelectorAll('.oy-card[data-door]')).toHaveLength(2);
    expect(doors?.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
    const rows = (await renderToBody(Involved.Rows)).querySelector('.oy-home');
    expect(rows?.querySelectorAll('.oy-takepart .oy-path')).toHaveLength(2);
    expect(rows?.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
  });

  it('newsletter: the footer block or the band, never both', async () => {
    const footer = (await renderToBody(Newsletter.Footer)).querySelector('.oy-home');
    expect(footer?.querySelector('.oy-footer-newsletter')).not.toBeNull();
    expect(footer?.querySelector('.oy-newsletter-band')).toBeNull();
    const band = (await renderToBody(Newsletter.Band)).querySelector('.oy-home');
    expect(band?.querySelector('.oy-newsletter-band')).not.toBeNull();
    expect(band?.querySelector('.oy-footer-newsletter')).toBeNull();
    expect(band?.querySelectorAll('oy-newsletter')).toHaveLength(1);
  });

  it('pattern and motion: the root attributes the tokens read', async () => {
    expect(
      (await renderToBody(Pattern.Subtle)).querySelector('.oy-home')?.getAttribute('data-pattern'),
    ).toBe('subtle');
    const off = (await renderToBody(Motion.Off)).querySelector('.oy-home');
    expect(off?.getAttribute('data-motion')).toBe('false');
    expect(off?.querySelector('.v2-kb')).toBeNull();
    const on = (await renderToBody(Motion.On)).querySelector('.oy-home');
    expect(on?.getAttribute('data-motion')).toBe('true');
    expect(on?.querySelector('.v2-kb')).not.toBeNull();
  });
});
