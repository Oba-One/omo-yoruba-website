import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './TicketTiers.stories';

const {
  Columns,
  Rows,
  One,
  OneOwed,
  NoLink,
  Pending,
  PendingWithZeffyForm,
  PendingWithLink,
  TableOnlyWithZeffyForm,
} = composeStories(stories);

const variants = (body: HTMLElement) =>
  [...body.querySelectorAll('.oy-tiers > article')].map((card) =>
    card.getAttribute('data-variant'),
  );

describe('TicketTiers', () => {
  it('draws the tiers in order as columns, the featured tier with the one gold button', async () => {
    const body = await renderToBody(Columns);
    expect(body.querySelector('.oy-tiers')?.getAttribute('data-layout')).toBe('columns');
    expect(variants(body)).toEqual(['buyNow', 'buyNow', 'enquiry']);
    expect(body.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
    expect(body.querySelector('.oy-tier--featured .oy-btn--primary')).not.toBeNull();
  });

  it('takes the rows layout', async () => {
    const body = await renderToBody(Rows);
    expect(body.querySelector('.oy-tiers')?.getAttribute('data-layout')).toBe('rows');
  });

  it('shows the link chip on every buy-now tier while the edition holds no link', async () => {
    const body = await renderToBody(NoLink);
    expect(
      body.querySelectorAll('.oy-tier[data-variant="buyNow"] .oy-tier-owed--action'),
    ).toHaveLength(2);
    expect(
      body.querySelector('.oy-tier[data-variant="enquiry"] a[data-enquiry="table"]'),
    ).not.toBeNull();
    expect(body.querySelectorAll('.oy-btn--primary')).toHaveLength(0);
  });

  it('shows the Pending line with no tiers', async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('.oy-tiers')).toBeNull();
    expect(text(body.querySelector('.oy-tiers-owed .oy-pend-line'))).toContain(
      'three prices and what each includes',
    );
  });

  it('lays a lone tier across the width and gives it the gold button when it sells the seat', async () => {
    const body = await renderToBody(One);
    const block = body.querySelector('.oy-tiers');
    expect(block?.getAttribute('data-count')).toBe('1');
    const button = block?.querySelector('.oy-tier a.oy-btn');
    expect(button?.className).toContain('oy-btn--primary');
    expect(button?.hasAttribute('data-tickets')).toBe(true);
    expect(body.querySelectorAll('.oy-btn--primary')).toHaveLength(1);
    // Still owed, the lone tier keeps its three parts: the price, the includes and the link as chips.
    const owed = (await renderToBody(OneOwed)).querySelector('.oy-tiers[data-count="1"] .oy-tier');
    expect(owed?.querySelectorAll('.oy-pend')).toHaveLength(3);
    expect(owed?.querySelector('.oy-btn')).toBeNull();
    // Three tiers keep their columns, and a lone table tier leaves the gold to the ticket button.
    expect(
      (await renderToBody(Columns)).querySelector('.oy-tiers')?.getAttribute('data-count'),
    ).toBe('3');
    const table = await renderToBody(TableOnlyWithZeffyForm);
    expect(table.querySelector('.oy-tier .oy-btn--primary')).toBeNull();
    expect(table.querySelector('.oy-tiers-tickets a.oy-btn--primary')).not.toBeNull();
  });

  it("draws the block's own Get tickets button while no card carries the ticket link", async () => {
    // No tiers, a Zeffy ticket form: the Pending line, then the button that opens the Tickets Dialog.
    const owed = await renderToBody(PendingWithZeffyForm);
    expect(owed.querySelector('.oy-tiers-owed .oy-pend-line')).not.toBeNull();
    const trigger = owed.querySelector('.oy-tiers-tickets a.oy-btn--primary');
    expect(trigger?.hasAttribute('data-tickets')).toBe(true);
    expect(trigger?.getAttribute('href')).toBe('https://www.zeffy.com/ticketing/a-gala');
    expect(text(owed.querySelector('.oy-tiers-tickets .oy-button-row-note'))).toBe(
      'Opens the ticket form on this page.',
    );
    // No tiers, any other link: a new tab, and a notice that names no seller.
    const linked = await renderToBody(PendingWithLink);
    const link = linked.querySelector('.oy-tiers-tickets a.oy-btn');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.hasAttribute('data-tickets')).toBe(false);
    expect(text(linked.querySelector('.oy-tiers-tickets .oy-button-row-note'))).toBe(
      'Opens in a new tab.',
    );
    // Only the table tier: its card opens the enquiry, so the ticket form still needs the block's button.
    const table = await renderToBody(TableOnlyWithZeffyForm);
    expect(table.querySelectorAll('.oy-tier')).toHaveLength(1);
    expect(table.querySelector('.oy-tiers-tickets a[data-tickets]')).not.toBeNull();
  });

  it('leaves the ticket link to the cards once a buy-now tier is listed, and draws nothing without a link', async () => {
    expect((await renderToBody(Columns)).querySelector('.oy-tiers-tickets')).toBeNull();
    expect((await renderToBody(Pending)).querySelector('.oy-tiers-tickets')).toBeNull();
  });
});
