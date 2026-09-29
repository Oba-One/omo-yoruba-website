import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './CreditLine.stories';

const {
  Unconfirmed,
  Confirmed,
  Pending,
  ConfirmedWithoutName,
  Inline,
  OnDark,
  Linked,
  UnsafeLink,
} = composeStories(stories);

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

  it('sets itself inside a line of text as a span', async () => {
    const body = await renderToBody(Inline);
    expect(body.querySelector('p.oy-credit-line')).toBeNull();
    const line = body.querySelector('span.oy-credit-line');
    expect(line?.classList.contains('oy-credit-line--inline')).toBe(true);
    expect(text(line)).toBe(
      'Photographs: Red Carpet Media Pending: photographer credit to confirm',
    );
  });

  it("sits in the dark scope with its chip, as the Lightbox's bar sets it", async () => {
    const body = await renderToBody(OnDark);
    expect(body.querySelector('.oy-dark span.oy-credit-line .oy-pend')).not.toBeNull();
  });

  it("links the name to the photographer's page, the full stop outside the link (ADR 0046)", async () => {
    const line = (await renderToBody(Linked)).querySelector('p.oy-credit-line');
    expect(text(line)).toBe('Photographs: Red Carpet Films.');
    const link = line?.querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://www.youtube.com/@redcarpetfilmshollywood');
    expect(text(link)).toBe('Red Carpet Films');
  });

  it('shows the name without a link for an address the site does not link', async () => {
    const line = (await renderToBody(UnsafeLink)).querySelector('p.oy-credit-line');
    expect(text(line)).toBe('Photographs: Red Carpet Films.');
    expect(line?.querySelector('a')).toBeNull();
  });
});
