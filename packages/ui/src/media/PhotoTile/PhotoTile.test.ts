import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './PhotoTile.stories';

const { Default, EnglishOnly, NoCaption, Pending } = composeStories(stories);

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
});
