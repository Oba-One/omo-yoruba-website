import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './EventCard.stories';

const { Default, Gala, Pending } = composeStories(stories);

describe('EventCard', () => {
  it("draws the event page's photograph, kicker, name and line, and one quiet link to the page", async () => {
    const card = (await renderToBody(Default)).querySelector('.oy-event-card');
    expect(card?.getAttribute('data-event')).toBe('festival');
    expect(card?.querySelector('img.oy-card-media')?.getAttribute('alt')).toBe('');
    expect(text(card?.querySelector('.oy-kicker'))).toContain('The new year has arrived');
    expect(text(card?.querySelector('h3'))).toBe('Odunde Festival');
    expect(text(card?.querySelector('.oy-card-body > p:not(.oy-event-card-when)'))).toContain(
      'A day of Yoruba culture at Leimert Park',
    );
    const links = card?.querySelectorAll('a') ?? [];
    expect(links).toHaveLength(1);
    expect(links[0]?.getAttribute('href')).toBe('/odunde');
    expect(links[0]?.className).toContain('oy-btn--quiet');
    expect(text(links[0])).toContain('See the festival');
  });

  it('says when and where the next edition is only as far as the Studio holds them', async () => {
    const between = (await renderToBody(Default)).querySelector('.oy-event-card-when');
    expect([...(between?.children ?? [])].map((fact) => text(fact))).toEqual(['Leimert Park']);
    const gala = (await renderToBody(Gala)).querySelector('.oy-event-card');
    expect([...(gala?.querySelector('.oy-event-card-when')?.children ?? [])].map(text)).toEqual([
      'Saturday 28 November 2026',
      'Yorba Linda Community Center',
    ]);
    expect(text(gala?.querySelector('a'))).toContain('See the Gala');
    expect(gala?.querySelector('a')?.getAttribute('href')).toBe('/gala');
  });

  it("keeps the page's name and its link, and names the missing photograph", async () => {
    const card = (await renderToBody(Pending)).querySelector('.oy-event-card');
    expect(text(card?.querySelector('h3'))).toBe('Odunde Festival');
    expect(card?.querySelector('img.oy-card-media')).toBeNull();
    expect(text(card?.querySelector('.oy-event-card-placeholder'))).toContain(
      'a photograph of Odunde Festival',
    );
    expect(card?.querySelector('.oy-card-body > p')).toBeNull();
    expect(card?.querySelector('a')?.getAttribute('href')).toBe('/odunde');
    expect(card?.querySelector('.oy-event-card-when')).toBeNull();
    expect(card?.querySelector('.oy-kicker')).toBeNull();
  });
});
