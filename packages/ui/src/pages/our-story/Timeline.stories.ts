import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { board, founding, header, timeline } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/OurStory/Timeline',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `timeline` option: hidden by default until the owner confirms they want a timeline and its entries (wayfinder ticket 07), or shown between how it began and the board, each entry's year and one line with the milestones apart, or the Pending line with no entries. The entries here are bracketed placeholders.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The default: how it began, then the board, as the development dataset stands. */
export const Hidden: Story = {
  args: {
    options: { timeline: 'hidden' },
    slots: { default: [header, founding, board({ listed: false })] },
  },
};

export const Shown: Story = {
  args: { options: { timeline: 'shown' }, slots: { default: [founding, timeline(true)] } },
};

/** Shown with no entries in the Studio: the Pending line. */
export const ShownPending: Story = {
  args: { options: { timeline: 'shown' }, slots: { default: [timeline(false)] } },
};
