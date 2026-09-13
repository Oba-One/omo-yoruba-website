import type { ComponentProps } from 'astro/types';
import { PLAN_FACTS } from '../../fixtures/event-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import FactList from './FactList.astro';

type Args = StoryArgs<ComponentProps<typeof FactList>>;

const meta = {
  title: 'Content/FactList',
  component: FactList,
  args: { facts: PLAN_FACTS },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Plan your visit: a label and the fact beside it, two columns wide. The seed holds the eight labels and none of the facts, which the prototype invents.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The eight labels as the seed writes them, every fact owed. */
export const Default: Story = {};

/** A fact the Studio holds reads as text. */
export const Mixed: Story = {
  args: {
    facts: [{ label: 'Getting there', value: 'Leimert Park' }, ...PLAN_FACTS.slice(1, 4)],
  },
};

/** No facts at all: the Pending line. */
export const Pending: Story = { args: { facts: [], pending: 'the eight practical facts' } };

/** One column, as a card or a narrow split holds its facts (Kids & STEM, Cultural Exchange). */
export const OneColumn: Story = {
  args: {
    columns: 1,
    facts: [
      { label: 'Ages', pending: 'ages and what they build' },
      { label: 'What they build', pending: 'ages and what they build' },
    ],
  },
};

/** A fact that is a link, as the contact block writes its email and phone; an unsafe link stays text. */
export const Linked: Story = {
  args: {
    columns: 1,
    facts: [
      { label: 'Email', value: '[ inbox@example.org ]', href: 'mailto:inbox@example.org' },
      { label: 'Website', value: '[ A link ]', href: 'javascript:alert(1)' },
    ],
  },
};
