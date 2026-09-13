import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './CreditLine.stories';

const { Unconfirmed, Confirmed, Pending, ConfirmedWithoutName } = composeStories(stories);

describe('CreditLine', () => {
  it('names the photographer with the chip until the credit is confirmed', async () => {
    const line = (await renderToBody(Unconfirmed)).querySelector('p.oy-credit-line');
    expect(text(line)).toBe(
      'Photographs: Red Carpet Media Pending: photographer credit to confirm',
    );
    expect(line?.querySelector('.oy-pend')).not.toBeNull();
  });

  it('drops the chip once confirmed, and shows it alone with no credit', async () => {
    const confirmed = (await renderToBody(Confirmed)).querySelector('p.oy-credit-line');
    expect(text(confirmed)).toBe('Photographs: Red Carpet Media.');
    expect(confirmed?.querySelector('.oy-pend')).toBeNull();
    const owed = (await renderToBody(Pending)).querySelector('p.oy-credit-line');
    expect(text(owed)).toBe('Photographs: Pending: photographer credit to confirm');
    // The registry lists only unconfirmed albums, so a confirmed one without a name shows nothing.
    expect((await renderToBody(ConfirmedWithoutName)).querySelector('.oy-credit-line')).toBeNull();
  });
});
