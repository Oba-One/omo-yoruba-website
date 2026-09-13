import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { cards, header, takePart } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Programs/Cards',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `cards` option: the four programs four across, the first three three across (the fourth program's section on the page goes with its card), or all four in pairs. Each card leads with its cadence and ages, Pending until the Studio holds them; the inline programs link to their sections on the page.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Four: Story = {
  args: { options: { cards: 'four' }, slots: { default: [header, cards('four'), takePart] } },
};

export const Three: Story = {
  args: { options: { cards: 'three' }, slots: { default: [header, cards('three'), takePart] } },
};

export const Pairs: Story = {
  args: { options: { cards: 'pairs' }, slots: { default: [header, cards('pairs'), takePart] } },
};
