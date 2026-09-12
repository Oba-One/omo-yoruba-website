import type { ComponentProps } from 'astro/types';
import HomeRoot from '../../page/HomeRoot/HomeRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { programs } from './sections';

type Args = StoryArgs<ComponentProps<typeof HomeRoot>>;

const meta = {
  title: 'Pages/Homepage/Highlight',
  component: HomeRoot,
  args: { slots: { default: programs } },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `highlight` option: which program the homepage leans on. The highlighted card moves first and takes the gold ring; the hero shows the one primary action the Studio holds either way.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Festival: Story = { args: { highlight: 'festival' } };

/** The Studio names this value "lessons"; the stored value keeps the prototype's word. */
export const Lessons: Story = { args: { highlight: 'school' } };

export const Collective: Story = { args: { highlight: 'collective' } };
