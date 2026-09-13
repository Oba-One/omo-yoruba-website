import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { initiatives, voice } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Collective/Initiatives',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `initiatives` option: each initiative's copy beside its photograph (side) or above it (stacked). Solar Hub is shown in the bracketed placeholder form to show the layout; Green Goods as the seed leaves it, every status, date, reach and product owed, since the register invents them all.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Side: Story = {
  args: {
    options: { initiatives: 'side' },
    scope: 'collective',
    slots: { default: [...initiatives('side', true, true), voice] },
  },
};

export const Stacked: Story = {
  args: {
    options: { initiatives: 'stacked' },
    scope: 'collective',
    slots: { default: [...initiatives('stacked', true, true), voice] },
  },
};
