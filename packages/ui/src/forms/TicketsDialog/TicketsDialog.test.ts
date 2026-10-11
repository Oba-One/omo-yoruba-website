import { composeStories } from '@storybook-astro/framework/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderLive, renderToBody, text } from '../../test/stories';
import * as stories from './TicketsDialog.stories';

const { Default, WithoutPageLink, Fallback, Closed } = composeStories(stories);

describe('TicketsDialog', () => {
  it("wraps the ticket form's template in its own dialog, named for its form", async () => {
    const body = await renderToBody(Default);
    const dialog = body.querySelector('dialog#tickets');
    expect(dialog?.hasAttribute('open')).toBe(true);
    expect(dialog?.getAttribute('aria-labelledby')).toBe('tickets-title');
    expect(text(body.querySelector('#tickets-title'))).toBe('Gala tickets');
    expect(text(body.querySelector('[data-lead]'))).toBe('Tickets and payment, all here.');
    expect(body.querySelector('[data-embed] template[data-zeffy]')).not.toBeNull();
    const host = body.querySelector('oy-zeffy-dialog');
    expect(host?.getAttribute('data-form')).toBe('tickets');
    expect(host?.getAttribute('data-zeffy-embed-id')).toBe('tickets');
    const foot = body.querySelector('[data-foot]');
    expect([...(foot?.querySelectorAll(':scope > span') ?? [])].map(text)).toEqual([
      'Secure • Powered by Zeffy',
    ]);
  });

  it("links Zeffy's own page for the form under the embed, or draws no link without one", async () => {
    const link = (await renderToBody(Default)).querySelector('[data-embed] a[target="_blank"]');
    expect(link?.getAttribute('href')).toBe('https://www.zeffy.com');
    expect(text(link)).toContain("Get tickets on Zeffy's page");
    expect((await renderToBody(WithoutPageLink)).querySelector('#tickets a[target]')).toBeNull();
  });

  it('falls back to the contact enquiry and Try again, naming no price and no date', async () => {
    const body = await renderToBody(Fallback);
    const fallback = body.querySelector('[data-fallback]');
    expect(fallback?.hasAttribute('hidden')).toBe(false);
    expect(text(fallback?.querySelector('b'))).toBe('The ticket form did not load.');
    expect(text(fallback?.querySelector('p'))).toBe(
      'Write to us and we will help you with your tickets.',
    );
    const enquiry = fallback?.querySelector('a[data-enquiry="contact"]');
    expect(enquiry?.getAttribute('href')).toBe('?enquiry=contact#enquiry');
    expect(text(fallback?.querySelector('[data-retry]'))).toBe('Try again');
    // The form shows the tickets, their prices and the night; the dialog's own words name none.
    expect(text(body.querySelector('oy-zeffy-dialog'))).not.toMatch(/\$|\d/);
  });
});

// The element itself, through the script the page ships (renderLive).
describe('TicketsDialog, running its element', () => {
  const tracked: string[] = [];
  const record = (event: Event) => {
    tracked.push((event as CustomEvent<{ event: string }>).detail.event);
  };

  beforeEach(() => {
    tracked.length = 0;
    document.addEventListener('oy:track', record);
  });

  afterEach(() => {
    document.removeEventListener('oy:track', record);
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  /** Clicks a Get tickets trigger as the tier cards carry it. */
  const getTickets = () => {
    const trigger = document.createElement('a');
    trigger.href = 'https://www.zeffy.com/ticketing/a-gala';
    trigger.setAttribute('data-tickets', '');
    document.body.prepend(trigger);
    trigger.click();
    return trigger;
  };

  const post = (data: unknown, origin = 'https://www.zeffy.com') => {
    window.dispatchEvent(new MessageEvent('message', { data, origin }));
  };

  it('opens from a Get tickets trigger without following its link, and hears only its own form', async () => {
    const body = await renderLive(Closed);
    body
      .querySelector('[data-embed]')
      ?.insertAdjacentHTML(
        'beforeend',
        '<template data-zeffy><iframe title="Zeffy ticket form"></iframe></template>',
      );
    vi.useFakeTimers();
    let prevented: boolean | undefined;
    document.addEventListener('click', (event) => {
      prevented = event.defaultPrevented;
    });
    getTickets();
    const host = body.querySelector<HTMLElement>('oy-zeffy-dialog');
    expect(prevented).toBe(true);
    expect(host?.querySelector('dialog')?.open).toBe(true);
    expect(host?.dataset.state).toBe('loading');
    post({ type: 'zeffy-embed:connected', embedId: 'give' });
    post({ type: 'zeffy-embed:connected', embedId: 'join' });
    expect(host?.dataset.state).toBe('loading');
    post({ type: 'zeffy-embed:connected', embedId: 'tickets' });
    expect(host?.dataset.state).toBe('ready');
    post({ type: 'zeffy-embed:thank-you-page-shown', embedId: 'tickets' });
    expect(tracked).toEqual(['tickets_opened', 'tickets_completed']);
  });
});
