import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { numbers, outcomes } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Impact/Sources',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `sources` option: every figure's source line shown (with its chip while owed) or hidden, under the headline numbers and the outcomes alike, taking the lead that promises them with it. The first outcome is a bracketed placeholder with its figure and source.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Shown: Story = {
  args: {
    options: { sources: 'shown' },
    slots: {
      default: [
        numbers('four', 'shown'),
        outcomes('cards', { sources: 'shown', placeholder: true }),
      ],
    },
  },
};

export const Hidden: Story = {
  args: {
    options: { sources: 'hidden' },
    slots: {
      default: [
        numbers('four', 'hidden'),
        outcomes('cards', { sources: 'hidden', placeholder: true }),
      ],
    },
  },
};
