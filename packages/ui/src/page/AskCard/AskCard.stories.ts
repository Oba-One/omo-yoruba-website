import type { ComponentProps } from 'astro/types';
import { FUND } from '../../fixtures/trust-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import AskCard from './AskCard.astro';

type Args = StoryArgs<ComponentProps<typeof AskCard>>;

const meta = {
  title: 'Page/AskCard',
  component: AskCard,
  args: {
    id: 'fund',
    kicker: FUND.kicker,
    title: FUND.title,
    line: FUND.line,
    linePending: FUND.linePending,
    action: FUND.actions[0],
    secondAction: FUND.actions[1],
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "An ask set as a card at the foot of a section: kicker, heading and one line on the left, the gold button and an optional outline on the right. The registry's chip follows the line while a fact in it is owed. Impact closes its partners and funders with it.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Impact's ask as the dataset stands: the line owes how soon the partnerships lead replies. */
export const Default: Story = {};

/** The line whole, once the Studio holds the reply time. */
export const Whole: Story = {
  args: { line: '[ Name ], our partnerships lead, answers [ how soon ].', linePending: undefined },
};

/** Alone in its section, as Impact draws it with the partners hidden: the heading is the section's own. */
export const SectionHeading: Story = {
  args: { id: undefined, headingId: 'fund-heading', level: 2 },
};

/** Nothing of the line yet: the registry's chip stands where it goes. */
export const Pending: Story = { args: { line: undefined } };

/** One button, no kicker and no line. */
export const Bare: Story = {
  args: { kicker: undefined, line: undefined, linePending: undefined, secondAction: undefined },
};
