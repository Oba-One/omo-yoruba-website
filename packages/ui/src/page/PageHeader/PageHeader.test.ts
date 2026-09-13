import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './PageHeader.stories';

const { Photo, Slim, MixedFacts, OneAction, PendingPhoto, PendingHeading, Still } =
  composeStories(stories);

describe('PageHeader', () => {
  it('lays the copy over the photograph in the dark scope, with the scrim, dots and rule', async () => {
    const header = (await renderToBody(Photo)).querySelector('header.oy-phead');
    expect(header?.classList.contains('oy-phead--photo')).toBe(true);
    expect(header?.classList.contains('oy-dark')).toBe(true);
    expect(header?.id).toBe('top');
    const img = header?.querySelector('.oy-phead-media img');
    expect(img?.getAttribute('alt')).toBe('');
    expect(img?.getAttribute('fetchpriority')).toBe('high');
    expect(img?.classList.contains('v2-kb')).toBe(true);
    expect(header?.querySelector('.oy-phead-scrim')).not.toBeNull();
    expect(header?.querySelector('.v2-dots')).not.toBeNull();
    expect(header?.querySelector('.oy-phead-rule')).not.toBeNull();
    expect(text(header?.querySelector('.oy-kicker'))).toBe('Ọdúndé•The new year has arrived');
    expect(header?.querySelectorAll('h1')).toHaveLength(1);
    expect(text(header?.querySelector('h1'))).toBe('Odunde Festival');
  });

  it('gives the first action the gold and the second the outline, each opening what it names', async () => {
    const header = (await renderToBody(Photo)).querySelector('header.oy-phead');
    const buttons = header?.querySelectorAll('.oy-phead-cta .oy-btn');
    expect(buttons).toHaveLength(2);
    expect(buttons?.[0]?.classList.contains('oy-btn--primary')).toBe(true);
    expect(buttons?.[0]?.getAttribute('href')).toBe('#plan');
    expect(buttons?.[1]?.classList.contains('oy-btn--secondary')).toBe(true);
    expect(buttons?.[1]?.getAttribute('data-enquiry')).toBe('vendor');
    const one = (await renderToBody(OneAction)).querySelectorAll('.oy-phead-cta .oy-btn');
    expect(one).toHaveLength(1);
  });

  it('writes each missing fact as its chip, joined by hidden dots', async () => {
    const facts = (await renderToBody(Photo)).querySelector('.oy-phead-facts');
    expect(Array.from(facts?.querySelectorAll('.oy-pend') ?? []).map(text)).toEqual([
      'Pending: the date',
      'Pending: the hours',
      'Pending: the cost',
    ]);
    expect(facts?.querySelectorAll('.oy-phead-dot[aria-hidden="true"]')).toHaveLength(2);
    const mixed = (await renderToBody(MixedFacts)).querySelector('.oy-phead-facts');
    expect(text(mixed)).toContain('Leimert Park');
  });

  it('sits on paper without a photograph when slim', async () => {
    const header = (await renderToBody(Slim)).querySelector('header.oy-phead');
    expect(header?.classList.contains('oy-phead--slim')).toBe(true);
    expect(header?.classList.contains('oy-dark')).toBe(false);
    expect(header?.querySelector('img')).toBeNull();
    expect(header?.querySelector('.oy-phead-rule')).toBeNull();
  });

  it('names a missing photograph and a missing heading', async () => {
    const photo = (await renderToBody(PendingPhoto)).querySelector('.oy-phead-media');
    expect(photo?.querySelector('img')).toBeNull();
    expect(text(photo?.querySelector('.oy-pend'))).toBe('Pending: the header photograph');
    const h1 = (await renderToBody(PendingHeading)).querySelector('h1');
    expect(text(h1)).toBe('Pending: the page heading');
    const still = (await renderToBody(Still)).querySelector('.oy-phead-media img');
    expect(still?.classList.contains('v2-kb')).toBe(false);
  });
});
