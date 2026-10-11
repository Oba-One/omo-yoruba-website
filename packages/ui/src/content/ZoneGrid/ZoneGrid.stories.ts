import type { ComponentProps } from 'astro/types';
import { ZONES } from '../../fixtures/event-pages';
import { PHOTOS } from '../../fixtures/photos';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import ZoneGrid from './ZoneGrid.astro';

type Args = StoryArgs<ComponentProps<typeof ZoneGrid>>;

const zones = ZONES.map((zone) => ({ ...zone, image: zone.image.src }));
/**
 * The festival's third zone; the seed writes the first two. Its English half is the site's own name for
 * these groups (Get Involved's "Hometown associations").
 */
const hometown = {
  _id: 'zone-egbe-ibile',
  name: { yo: 'Ẹgbẹ́ Ìbílẹ̀', en: 'The hometown associations' },
  line: null,
  image: PHOTOS.receivingGift.src,
};

const meta = {
  title: 'Content/ZoneGrid',
  component: ZoneGrid,
  args: { zones, layout: 'mosaic' },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The zones block: the two zones the seed names and a placeholder card for the one still owed, up to the confirmed three. Mosaic, five across, a grid of three, or a list.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Mosaic: Story = {};

export const Five: Story = { args: { layout: 'five' } };

export const Grid: Story = { args: { layout: 'grid' } };

export const List: Story = { args: { layout: 'list' } };

/** All three zones named: the market tall, the other two beside it, each with its photograph at the left of its words. */
export const Three: Story = { args: { zones: [...zones, hometown] } };

/** No zone documents at all: three placeholder cards. */
export const Pending: Story = { args: { zones: [] } };
