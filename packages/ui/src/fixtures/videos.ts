/**
 * An album's videos for the stories (ADR 0050), shaped as `videoViews` hands them to `VideoGrid`: a highlights cut
 * and a teaser of Odunde 2026, as the owner described them, with stills from the register's photographs and the
 * credit the albums carry, linked to the photographer's page. The titles are the stories' own, not the channel's.
 * The addresses are built from ids made up for the stories (eleven characters that name no real video), through
 * the same functions the site builds them with.
 */
import { youtubeEmbedSrc, youtubeWatchHref } from '@oy/content/videos';
import type { VideoGridItem } from '../media/VideoGrid/VideoGrid.astro';
import { LINKED_ALBUM_CREDIT } from './event-pages';
import { PHOTOS } from './photos';

const HIGHLIGHTS_ID = 'AbC_dEf-123';
const TEASER_ID = 'ZyX_wVu-987';

const video = (key: string, id: string, title: string, still: string): VideoGridItem => ({
  key,
  title,
  watchHref: youtubeWatchHref(id),
  embedSrc: youtubeEmbedSrc(id),
  still,
  credit: LINKED_ALBUM_CREDIT.credit,
  creditHref: LINKED_ALBUM_CREDIT.href,
});

/** The Odunde 2026 album's two videos, in album order, each with a still and the photographer's credit. */
export const ODUNDE_VIDEOS: VideoGridItem[] = [
  video(
    'odunde-2026-highlights',
    HIGHLIGHTS_ID,
    'Odunde 2026 highlights',
    PHOTOS.processionBegins.src,
  ),
  video('odunde-2026-teaser', TEASER_ID, 'Odunde 2026 teaser', PHOTOS.kidWithElder.src),
];
