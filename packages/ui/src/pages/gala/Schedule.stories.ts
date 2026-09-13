import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { evening, seam } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Gala/Schedule',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `schedule` option: the running order beside the evening intro, or no column. The rows name what they wait for; with no rows in the Studio the column shows its Pending line.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Shown: Story = {
  args: { options: { schedule: 'shown' }, slots: { default: [evening('shown'), seam] } },
};

export const Hidden: Story = {
  args: { options: { schedule: 'hidden' }, slots: { default: [evening('hidden'), seam] } },
};
