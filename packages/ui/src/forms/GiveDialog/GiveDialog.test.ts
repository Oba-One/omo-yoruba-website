import { composeStories } from '@storybook-astro/framework/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderLive, renderToBody, text } from '../../test/stories';
import * as stories from './GiveDialog.stories';
import { ZEFFY_EMBED_ID, ZEFFY_ORIGIN } from './zeffy';

const {
  Default,
  WithoutPageLink,
  WithEin,
  Fallback,
  FallbackNameWithoutAddress,
  FallbackWithAddress,
  Pending,
  Closed,
} = composeStories(stories);

describe('GiveDialog', () => {
  it('wraps the embed template in the dialog with the fallback hidden', async () => {
    const body = await renderToBody(Default);
    const dialog = body.querySelector('dialog#give');
    expect(dialog?.hasAttribute('open')).toBe(true);
    expect(dialog?.getAttribute('aria-labelledby')).toBe('give-title');
    expect(text(body.querySelector('#give-title'))).toBe('Give to Omo Yorùbá');
    expect(body.querySelector('[data-embed] template[data-zeffy]')).not.toBeNull();
    expect(body.querySelector('[data-fallback]')?.hasAttribute('hidden')).toBe(true);
    // No promise that the donor never leaves the page: the link under the form opens Zeffy's own.
    expect(text(body.querySelector('[data-lead]'))).toBe('Amount and card details, all here.');
    const host = body.querySelector('oy-give-dialog');
    expect(host?.getAttribute('data-timeout')).toBe('8000');
    // The listener hears the origin and the form the island's address names (ADR 0045), under a name
    // Zeffy's own embed script would not take for one of its containers (`[data-zeffy-embed]`).
    expect(host?.getAttribute('data-zeffy-origin')).toBe(ZEFFY_ORIGIN);
    expect(host?.getAttribute('data-zeffy-embed-id')).toBe(ZEFFY_EMBED_ID);
    expect(body.querySelector('[data-zeffy-embed]')).toBeNull();
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
  });

  it('states neither monthly giving nor emailed receipts in any mode, until the form confirms them (R38)', async () => {
    for (const story of [Default, Fallback, Pending]) {
      const host = (await renderToBody(story)).querySelector('oy-give-dialog');
      expect(host?.outerHTML).not.toMatch(/monthly|receipt/i);
    }
  });

  it('shows its foot only with the form, never in the pending or fallback modes (R38)', async () => {
    const foot = (await renderToBody(Default)).querySelector('[data-foot]');
    expect(foot?.hasAttribute('hidden')).toBe(false);
    expect([...(foot?.querySelectorAll(':scope > span') ?? [])].map(text)).toEqual([
      'Secure • Powered by Zeffy',
      '501(c)(3) • EIN XX-XXXXXXX',
    ]);
    for (const story of [Fallback, Pending]) {
      expect((await renderToBody(story)).querySelector('[data-foot]')?.hasAttribute('hidden')).toBe(
        true,
      );
    }
  });

  it('names the EIN in the foot once the settings hold it', async () => {
    const foot = (await renderToBody(WithEin)).querySelector('[data-foot]');
    expect(foot?.hasAttribute('hidden')).toBe(false);
    expect(text(foot?.querySelector(':scope > span:last-child'))).toBe(
      '501(c)(3) • EIN 12-3456789',
    );
  });

  it('shows the address chip, never a bare name, while the settings hold no address (R45)', async () => {
    const body = await renderToBody(FallbackNameWithoutAddress);
    const line = body.querySelector('[data-fallback] p');
    expect(text(line)).toBe(
      'Write to us and we will take the gift by hand, or send a check to Pending: mailing address',
    );
    expect(text(line)).not.toContain('Omo Yorùbá of Southern California');
  });

  it('names the organisation and the address in the check line once set', async () => {
    const body = await renderToBody(FallbackWithAddress);
    expect(text(body.querySelector('[data-fallback] p'))).toContain(
      'send a check to Omo Yorùbá of Southern California, PO Box 000, Los Angeles, CA 90000.',
    );
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

  it('hides the foot with the form when the timer ends, and shows it again on Try again (R38)', async () => {
    const body = await renderLive(Closed);
    vi.useFakeTimers();
    donate();
    const foot = body.querySelector('[data-foot]');
    expect(foot?.hasAttribute('hidden')).toBe(false);
    vi.advanceTimersByTime(8000);
    expect(foot?.hasAttribute('hidden')).toBe(true);
    body.querySelector<HTMLButtonElement>('[data-retry]')?.click();
    expect(body.querySelector<HTMLElement>('oy-give-dialog')?.dataset.state).toBe('loading');
    expect(foot?.hasAttribute('hidden')).toBe(false);
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

  it("records give_page_opened when the donor takes the link to Zeffy's own page", async () => {
    const body = await renderLive(Closed);
    donate();
    // The link opens a new tab; the test keeps the document where it is.
    document.addEventListener('click', (event) => event.preventDefault(), {
      capture: true,
      once: true,
    });
    body.querySelector<HTMLAnchorElement>('[data-zeffy-page]')?.click();
    expect(tracked).toEqual(['give_opened', 'give_page_opened']);
  });

  it("turns express checkout off on an iPhone before the frame loads, as Zeffy's own script does", async () => {
    const form =
      'https://www.zeffy.com/en-US/embed/donation-form/example?embed-version=v2&embedId=give';
    // The frame's address is what is checked; happy-dom must not fetch it.
    const settings = (
      window as unknown as { happyDOM: { settings: { disableIframePageLoading: boolean } } }
    ).happyDOM.settings;
    const loading = settings.disableIframePageLoading;
    settings.disableIframePageLoading = true;
    const mountWith = async () => {
      const body = await renderLive(Closed);
      body
        .querySelector('[data-embed]')
        ?.insertAdjacentHTML(
          'beforeend',
          `<template data-zeffy><iframe src="${form}"></iframe></template>`,
        );
      vi.useFakeTimers();
      donate();
      return body.querySelector('[data-mount] iframe')?.getAttribute('src') ?? '';
    };
    expect(new URL(await mountWith()).searchParams.has('disableExpressCheckout')).toBe(false);
    document.body.replaceChildren();
    vi.useRealTimers();
    const agent = vi
      .spyOn(window.navigator, 'userAgent', 'get')
      .mockReturnValue('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)');
    const src = new URL(await mountWith());
    agent.mockRestore();
    settings.disableIframePageLoading = loading;
    expect(src.searchParams.get('disableExpressCheckout')).toBe('true');
    expect(src.searchParams.get('embedId')).toBe('give');
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

  it('records give_completed again once a reloaded form connects anew', async () => {
    // Safari reloads a persisted frame on every page swap without a new mount.
    await openWithFrame();
    post({ type: 'zeffy-embed:thank-you-page-shown', embedId: 'give' });
    post({ type: 'zeffy-embed:connected', embedId: 'give' });
    post({ type: 'zeffy-embed:thank-you-page-shown', embedId: 'give' });
    expect(tracked).toEqual(['give_opened', 'give_completed', 'give_completed']);
  });

  it('brings the form back when Zeffy connects after the timer, where a late load leaves the fallback', async () => {
    const { host, frame } = await openWithFrame();
    vi.advanceTimersByTime(8000);
    expect(host?.dataset.state).toBe('failed');
    // A frame fires load for an error page too, so a late one proves nothing.
    frame?.dispatchEvent(new Event('load'));
    expect(host?.dataset.state).toBe('failed');
    expect(host?.querySelector('[data-fallback]')?.hasAttribute('hidden')).toBe(false);
    post({ type: 'zeffy-embed:connected', embedId: 'give' });
    expect(host?.dataset.state).toBe('ready');
    expect(host?.querySelector('[data-embed]')?.hasAttribute('hidden')).toBe(false);
    expect(host?.querySelector('[data-fallback]')?.hasAttribute('hidden')).toBe(true);
    expect(host?.querySelector('[data-foot]')?.hasAttribute('hidden')).toBe(false);
    expect(text(host?.querySelector('[data-lead]'))).toBe('Amount and card details, all here.');
  });

  it('scrolls back to the top of a new step or the thank-you page when it begins above the view', async () => {
    const { host, frame } = await openWithFrame();
    const at = (element: Element | null | undefined, top: number) => {
      if (element) element.getBoundingClientRect = () => ({ top }) as DOMRect;
    };
    // Above 720px the dialog itself scrolls: the donor is 300px past the frame's top.
    const dialog = host?.querySelector('dialog') as HTMLDialogElement;
    dialog.scrollTop = 500;
    at(dialog, 0);
    at(frame, -300);
    post({ type: 'zeffy-embed:step-changed', embedId: 'give' });
    expect(dialog.scrollTop).toBe(200);
    // With the frame's top in view nothing moves.
    at(frame, 120);
    post({ type: 'zeffy-embed:thank-you-page-shown', embedId: 'give' });
    expect(dialog.scrollTop).toBe(200);
    // A panel taller than its box that only clips (overflow hidden, above 720px) is never scrolled.
    const sheet = host?.querySelector('.oy-modal') as HTMLElement;
    sheet.style.overflowY = 'hidden';
    Object.defineProperty(sheet, 'scrollHeight', { value: 1400, configurable: true });
    Object.defineProperty(sheet, 'clientHeight', { value: 600, configurable: true });
    at(sheet, 60);
    at(frame, -40);
    post({ type: 'zeffy-embed:step-changed', embedId: 'give' });
    expect(sheet.scrollTop).toBe(0);
    expect(dialog.scrollTop).toBe(160);
    // Under 720px the bottom sheet scrolls: the frame begins 50px above the sheet's top edge.
    sheet.style.overflowY = 'auto';
    sheet.scrollTop = 400;
    at(frame, 10);
    post({ type: 'zeffy-embed:thank-you-page-shown', embedId: 'give' });
    expect(sheet.scrollTop).toBe(350);
    expect(dialog.scrollTop).toBe(160);
  });

  it('keeps a dialog served in its fallback mode on the fallback until Try again', async () => {
    const body = await renderLive(FallbackNameWithoutAddress);
    expect(body.querySelector('dialog')?.open).toBe(true);
    expect(body.querySelector('[data-fallback]')?.hasAttribute('hidden')).toBe(false);
    expect(body.querySelector('[data-embed]')?.hasAttribute('hidden')).toBe(true);
    expect(body.querySelector('[data-foot]')?.hasAttribute('hidden')).toBe(true);
    vi.useFakeTimers();
    body.querySelector<HTMLButtonElement>('[data-retry]')?.click();
    expect(body.querySelector('[data-embed]')?.hasAttribute('hidden')).toBe(false);
    expect(body.querySelector('[data-fallback]')?.hasAttribute('hidden')).toBe(true);
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
