import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { gifts, give, header, larger, other, trust } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Donate/Impact',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The `impact` option: what your gift does shown (each giving level as an outcome card: the amount, what it pays for and where the cost comes from, each owed one its chip; the Pending line while the Studio holds none) or hidden. The page's one gold action is the header's Give now; the give-now facts that depend on the Zeffy form are owed. The levels here are bracketed placeholders.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** As the development dataset stands: no giving level, no other way to give, the EIN owed. */
export const Shown: Story = {
  args: {
    options: { impact: 'shown' },
    slots: { default: [header, give, larger, gifts(false), other, trust] },
  },
};

/** Levels in the bracketed form, to show the layout a confirmed level takes. */
export const WithLevels: Story = {
  args: { options: { impact: 'shown' }, slots: { default: [gifts(true)] } },
};

export const Hidden: Story = {
  args: { options: { impact: 'hidden' }, slots: { default: [header, give, larger, other, trust] } },
};
