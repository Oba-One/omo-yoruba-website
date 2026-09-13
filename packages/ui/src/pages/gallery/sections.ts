/**
 * The gallery's sections as configured components for the page-section stories (ROUTES section 5: one story per
 * layout option). Every part comes from the fixtures; the site composes the same parts in packages/web from
 * `buildGalleryPage` and `buildAlbumPage`. The headings and the soon sentence are the page's copy, as on the site.
 */

import FactList from '../../content/FactList/FactList.astro';
import Prose from '../../content/Prose/Prose.astro';
import ActionButton from '../../core/ActionButton/ActionButton.astro';
import Button from '../../core/Button/Button.astro';
import {
  ALBUM_TILES,
  ALBUM_TILES_GRID,
  CREDIT_ROWS,
  GALA_ALBUM,
  GALLERY_HEADER,
  GALLERY_PENDING,
} from '../../fixtures/gallery';
import AlbumGrid from '../../media/AlbumGrid/AlbumGrid.astro';
import ButtonRow from '../../page/ButtonRow/ButtonRow.astro';
import PageHeader from '../../page/PageHeader/PageHeader.astro';
import Section from '../../page/Section/Section.astro';
import SectionHead from '../../page/SectionHead/SectionHead.astro';
import Split from '../../page/Split/Split.astro';
import type { SlotValue } from '../../storybook';
import AlbumSection from './AlbumSection.astro';

export const header: SlotValue = {
  component: PageHeader,
  props: { variant: 'slim', ...GALLERY_HEADER },
};

/** The albums in the mosaic, newest year first: tiles open the Lightbox (`viewer`) or the album's page (`grid`). */
export const albums = (
  captions: 'always' | 'hover' = 'always',
  open: 'viewer' | 'grid' = 'viewer',
): SlotValue => ({
  component: Section,
  props: { id: 'albums' },
  slots: {
    default: {
      component: AlbumGrid,
      props: {
        albums: open === 'viewer' ? ALBUM_TILES : ALBUM_TILES_GRID,
        captions,
        pending: GALLERY_PENDING.albums,
      },
    },
  },
});

/** `state: soon`: one sentence that claims nothing unconfirmed, and the two event pages. */
export const soon: SlotValue = {
  component: Section,
  props: { id: 'albums' },
  slots: {
    default: [
      {
        component: Prose,
        props: {
          text: 'The albums are being prepared. Until then, the Odunde and Gala pages carry their own photographs.',
        },
      },
      {
        component: ButtonRow,
        slots: {
          default: [
            {
              component: Button,
              props: { variant: 'quiet', href: '/odunde', arrow: true },
              slots: { default: 'Odunde Festival' },
            },
            {
              component: Button,
              props: { variant: 'quiet', href: '/gala', arrow: true },
              slots: { default: 'End-of-Year Gala' },
            },
          ],
        },
      },
    ],
  },
};

/** Photography credit and permissions, every gallery route's close, with the policy and the inbox owed. */
export const credits: SlotValue = {
  component: Section,
  props: { id: 'credit', ground: 'alt', labelledby: 'credit-heading' },
  slots: {
    default: {
      component: Split,
      slots: {
        default: {
          component: SectionHead,
          props: {
            title: 'Photography credit and permissions',
            intro:
              'These photographs show real people, including children. Here is how we credit them, how we ask permission, and how to ask for a photograph to be removed.',
            id: 'credit-heading',
          },
        },
        aside: [
          { component: FactList, props: { facts: CREDIT_ROWS, columns: 1 } },
          {
            component: ButtonRow,
            slots: {
              default: {
                component: ActionButton,
                props: {
                  action: { label: 'Send a message', kind: 'enquiry', enquiryKind: 'contact' },
                  variant: 'quiet',
                },
              },
            },
          },
        ],
      },
    },
  },
};

/** An album page's header: the gallery's kicker, the album's title and its count. */
export const albumHeader: SlotValue = {
  component: PageHeader,
  props: {
    variant: 'slim',
    kicker: GALLERY_HEADER.kicker,
    title: GALA_ALBUM.title,
    facts: [{ text: GALA_ALBUM.count }],
  },
};

/** An album page's body, the Lightbox served open on the first photograph or closed. */
export const albumBody = (open: boolean, captions: 'always' | 'hover' = 'always'): SlotValue => ({
  component: AlbumSection,
  props: { open, captions },
});
