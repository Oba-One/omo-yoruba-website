import type { ComponentProps } from 'astro/types';
import { GALA_2026, ODUNDE_2027 } from '../../fixtures/homepage';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import EventBand from './EventBand.astro';

type Args = StoryArgs<ComponentProps<typeof EventBand>>;

const meta = {
  title: 'Bands/EventBand',
  component: EventBand,
  args: { event: GALA_2026 },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'One edition at a time, whichever is next: the gala frame or the festival frame, with chevron rows, stripe seams and motif columns. The edition brings its title, venue, date and summary; a missing date or venue shows a Pending chip.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The Gala frame: "Coming up next", the edition, Tickets & tables. The date and venue are Pending until the Studio holds them. */
export const Gala: Story = {};

/** The festival frame: "Ọdúndé • The new year has arrived", Leimert Park, Vendors & sponsors. */
export const Odunde: Story = { args: { event: ODUNDE_2027 } };

/** Every fact present: how the band reads once the edition is filled in. The values are illustrative and come from no dataset. */
export const Filled: Story = {
  args: {
    event: {
      ...ODUNDE_2027,
      start: '2027-06-12T17:00:00.000Z',
      summary: 'One village, four zones, one family.',
    },
  },
};

/** No edition to show: the Pending line names what the band waits for. */
export const Pending: Story = { args: { event: undefined } };
