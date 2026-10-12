import type { ComponentProps } from 'astro/types';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import ReadingGuide from './ReadingGuide.astro';
import ReadingGuideSample from './ReadingGuideSample.astro';

type Args = StoryArgs<ComponentProps<typeof ReadingGuide>>;

const meta = {
  title: 'Content/ReadingGuide',
  component: ReadingGuide,
  args: {
    sections: [
      { slug: 'add-or-change-a-person', text: 'Add or change a person' },
      { slug: 'check-your-work-and-publish', text: 'Check your work and publish' },
    ],
    slots: { default: { component: ReadingGuideSample } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A step-by-step guide read beside the tool it describes. On a wide screen the list of tasks stays in view while the steps scroll; on a narrow one it sits above them. The reading column takes rendered Markdown: numbered steps, a figure for a screenshot with its caption, and an aside for a note that is not a step.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};
