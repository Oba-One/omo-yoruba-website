import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Logo.stories';

const { Default, Mark, OnDark } = composeStories(stories);
const name = 'Omo Yorùbá of Southern California';

describe('Logo', () => {
  it('is the mark beside the two-line wordmark, linked home, by default', async () => {
    const body = await renderToBody(Default);
    const logo = body.querySelector('a.oy-logo');
    expect(logo?.getAttribute('href')).toBe('/');
    const mark = logo?.querySelector('img.oy-logo-img');
    expect(mark?.getAttribute('src')).toContain('logo-mark');
    expect(mark?.getAttribute('alt')).toBe('');
    expect(mark?.getAttribute('aria-hidden')).toBe('true');
    const wordmark = logo?.querySelector('.oy-logo-text');
    expect(text(wordmark)).toBe(name);
    expect(wordmark?.querySelector('.oy-logo-sub')?.textContent).toBe('of Southern California');
  });

  it('names itself through the image when only the mark shows', async () => {
    const body = await renderToBody(Mark);
    const logo = body.querySelector('.oy-logo');
    expect(logo?.hasAttribute('aria-label')).toBe(false);
    expect(logo?.querySelector('.oy-logo-text')).toBeNull();
    const mark = logo?.querySelector('img.oy-logo-img');
    expect(mark?.getAttribute('alt')).toBe(name);
    expect(mark?.hasAttribute('aria-hidden')).toBe(false);
  });

  it('uses the light lockup image with the full name as alt on dark grounds', async () => {
    const body = await renderToBody(OnDark);
    const image = body.querySelector('.oy-dark img.oy-logo-lockup');
    expect(image?.getAttribute('src')).toContain('logo-lockup-light');
    expect(image?.getAttribute('alt')).toBe(name);
    expect(body.querySelector('.oy-logo-img')).toBeNull();
    expect(body.querySelector('a.oy-logo')).toBeNull();
  });
});
