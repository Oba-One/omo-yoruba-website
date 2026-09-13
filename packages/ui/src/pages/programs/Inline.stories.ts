import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { exchange, kids } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Programs/Inline',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `inline` option: Kids & STEM and Cultural Exchange start open or closed behind their quiet toggles, which open and close without JavaScript. Kids & STEM's two halves carry their photographs with every fact Pending; Cultural Exchange names each fact it owes and its photograph.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Expanded: Story = {
  args: {
    options: { inline: 'expanded' },
    slots: { default: [kids('expanded'), exchange('expanded')] },
  },
};

export const Collapsed: Story = {
  args: {
    options: { inline: 'collapsed' },
    slots: { default: [kids('collapsed'), exchange('collapsed')] },
  },
};
