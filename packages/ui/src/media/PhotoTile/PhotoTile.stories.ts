import type { ComponentProps } from 'astro/types';
import { TILES } from '../../fixtures/homepage';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import PhotoTile from './PhotoTile.astro';

type Args = StoryArgs<ComponentProps<typeof PhotoTile>>;

const first = TILES[0] as (typeof TILES)[number];

const meta = {
  title: 'Media/PhotoTile',
  component: PhotoTile,
  args: { image: first.image.src, alt: first.image.alt, caption: first.caption },
  decorators: [wrap('sb-oy-narrow')],
  parameters: {
    docs: {
      description: {
        component:
          'Caption over a scrim, Yoruba first with the gold dot. Square corners, no zoom on hover. The placeholder carries the àdìrẹ dot field until the photograph lands.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const EnglishOnly: Story = { args: { caption: 'Festival day' } };

export const NoCaption: Story = { args: { caption: undefined } };

/** The scrim deepens; the photo holds still. */
export const Hover: Story = { parameters: { pseudo: { hover: '.v2-mo' } } };

/** No photograph: the dot field placeholder naming what is missing. */
export const Pending: Story = {
  args: { image: undefined, alt: undefined, what: 'a festival photograph' },
};
