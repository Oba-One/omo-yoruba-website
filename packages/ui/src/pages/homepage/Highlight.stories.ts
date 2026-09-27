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
          "The `highlight` option: which program the homepage leans on. The highlighted card moves first and takes the gold ring; the hero keeps its own gold button whatever the highlight (ADR 0042), where the prototype swapped it for the program's action.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Festival: Story = { args: { highlight: 'festival' } };

/** The Studio names this value "lessons"; the stored value keeps the prototype's word. */
export const Lessons: Story = {
  args: { highlight: 'school' },
};

export const Collective: Story = {
  args: { highlight: 'collective' },
};
