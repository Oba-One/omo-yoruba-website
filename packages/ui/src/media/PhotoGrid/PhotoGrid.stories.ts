import type { ComponentProps } from 'astro/types';
import {
  type FixturePhotograph,
  GALA_ALBUM_PHOTOS,
  GALLERY_PENDING,
  ODUNDE_ALBUM_PHOTOS,
} from '../../fixtures/gallery';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import PhotoGrid from './PhotoGrid.astro';

type Args = StoryArgs<ComponentProps<typeof PhotoGrid>>;

const mobile = { globals: { viewport: { value: 'mobile', isRotated: false } } };
const desktop = { globals: { viewport: { value: 'desktop', isRotated: false } } };

/** A photograph as a tile takes the empty alt beside its caption. */
const tiles = (photos: FixturePhotograph[]) =>
  photos.map(({ key, href, image, tileAlt, caption }) => ({
    key,
    href,
    image,
    alt: tileAlt,
    caption,
  }));

const meta = {
  title: 'Media/PhotoGrid',
  component: PhotoGrid,
  decorators: [wrap('oy-wrap')],
  args: {
    lightbox: 'album-lightbox',
    photos: tiles(GALA_ALBUM_PHOTOS),
    pending: GALLERY_PENDING.photographs,
  },
  parameters: {
    docs: {
      description: {
        component:
          "An album's photographs on its page: three across at 200px, two under 900px, one under 600px, each the whole tile a link to its photo address, which the album's Lightbox opens in place. The captions are the register's descriptions as the dataset holds them, so the tiles leave the alt empty and a reader hears each once. The gold edge draws inside the tile on hover; nothing lifts or zooms.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The six photographs of End-of-Year Gala 2025. */
export const Default: Story = { ...desktop };

/** The first eight photographs of Odunde 2026. */
export const Odunde: Story = { ...desktop, args: { photos: tiles(ODUNDE_ALBUM_PHOTOS) } };

/** At 375 the tiles stack. */
export const Mobile: Story = { ...mobile };

/** `captions: hover`: the captions wait for the pointer or the keyboard. */
export const CaptionsOnHover: Story = { ...desktop, args: { captions: 'hover' } };

/** Served with the Lightbox open over it: nothing loads before the photograph on screen. */
export const UnderTheLightbox: Story = { ...desktop, args: { eager: 0 } };

/** An album with no photographs yet: the registry's Pending line. */
export const Pending: Story = { args: { photos: [] } };
