import type { ComponentProps } from 'astro/types';
import { WHAT_IT_IS_FIGURE } from '../../fixtures/event-pages';
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

/** A Studio photo with a hotspot: the tile keeps the prototype's framing (50% 35%). */
export const Framed: Story = {
  args: { image: { src: first.image.src, alt: first.image.alt, position: '50% 35%' } },
};

export const EnglishOnly: Story = { args: { caption: 'Festival day' } };

export const NoCaption: Story = { args: { caption: undefined } };

/** The scrim deepens; the photo holds still. */
export const Hover: Story = { parameters: { pseudo: { hover: '.v2-mo' } } };

/** No photograph: the dot field placeholder naming what is missing. */
export const Pending: Story = {
  args: { image: undefined, alt: undefined, what: 'a festival photograph' },
};

/** The framed figure beside an event page's prose: 360px tall, 6px corners, a place caption with no Yoruba half. */
export const Figure: Story = {
  args: {
    shape: 'figure',
    image: WHAT_IT_IS_FIGURE.image,
    caption: WHAT_IT_IS_FIGURE.caption,
  },
  decorators: [wrap('sb-oy-medium')],
};

/** A shorter figure, as a split draws its photograph beside a heading and facts: 280px on the Collective's why. */
export const FigureShort: Story = {
  args: { ...Figure.args, height: 280 },
  decorators: [wrap('sb-oy-medium')],
};

/** An album page's first photograph, the page's largest paint: loaded at once, and first. */
export const LargestPaint: Story = { args: { priority: true } };
