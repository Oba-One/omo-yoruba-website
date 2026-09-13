import type { ComponentProps } from 'astro/types';
import { EVENTBRITE_STAND_IN, TIER_PLACEHOLDERS } from '../../fixtures/event-pages';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import TicketTierCard from './TicketTierCard.astro';

type Args = StoryArgs<ComponentProps<typeof TicketTierCard>>;

const [seat, pair, table] = TIER_PLACEHOLDERS;

const meta = {
  title: 'Cards/TicketTierCard',
  component: TicketTierCard,
  args: { tier: seat as Args['tier'], ticketsUrl: EVENTBRITE_STAND_IN },
  decorators: [wrap('oy-tiers')],
  parameters: {
    docs: {
      description: {
        component:
          "A ticket tier: name, price, what it includes and one button. Buy now leaves for the edition's Eventbrite event in a new tab, with the notice on the card, or shows the Pending chip while the edition holds no link; the table tier opens its enquiry. The featured tier wears the gold ring. The names, prices and includes here are placeholders: the Studio holds no tiers yet.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Buy now with the edition's link: the outline button and the new-tab notice. */
export const BuyNow: Story = {};

/** Buy now before the edition holds its Eventbrite link: the chip where the button goes. */
export const BuyNowNoLink: Story = { args: { ticketsUrl: null } };

/** The featured tier with the block's gold button. */
export const Featured: Story = { args: { tier: pair as Args['tier'], primary: true } };

/** The table tier: invoiced by hand, the button opens the table enquiry. */
export const Enquiry: Story = { args: { tier: table as Args['tier'] } };

/** A tier still owed its price and its includes. */
export const Pending: Story = {
  args: {
    tier: { _id: 'tier-owed', name: '[ A single seat ]', variant: 'buyNow' },
    ticketsUrl: null,
  },
};
