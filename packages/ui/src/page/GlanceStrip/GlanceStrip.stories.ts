import type { ComponentProps } from 'astro/types';
import { FESTIVAL_GLANCE } from '../../fixtures/event-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import GlanceStrip from './GlanceStrip.astro';

type Args = StoryArgs<ComponentProps<typeof GlanceStrip>>;

const meta = {
  title: 'Page/GlanceStrip',
  component: GlanceStrip,
  args: { facts: FESTIVAL_GLANCE },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The next edition at a glance: four or five facts, each with a Pending chip where the Studio holds no value. Odunde 2027 as the seed holds it: the park and the family fact are known, the date, hours and cost are not.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Five facts, the festival's. */
export const Default: Story = {};

export const Five: Story = {};

/** Four facts. */
export const Four: Story = { args: { facts: FESTIVAL_GLANCE.slice(0, 4) } };

/** With the line under the strip, as the Gala sets it. */
export const WithCaption: Story = {
  args: { caption: 'Everything you need to say yes: the date, the dress, and the price.' },
};

/** Nothing entered yet: every value is its chip. */
export const Pending: Story = {
  args: {
    facts: [
      { label: 'Date', pending: 'the date' },
      { label: 'Doors', pending: 'the doors time' },
      { label: 'Venue', pending: 'the venue' },
      { label: 'Dress', pending: 'the dress code' },
      { label: 'Seats from', pending: 'three prices and what each includes' },
    ],
  },
};
