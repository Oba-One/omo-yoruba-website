import type { ComponentProps } from 'astro/types';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import ProgressBar from './ProgressBar.astro';

type Args = StoryArgs<ComponentProps<typeof ProgressBar>>;

const meta = {
  title: 'Page/ProgressBar',
  component: ProgressBar,
  args: { loading: false },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The only page-level motion besides the cross-fade: a 2px gold line at the top while the next page loads. The site sets data-loading on the root element from the router events.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Idle: nothing shows. */
export const Default: Story = {};

/** Loading: the bar grows across the top. */
export const Loading: Story = { args: { loading: true } };
