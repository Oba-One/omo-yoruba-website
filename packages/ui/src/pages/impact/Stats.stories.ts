import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { header, numbers } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Impact/Stats',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `stats` option: the four confirmed figures in the framed grid, or six in two rows of three, where the two cells the page waits for (attendance and learners served) name themselves. Every figure shows the chip for its source line until the Studio holds one.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Four: Story = {
  args: {
    options: { stats: 'four', sources: 'shown' },
    slots: { default: [header, numbers('four')] },
  },
};

export const Six: Story = {
  args: {
    options: { stats: 'six', sources: 'shown' },
    slots: { default: [header, numbers('six')] },
  },
};
