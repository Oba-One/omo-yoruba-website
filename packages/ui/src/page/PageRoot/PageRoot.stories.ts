import type { ComponentProps } from 'astro/types';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import PageRoot from './PageRoot.astro';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Page/PageRoot',
  component: PageRoot,
  args: {
    options: { phead: 'photo', schedule: 'shown' },
    slots: {
      default: '<p class="oy-wrap">The page-section stories wrap a section in this root.</p>',
    },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** The warm Gala: the treatment option on the root. */
export const Treatment: Story = { args: { options: { treatment: 'warm' } } };

/** The Collective's green scope: the site sets it on the page's main, which keeps green off the nav and footer. */
export const Scope: Story = { args: { options: { green: 'strong' }, scope: 'collective' } };
