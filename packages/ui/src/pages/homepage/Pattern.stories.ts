import type { ComponentProps } from 'astro/types';
import HomeRoot from '../../page/HomeRoot/HomeRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { eventBand, voices } from './sections';

type Args = StoryArgs<ComponentProps<typeof HomeRoot>>;

const meta = {
  title: 'Pages/Homepage/Pattern',
  component: HomeRoot,
  args: { slots: { default: [eventBand('gala'), voices] } },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `pattern` option: `rich` keeps the motif columns, the batik wash and the drifting dots at their full low opacity; `subtle` dims them further. Texture, never costume.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Rich: Story = { args: { pattern: 'rich' } };

export const Subtle: Story = { args: { pattern: 'subtle' } };
