import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './PartnerCards.stories';

const { Default, WithLines, Seven, Logos, Pending } = composeStories(stories);

describe('PartnerCards', () => {
  it('draws a card per partner: its kind as the kicker, its name, and a link worded by its address', async () => {
    const cards = [...(await renderToBody(Default)).querySelectorAll('.oy-partner-card')];
    expect(cards.map((card) => text(card.querySelector('h3')))).toEqual([
      'Association of Moremi Women',
      'STEMnetics',
      'WEFA',
    ]);
    expect(cards.map((card) => text(card.querySelector('.oy-kicker')))).toEqual([
      'Partner',
      'Partner',
      'Sponsor',
    ]);
    // Only the partner with a site has a link, and its words are the site's address.
    expect(cards[0]?.querySelector('a')).toBeNull();
    const link = cards[2]?.querySelector('a.oy-btn--quiet');
    expect(link?.getAttribute('href')).toBe('https://wefa.world');
    expect(link?.getAttribute('rel')).toBe('noopener');
    expect(text(link)).toContain('WEFA: wefa.world');
  });

  it("adds the Studio's line when a partner has one, and no empty paragraph when it has none", async () => {
    const lined = (await renderToBody(WithLines)).querySelectorAll(
      '.oy-partner-card .oy-card-body > p',
    );
    expect(lined).toHaveLength(3);
    expect(
      (await renderToBody(Default)).querySelector('.oy-partner-card .oy-card-body > p'),
    ).toBeNull();
  });

  it('sets the cards three across with a short last row in the middle', async () => {
    const grid = (await renderToBody(Seven)).querySelector('.oy-card-grid.oy-partner-cards');
    expect(grid?.getAttribute('data-columns')).toBe('3');
    expect(grid?.hasAttribute('data-center')).toBe(true);
    expect(grid?.querySelectorAll('.oy-partner-card')).toHaveLength(7);
    // A partner of no known kind wears no kicker.
    expect(grid?.querySelectorAll('.oy-kicker')).toHaveLength(6);
  });

  it('leads a card with its logo, and leaves out a link that is not a web address', async () => {
    const cards = [...(await renderToBody(Logos)).querySelectorAll('.oy-partner-card')];
    expect(cards[0]?.querySelector('img.oy-partner-card-logo')).not.toBeNull();
    expect(cards[1]?.querySelector('a')).toBeNull();
    // An address with a host and another scheme has passed the action guard; a card still refuses it.
    expect(cards[2]?.querySelector('a')).toBeNull();
  });

  it("shows the registry's Pending line with no partners", async () => {
    const body = await renderToBody(Pending);
    expect(text(body.querySelector('.oy-partner-cards .oy-pend-line'))).toContain(
      'partner and funder names',
    );
    expect(body.querySelector('.oy-partner-card')).toBeNull();
  });
});
