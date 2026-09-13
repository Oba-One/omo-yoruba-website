import type { ComponentProps } from 'astro/types';
import { TIMELINE_PLACEHOLDERS } from '../../fixtures/trust-pages';
import { type Meta, onDark, type StoryArgs, type StoryObj } from '../../storybook';
import Timeline from './Timeline.astro';

type Args = StoryArgs<ComponentProps<typeof Timeline>>;

/**
 * Entries in the bracketed placeholder form: the prototype's dates and lines are invented, so no year a
 * story shows is one of them. Wayfinder ticket 07 decides whether the page shows a timeline at all.
 */
const ENTRIES = TIMELINE_PLACEHOLDERS;

const meta = {
  title: 'Content/Timeline',
  component: Timeline,
  args: { entries: ENTRIES },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Our Story's years: each entry's year or span and its one line down the hairline, a milestone's dot in terracotta. With no entries, the registry's Pending line. The entries here are bracketed placeholders; the page keeps the timeline hidden until the owner confirms it.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** With its milestones: the founding and today. */
export const Milestones: Story = {};

/** No entry has a milestone. */
export const Plain: Story = {
  args: { entries: ENTRIES.map((entry) => ({ ...entry, milestone: false })) },
};

/** No entries: the Pending line. */
export const Pending: Story = { args: { entries: [] } };

export const OnDark: Story = { ...onDark };
