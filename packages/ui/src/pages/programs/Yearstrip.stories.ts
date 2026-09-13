import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { takePart, year } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Programs/Yearstrip',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `yearstrip` option: When things run shown with the impact handoff under it, or hidden, which leaves the take-part band next. The events' months are confirmed; the programs' whens wait as Pending until the Studio holds them.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Shown: Story = {
  args: { options: { yearstrip: 'shown' }, slots: { default: [year, takePart] } },
};

export const Hidden: Story = {
  args: { options: { yearstrip: 'hidden' }, slots: { default: [takePart] } },
};
