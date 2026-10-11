/**
 * An album's videos, played from YouTube (ADR 0050). The owner pastes the address the video's Share button gives
 * and the site keeps only the video's id from it: the frame and the link to YouTube are both built from that id,
 * never from the stored text, so the Studio's field cannot make the site frame or link anything else. Pure and
 * free of Sanity imports, so the Studio's rule, the site's builders and the tests share it. An address arrives
 * cleaned of stega (`cleanText`): one still wearing its characters reads no id.
 */

/** YouTube's no-cookie player: the one origin the site frames for a video, and only once a visitor presses play. */
export const YOUTUBE_EMBED_ORIGIN = 'https://www.youtube-nocookie.com';

/** An id is eleven characters of letters, digits, "_" and "-". */
const ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * What YouTube's embed path holds in an id's place for a playlist (`/embed/videoseries?list=...`) and for a channel's
 * live stream (`/embed/live_stream?channel=...`): eleven characters each, and no video.
 */
const NOT_VIDEOS: ReadonlySet<string> = new Set(['videoseries', 'live_stream']);

const isId = (value: string): boolean => ID.test(value) && !NOT_VIDEOS.has(value);

const EMBED_HOST = new URL(YOUTUBE_EMBED_ORIGIN).host;

/** The hosts that answer `/watch?v=<id>` and the `/shorts/`, `/embed/` and `/live/` paths. */
const YOUTUBE_HOSTS: ReadonlySet<string> = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
]);

const FIRST_SEGMENT = /^\/([^/]+)\/?$/;
const KIND_SEGMENT = /^\/(?:shorts|embed|live)\/([^/]+)\/?$/;
const EMBED_SEGMENT = /^\/embed\/([^/]+)\/?$/;

/** What an address offers as its id, before the length and the characters are checked. */
function candidate(url: URL): string | null | undefined {
  if (url.host === 'youtu.be') return FIRST_SEGMENT.exec(url.pathname)?.[1];
  if (url.host === EMBED_HOST) return EMBED_SEGMENT.exec(url.pathname)?.[1];
  if (!YOUTUBE_HOSTS.has(url.host)) return undefined;
  return url.pathname === '/watch'
    ? url.searchParams.get('v')
    : KIND_SEGMENT.exec(url.pathname)?.[1];
}

/**
 * The video's id from an https address on `youtu.be/<id>`, `youtube.com/watch?v=<id>` (also `www.` and `m.`),
 * `/shorts/<id>`, `/embed/<id>`, `/live/<id>` or `www.youtube-nocookie.com/embed/<id>`; anything else (plain
 * http, another host or port, a channel or playlist, a value that is not a string) answers undefined. The id is
 * read whole and exact: an eleven-character run inside a longer segment is not an id, and neither are the two
 * embed paths that happen to be eleven characters, `videoseries` and `live_stream`.
 */
export function youtubeId(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return undefined;
  }
  if (url.protocol !== 'https:') return undefined;
  const found = candidate(url);
  return typeof found === 'string' && isId(found) ? found : undefined;
}

/** Callers hand these builders an id `youtubeId` read; anything else is a mistake to surface, not to build on. */
function checked(id: string): string {
  if (!isId(id)) throw new TypeError(`Not a YouTube video id: ${JSON.stringify(id)}`);
  return id;
}

/** The player's frame address: no-cookie, playing at once (it is only framed after a press), related videos from the same channel. */
export const youtubeEmbedSrc = (id: string): string =>
  `${YOUTUBE_EMBED_ORIGIN}/embed/${checked(id)}?autoplay=1&rel=0`;

/** The video's own page, which the play link opens for a visitor without JavaScript or with a modifier key held. */
export const youtubeWatchHref = (id: string): string =>
  `https://www.youtube.com/watch?v=${checked(id)}`;
