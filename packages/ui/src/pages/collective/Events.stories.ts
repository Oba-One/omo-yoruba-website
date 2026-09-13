import type { ComponentProps } from 'astro/types';
import PageRoot from '../../page/PageRoot/PageRoot.astro';
import type { Meta, StoryArgs, StoryObj } from '../../storybook';
import { events, header, headerWithoutEvents, initiatives, why } from './sections';

type Args = StoryArgs<ComponentProps<typeof PageRoot>>;

const meta = {
  title: 'Pages/Collective/Events',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The `events` option: the Collective\'s dated events still to come, nearest first (ADR 0030), each with a quiet "Ask to join" opening the contact form; with none, the heading over the registry\'s Pending line. Hidden takes the section away with the header\'s "See what is on". The Studio holds no collective events, so shown rows are bracketed placeholders.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Two events to come, in the bracketed placeholder form. */
export const Shown: Story = {
  args: {
    options: { events: 'shown' },
    scope: 'collective',
    slots: { default: [header, why, events(true), ...initiatives('side', true)] },
  },
};

/** Nothing to come, as the development dataset stands: the Pending line. */
export const Pending: Story = {
  args: {
    options: { events: 'shown' },
    scope: 'collective',
    slots: { default: [header, why, events(false), ...initiatives('side', true)] },
  },
};

export const Hidden: Story = {
  args: {
    options: { events: 'hidden' },
    scope: 'collective',
    slots: { default: [headerWithoutEvents, why, ...initiatives('side', true)] },
  },
};
