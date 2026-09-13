/**
 * The Collective page's sections as configured components for the page-section stories (ROUTES section
 * 5: one story per layout option). Every part comes from the fixtures; the site composes the same parts
 * in packages/web from `buildCollectivePage`, inside `main` with `data-scope="collective"`, which the
 * stories' root supplies. The section kickers and headings are the page's copy, as on the site. The
 * argument and the one voice are owed (the register invents both), so they wait under their chips.
 */

import { COLLECTIVE_VOICE_SLOT } from '@oy/content/pending';
import PullQuote from '../../cards/PullQuote/PullQuote.astro';
import EventList from '../../content/EventList/EventList.astro';
import Pending from '../../core/Pending/Pending.astro';
import { PHOTOS } from '../../fixtures/photos';
import {
  ARGUMENT_PENDING,
  ASK_TO_JOIN,
  COLLECTIVE_EVENT_PLACEHOLDERS,
  COLLECTIVE_EVENTS_PENDING,
  COLLECTIVE_HEADER,
  COLLECTIVE_TAKE_PART,
  COLLECTIVE_TAKE_PART_INTRO,
  COLLECTIVE_VOICE_PENDING,
  EVENT_VENUE_PENDING,
  INITIATIVE_FACTS_PENDING,
  INITIATIVE_FACTS_PLACEHOLDER,
  INITIATIVE_PLACEHOLDER,
  INITIATIVES,
} from '../../fixtures/program-pages';
import PhotoTile from '../../media/PhotoTile/PhotoTile.astro';
import Handoff from '../../page/Handoff/Handoff.astro';
import Initiative from '../../page/Initiative/Initiative.astro';
import PageHeader from '../../page/PageHeader/PageHeader.astro';
import Section from '../../page/Section/Section.astro';
import SectionHead from '../../page/SectionHead/SectionHead.astro';
import Split from '../../page/Split/Split.astro';
import TakePartBand from '../../page/TakePartBand/TakePartBand.astro';
import type { SlotValue } from '../../storybook';

export const header: SlotValue = {
  component: PageHeader,
  props: { variant: 'slim', ...COLLECTIVE_HEADER },
};

/** The header under `events` hidden: "See what is on" goes with the section it opens. */
export const headerWithoutEvents: SlotValue = {
  component: PageHeader,
  props: {
    variant: 'slim',
    ...COLLECTIVE_HEADER,
    actions: COLLECTIVE_HEADER.actions.filter((action) => action.href !== '#events'),
  },
};

/**
 * Collective events: the rows still to come in the bracketed placeholder form, or, with none (as the
 * development dataset stands), the heading over the registry's Pending line.
 */
export const events = (placeholders: boolean): SlotValue => ({
  component: Section,
  props: { id: 'events', ground: 'alt', labelledby: 'events-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ohun tí ń bọ̀', en: 'Coming up' },
          title: 'Collective events',
          id: 'events-heading',
        },
      },
      {
        component: EventList,
        props: {
          events: placeholders ? COLLECTIVE_EVENT_PLACEHOLDERS : [],
          action: ASK_TO_JOIN,
          pending: COLLECTIVE_EVENTS_PENDING,
          venuePending: EVENT_VENUE_PENDING,
        },
      },
    ],
  },
});

/** Why culture and sustainability sit together: the argument's chip beside the Collective program's photograph. */
export const why: SlotValue = {
  component: Section,
  props: { id: 'why', labelledby: 'why-heading' },
  slots: {
    default: {
      component: Split,
      slots: {
        default: [
          {
            component: SectionHead,
            props: {
              kicker: { yo: 'Ìdí rẹ̀', en: 'Why' },
              title: 'Why culture and sustainability sit together',
              id: 'why-heading',
            },
          },
          { component: Pending, props: { what: ARGUMENT_PENDING } },
        ],
        aside: {
          component: PhotoTile,
          props: {
            shape: 'figure',
            height: 280,
            image: PHOTOS.attendeeSmiling,
            what: 'a photo of Yoruba Cultural Collective',
          },
        },
      },
    },
  },
};

/**
 * Solar Hub and Green Goods as the `initiatives` and `status` options draw them, on alternating grounds.
 * `placeholders` fills the first in the bracketed form to show the layout the Studio's facts will take.
 */
export const initiatives = (
  layout: 'side' | 'stacked',
  status: boolean,
  placeholders = false,
): SlotValue[] =>
  INITIATIVES.map((initiative, index) => {
    const id = initiative._id.replace(/^initiative-/, '');
    const filled = placeholders && index === 0;
    return {
      component: Section,
      props: { id, ground: index % 2 === 1 ? 'alt' : 'white', labelledby: `${id}-heading` },
      slots: {
        default: {
          component: Initiative,
          props: {
            initiative: filled ? INITIATIVE_PLACEHOLDER : initiative,
            facts: filled ? INITIATIVE_FACTS_PLACEHOLDER : INITIATIVE_FACTS_PENDING,
            layout,
            status,
            statusPending: 'the status line',
            blurbPending: 'what the initiative is',
            id: `${id}-heading`,
          },
        },
      },
    };
  });

/** The one voice waiting in its slot: the chip, then the prototype's placeholder form. */
export const voice: SlotValue = {
  component: Section,
  props: { id: 'voice' },
  slots: {
    default: {
      component: PullQuote,
      props: {
        variant: 'single',
        placeholder: COLLECTIVE_VOICE_SLOT,
        pending: COLLECTIVE_VOICE_PENDING,
      },
    },
  },
};

export const takePart: SlotValue = {
  component: Section,
  props: { id: 'take-part', ground: 'alt', labelledby: 'take-part-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ẹ bá wa kọ́', en: 'Build with us' },
          title: 'Build with the Collective',
          intro: COLLECTIVE_TAKE_PART_INTRO,
          id: 'take-part-heading',
        },
      },
      {
        component: TakePartBand,
        props: {
          rows: COLLECTIVE_TAKE_PART,
          pending: 'the ways in',
          rowPending: 'a way in, its title or its button label',
        },
      },
      {
        component: Handoff,
        props: {
          shape: 'box',
          variant: 'quiet',
          text: 'See what the Collective has built so far.',
          action: { label: 'See our impact', kind: 'url', href: '/impact' },
        },
      },
    ],
  },
};
