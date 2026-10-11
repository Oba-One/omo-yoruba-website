import { composeStories } from '@storybook-astro/framework/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderLive, renderToBody, text } from '../../test/stories';
import * as giveStories from '../GiveDialog/GiveDialog.stories';
import { ZEFFY_ORIGIN } from '../ZeffyDialog/zeffy';
import * as stories from './JoinDialog.stories';

const { Default, WithoutPageLink, Fallback, Closed } = composeStories(stories);
const { Closed: GiveClosed } = composeStories(giveStories);

describe('JoinDialog', () => {
  it("wraps the membership form's template in its own dialog, named for its form", async () => {
    const body = await renderToBody(Default);
    const dialog = body.querySelector('dialog#join');
    expect(dialog?.hasAttribute('open')).toBe(true);
    expect(dialog?.getAttribute('aria-labelledby')).toBe('join-title');
    expect(text(body.querySelector('#join-title'))).toBe('Become a member');
    expect(text(body.querySelector('[data-lead]'))).toBe('Membership and dues, all here.');
    expect(body.querySelector('[data-embed] template[data-zeffy]')).not.toBeNull();
    expect(body.querySelector('[data-fallback]')?.hasAttribute('hidden')).toBe(true);
    // The listener hears Zeffy's origin and this dialog's own form, never the Give Dialog's.
    const host = body.querySelector('oy-zeffy-dialog');
    expect(host?.getAttribute('data-form')).toBe('join');
    expect(host?.getAttribute('data-zeffy-origin')).toBe(ZEFFY_ORIGIN);
    expect(host?.getAttribute('data-zeffy-embed-id')).toBe('join');
  });

  it("links Zeffy's own page for the form, claiming nothing about how it takes payment", async () => {
    const body = await renderToBody(Default);
    const link = body.querySelector('[data-embed] a[target="_blank"]');
    expect(link?.getAttribute('href')).toBe('https://www.zeffy.com');
    expect(link?.getAttribute('rel')).toBe('noopener');
    expect(text(link)).toContain("Join on Zeffy's page");
    const note = body.querySelector(`#${link?.getAttribute('aria-describedby')}`);
    expect(text(note)).toBe("Zeffy's own page has the same form. It opens in a new tab.");
    expect((await renderToBody(WithoutPageLink)).querySelector('#join a[target]')).toBeNull();
  });

  it('names Zeffy alone in its foot, with no tax line', async () => {
    const foot = (await renderToBody(Default)).querySelector('[data-foot]');
    expect(foot?.hasAttribute('hidden')).toBe(false);
    expect([...(foot?.querySelectorAll(':scope > span') ?? [])].map(text)).toEqual([
      'Secure • Powered by Zeffy',
    ]);
  });

  it('falls back to the member enquiry and Try again, stating no dues', async () => {
    const body = await renderToBody(Fallback);
    const fallback = body.querySelector('[data-fallback]');
    expect(fallback?.hasAttribute('hidden')).toBe(false);
    expect(body.querySelector('[data-embed]')?.hasAttribute('hidden')).toBe(true);
    expect(body.querySelector('[data-foot]')?.hasAttribute('hidden')).toBe(true);
    expect(text(fallback?.querySelector('b'))).toBe('The membership form did not load.');
    expect(text(fallback?.querySelector('p'))).toBe(
      'Tell us about yourself and our membership lead will arrange your dues with you.',
    );
    const enquiry = fallback?.querySelector('a[data-enquiry="member"]');
    expect(enquiry?.getAttribute('href')).toBe('?enquiry=member#enquiry');
    expect(text(enquiry)).toContain('Become a member');
    expect(text(fallback?.querySelector('[data-retry]'))).toBe('Try again');
    // The form shows the membership and its price; the dialog's own words name neither.
    expect(body.querySelector('oy-zeffy-dialog')?.outerHTML).not.toMatch(/\$|\d+ a (month|year)/i);
  });

  it('mounts closed by default', async () => {
    const body = await renderToBody(Closed);
    expect(body.querySelector('dialog#join')?.hasAttribute('open')).toBe(false);
  });
});

// The element itself, through the script the page ships (renderLive), with Zeffy's messages dispatched as a
// browser delivers them.
describe('JoinDialog, running its element', () => {
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

  /** Clicks a trigger as the site's links carry it: `data-join` for a membership button, `data-give` for Donate. */
  const click = (form: 'join' | 'give') => {
    const trigger = document.createElement('a');
    trigger.href = form === 'join' ? '?enquiry=member#enquiry' : '/donate#give';
    trigger.setAttribute(`data-${form}`, '');
    document.body.prepend(trigger);
    // The test keeps the document where it is when no dialog claims the click.
    trigger.addEventListener('click', (event) => event.preventDefault());
    trigger.click();
  };

  /** Posts a message as Zeffy's form does to the page that frames it. */
  const post = (data: unknown, origin = 'https://www.zeffy.com') => {
    window.dispatchEvent(new MessageEvent('message', { data, origin }));
  };

  const FRAME = '<template data-zeffy><iframe title="Zeffy membership form"></iframe></template>';

  /** The Join Dialog on a page, closed, its template in place, with the timers faked. */
  const mountJoin = async () => {
    const body = await renderLive(Closed);
    body.querySelector('[data-embed]')?.insertAdjacentHTML('beforeend', FRAME);
    vi.useFakeTimers();
    return body.querySelector<HTMLElement>('oy-zeffy-dialog[data-form="join"]');
  };

  it('opens from a membership trigger, never from a Donate trigger, and announces join_opened', async () => {
    const host = await mountJoin();
    const dialog = host?.querySelector('dialog');
    click('give');
    expect(dialog?.open).toBe(false);
    click('join');
    expect(dialog?.open).toBe(true);
    expect(host?.dataset.state).toBe('loading');
    expect(tracked).toEqual(['join_opened']);
  });

  it("hears Zeffy's messages for its own form only, and announces join_completed once", async () => {
    const host = await mountJoin();
    click('join');
    post({ type: 'zeffy-embed:connected', embedId: 'give' });
    post({ type: 'zeffy-embed:connected', embedId: 'join' }, 'https://www.zeffy.com.example.org');
    expect(host?.dataset.state).toBe('loading');
    post({ type: 'zeffy-embed:connected', embedId: 'join' });
    expect(host?.dataset.state).toBe('ready');
    post({ type: 'zeffy-embed:resized', embedId: 'join', height: 811.6 });
    expect(host?.querySelector<HTMLIFrameElement>('[data-mount] iframe')?.style.height).toBe(
      '812px',
    );
    post({ type: 'zeffy-embed:thank-you-page-shown', embedId: 'give' });
    post({ type: 'zeffy-embed:thank-you-page-shown', embedId: 'join' });
    post({ type: 'zeffy-embed:thank-you-page-shown', embedId: 'join' });
    expect(tracked).toEqual(['join_opened', 'join_completed']);
  });

  it('falls back to the member enquiry after eight seconds, and announces join_embed_failed', async () => {
    const body = await renderLive(Closed);
    vi.useFakeTimers();
    click('join');
    const host = body.querySelector<HTMLElement>('oy-zeffy-dialog');
    vi.advanceTimersByTime(8000);
    expect(host?.dataset.state).toBe('failed');
    expect(text(host?.querySelector('[data-lead]'))).toBe(
      'Another way to join while the form is down.',
    );
    expect(host?.querySelector('[data-fallback]')?.hasAttribute('hidden')).toBe(false);
    expect(tracked).toEqual(['join_opened', 'join_embed_failed']);
  });

  it('opens for #join and strips the hash on close, leaving #give to the Give Dialog', async () => {
    const host = await mountJoin();
    const dialog = host?.querySelector('dialog');
    window.location.hash = '#give';
    window.dispatchEvent(new Event('hashchange'));
    expect(dialog?.open).toBe(false);
    window.location.hash = '#join';
    window.dispatchEvent(new Event('hashchange'));
    expect(dialog?.open).toBe(true);
    dialog?.close();
    expect(window.location.hash).toBe('');
  });

  it("wires a dialog the parser connects before its children, as it does a page's second dialog", async () => {
    // The page's first dialog defines the element. The parser then meets the second dialog's start tag
    // and connects it empty, parses its children, and runs the copy of the script that follows them.
    await renderLive(GiveClosed);
    const rendered = await renderToBody(Closed);
    const markup = rendered.querySelector('oy-zeffy-dialog')?.innerHTML ?? '';
    const script = rendered.querySelector('script')?.textContent ?? '';
    document.body.replaceChildren();
    const host = document.createElement('oy-zeffy-dialog');
    host.dataset.form = 'join';
    document.body.append(host);
    expect(host.dataset.ready).toBeUndefined();
    host.innerHTML = markup;
    new Function(script)();
    expect(host.dataset.ready).toBe('true');
    click('join');
    expect(host.querySelector('dialog')?.open).toBe(true);
    expect(tracked).toEqual(['join_opened']);
  });

  it('shares the page with the Give Dialog: each trigger and each message reaches its own dialog', async () => {
    // Two dialogs, one element definition: the Give Dialog's markup joins the page after the Join Dialog's.
    const give = (await renderToBody(GiveClosed)).querySelector('oy-zeffy-dialog')?.outerHTML ?? '';
    const body = await renderLive(Closed);
    body.append(document.createRange().createContextualFragment(give));
    for (const embed of body.querySelectorAll('[data-embed]')) {
      embed.insertAdjacentHTML('beforeend', FRAME);
    }
    vi.useFakeTimers();
    const joinHost = body.querySelector<HTMLElement>('oy-zeffy-dialog[data-form="join"]');
    const giveHost = body.querySelector<HTMLElement>('oy-zeffy-dialog[data-form="give"]');
    expect(giveHost?.dataset.ready).toBe('true');
    click('give');
    expect(giveHost?.querySelector('dialog')?.open).toBe(true);
    expect(joinHost?.querySelector('dialog')?.open).toBe(false);
    click('join');
    expect(joinHost?.querySelector('dialog')?.open).toBe(true);
    post({ type: 'zeffy-embed:connected', embedId: 'join' });
    expect(joinHost?.dataset.state).toBe('ready');
    expect(giveHost?.dataset.state).toBe('loading');
    post({ type: 'zeffy-embed:thank-you-page-shown', embedId: 'give' });
    expect(tracked).toEqual(['give_opened', 'join_opened', 'give_completed']);
  });
});
