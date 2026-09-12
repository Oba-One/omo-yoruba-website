import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './GiveDialog.stories';

const { Default, Fallback, FallbackWithAddress, Pending, Closed } = composeStories(stories);

describe('GiveDialog', () => {
  it('wraps the embed template in the dialog with the fallback hidden', async () => {
    const body = await renderToBody(Default);
    const dialog = body.querySelector('dialog#give');
    expect(dialog?.hasAttribute('open')).toBe(true);
    expect(dialog?.getAttribute('aria-labelledby')).toBe('give-title');
    expect(text(body.querySelector('#give-title'))).toBe('Give to Omo Yorùbá');
    expect(body.querySelector('[data-embed] template[data-zeffy]')).not.toBeNull();
    expect(body.querySelector('[data-fallback]')?.hasAttribute('hidden')).toBe(true);
    expect(text(body.querySelector('[data-lead]'))).toContain('You never leave the page.');
    expect(body.querySelector('oy-give-dialog')?.getAttribute('data-timeout')).toBe('4000');
  });

  it('falls back to the check line with the address Pending, Contact us and Try again', async () => {
    const body = await renderToBody(Fallback);
    const fallback = body.querySelector('[data-fallback]');
    expect(fallback?.hasAttribute('hidden')).toBe(false);
    expect(body.querySelector('[data-embed]')?.hasAttribute('hidden')).toBe(true);
    expect(text(fallback?.querySelector('b'))).toBe('The giving form did not load.');
    expect(text(fallback?.querySelector('.oy-pend'))).toBe('Pending: mailing address');
    const contact = fallback?.querySelector('a[data-enquiry="contact"]');
    expect(contact?.getAttribute('href')).toBe('?enquiry=contact#enquiry');
    expect(text(contact)).toContain('Contact us');
    expect(text(fallback?.querySelector('[data-retry]'))).toBe('Try again');
    expect(text(body.querySelector('[data-ein]'))).toBe('XX-XXXXXXX');
  });

  it('names the organisation and the address in the check line once set', async () => {
    const body = await renderToBody(FallbackWithAddress);
    expect(text(body.querySelector('[data-fallback] p'))).toContain(
      'send a check to Omo Yorùbá of Southern California, PO Box 000, Los Angeles, CA 90000.',
    );
    expect(text(body.querySelector('[data-ein]'))).toBe('12-3456789');
  });

  it('answers Pending without a Try again while the Zeffy URL is empty', async () => {
    const body = await renderToBody(Pending);
    expect(text(body.querySelector('[data-heading]'))).toBe(
      'The online giving form is not set up yet.',
    );
    expect(body.querySelector('[data-retry]')).toBeNull();
    expect(body.querySelector('[data-fallback]')?.hasAttribute('hidden')).toBe(false);
  });

  it('mounts closed by default', async () => {
    const body = await renderToBody(Closed);
    expect(body.querySelector('dialog#give')?.hasAttribute('open')).toBe(false);
  });
});
