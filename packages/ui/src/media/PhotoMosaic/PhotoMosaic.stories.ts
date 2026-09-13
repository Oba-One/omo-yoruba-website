import type { ComponentProps } from 'astro/types';
import { TILES } from '../../fixtures/homepage';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import PhotoMosaic from './PhotoMosaic.astro';

type Args = StoryArgs<ComponentProps<typeof PhotoMosaic>>;

const tiles = TILES.map((tile) => ({
  image: tile.image.src,
  alt: tile.image.alt,
  caption: tile.caption,
}));

const meta = {
  title: 'Media/PhotoMosaic',
  component: PhotoMosaic,
  args: { tiles, count: 7 },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The year in the life: seven, five or three tiles from the gallery option. The first tile leads at double size in the seven and five arrangements; three sit side by side. Six, Impact's photographs, sit in two rows of three. Missing tiles are padded with the placeholder.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Seven: Story = {};

export const Five: Story = { args: { count: 5 } };

export const Three: Story = { args: { count: 3 } };

/** Six equal tiles in two rows of three: Impact's work in photographs. */
export const Six: Story = { args: { count: 6 } };

/** Two photographs for a seven tile mosaic: the rest are placeholders. */
export const Padded: Story = { args: { tiles: tiles.slice(0, 2) } };

/** No photographs: seven placeholders. */
export const Pending: Story = { args: { tiles: [] } };
