import type { ComponentProps } from 'astro/types';
import { STATS } from '../../fixtures/homepage';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import StatStrip from './StatStrip.astro';

type Args = StoryArgs<ComponentProps<typeof StatStrip>>;

const meta = {
  title: 'Page/StatStrip',
  component: StatStrip,
  args: { stats: STATS },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The headline figures: big serif numbers with a small label each, on white with the corner dot fields. The Impact page turns the source lines on; a figure without a source shows the Pending chip the registry names.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The four seeded figures, no source lines: the homepage. */
export const Four: Story = {};

/** Six across: the Impact page's option. The two extra figures are the seeded ones repeated to show the layout. */
export const Six: Story = { args: { stats: [...STATS, ...STATS.slice(0, 2)] } };

/** With source lines: every seeded figure still waits for its source, so each shows the chip. */
export const WithSources: Story = { args: { sources: true } };

/** One figure sourced (an illustrative line, from no dataset), the rest Pending. */
export const WithOneSource: Story = {
  args: {
    sources: true,
    stats: STATS.map((stat, index) =>
      index === 0 ? { ...stat, source: 'Founding date, 1997' } : stat,
    ),
  },
};

/** No figures: the Pending line. */
export const Pending: Story = { args: { stats: [] } };
