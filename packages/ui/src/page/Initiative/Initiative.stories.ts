import type { ComponentProps } from 'astro/types';
import {
  INITIATIVE_FACTS_PENDING,
  INITIATIVE_FACTS_PLACEHOLDER,
  INITIATIVE_PLACEHOLDER,
  INITIATIVES,
} from '../../fixtures/program-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import Initiative from './Initiative.astro';

type Args = StoryArgs<ComponentProps<typeof Initiative>>;

const meta = {
  title: 'Page/Initiative',
  component: Initiative,
  args: {
    initiative: INITIATIVES[0],
    facts: INITIATIVE_FACTS_PENDING,
    id: 'solar-hub-heading',
    statusPending: 'the status line',
    blurbPending: 'what the initiative is',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "One of the Collective's initiatives (`12 Yoruba Cultural Collective.dc.html`, CONTEXT, Initiative): the status pill from its status line or the registry's chip, the member-led pill, the heading, the blurb or its chip, the four facts inside the column, and the photograph or a placeholder naming the project, the copy beside it or above it. Green stays inside the Collective's scope, which the section carries.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** As the seed leaves Solar Hub: its name and member-led, every fact owed. */
export const Default: Story = {};

/** The bracketed placeholder form, with a photograph, to show the layout the Studio's facts will take. */
export const Filled: Story = {
  args: { initiative: INITIATIVE_PLACEHOLDER, facts: INITIATIVE_FACTS_PLACEHOLDER },
};

/** The `initiatives` option's stacked form: the copy above the photograph. */
export const Stacked: Story = {
  args: {
    initiative: INITIATIVE_PLACEHOLDER,
    facts: INITIATIVE_FACTS_PLACEHOLDER,
    layout: 'stacked',
  },
};

/** The `status` option hidden: no status pill and no chip for it; the status fact stays. */
export const StatusHidden: Story = { args: { status: false } };
