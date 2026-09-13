import type { ComponentProps } from 'astro/types';
import { EVENTBRITE_STAND_IN, TIER_PLACEHOLDERS } from '../../fixtures/event-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import TicketTiers from './TicketTiers.astro';

type Args = StoryArgs<ComponentProps<typeof TicketTiers>>;

const meta = {
  title: 'Content/TicketTiers',
  component: TicketTiers,
  args: {
    tiers: TIER_PLACEHOLDERS,
    layout: 'columns',
    emphasis: 'seats',
    ticketsUrl: EVENTBRITE_STAND_IN,
    pending: 'three prices and what each includes',
  },
  parameters: {
    docs: {
      description: {
        component:
          "The Gala's seats and tables: the tiers in the Studio's order as columns or rows, the table tier first in the markup when the page emphasises tables, the first featured tier with the gold button. No tiers shows the registry's Pending line.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Columns: Story = {};

export const Rows: Story = { args: { layout: 'rows' } };

/** `emphasis` on tables: the table tier moves to the front. */
export const TablesFirst: Story = { args: { emphasis: 'tables' } };

/** Before the edition holds its Eventbrite link: every buy-now tier shows the chip. */
export const NoLink: Story = { args: { ticketsUrl: null } };

/** No tiers in the Studio, as for Gala 2026 today. */
export const Pending: Story = { args: { tiers: [] } };
