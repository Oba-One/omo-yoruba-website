/**
 * The Collective page's sections as configured components for the page-section stories (ROUTES section
 * 5: one story per layout option). Every part comes from the fixtures; the site composes the same parts
 * in packages/web from `buildCollectivePage`, inside `main` with `data-scope="collective"`, which the
 * stories' root supplies. The section kickers and headings are the page's copy, as on the site. The
 * argument and the one voice are owed (the register invents both), so they wait under their chips.
 */

import { COLLECTIVE_VOICE_SLOT } from '@oy/content/pending';
import PullQuote from '../../cards/PullQuote/PullQuote.astro';
import Pending from '../../core/Pending/Pending.astro';
import { PHOTOS } from '../../fixtures/photos';
import {
  ARGUMENT_PENDING,
  COLLECTIVE_HEADER,
  COLLECTIVE_TAKE_PART,
  COLLECTIVE_TAKE_PART_INTRO,
  COLLECTIVE_VOICE_PENDING,
} from '../../fixtures/program-pages';
import PhotoTile from '../../media/PhotoTile/PhotoTile.astro';
import Handoff from '../../page/Handoff/Handoff.astro';
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
            image: PHOTOS.attendeeSmiling,
            what: 'a photo of Yoruba Cultural Collective',
          },
        },
      },
    },
  },
};

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
