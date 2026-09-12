import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './NewsletterForm.stories';

const { Default, Busy, Success, WithError, OnDark } = composeStories(stories);

describe('NewsletterForm', () => {
  it('posts the address without JavaScript, with a hidden label and a honeypot out of reach', async () => {
    const body = await renderToBody(Default);
    const form = body.querySelector('form');
    const input = body.querySelector<HTMLInputElement>('input[type="email"]');
    const label = body.querySelector('label[for="oy-newsletter"]');
    const honeypot = body.querySelector<HTMLInputElement>('input[name="website"]');
    expect(form?.getAttribute('method')).toBe('POST');
    expect(form?.hasAttribute('novalidate')).toBe(true);
    expect(input?.getAttribute('name')).toBe('email');
    expect(input?.getAttribute('aria-required')).toBe('true');
    expect(text(label)).toBe('Email address');
    expect(honeypot?.getAttribute('tabindex')).toBe('-1');
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(body.querySelector('input[name="source"]')?.getAttribute('value')).toBe('/');
    expect(text(body.querySelector('button[type="submit"]'))).toBe('Subscribe');
    expect(body.querySelector('[role="alert"]')?.hasAttribute('hidden')).toBe(true);
  });

  it('reads Sending... while busy and keeps focus', async () => {
    const button = (await renderToBody(Busy)).querySelector('button[type="submit"]');
    expect(text(button)).toBe('Sending...');
    expect(button?.getAttribute('aria-busy')).toBe('true');
    expect(button?.hasAttribute('disabled')).toBe(false);
  });

  it('flips the button to the thanks in place on success and shows the on-the-list line', async () => {
    const body = await renderToBody(Success);
    expect(text(body.querySelector('button[type="submit"]'))).toBe('Ẹ ṣé! ✓');
    expect(body.querySelector('button[type="submit"]')?.getAttribute('data-state')).toBe('success');
    expect(body.querySelector('.oy-signup-done')?.hasAttribute('hidden')).toBe(false);
    expect(text(body.querySelector('.oy-signup-done'))).toContain('You are on the list');
    expect(body.querySelector('input[type="email"]')?.hasAttribute('readonly')).toBe(true);
  });

  it('names the problem in a sentence and keeps the typed value on error', async () => {
    const body = await renderToBody(WithError);
    const alert = body.querySelector('[role="alert"]');
    const input = body.querySelector('input[type="email"]');
    expect(alert?.hasAttribute('hidden')).toBe(false);
    expect(text(alert)).toBe('That email address does not look right. Check it and send again.');
    expect(input?.getAttribute('value')).toBe('ade@example');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-describedby')).toBe('oy-newsletter-error');
  });

  it('renders inside the dark scope for the footer', async () => {
    const body = await renderToBody(OnDark);
    expect(body.querySelector('.oy-dark oy-newsletter')).not.toBeNull();
  });
});
