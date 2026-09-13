import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { plan, schedule } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Odunde/Schedule',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `schedule` option: the day hour by hour shown open with its quiet toggle, collapsed behind it, or hidden, which leaves plan your visit next. The rows name what they wait for; with no rows in the Studio the section shows its Pending line.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Shown: Story = {
  args: { options: { schedule: 'shown' }, slots: { default: [schedule('shown'), plan] } },
};

export const Collapsed: Story = {
  args: { options: { schedule: 'collapsed' }, slots: { default: [schedule('collapsed'), plan] } },
};

export const Hidden: Story = {
  args: { options: { schedule: 'hidden' }, slots: { default: [plan] } },
};
