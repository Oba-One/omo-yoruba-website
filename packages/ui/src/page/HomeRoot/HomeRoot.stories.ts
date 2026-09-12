import type { ComponentProps } from 'astro/types';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import HomeRoot from './HomeRoot.astro';

type Args = StoryArgs<ComponentProps<typeof HomeRoot>>;

const meta = {
  title: 'Page/HomeRoot',
  component: HomeRoot,
  args: { slots: { default: '<p>The page root: the layout options as data attributes.</p>' } },
  parameters: {
    docs: {
      description: {
        component:
          'The page root the prototype carries: the grain-dots card texture and the data attributes the layout options drive, which the ported CSS reads. The site puts the same attributes on the body; the Pages stories wrap a section in this.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Subtle: Story = {
  args: { pattern: 'subtle', motion: 'off', highlight: 'collective' },
};
