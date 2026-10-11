import { composeStories } from '@storybook-astro/framework/testing';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { LINKED_ALBUM_CREDIT } from '../../fixtures/event-pages';
import { ODUNDE_VIDEOS } from '../../fixtures/videos';
import { renderLive, renderToBody, text } from '../../test/stories';
import * as stories from './VideoGrid.stories';

const {
  Default,
  OneVideo,
  WithoutStill,
  WithoutCredit,
  UnlinkedCredit,
  UnsafeLink,
  WithEdit,
  Priority,
  Pending,
} = composeStories(stories);

const [highlights, teaser] = ODUNDE_VIDEOS;

describe('VideoGrid', () => {
  it('lists each video as a tile whose one link is named for it and opens it on YouTube', async () => {
    const body = await renderToBody(Default);
    const list = body.querySelector('ul.oy-video-grid');
    expect(list?.getAttribute('aria-label')).toBe('Videos');
    const tiles = [...body.querySelectorAll('ul.oy-video-grid > li')];
    expect(tiles).toHaveLength(2);
    const links = tiles.map((tile) => tile.querySelector('oy-video > a.oy-video-play'));
    expect(links.map(text)).toEqual([
      'Play video: Odunde 2026 highlights',
      'Play video: Odunde 2026 teaser',
    ]);
    expect(links.map((link) => link?.getAttribute('href'))).toEqual([
      highlights?.watchHref,
      teaser?.watchHref,
    ]);
    expect(links[0]?.getAttribute('href')).toBe('https://www.youtube.com/watch?v=AbC_dEf-123');
    // Each tile holds exactly one link to play; the credit's link is in the line under it.
    for (const tile of tiles) expect(tile.querySelectorAll('oy-video a')).toHaveLength(1);
  });

  it('hands the element the player to swap in and the title for its frame, loading neither', async () => {
    const hosts = [...(await renderToBody(Default)).querySelectorAll('oy-video')];
    expect(hosts.map((host) => host.getAttribute('data-embed'))).toEqual([
      highlights?.embedSrc,
      teaser?.embedSrc,
    ]);
    expect(hosts[0]?.getAttribute('data-embed')).toBe(
      'https://www.youtube-nocookie.com/embed/AbC_dEf-123?autoplay=1&rel=0',
    );
    expect(hosts.map((host) => host.getAttribute('data-title'))).toEqual([
      'Odunde 2026 highlights',
      'Odunde 2026 teaser',
    ]);
    expect(hosts.every((host) => !host.hasAttribute('data-playing'))).toBe(true);
    expect(hosts.every((host) => !host.hasAttribute('data-ready'))).toBe(true);
  });

  it('requests nothing from YouTube or Google before the press: no frame, no script, no thumbnail', async () => {
    const body = await renderToBody(Default);
    expect(
      body.querySelector('iframe, embed, object, video, audio, source, link, script[src]'),
    ).toBeNull();
    const requested = [...body.querySelectorAll('[src], [srcset], [data-src]')].map((element) =>
      [
        element.getAttribute('src'),
        element.getAttribute('srcset'),
        element.getAttribute('data-src'),
      ].join(' '),
    );
    expect(requested.length).toBeGreaterThan(0);
    expect(requested.join(' ')).not.toMatch(/youtube|ytimg|google|gstatic|googlevideo/i);
    // Our own photographs are what the tiles show.
    for (const img of body.querySelectorAll('img')) {
      expect(img.getAttribute('src')).toContain('.jpg');
    }
  });

  it("draws the play mark as a round, hidden triangle, and leaves the still's alt empty beside the link's name", async () => {
    const body = await renderToBody(Default);
    const tile = body.querySelector('li');
    const mark = tile?.querySelector('.oy-video-mark');
    expect(mark?.getAttribute('aria-hidden')).toBe('true');
    expect(mark?.querySelector('svg path')).not.toBeNull();
    expect(tile?.querySelector('img')?.getAttribute('alt')).toBe('');
    // Nothing in the link but the hidden name speaks, so a reader hears the title once.
    expect(text(tile?.querySelector('a.oy-video-play'))).toBe('Play video: Odunde 2026 highlights');
    expect(tile?.querySelector('a.oy-video-play .oy-visually-hidden')).not.toBeNull();
  });

  it('sets the title as a paragraph, never a heading, so the page keeps its order', async () => {
    const body = await renderToBody(Default);
    expect([...body.querySelectorAll('li > p.oy-video-title')].map(text)).toEqual([
      'Odunde 2026 highlights',
      'Odunde 2026 teaser',
    ]);
    expect(body.querySelector('h1, h2, h3, h4, h5, h6')).toBeNull();
  });

  it('names who made it, linked to their page with the full stop outside the link, and that it plays from YouTube', async () => {
    const line = (await renderToBody(Default)).querySelector('li .oy-video-line');
    expect(text(line)).toBe('Video: Red Carpet Films. Plays from YouTube.');
    const link = line?.querySelector('a');
    expect(link?.getAttribute('href')).toBe(LINKED_ALBUM_CREDIT.href);
    expect(text(link)).toBe('Red Carpet Films');
    // The credit is the shared line, labelled Video and set inline in the muted line: confirmed, so no chip.
    const credit = line?.querySelector('span.oy-credit-line.oy-credit-line--inline');
    expect(text(credit)).toBe('Video: Red Carpet Films.');
    expect(credit?.querySelector('.oy-pend')).toBeNull();
  });

  it('keeps the name plain where the maker has no page, or an address the site does not link', async () => {
    for (const story of [UnlinkedCredit, UnsafeLink]) {
      const line = (await renderToBody(story)).querySelector('li .oy-video-line');
      expect(text(line)).toBe('Video: Red Carpet Films. Plays from YouTube.');
      expect(line?.querySelector('a')).toBeNull();
    }
  });

  it('says only that it plays from YouTube when no maker is named', async () => {
    const line = (await renderToBody(WithoutCredit)).querySelector('li .oy-video-line');
    expect(text(line)).toBe('Plays from YouTube.');
    expect(line?.querySelector('a')).toBeNull();
  });

  it('puts a lone video in its own, narrower column', async () => {
    const body = await renderToBody(OneVideo);
    expect(body.querySelectorAll('ul.oy-video-grid > li')).toHaveLength(1);
    expect(body.querySelector('ul.oy-video-grid')?.classList.contains('oy-video-grid--one')).toBe(
      true,
    );
    const two = (await renderToBody(Default)).querySelector('ul.oy-video-grid');
    expect(two?.classList.contains('oy-video-grid--one')).toBe(false);
  });

  it('loads every still lazily, the first at once and first only when the page asks', async () => {
    const lazy = [...(await renderToBody(Default)).querySelectorAll('img')];
    expect(lazy.map((img) => img.getAttribute('loading'))).toEqual(['lazy', 'lazy']);
    expect(lazy.every((img) => img.getAttribute('decoding') === 'async')).toBe(true);
    expect(lazy.some((img) => img.hasAttribute('fetchpriority'))).toBe(false);
    const eager = [...(await renderToBody(Priority)).querySelectorAll('img')];
    expect(eager.map((img) => img.getAttribute('loading'))).toEqual(['eager', 'lazy']);
    expect(eager[0]?.getAttribute('fetchpriority')).toBe('high');
    expect(eager[1]?.hasAttribute('fetchpriority')).toBe(false);
  });

  it("names the missing still with the placeholder, which the link's own name stays clear of", async () => {
    const body = await renderToBody(WithoutStill);
    const link = body.querySelector('a.oy-video-play');
    expect(link?.querySelector('img')).toBeNull();
    const fill = link?.querySelector('.oy-video-fill');
    expect(fill?.getAttribute('aria-hidden')).toBe('true');
    expect(fill?.querySelector('.oy-ph')?.getAttribute('aria-label')).toBe(
      'Placeholder for the still for this video',
    );
    expect(text(link)).toContain('Play video: Odunde 2026 highlights');
    expect(link?.querySelector('.oy-video-mark')).not.toBeNull();
  });

  it('ships the element script with the video list, guarded against a second copy, and nothing without one', async () => {
    const source = (await renderToBody(Default)).querySelector('script')?.textContent ?? '';
    expect(source).toContain("customElements.get('oy-video')");
    expect((await renderToBody(Pending)).querySelector('script')).toBeNull();
  });

  it("puts each video's edit attribute on its tile in draft mode, and none otherwise", async () => {
    const tiles = [...(await renderToBody(WithEdit)).querySelectorAll('ul.oy-video-grid > li')];
    expect(tiles.map((tile) => tile.getAttribute('data-sanity'))).toEqual([
      'id=album-odunde-2026;type=album;path=videos:odunde-2026-highlights;base=%2Fadmin',
      'id=album-odunde-2026;type=album;path=videos:odunde-2026-teaser;base=%2Fadmin',
    ]);
    const published = [...(await renderToBody(Default)).querySelectorAll('ul.oy-video-grid > li')];
    expect(published.some((tile) => tile.hasAttribute('data-sanity'))).toBe(false);
  });

  it('renders nothing for an album with no videos', async () => {
    const body = await renderToBody(Pending);
    expect(body.querySelector('ul, li, oy-video, a, img, p')).toBeNull();
    expect(text(body)).toBe('');
  });
});

// The element itself, through the script the page ships (renderLive). These run last: once defined, the element
// would wire the markup the tests above expect unwired. happy-dom would fetch a frame's address, so it is told not to.
describe('VideoGrid, wired', () => {
  type Happy = { happyDOM: { settings: { disableIframePageLoading: boolean } } };
  const settings = () => (window as unknown as Happy).happyDOM.settings;
  let loading = false;
  beforeAll(() => {
    loading = settings().disableIframePageLoading;
    settings().disableIframePageLoading = true;
  });
  afterAll(() => {
    settings().disableIframePageLoading = loading;
  });
  afterEach(() => {
    document.body.replaceChildren();
  });

  const tileLink = (body: HTMLElement, at = 0) =>
    body.querySelectorAll<HTMLAnchorElement>('a.oy-video-play')[at] as HTMLAnchorElement;
  const frames = (body: HTMLElement) => [
    ...body.querySelectorAll<HTMLIFrameElement>('oy-video iframe'),
  ];

  /**
   * One click on the link as a browser delivers it. A listener on the document, after the element's own, stops the
   * default action so happy-dom opens nothing, and records whether the element had already taken the press.
   */
  function press(link: Element, init: MouseEventInit = {}) {
    let takenByElement = false;
    const settle = (event: Event) => {
      takenByElement = event.defaultPrevented;
      event.preventDefault();
    };
    document.addEventListener('click', settle, { once: true });
    link.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init }),
    );
    document.removeEventListener('click', settle);
    return takenByElement;
  }

  it('wires each tile as the page parses, with nothing requested yet', async () => {
    const body = await renderLive(Default);
    const hosts = [...body.querySelectorAll<HTMLElement>('oy-video')];
    expect(hosts.map((host) => host.dataset.ready)).toEqual(['true', 'true']);
    expect(frames(body)).toEqual([]);
    expect(hosts.some((host) => host.hasAttribute('data-playing'))).toBe(false);
  });

  it('swaps the player in for the link on a click, with the frame focused and the other tile untouched', async () => {
    const body = await renderLive(Default);
    const taken = press(tileLink(body));
    expect(taken).toBe(true);
    const [frame] = frames(body);
    expect(frames(body)).toHaveLength(1);
    // Exactly the address the tile carried: the page built it from the video's id alone.
    expect(frame?.getAttribute('src')).toBe(highlights?.embedSrc);
    expect(frame?.getAttribute('title')).toBe('Odunde 2026 highlights');
    expect(frame?.hasAttribute('allowfullscreen')).toBe(true);
    expect(frame?.getAttribute('allow')).toContain('autoplay');
    expect(frame?.getAttribute('allow')).toContain('picture-in-picture');
    expect(frame?.getAttribute('referrerpolicy')).toBe('strict-origin-when-cross-origin');
    expect(document.activeElement).toBe(frame);
    const host = frame?.closest('oy-video') as HTMLElement;
    expect(host.hasAttribute('data-playing')).toBe(true);
    expect(host.querySelector('a, img, svg')).toBeNull();
    // The second video waits for its own press.
    const second = body.querySelectorAll('oy-video')[1] as HTMLElement;
    expect(second.querySelector('a.oy-video-play')).not.toBeNull();
    expect(second.hasAttribute('data-playing')).toBe(false);
    expect(second.querySelector('iframe')).toBeNull();
  });

  it('takes the press the keyboard makes too: Enter on the link fires a click with no pointer', async () => {
    const body = await renderLive(Default);
    const link = tileLink(body, 1);
    link.focus();
    expect(press(link, { detail: 0 })).toBe(true);
    expect(frames(body).map((frame) => frame.getAttribute('src'))).toEqual([teaser?.embedSrc]);
    expect(document.activeElement).toBe(frames(body)[0]);
  });

  it('leaves a click with a modifier key to the browser: the link stays and nothing loads', async () => {
    const body = await renderLive(Default);
    for (const init of [
      { metaKey: true },
      { ctrlKey: true },
      { shiftKey: true },
      { altKey: true },
      { button: 1 },
    ]) {
      expect(press(tileLink(body), init), JSON.stringify(init)).toBe(false);
    }
    expect(frames(body)).toEqual([]);
    expect(tileLink(body).getAttribute('href')).toBe(highlights?.watchHref);
    expect(body.querySelector('oy-video[data-playing]')).toBeNull();
  });

  it('frames only an https address, and otherwise lets the link open the video', async () => {
    const body = await renderLive(Default);
    const host = body.querySelector('oy-video') as HTMLElement;
    for (const src of [
      'javascript:alert(1)',
      'http://www.youtube-nocookie.com/embed/AbC_dEf-123',
      '',
    ]) {
      host.setAttribute('data-embed', src);
      expect(press(tileLink(body)), src).toBe(false);
    }
    host.removeAttribute('data-embed');
    expect(press(tileLink(body))).toBe(false);
    expect(frames(body)).toEqual([]);
  });

  it('keeps the one listener it registered on the element across a reconnection (ADR 0041)', async () => {
    const body = await renderLive(Default);
    const host = body.querySelector('oy-video') as HTMLElement;
    const added = vi.spyOn(host, 'addEventListener');
    host.remove();
    body.prepend(host);
    expect(added).not.toHaveBeenCalled();
    added.mockRestore();
    expect(press(tileLink(body))).toBe(true);
    expect(frames(body)).toHaveLength(1);
  });

  it('ignores a click that is not on the play link', async () => {
    const body = await renderLive(Default);
    expect(press(tileLink(body))).toBe(true);
    // The frame now fills the box; a click landing on it, or on the tile, plays nothing more.
    expect(press(frames(body)[0] as HTMLIFrameElement)).toBe(false);
    expect(frames(body)).toHaveLength(1);
  });
});
