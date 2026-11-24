import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { learn, lesson, takePart } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Lessons/Lesson',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The optional lesson steps, shown or hidden. Unconfirmed teaching content stays hidden. Shown uses bracketed steps to preview the layout, and Pending shows the request for the lesson's shape.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Shown: Story = {
  args: { options: { lesson: 'shown' }, slots: { default: [learn, lesson(true), takePart] } },
};

export const Pending: Story = {
  args: { options: { lesson: 'shown' }, slots: { default: [learn, lesson(false), takePart] } },
};

export const Hidden: Story = {
  args: { options: { lesson: 'hidden' }, slots: { default: [learn, takePart] } },
};
