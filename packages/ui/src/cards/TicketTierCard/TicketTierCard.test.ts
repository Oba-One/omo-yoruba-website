import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './TicketTierCard.stories';

const { BuyNow, BuyNowNoLink, Featured, Enquiry, Pending } = composeStories(stories);

describe('TicketTierCard', () => {
  it('opens Eventbrite in a new tab with the notice on the card', async () => {
    const card = (await renderToBody(BuyNow)).querySelector('article.oy-tier');
    expect(card?.getAttribute('data-variant')).toBe('buyNow');
    expect(text(card?.querySelector('h3.oy-tier-name'))).toBe('[ A single seat ]');
    expect(text(card?.querySelector('.oy-tier-price'))).toBe('[ Price ]');
    expect(text(card?.querySelector('.oy-tier-note'))).toBe('Opens Eventbrite in a new tab.');
    const link = card?.querySelector('a.oy-btn');
    expect(link?.getAttribute('href')).toBe('https://www.eventbrite.com');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener');
    expect(link?.className).toContain('oy-btn--secondary');
    expect(text(link)).toContain('Get tickets');
  });

  it('shows the registry chip where the button goes while the edition holds no link', async () => {
    const card = (await renderToBody(BuyNowNoLink)).querySelector('article.oy-tier');
    expect(card?.querySelector('a.oy-btn')).toBeNull();
    expect(card?.querySelector('.oy-tier-note')).toBeNull();
    expect(text(card?.querySelector('.oy-tier-owed--action .oy-pend'))).toBe(
      'Pending: the Eventbrite link',
    );
  });

  it('rings the featured tier and gives it the gold button', async () => {
    const card = (await renderToBody(Featured)).querySelector('article.oy-tier');
    expect(card?.classList.contains('oy-tier--featured')).toBe(true);
    expect(card?.querySelector('a.oy-btn--primary')).not.toBeNull();
  });

  it('opens the table enquiry from the table tier, with the invoicing line', async () => {
    const card = (await renderToBody(Enquiry)).querySelector('article.oy-tier');
    expect(card?.getAttribute('data-variant')).toBe('enquiry');
    expect(text(card?.querySelector('.oy-tier-note'))).toBe(
      'Placed by hand and invoiced. Nothing is charged on this page.',
    );
    const button = card?.querySelector('a.oy-btn');
    expect(button?.getAttribute('data-enquiry')).toBe('table');
    expect(button?.hasAttribute('target')).toBe(false);
    expect(text(button)).toContain('Reserve a table');
  });

  it('names the price and the includes the Studio still owes', async () => {
    const card = (await renderToBody(Pending)).querySelector('article.oy-tier');
    expect(text(card?.querySelector('.oy-tier-price .oy-pend'))).toBe('Pending: the price');
    expect(card?.querySelector('ul.oy-incl')).toBeNull();
    expect(text(card?.querySelector('.oy-tier-owed .oy-pend'))).toBe(
      'Pending: what the ticket includes',
    );
  });
});
