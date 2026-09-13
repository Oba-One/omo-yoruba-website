/**
 * The gallery's fixtures (`18 Photo Gallery.dc.html`, ADR 0037, ADR 0039), shaped as `buildGalleryPage` and
 * `buildAlbumPage` hand them to the library: the three albums the dataset holds with the register's
 * photographs, their captions as the dataset stores them (the register's descriptions, which are also the alt
 * text), the counts of the register's sets, and the Pending states the Studio owes. No date, even as an ISO
 * string; a layout that needs more albums than exist uses the bracketed placeholder form.
 */
import {
  ALBUM_CREDIT_PENDING,
  ALBUM_YEAR_PENDING,
  PHOTO_CREDIT_PENDING,
  pendingWhat,
  presenceWhat,
} from '@oy/content/pending';
import { albumHref } from '@oy/content/routes';
import type { AlbumTileData } from '../media/AlbumTile/AlbumTile.astro';
import type { PhotoGridItem } from '../media/PhotoGrid/PhotoGrid.astro';
import { PHOTOS } from './photos';

export const GALLERY_HEADER = {
  kicker: { yo: 'Àwòrán', en: 'Photographs' },
  title: 'Photographs',
  line: 'Odunde, the Gala and the summer camp. Open an album and start looking.',
};

/** The registry's wordings the gallery reads, from the registry itself, so a story never drifts from the site's chip. */
export const GALLERY_PENDING = {
  albums: presenceWhat('album')?.what ?? '',
  year: ALBUM_YEAR_PENDING,
  photographs: pendingWhat('album', 'photos[]') ?? '',
  credit: ALBUM_CREDIT_PENDING,
  ownCredit: PHOTO_CREDIT_PENDING,
  consent: pendingWhat('galleryPage', 'creditsAndConsent') ?? '',
  inbox: pendingWhat('siteSettings', 'generalEmail') ?? '',
};

/**
 * The three albums in the gallery's order (newest year first, the summer camp without a year last), each
 * tile linking to its first photograph as `open: viewer` does. The editions' titles carry their years, so
 * their lines read the count alone.
 */
export const ALBUM_TILES: AlbumTileData[] = [
  {
    title: 'Odunde 2026',
    href: albumHref('odunde-2026', 'odunde-2026-kid-playing-with-elder'),
    image: PHOTOS.kidWithElder.src,
    count: '43 photographs',
  },
  {
    title: 'End-of-Year Gala 2025',
    href: albumHref('gala-2025', 'gala-2025-attendees-group-photo'),
    image: PHOTOS.galaGroupPortrait.src,
    count: '6 photographs',
  },
  {
    title: 'Summer camp',
    href: albumHref('summer-camp', 'community-dance'),
    image: PHOTOS.summerCampArtClass.src,
    count: '19 photographs',
    yearPending: GALLERY_PENDING.year,
  },
];

/** The same albums as `open: grid` links them: each tile to its album's page. */
export const ALBUM_TILES_GRID: AlbumTileData[] = ALBUM_TILES.map((album) => ({
  ...album,
  href: album.href.split('?')[0] as string,
}));

/** An album the layout stories need beyond the three that exist, in the prototypes' placeholder form. */
export const PLACEHOLDER_ALBUM: AlbumTileData = {
  title: '[ Album title ]',
  href: '/gallery',
  year: '[ Year ]',
  count: '[ Count ]',
};

export interface FixturePhotograph {
  key: string;
  href: string;
  image: string;
  /** The photograph's alt text, as the Lightbox shows it. */
  alt: string;
  /** The alt a tile carries: empty beside a caption that says the same, so a reader hears it once. */
  tileAlt: string;
  caption: string;
  credit?: string;
  confirmed?: boolean;
  creditPending?: string;
}

const photograph = (album: string, key: string, photo: { src: string; alt: string }) => ({
  key,
  href: albumHref(album, key),
  image: photo.src,
  // The caption is the register's description, as the dataset stores it (spec Q10).
  alt: photo.alt,
  tileAlt: '',
  caption: photo.alt,
  credit: album === 'gala-2025' ? 'Members and volunteers' : 'Red Carpet Media',
  confirmed: false,
  creditPending: GALLERY_PENDING.credit,
});

/** Photographs as `PhotoGrid` lists them: each tile's alt empty beside a caption that says the same. */
export const photoTiles = (photos: FixturePhotograph[]): PhotoGridItem[] =>
  photos.map(({ key, href, image, tileAlt, caption }) => ({
    key,
    href,
    image,
    alt: tileAlt,
    caption,
  }));

/** The End-of-Year Gala 2025 album: all six photographs in album order, the credit unconfirmed. */
export const GALA_ALBUM_PHOTOS: FixturePhotograph[] = [
  photograph('gala-2025', 'gala-2025-attendees-group-photo', PHOTOS.galaGroupPortrait),
  photograph('gala-2025', 'gala-2025-three-friends-selfie', PHOTOS.galaSelfie),
  photograph('gala-2025', 'gala-2025-attendees-smiling', PHOTOS.galaSmiling),
  photograph('gala-2025', 'gala-2025-group-photo', PHOTOS.galaGroup),
  photograph('gala-2025', 'gala-2025-attendees-sitting', PHOTOS.galaSitting),
  photograph('gala-2025', 'gala-2025-attendees-getting-food', PHOTOS.galaGettingFood),
];

/** The first eight photographs of the Odunde 2026 album, in album order. */
export const ODUNDE_ALBUM_PHOTOS: FixturePhotograph[] = [
  photograph('odunde-2026', 'odunde-2026-kid-playing-with-elder', PHOTOS.kidWithElder),
  photograph('odunde-2026', 'odunde-2026-procession-begins', PHOTOS.processionBegins),
  photograph('odunde-2026', 'odunde-2026-procession-with-drummer', PHOTOS.processionDrummer),
  photograph('odunde-2026', 'odunde-2026-procession-zoomed', PHOTOS.processionZoomed),
  photograph('odunde-2026', 'odunde-2026-president-receiving-gift', PHOTOS.receivingGift),
  photograph(
    'odunde-2026',
    'odunde-2026-performer-speaking-with-theater-backdrop',
    PHOTOS.performerSpeaking,
  ),
  photograph('odunde-2026', 'odunde-2026-performer-gele-speaking', PHOTOS.performerGeleSpeaking),
  photograph('odunde-2026', 'odunde-2026-performer-doing-gele-tying', PHOTOS.geleTying),
];

/** A photograph with a credit of its own, still unconfirmed, in the placeholder form for the name. */
export const OWN_CREDIT_PHOTO: FixturePhotograph = {
  ...photograph('gala-2025', 'gala-2025-three-friends-selfie', PHOTOS.galaSelfie),
  credit: '[ Photographer ]',
  creditPending: GALLERY_PENDING.ownCredit,
};

/** The End-of-Year Gala 2025 album page's head: its title, its line and the credit as the dataset holds it. */
export const GALA_ALBUM = {
  title: 'End-of-Year Gala 2025',
  count: '6 photographs',
  credit: 'Members and volunteers',
  confirmed: false,
  edition: { label: 'End-of-Year Gala', href: '/gala' },
};

/** The rows of Photography credit and permissions while the owner's policy and the general inbox are owed. */
export const CREDIT_ROWS = [
  { label: 'Credits', value: 'Given with each album, and with a photograph where it differs.' },
  { label: 'Consent policy', pending: GALLERY_PENDING.consent },
  { label: 'Removal requests', pending: GALLERY_PENDING.inbox },
];

/** Photography credit and permissions as the site builds it (`galleryCredits`): the page's words, the rows owed. */
export const GALLERY_CREDITS = {
  title: 'Photography credit and permissions',
  lead: 'These photographs show real people, including children. Here is how we credit them, how we ask permission, and how to ask for a photograph to be removed.',
  rows: CREDIT_ROWS,
  action: { label: 'Send a message', kind: 'enquiry', enquiryKind: 'contact' },
};
