import { OUTCOME_PENDING } from '@oy/content/pending';
import type { ComponentProps } from 'astro/types';
import { OUTCOME_PLACEHOLDER } from '../../fixtures/trust-pages';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import OutcomeCard from './OutcomeCard.astro';

type Args = StoryArgs<ComponentProps<typeof OutcomeCard>>;

/** Owed content in the bracketed placeholder form: no outcome, figure or source is confirmed yet. */
const FIGURE = OUTCOME_PLACEHOLDER;

const meta = {
  title: 'Cards/OutcomeCard',
  component: OutcomeCard,
  args: FIGURE,
  decorators: [wrap('sb-oy-narrow')],
  parameters: {
    docs: {
      description: {
        component:
          "What a program, an event or a gift produces (Impact's outcomes, Donate's giving levels): the subject's name, the figure, what it counts and the source line under it, or the plain statement of what is being measured when there is no figure. Every owed part shows the registry's chip; the values here are bracketed placeholders.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** A figure with its line and its source. */
export const Default: Story = {};

export const WithFigure: Story = {};

/** A figure whose source is owed: the chip where the source line goes. */
export const SourcePending: Story = { args: { source: null } };

/** No figure yet: the plain statement alone, no source line. */
export const Statement: Story = {
  args: { figure: null, source: null, line: '[ What is being measured this year ]' },
};

/** Neither figure nor statement: the chip the page names (a slot, as Impact keeps one per subject). */
export const Pending: Story = {
  args: {
    figure: null,
    line: null,
    source: null,
    title: 'Kids & STEM',
    pending: OUTCOME_PENDING,
  },
};

/** A giving level on Donate: the amount as the figure, no subject, what the gift does and the source. */
export const GivingLevel: Story = {
  args: {
    title: null,
    figure: '[ Amount ]',
    line: '[ What the gift pays for ]',
    source: '[ Where the cost comes from ]',
  },
};

/** Under Impact's `sources: hidden`: the figure and its line, no source line or chip. */
export const SourcesHidden: Story = { args: { sources: false, source: null } };

/** The row form: the name, the figure and the line on one line, the source under them. */
export const Row: Story = {
  args: { variant: 'row' },
  decorators: [wrap('sb-oy-wide')],
  globals: { viewport: { value: 'desktop' } },
};
