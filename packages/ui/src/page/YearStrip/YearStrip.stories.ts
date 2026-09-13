import type { ComponentProps } from 'astro/types';
import { YEAR_STRIP, YEAR_WHEN_PENDING } from '../../fixtures/program-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import YearStrip from './YearStrip.astro';

type Args = StoryArgs<ComponentProps<typeof YearStrip>>;

const meta = {
  title: 'Page/YearStrip',
  component: YearStrip,
  args: { rows: YEAR_STRIP, whenPending: YEAR_WHEN_PENDING, pending: 'when each program runs' },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "When things run on the Programs hub (`10 Programs.dc.html`): one column per program or event across a year, each its when as a terracotta label (the registry's chip while the Studio holds none), its name and a short note. Five columns wide, two under 1000px. The seed holds June and November or December for the events and no cadence for the programs, which the prototype invents.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The five rows as the seed writes them: the events' months, the programs' whens owed. */
export const Default: Story = {};

/** Every when in the Studio, in the bracketed placeholder form. */
export const Filled: Story = {
  args: { rows: YEAR_STRIP.map((row) => ({ ...row, when: row.when ?? '[ When ]' })) },
};

/** Four rows: four columns. */
export const Four: Story = { args: { rows: YEAR_STRIP.slice(0, 4) } };

/** At 375 the columns fall into two. */
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };

/** No rows in the Studio: the registry's Pending line. */
export const Pending: Story = { args: { rows: [] } };
