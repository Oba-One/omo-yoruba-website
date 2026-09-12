import type { ComponentProps } from 'astro/types';
import HomeRoot from '../../page/HomeRoot/HomeRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { hero, programs } from './sections';

type Args = StoryArgs<ComponentProps<typeof HomeRoot>>;

const meta = {
  title: 'Pages/Homepage/Highlight',
  component: HomeRoot,
  args: { slots: { default: [hero(false), programs] } },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `highlight` option: which program the homepage leans on. The highlighted card moves first and takes the gold ring, and the hero's gold button becomes that program's own action, as the prototype swaps it; `festival` keeps the hero's own button.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Festival: Story = { args: { highlight: 'festival' } };

/** The Studio names this value "lessons"; the stored value keeps the prototype's word. */
export const Lessons: Story = {
  args: { highlight: 'school', slots: { default: [hero(false, 'school'), programs] } },
};

export const Collective: Story = {
  args: { highlight: 'collective', slots: { default: [hero(false, 'collective'), programs] } },
};
