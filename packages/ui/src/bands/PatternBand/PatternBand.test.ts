import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody } from '../../test/stories';
import * as stories from './PatternBand.stories';

const { Default, DotsStronger, ChevronFlipped, Motif, Batik } = composeStories(stories);

describe('PatternBand', () => {
  it('is the àdìrẹ dot field by default, decorative, at the handoff opacity', async () => {
    const body = await renderToBody(Default);
    const band = body.querySelector('.oy-pattern');
    expect(band?.classList.contains('oy-pattern--dots')).toBe(true);
    expect(band?.classList.contains('v2-dots')).toBe(true);
    expect(band?.getAttribute('aria-hidden')).toBe('true');
    expect(band?.hasAttribute('style')).toBe(false);
  });

  it('takes an opacity override as an inline style that beats the layer default', async () => {
    const body = await renderToBody(DotsStronger);
    expect(body.querySelector('.oy-pattern--dots')?.getAttribute('style')).toBe('opacity: 0.13');
  });

  it('flips the chevron row for the bottom edge of a band', async () => {
    const body = await renderToBody(ChevronFlipped);
    expect(body.querySelector('.oy-pattern--chevron.oy-pattern--flip')).not.toBeNull();
  });

  it('reuses the interaction layer classes and never points into the handoff', async () => {
    expect(
      (await renderToBody(Motif)).querySelector('.oy-pattern--motif.v2-motif.v2-motif-col'),
    ).not.toBeNull();
    expect((await renderToBody(Batik)).querySelector('.oy-pattern--batik.v2-batik')).not.toBeNull();
    for (const story of [Default, Motif, Batik]) {
      const body = await renderToBody(story);
      expect(body.innerHTML).not.toContain('docs/design');
      expect(body.innerHTML).not.toContain('images/patterns');
    }
  });
});
