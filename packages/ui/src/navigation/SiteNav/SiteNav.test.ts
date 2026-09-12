import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './SiteNav.stories';

const { Default, OnOdunde, OnPrograms, OnLessons, MobileMenuOpen } = composeStories(stories);

describe('SiteNav', () => {
  it('renders the five items, the small gold Donate link and a closed menu', async () => {
    const body = await renderToBody(Default);
    const links = Array.from(body.querySelectorAll('.oy-nav-links a, .oy-nav-links button')).map(
      (el) => text(el),
    );
    expect(links).toEqual([
      'Events',
      'Ọdúndé Festival',
      'End-of-Year Gala',
      'Programs',
      'Get Involved',
      'Impact',
      'Our Story',
    ]);
    const donate = body.querySelector('a.oy-nav-donate');
    expect(donate?.getAttribute('href')).toBe('/donate#give');
    expect(donate?.hasAttribute('data-give')).toBe(true);
    expect(donate?.className.split(' ')).toContain('oy-btn--sm');
    expect(body.querySelector('dialog.oy-nav-menu')?.hasAttribute('open')).toBe(false);
    expect(body.querySelector('.oy-nav-burger')?.getAttribute('aria-expanded')).toBe('false');
    expect(body.querySelector('[aria-current="page"]')).toBeNull();
    expect(body.querySelector('.oy-nav')?.getAttribute('data-page')).toBe('');
  });

  it('marks the Events trigger and the festival link current on /odunde', async () => {
    const body = await renderToBody(OnOdunde);
    expect(body.querySelector('.oy-nav-drop')?.getAttribute('data-current')).toBe('true');
    expect(body.querySelector('.oy-nav')?.getAttribute('data-page')).toBe('odunde');
    const current = Array.from(body.querySelectorAll('[aria-current="page"]')).map((el) =>
      el.getAttribute('href'),
    );
    expect(current).toEqual(['/odunde', '/odunde']);
  });

  it('marks the exact Programs link current and keeps Programs lit on a child page', async () => {
    const programs = await renderToBody(OnPrograms);
    expect(
      programs.querySelector('.oy-nav-links a[href="/programs"]')?.getAttribute('aria-current'),
    ).toBe('page');
    const lessons = await renderToBody(OnLessons);
    expect(lessons.querySelector('.oy-nav')?.getAttribute('data-page')).toBe('school');
    expect(lessons.querySelector('[aria-current="page"]')).toBeNull();
  });

  it('flattens the links in the mobile menu with Events as a group label and Donate last', async () => {
    const body = await renderToBody(MobileMenuOpen);
    const menu = body.querySelector('dialog.oy-nav-menu');
    expect(menu?.hasAttribute('open')).toBe(true);
    expect(menu?.getAttribute('aria-label')).toBe('Menu');
    expect(text(menu?.querySelector('.oy-nav-group'))).toBe('Events');
    const labels = Array.from(menu?.querySelectorAll('a') ?? []).map((a) => text(a));
    expect(labels).toEqual([
      'Ọdúndé Festival',
      'End-of-Year Gala',
      'Programs',
      'Get Involved',
      'Impact',
      'Our Story',
      'Donate',
    ]);
    expect(menu?.querySelector('.oy-nav-close')?.getAttribute('aria-label')).toBe('Close menu');
    expect(body.querySelector('.oy-nav-burger')?.getAttribute('aria-expanded')).toBe('true');
  });
});
