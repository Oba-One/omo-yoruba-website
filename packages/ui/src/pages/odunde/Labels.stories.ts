import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { takePart } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Odunde/Labels',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `labels` option of the take-part band: every chip one width in a column, no chips, or the chips as small kickers above each heading.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Column: Story = {
  args: { options: { labels: 'column' }, slots: { default: [takePart('vendor', 'column')] } },
};

export const None: Story = {
  args: { options: { labels: 'none' }, slots: { default: [takePart('vendor', 'none')] } },
};

export const Kicker: Story = {
  args: { options: { labels: 'kicker' }, slots: { default: [takePart('vendor', 'kicker')] } },
};
