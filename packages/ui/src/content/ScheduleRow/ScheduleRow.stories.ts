import type { ComponentProps } from 'astro/types';
import { SCHEDULE_PLACEHOLDERS } from '../../fixtures/event-pages';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import ScheduleRow from './ScheduleRow.astro';

type Args = StoryArgs<ComponentProps<typeof ScheduleRow>>;

const first = SCHEDULE_PLACEHOLDERS[0] as (typeof SCHEDULE_PLACEHOLDERS)[number];

const meta = {
  title: 'Content/ScheduleRow',
  component: ScheduleRow,
  args: { item: first, mode: 'time' },
  decorators: [wrap('oy-sched')],
  parameters: {
    docs: {
      description: {
        component:
          'One row of a schedule, time-led or day-led, with the zone tag on the festival. The prototypes invent every time and event, so the rows here name what they wait for; the time is the chip.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/** Time-led: the time in the display face (Pending until the Studio holds it). */
export const TimeLed: Story = {};

/** Day-led: the day as a terracotta label. */
export const DayLed: Story = { args: { mode: 'day' } };

/** A day-led row with the page's own wording: a lesson's step without its place. */
export const DayLedWording: Story = { args: { mode: 'day', timePending: 'the step' } };

/** Without a zone, as the Gala's running order sets its rows. */
export const WithoutZone: Story = { args: { item: { ...first, zone: null } } };
