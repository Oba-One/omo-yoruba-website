import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './StatStrip.stories';

const { Four, Six, WithSources, WithOneSource, Pending } = composeStories(stories);

describe('StatStrip', () => {
  it('renders the four figures with their labels and the corner fields', async () => {
    const band = (await renderToBody(Four)).querySelector('.oy-stat-band');
    expect(band?.querySelectorAll('.v2-corner')).toHaveLength(2);
    const strip = band?.querySelector('.oy-stat-strip');
    expect(strip?.getAttribute('data-columns')).toBe('4');
    const stats = Array.from(strip?.querySelectorAll('.oy-stat') ?? []);
    expect(stats.map((s) => text(s.querySelector('b')))).toEqual(['29', '3,000+', '4', '9']);
    expect(text(stats[0]?.querySelector('span'))).toBe('years serving Southern California');
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
});
