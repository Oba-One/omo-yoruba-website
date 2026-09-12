import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Hero.stories';

const { Default, MotionOff, Pending } = composeStories(stories);

describe('Hero', () => {
  it('renders the photo, the scrim, the kicker, one H1, the sub and the two actions', async () => {
    const body = await renderToBody(Default);
    const hero = body.querySelector('header.v2-hero.oy-dark');
    expect(hero).not.toBeNull();
    const img = hero?.querySelector('img.oy-hero-photo');
    expect(img?.getAttribute('loading')).toBe('eager');
    expect(img?.getAttribute('fetchpriority')).toBe('high');
    expect(img?.classList.contains('v2-kb')).toBe(true);
    expect(hero?.querySelector('.v2-hero-scrim')?.getAttribute('aria-hidden')).toBe('true');
    expect(text(hero?.querySelector('.oy-kicker'))).toBe('Ẹ káàbọ̀•Welcome');
    expect(hero?.querySelectorAll('h1')).toHaveLength(1);
    expect(text(hero?.querySelector('h1'))).toBe('Yoruba culture, alive in Southern California');
    expect(text(hero?.querySelector('.oy-hero-sub'))).toBe(
      'Language, festival, family. Since 1997.',
    );
    const buttons = hero?.querySelectorAll('.v2-hero-cta .oy-btn') ?? [];
    expect(buttons).toHaveLength(2);
    expect(buttons[0]?.className).toContain('oy-btn--primary');
    expect(buttons[0]?.getAttribute('href')).toBe('/odunde');
    expect(buttons[1]?.className).toContain('oy-btn--secondary');
    expect(text(hero?.querySelector('.oy-hero-blessing [lang="yo"]'))).toBe('Oòdúà á gbè wá o!');
    expect(hero?.querySelector('.oy-divider-asoke')).not.toBeNull();
  });

  it('drops the breathing and the rise when motion is off', async () => {
    const hero = (await renderToBody(MotionOff)).querySelector('header');
    expect(hero?.querySelector('img.v2-kb')).toBeNull();
    expect(hero?.querySelector('.v2-rise')).toBeNull();
  });

  it('keeps one H1 and names the photograph as Pending when the Studio holds nothing', async () => {
    const hero = (await renderToBody(Pending)).querySelector('header');
    expect(hero?.querySelector('img')).toBeNull();
    expect(text(hero?.querySelector('.oy-hero-pending'))).toBe('Pending: the hero photograph');
    expect(hero?.querySelectorAll('h1')).toHaveLength(1);
    expect(text(hero?.querySelector('h1 .oy-pend'))).toBe('Pending: the hero heading');
    expect(hero?.querySelector('.oy-btn')).toBeNull();
  });
});
