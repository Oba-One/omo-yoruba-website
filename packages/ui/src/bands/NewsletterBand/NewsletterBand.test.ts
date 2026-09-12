import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './NewsletterBand.stories';

const { Default, Success, Pending } = composeStories(stories);

describe('NewsletterBand', () => {
  it('renders the dark band with the settings copy and the band form', async () => {
    const band = (await renderToBody(Default)).querySelector('#subscribe.oy-newsletter.oy-dark');
    expect(band?.querySelector('.v2-dots--drift')?.getAttribute('aria-hidden')).toBe('true');
    expect(text(band?.querySelector('h2'))).toBe('Festival news and updates, in your inbox');
    expect(text(band?.querySelector('.oy-newsletter-copy p'))).toContain('Once or twice a month');
    const form = band?.querySelector('oy-newsletter');
    expect(form?.getAttribute('data-variant')).toBe('band');
    expect(form?.querySelector('input[type="email"]')?.getAttribute('id')).toBe(
      'oy-newsletter-band',
    );
  });

  it('carries the form state through and names a missing title', async () => {
    expect(text((await renderToBody(Success)).querySelector('button[type="submit"]'))).toBe(
      'Ẹ ṣé! ✓',
    );
    expect(text((await renderToBody(Pending)).querySelector('h2 .oy-pend'))).toBe(
      'Pending: the newsletter title',
    );
  });
});
