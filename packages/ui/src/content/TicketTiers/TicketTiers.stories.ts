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
    ticketsUrl: EVENTBRITE_STAND_IN,
    pending: 'three prices and what each includes',
  },
  parameters: {
    docs: {
      description: {
        component:
          "The Gala's seats and tables: the tiers in the Studio's order as columns or rows, the first featured tier with the gold button. No tiers shows the registry's Pending line.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Columns: Story = {};

export const Rows: Story = { args: { layout: 'rows' } };

/** Before the edition holds its ticket link: every buy-now tier shows the chip. */
export const NoLink: Story = { args: { ticketsUrl: null } };

/** No tiers in the Studio and no ticket link. */
export const Pending: Story = { args: { tiers: [], ticketsUrl: null } };

/** No tiers in the Studio, and a Zeffy ticket form as the edition's link: the form lists the tickets itself. */
export const PendingWithZeffyForm: Story = {
  args: { tiers: [], ticketsUrl: 'https://www.zeffy.com/embed/ticketing/a-gala' },
};

/** No tiers in the Studio, and any other ticket link: it opens in a new tab. */
export const PendingWithLink: Story = { args: { tiers: [] } };

/** Only the table tier, and a Zeffy ticket form: no card sells a seat, so the block's own button does. */
export const TableOnlyWithZeffyForm: Story = {
  args: {
    tiers: TIER_PLACEHOLDERS.filter((tier) => tier.variant === 'enquiry'),
    ticketsUrl: 'https://www.zeffy.com/embed/ticketing/a-gala',
  },
};
