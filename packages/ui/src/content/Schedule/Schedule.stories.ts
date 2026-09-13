import type { ComponentProps } from 'astro/types';
import { SCHEDULE_PLACEHOLDERS } from '../../fixtures/event-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import Schedule from './Schedule.astro';

type Args = StoryArgs<ComponentProps<typeof Schedule>>;

const meta = {
  title: 'Content/Schedule',
  component: Schedule,
  args: {
    items: SCHEDULE_PLACEHOLDERS,
    toggle: true,
    open: true,
    pending: 'the rows, times and content',
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "An edition's rows in order. On the festival page it sits in a native disclosure, open when the option is shown and closed when collapsed; the Gala lists its running order without one. No rows: the Pending line.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Shown: open, with the quiet toggle. */
export const Default: Story = {};

export const Shown: Story = {};

/** Collapsed: closed until the toggle opens it, with or without JavaScript. */
export const Collapsed: Story = { args: { open: false } };

/** A running order: no toggle, no zone tags. */
export const RunningOrder: Story = {
  args: {
    toggle: false,
    items: SCHEDULE_PLACEHOLDERS.map((item) => ({ ...item, zone: null })),
    pending: 'the running order',
  },
};

/** No rows yet: the Pending line. */
export const Pending: Story = { args: { items: [] } };
