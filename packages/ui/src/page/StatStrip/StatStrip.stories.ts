import type { ComponentProps } from 'astro/types';
import { HOMEPAGE_STATS, STATS } from '../../fixtures/homepage';
import { IMPACT_SIX_PENDING, IMPACT_STATS } from '../../fixtures/trust-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import StatStrip from './StatStrip.astro';

type Args = StoryArgs<ComponentProps<typeof StatStrip>>;

const meta = {
  title: 'Page/StatStrip',
  component: StatStrip,
  args: { stats: HOMEPAGE_STATS },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The headline figures: big serif numbers with a small label each. The band is the homepage's, on white with the corner dot fields; the framed grid is Impact's, inside its section, with the source lines on. A figure without a source shows the Pending chip the registry names, and under Impact's six the empty cells wait for attendance and learners served.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The four seeded figures with the short labels, no source lines: the homepage. */
export const Default: Story = {};

export const Four: Story = {};

/** Six across: the Impact page's option. The two extra figures are the seeded ones repeated to show the layout. */
export const Six: Story = { args: { stats: [...STATS, ...STATS.slice(0, 2)] } };

/** With source lines and the full labels: every seeded figure still waits for its source, so each shows the chip. */
export const WithSources: Story = { args: { sources: true, stats: STATS } };

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

/** Impact's framed grid: the four seeded figures in its order, each waiting for its source line. */
export const Framed: Story = { args: { variant: 'framed', sources: true, stats: IMPACT_STATS } };

/** Impact's six with the four seeded figures: the two empty cells name what they wait for. */
export const FramedSix: Story = {
  args: {
    variant: 'framed',
    sources: true,
    stats: IMPACT_STATS,
    columns: 6,
    padPending: IMPACT_SIX_PENDING,
  },
};

/** Impact's grid with its source lines hidden. */
export const FramedSourcesHidden: Story = { args: { variant: 'framed', stats: IMPACT_STATS } };

/** Impact's grid with no figures: the Pending line. */
export const FramedPending: Story = {
  args: {
    variant: 'framed',
    stats: [],
    what: 'the headline figures',
    padPending: IMPACT_SIX_PENDING,
    columns: 6,
  },
};
