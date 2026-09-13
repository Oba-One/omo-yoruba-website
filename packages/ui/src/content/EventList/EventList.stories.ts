import type { ComponentProps } from 'astro/types';
import {
  ASK_TO_JOIN,
  COLLECTIVE_EVENT_PLACEHOLDERS,
  COLLECTIVE_EVENTS_PENDING,
  EVENT_VENUE_PENDING,
} from '../../fixtures/program-pages';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import EventList from './EventList.astro';

type Args = StoryArgs<ComponentProps<typeof EventList>>;

const meta = {
  title: 'Content/EventList',
  component: EventList,
  args: {
    events: COLLECTIVE_EVENT_PLACEHOLDERS,
    action: ASK_TO_JOIN,
    pending: COLLECTIVE_EVENTS_PENDING,
    venuePending: EVENT_VENUE_PENDING,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "A list of event rows: the Collective's events still to come, nearest first, each with its date block, title, summary, weekday and time with the venue or its chip, and a quiet action. The Studio holds no collective events yet, so the rows here are bracketed placeholders, and with none the list shows the registry's Pending line.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Two events in the bracketed placeholder form, the second still owed its venue. */
export const Default: Story = {};

/** Nothing to come: the Pending line, as the development dataset stands. */
export const Pending: Story = { args: { events: [] } };
