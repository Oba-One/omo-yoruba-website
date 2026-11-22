import type { ComponentProps } from 'astro/types';
import { FESTIVAL_HEADER, GALA_HEADER } from '../../fixtures/event-pages';
import { type Meta, type StoryArgs, type StoryObj, wrap } from '../../storybook';
import EventCard from './EventCard.astro';

type Args = StoryArgs<ComponentProps<typeof EventCard>>;

const festival = {
  kind: 'festival',
  href: '/odunde',
  kicker: FESTIVAL_HEADER.kicker,
  title: FESTIVAL_HEADER.title,
  line: FESTIVAL_HEADER.line,
  image: FESTIVAL_HEADER.image.src,
  where: 'Leimert Park',
} satisfies Args['event'];

const meta = {
  title: 'Cards/EventCard',
  component: EventCard,
  args: { event: festival },
  decorators: [wrap('sb-oy-narrow')],
  parameters: {
    docs: {
      description: {
        component:
          "One of the two events the year turns on, as the homepage introduces them: the event page's own photograph, kicker, name and line, when and where the next edition is once the Studio holds them, and one quiet link to the page. Two across through the CardGrid.",
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Odunde between editions: the venue's name, no date yet. */
export const Default: Story = {};

/** The Gala with its next edition's date and venue, as the Studio holds them. */
export const Gala: Story = {
  args: {
    event: {
      kind: 'gala',
      href: '/gala',
      kicker: GALA_HEADER.kicker,
      title: GALA_HEADER.title,
      line: GALA_HEADER.line,
      image: GALA_HEADER.image.src,
      when: 'Saturday 28 November 2026',
      where: 'Yorba Linda Community Center',
    },
  },
};

/** Nothing from the Studio yet: the page's name, the placeholder that names the photograph and the link. */
export const Pending: Story = { args: { event: { kind: 'festival', href: '/odunde' } } };

export const Hover: Story = { parameters: { pseudo: { hover: '.oy-card' } } };
