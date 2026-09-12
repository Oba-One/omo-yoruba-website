import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Card.stories';

const { Default, WithPhoto, FramedPhoto, WithKicker, AsFigure, NoRule } = composeStories(stories);

describe('Card', () => {
  it('renders the card shell with the body, the title and the woven rule', async () => {
    const body = await renderToBody(Default);
    const card = body.querySelector('article.oy-card.v2-card');
    expect(card).not.toBeNull();
    expect(text(card?.querySelector('.oy-card-body h3'))).toBe('Program card');
    expect(card?.querySelector('.v2-rule')?.getAttribute('aria-hidden')).toBe('true');
    expect(card?.querySelector('img')).toBeNull();
  });

  it('puts the photo above the body, lazy, with its alt and a fixed height', async () => {
    const img = (await renderToBody(WithPhoto)).querySelector('img.oy-card-media');
    expect(img?.getAttribute('alt')).toContain('Two women in gèlè');
    expect(img?.getAttribute('loading')).toBe('lazy');
    expect(img?.getAttribute('decoding')).toBe('async');
    expect(img?.getAttribute('style')).toBe('height: 170px');
  });

  it('frames a photo by its hotspot', async () => {
    const img = (await renderToBody(FramedPhoto)).querySelector('img.oy-card-media');
    expect(img?.getAttribute('style')).toBe('height: 170px; object-position: 60% 35%');
  });

  it('renders the bilingual kicker above the title', async () => {
    const body = await renderToBody(WithKicker);
    expect(text(body.querySelector('.oy-kicker'))).toBe('Ẹ̀kọ́ èdè•Lessons');
  });

  it('can be a figure without a title and can drop the rule', async () => {
    const figure = (await renderToBody(AsFigure)).querySelector('figure.oy-card');
    expect(figure).not.toBeNull();
    expect(figure?.querySelector('h3')).toBeNull();
    expect((await renderToBody(NoRule)).querySelector('.v2-rule')).toBeNull();
  });
});
