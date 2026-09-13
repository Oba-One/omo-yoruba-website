import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { initiatives } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Collective/Status',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `status` option: each initiative's status pill above its name, or the registry's chip while the status line is owed; hidden takes both away and keeps the status among the facts.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Shown: Story = {
  args: {
    options: { status: 'shown' },
    scope: 'collective',
    slots: { default: initiatives('side', true, true) },
  },
};

export const Hidden: Story = {
  args: {
    options: { status: 'hidden' },
    scope: 'collective',
    slots: { default: initiatives('side', false, true) },
  },
};
