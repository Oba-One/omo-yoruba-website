import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './PhotoTile.stories';

const { Default, Framed, EnglishOnly, NoCaption, Pending, Figure } = composeStories(stories);

describe('PhotoTile', () => {
  it('renders the photo lazily with the Yoruba-first caption and the gold dot', async () => {
    const tile = (await renderToBody(Default)).querySelector('figure.v2-mo');
    const img = tile?.querySelector('img');
    expect(img?.getAttribute('loading')).toBe('lazy');
    expect(img?.getAttribute('alt')).toContain('Women in white');
    expect(text(tile?.querySelector('figcaption [lang="yo"]'))).toBe('Ọdúndé');
    expect(tile?.querySelector('.oy-photo-tile-dot')?.getAttribute('aria-hidden')).toBe('true');
    expect(text(tile?.querySelector('figcaption'))).toBe('Ọdúndé • Festival day at Leimert Park');
  });

  it('frames a photo by its hotspot and leaves a plain URL at the centre', async () => {
    const framed = (await renderToBody(Framed)).querySelector('figure.v2-mo img');
    expect(framed?.getAttribute('style')).toBe('object-position: 50% 35%');
    const plain = (await renderToBody(Default)).querySelector('figure.v2-mo img');
    expect(plain?.hasAttribute('style')).toBe(false);
  });

  it('keeps a single caption plain and can have none', async () => {
    const caption = (await renderToBody(EnglishOnly)).querySelector('figcaption');
    expect(caption?.querySelector('[lang="yo"]')).toBeNull();
    expect(text(caption)).toBe('Festival day');
    expect((await renderToBody(NoCaption)).querySelector('figcaption')).toBeNull();
  });

  it('shows the àdìrẹ placeholder naming the missing photograph', async () => {
    const tile = (await renderToBody(Pending)).querySelector('figure.v2-mo');
    expect(tile?.querySelector('img')).toBeNull();
    const placeholder = tile?.querySelector('.oy-ph--adire');
    expect(placeholder?.getAttribute('aria-label')).toBe('Placeholder for a festival photograph');
  });

  it('frames the event page figure and marks no Yoruba where the caption has none', async () => {
    const figure = (await renderToBody(Figure)).querySelector('figure.v2-mo');
    expect(figure?.classList.contains('oy-photo-tile--figure')).toBe(true);
    expect(figure?.querySelector('img')?.getAttribute('style')).toBe('object-position: 45% 50%');
    expect(figure?.querySelector('figcaption [lang]')).toBeNull();
    expect(text(figure?.querySelector('figcaption'))).toBe('Festival day • Leimert Park');
  });
});
