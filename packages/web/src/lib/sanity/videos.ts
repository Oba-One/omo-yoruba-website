/**
 * An album's videos as the library's `VideoGrid` takes them (ADR 0050), shared by the album page and the event
 * pages' past years: one function takes the album and answers its tiles. Pure, so a test drives it with a fixture.
 * A video with no title, no key or no readable YouTube address is left out. The frame's address and the link to
 * YouTube are built from the id alone (`@oy/content/videos`), so nothing else the Studio stored in the address
 * reaches the page. The key, the address and the names that become labels are cleaned of stega before they are
 * used as an address or a comparison. A still is the video's own, else the album's cover, else the first of its
 * photographs that holds a picture, cropped to the tile's 16:9 at the CDN around its hotspot.
 */
import { youtubeEmbedSrc, youtubeId, youtubeWatchHref } from '@oy/content/videos';
import type { ResolvedImage } from '@oy/ui/media/image.ts';
import {
  type BuildOptions,
  cleanText,
  type ImageLike,
  present,
  resolveImage,
  studioText,
} from './view';

/** A video as the album queries project it. */
export interface VideoLike {
  _key?: string | null;
  title?: string | null;
  url?: string | null;
  /** The video's own still, a plain image with neither alt text nor caption. */
  still?: ImageLike | null;
  /** Who made it: the photographer's credit line or name. */
  credit?: string | null;
  /** The photographer's page, which the credit's name links to. */
  creditUrl?: string | null;
}

/** What the tiles read of an album: its videos, and the cover and photographs a video's still falls back to. */
export interface VideoAlbumLike {
  cover?: ImageLike | null;
  photos?: readonly (ImageLike | null)[] | null;
  videos?: readonly (VideoLike | null)[] | null;
}

/** One video as the tile draws it. */
export interface VideoView {
  key: string;
  title: string;
  /** The video's own page on YouTube: what the play link opens without JavaScript. */
  watchHref: string;
  /** The player's frame, which a press on the play link swaps in. */
  embedSrc: string;
  /** Our own photograph under the play mark; none when the album holds no picture at all. */
  still?: ResolvedImage;
  credit?: string;
  creditHref?: string;
  /** A `data-sanity` attribute, so click-to-edit reaches the video. */
  edit?: string;
}

/** The tile is 16:9, about 540 pixels wide at its widest column and 720 when it stands alone. */
const STILL = { width: 720, aspect: 16 / 9 };

/**
 * The still a video takes when it has none of its own: the album's cover, else the first of its photographs that
 * holds a picture. An image slot left with its alt text or caption but no picture is no still, and the next is tried.
 */
function albumStill(album: VideoAlbumLike, options: BuildOptions): ResolvedImage | undefined {
  for (const image of [album.cover, ...(album.photos ?? [])]) {
    const resolved = resolveImage(options.imageSet, image, STILL);
    if (resolved) return resolved;
  }
  return undefined;
}

/**
 * The tiles of an album's videos, in the order the Studio holds them. `edit` is the album document's attribute
 * factory: it answers the path of the video's list item, or undefined outside draft mode.
 */
export function videoViews(
  album: VideoAlbumLike | null | undefined,
  options: BuildOptions,
  edit: (path: string) => string | undefined,
): VideoView[] {
  const videos = (album?.videos ?? []).filter(present);
  if (!album || videos.length === 0) return [];
  const fallback = albumStill(album, options);
  return videos.flatMap((video) => {
    const key = cleanText(video._key);
    const title = cleanText(video.title);
    const id = youtubeId(cleanText(video.url));
    if (!key || !title || !id) return [];
    const credit = studioText(video.credit);
    return [
      {
        key,
        title,
        watchHref: youtubeWatchHref(id),
        embedSrc: youtubeEmbedSrc(id),
        still: resolveImage(options.imageSet, video.still, STILL) ?? fallback,
        credit,
        creditHref: credit ? cleanText(video.creditUrl) : undefined,
        edit: edit(`videos[_key=="${key}"]`),
      },
    ];
  });
}
