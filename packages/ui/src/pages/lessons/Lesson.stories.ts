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
          "The `lesson` option: What a lesson looks like, shown after What you learn, or hidden. The Studio holds no steps yet (the register marks the prototype's invented), so Shown draws the rows in the bracketed placeholder form to show the layout, and Pending shows the registry's line as the development dataset stands.",
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
