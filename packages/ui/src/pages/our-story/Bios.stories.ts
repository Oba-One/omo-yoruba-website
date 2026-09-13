import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { board } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/OurStory/Bios',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `bios` option on the board: each card's role, name and short bio (a missing one its chip), or with `full` the full bio under the short one where it is written. The people here are bracketed placeholders; the Studio holds no board yet.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Short: Story = {
  args: { options: { bios: 'short' }, slots: { default: [board({ bios: 'short' })] } },
};

export const Full: Story = {
  args: { options: { bios: 'full' }, slots: { default: [board({ bios: 'full' })] } },
};
