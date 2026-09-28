import { composeStories } from '@storybook-astro/framework/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderLive, renderToBody, text } from '../../test/stories';
import * as stories from './GiveDialog.stories';
import { ZEFFY_EMBED_ID, ZEFFY_ORIGIN } from './zeffy';

const { Default, WithoutPageLink, Fallback, FallbackWithAddress, Pending, Closed } =
  composeStories(stories);

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
    const host = body.querySelector('oy-give-dialog');
    expect(host?.getAttribute('data-timeout')).toBe('8000');
    // The listener hears the origin and the form the island's address names (ADR 0045).
    expect(host?.getAttribute('data-zeffy-origin')).toBe(ZEFFY_ORIGIN);
    expect(host?.getAttribute('data-zeffy-embed')).toBe(ZEFFY_EMBED_ID);
  });

  it("links Zeffy's own page for the form under the embed, in a new tab", async () => {
    const body = await renderToBody(Default);
    const link = body.querySelector('[data-embed] a[target="_blank"]');
    expect(link?.getAttribute('href')).toBe('https://www.zeffy.com');
    expect(link?.getAttribute('rel')).toBe('noopener');
    expect(text(link)).toContain("Give on Zeffy's page");
    const note = body.querySelector(`#${link?.getAttribute('aria-describedby')}`);
    expect(text(note)).toBe(
      "On a phone, Zeffy's own page can take Apple Pay and Google Pay. It opens in a new tab.",
    );
  });

  it('draws no link without a page, nor in the pending mode, where there is no form', async () => {
    expect((await renderToBody(WithoutPageLink)).querySelector('#give a[target]')).toBeNull();
    expect((await renderToBody(Pending)).querySelector('#give a[target]')).toBeNull();
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

// The element itself, through the script the page ships (renderLive). Zeffy's messages are dispatched as a
// browser delivers them: a MessageEvent on the window, with the sender's origin.
describe('GiveDialog, running its element', () => {
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

  /** Clicks a Donate trigger as the site's links carry it. */
  const donate = () => {
    const trigger = document.createElement('a');
    trigger.href = '/donate#give';
    trigger.dataset.give = '';
    document.body.prepend(trigger);
    trigger.click();
  };

  /** Posts a message as Zeffy's form does to the page that frames it. */
  const post = (data: unknown, origin = 'https://www.zeffy.com') => {
    window.dispatchEvent(new MessageEvent('message', { data, origin }));
  };

  /** Opens the dialog once the island's template has arrived with its frame, with the timers faked. */
  const openWithFrame = async () => {
    const body = await renderLive(Closed);
    body
      .querySelector('[data-embed]')
      ?.insertAdjacentHTML(
        'beforeend',
        '<template data-zeffy><iframe title="Zeffy donation form"></iframe></template>',
      );
    vi.useFakeTimers();
    donate();
    return {
      host: body.querySelector<HTMLElement>('oy-give-dialog'),
      frame: body.querySelector<HTMLIFrameElement>('[data-mount] iframe'),
    };
  };

  it('falls back after eight seconds when the form never arrives, and announces it', async () => {
    const body = await renderLive(Closed);
    vi.useFakeTimers();
    donate();
    const host = body.querySelector<HTMLElement>('oy-give-dialog');
    expect(host?.dataset.state).toBe('loading');
    vi.advanceTimersByTime(7999);
    expect(host?.dataset.state).toBe('loading');
    vi.advanceTimersByTime(1);
    expect(host?.dataset.state).toBe('failed');
    expect(body.querySelector('[data-fallback]')?.hasAttribute('hidden')).toBe(false);
    expect(tracked).toEqual(['give_opened', 'give_embed_failed']);
  });

  it("counts Zeffy's connected message as ready, only from Zeffy's origin and for this form", async () => {
    const { host } = await openWithFrame();
    expect(host?.dataset.state).toBe('loading');
    post({ type: 'zeffy-embed:connected', embedId: 'give' }, 'https://www.zeffy.com.example.org');
    post({ type: 'zeffy-embed:connected', embedId: 'give' }, 'http://www.zeffy.com');
    post({ type: 'zeffy-embed:connected', embedId: 'another' });
    post({ type: 'zeffy-embed:connected' });
    post(JSON.stringify({ type: 'zeffy-embed:connected', embedId: 'give' }));
    post(null);
    expect(host?.dataset.state).toBe('loading');
    post({ type: 'zeffy-embed:connected', embedId: 'give' });
    expect(host?.dataset.state).toBe('ready');
    expect(host?.querySelector('[data-loading]')?.hasAttribute('hidden')).toBe(true);
    // Ready stops the timer, so the fallback never shows.
    vi.advanceTimersByTime(20_000);
    expect(host?.dataset.state).toBe('ready');
  });

  it('sets the frame to the height Zeffy reports, up to a ceiling, and ignores anything else', async () => {
    const { frame } = await openWithFrame();
    post({ type: 'zeffy-embed:resized', embedId: 'give', height: 902.4 });
    expect(frame?.style.height).toBe('902px');
    for (const height of [0, -40, Number.NaN, Number.POSITIVE_INFINITY, '700', undefined]) {
      post({ type: 'zeffy-embed:resized', embedId: 'give', height });
    }
    post({ type: 'zeffy-embed:resized', embedId: 'give', height: 700 }, 'https://example.org');
    post({ type: 'zeffy-embed:resized', embedId: 'another', height: 700 });
    expect(frame?.style.height).toBe('902px');
    post({ type: 'zeffy-embed:resized', embedId: 'give', height: 100_000 });
    expect(frame?.style.height).toBe('2400px');
  });

  it('records give_completed once, when Zeffy shows its thank-you page', async () => {
    await openWithFrame();
    post({ type: 'zeffy-embed:thank-you-page-shown', embedId: 'give' }, 'https://example.org');
    post({ type: 'zeffy-embed:thank-you-page-shown', embedId: 'another' });
    post({ type: 'zeffy-embed:thank-you-animation-shown', embedId: 'give' });
    expect(tracked).toEqual(['give_opened']);
    post({ type: 'zeffy-embed:thank-you-page-shown', embedId: 'give' });
    post({ type: 'zeffy-embed:thank-you-page-shown', embedId: 'give' });
    expect(tracked).toEqual(['give_opened', 'give_completed']);
  });

  it('hears nothing before the form is mounted', async () => {
    const body = await renderLive(Closed);
    post({ type: 'zeffy-embed:connected', embedId: 'give' });
    expect(body.querySelector<HTMLElement>('oy-give-dialog')?.dataset.state).toBeUndefined();
  });

  it('keeps the one message listener it registered at definition across a reconnection (ADR 0041)', async () => {
    const { host, frame } = await openWithFrame();
    const added = vi.spyOn(window, 'addEventListener');
    host?.remove();
    document.body.append(host as HTMLElement);
    expect(added.mock.calls.map(([type]) => type)).not.toContain('message');
    added.mockRestore();
    post({ type: 'zeffy-embed:resized', embedId: 'give', height: 900 });
    expect(frame?.style.height).toBe('900px');
  });
});
