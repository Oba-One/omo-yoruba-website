import type { ComponentProps } from 'astro/types';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import ReadingGuide from './ReadingGuide.astro';

type Args = StoryArgs<ComponentProps<typeof ReadingGuide>>;

const meta = {
  title: 'Content/ReadingGuide',
  component: ReadingGuide,
  args: {
    sections: [
      { slug: 'get-started', text: 'Get started' },
      { slug: 'before-you-publish', text: 'Before you publish' },
    ],
    slots: {
      default:
        '<h1>Your guide to Studio</h1><h2 id="get-started">Get started</h2><p>Changes save as a <strong>draft</strong> while you work.</p><h2 id="before-you-publish">Before you publish</h2><p>Use confirmed facts and short sentences.</p>',
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};
