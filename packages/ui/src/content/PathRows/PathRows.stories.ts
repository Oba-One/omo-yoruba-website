import type { ComponentProps } from 'astro/types';
import PathRow from '../../cards/PathRow/PathRow.astro';
import { DOORS } from '../../fixtures/homepage';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import PathRows from './PathRows.astro';

type Args = StoryArgs<ComponentProps<typeof PathRows>>;

const rows = DOORS.map((door, index) => ({
  component: PathRow,
  props: { door, primary: index === 0 },
}));

const meta = {
  title: 'Content/PathRows',
  component: PathRows,
  args: { labels: 'column', slots: { default: rows } },
  parameters: {
    docs: {
      description: {
        component:
          'The rows arrangement of the doors: one width for every chip by default, no chips, or the chips as small kickers above the heading.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Column: Story = {};

export const NoLabels: Story = { args: { labels: 'none' } };

export const Kicker: Story = { args: { labels: 'kicker' } };

/** Doors the Studio still owes: each row names what is missing. */
export const Pending: Story = {
  args: {
    slots: {
      default: [
        { component: PathRow, props: { door: {} } },
        { component: PathRow, props: { door: {} } },
      ],
    },
  },
};
