import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { seats } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Gala/Emphasis',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `emphasis` option: seats keep the Studio order; tables move the table tier to the front in the markup. The gold ring stays on the tier the Studio features.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Seats: Story = {
  args: { options: { emphasis: 'seats' }, slots: { default: [seats('columns', 'seats')] } },
};

export const Tables: Story = {
  args: { options: { emphasis: 'tables' }, slots: { default: [seats('columns', 'tables')] } },
};
