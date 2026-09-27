import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './TicketTiers.stories';

const { Columns, Rows, NoLink, Pending } = composeStories(stories);

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
});
