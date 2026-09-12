import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './EventBand.stories';

const { Gala, Odunde, Filled, Pending } = composeStories(stories);

describe('EventBand', () => {
  it('frames the Gala with its kicker and button and marks the missing date and venue', async () => {
    const band = (await renderToBody(Gala)).querySelector('.oy-event-band');
    expect(band?.getAttribute('data-kind')).toBe('gala');
    expect(band?.classList.contains('oy-dark')).toBe(true);
    expect(text(band?.querySelector('.oy-kicker'))).toBe('Coming up next');
    expect(text(band?.querySelector('h2'))).toBe('End-of-Year Gala 2026');
    const chips = Array.from(band?.querySelectorAll('.oy-band-line .oy-pend') ?? []).map(text);
    expect(chips).toEqual(['Pending: the venue', 'Pending: the date']);
    const button = band?.querySelector('a.oy-btn');
    expect(button?.getAttribute('href')).toBe('/gala');
    expect(text(button)).toContain('Tickets & tables');
    expect(band?.querySelectorAll('.oy-pattern--chevron')).toHaveLength(2);
    expect(band?.querySelectorAll('.oy-pattern--motif')).toHaveLength(2);
  });

  it('frames the festival with the Ọdúndé kicker, the venue and its own chip wording', async () => {
    const band = (await renderToBody(Odunde)).querySelector('.oy-event-band');
    expect(band?.getAttribute('data-kind')).toBe('festival');
    expect(text(band?.querySelector('.oy-kicker'))).toBe('Ọdúndé•The new year has arrived');
    expect(text(band?.querySelector('.oy-band-line'))).toContain('Leimert Park');
    expect(text(band?.querySelector('.oy-band-line .oy-pend'))).toBe('Pending: the date and hours');
    expect(band?.querySelector('a.oy-btn')?.getAttribute('href')).toBe('/odunde');
    // After the date's chip the summary starts its own line; no generic band class on the root.
    expect(band?.querySelector('.oy-band-summary--apart')?.textContent).toBe(
      'One village, four zones, one family.',
    );
    expect(band?.classList.contains('oy-band')).toBe(false);
  });

  it('writes the date in words in Los Angeles time and appends the summary', async () => {
    const line = (await renderToBody(Filled)).querySelector('.oy-band-line');
    // One sentence after the date, as the prototype writes it.
    expect(text(line)).toContain('Saturday 12 June 2027. One village, four zones, one family.');
    expect(line?.querySelector('.oy-band-summary--apart')).toBeNull();
    expect(line?.querySelector('.oy-pend')).toBeNull();
  });

  it('renders the Pending line when there is no edition', async () => {
    const band = (await renderToBody(Pending)).querySelector('.oy-event-band');
    expect(band?.querySelector('h2')).toBeNull();
    expect(text(band?.querySelector('.oy-pend-line'))).toContain('the lead event');
  });
});
