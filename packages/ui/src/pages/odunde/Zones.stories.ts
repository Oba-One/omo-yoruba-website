import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { zones } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Odunde/Zones',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `zones` option: the plaza as a mosaic with the market tall (the default), five across, a grid of three, or a list. The two named zones lead; two placeholder cards name the zones the festival is still owed.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Mosaic: Story = {
  args: { options: { zones: 'mosaic' }, slots: { default: zones('mosaic') } },
};

export const Five: Story = {
  args: { options: { zones: 'five' }, slots: { default: zones('five') } },
};

export const Grid: Story = {
  args: { options: { zones: 'grid' }, slots: { default: zones('grid') } },
};

export const List: Story = {
  args: { options: { zones: 'list' }, slots: { default: zones('list') } },
};
