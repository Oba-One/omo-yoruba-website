import type { ComponentProps } from 'astro/types';
import { ZONES } from '../../fixtures/event-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import ZoneGrid from './ZoneGrid.astro';

type Args = StoryArgs<ComponentProps<typeof ZoneGrid>>;

const zones = ZONES.map((zone) => ({ ...zone, image: zone.image.src }));

const meta = {
  title: 'Content/ZoneGrid',
  component: ZoneGrid,
  args: { zones, layout: 'mosaic' },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The zones block: the two named zones and two placeholder cards for the zones still owed, up to the confirmed four. Mosaic, five across, a grid of three, or a list.',
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

/** No zone documents at all: four placeholder cards. */
export const Pending: Story = { args: { zones: [] } };
