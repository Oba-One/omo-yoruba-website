/**
 * The Gala page's sections as configured components for the page-section stories (ROUTES section 5:
 * one story per layout option, so the owner compares the values without touching content). Every
 * part comes from the fixtures; the site composes the same parts in packages/web from
 * `buildGalaPage`. The section kickers and headings are the page's copy, as on the site.
 */

import PersonCard from '../../cards/PersonCard/PersonCard.astro';
import { countWord } from '../../content/count-word';
import Prose from '../../content/Prose/Prose.astro';
import Schedule from '../../content/Schedule/Schedule.astro';
import SponsorLevels from '../../content/SponsorLevels/SponsorLevels.astro';
import TicketTiers from '../../content/TicketTiers/TicketTiers.astro';
import ActionButton from '../../core/ActionButton/ActionButton.astro';
import Button from '../../core/Button/Button.astro';
import Divider from '../../core/Divider/Divider.astro';
import {
  GALA_ALBUM_CREDIT,
  GALA_EVENING_INTRO,
  GALA_GLANCE,
  GALA_GLANCE_CAPTION,
  GALA_HEADER,
  GALA_HONOREES_INTRO,
  GALA_META,
  GALA_PAST_SLIDES,
  GALA_RUNNING_ORDER_PLACEHOLDERS,
  GALA_SPONSOR_INTRO,
  GALA_TAKE_PART,
  GALA_TIERS_INTRO,
  HONOREE_PLACEHOLDERS,
  SPONSOR_LEVEL_PLACEHOLDERS,
  TIER_PLACEHOLDERS,
} from '../../fixtures/event-pages';
import CreditLine from '../../media/CreditLine/CreditLine.astro';
import PhotoCarousel from '../../media/PhotoCarousel/PhotoCarousel.astro';
import ButtonRow from '../../page/ButtonRow/ButtonRow.astro';
import CardGrid from '../../page/CardGrid/CardGrid.astro';
import GlanceStrip from '../../page/GlanceStrip/GlanceStrip.astro';
import Handoff from '../../page/Handoff/Handoff.astro';
import PageHeader from '../../page/PageHeader/PageHeader.astro';
import Section from '../../page/Section/Section.astro';
import SectionHead from '../../page/SectionHead/SectionHead.astro';
import Split from '../../page/Split/Split.astro';
import TakePartBand, { type TakePartLabels } from '../../page/TakePartBand/TakePartBand.astro';
import type { SlotValue } from '../../storybook';

export const header: SlotValue = {
  component: PageHeader,
  props: {
    variant: 'photo',
    kicker: GALA_HEADER.kicker,
    title: GALA_HEADER.title,
    line: GALA_HEADER.line,
    image: GALA_HEADER.image.src,
    actions: GALA_HEADER.actions,
    facts: GALA_META,
    dots: true,
  },
};

export const glance: SlotValue = {
  component: GlanceStrip,
  props: { facts: GALA_GLANCE, caption: GALA_GLANCE_CAPTION },
};

/** The evening with its running order as the option shows it: placeholder rows, or no column at all. */
export const evening = (schedule: 'shown' | 'hidden'): SlotValue => ({
  component: Section,
  props: { id: 'evening', labelledby: 'evening-heading' },
  slots: {
    default: {
      component: Split,
      slots: {
        default: [
          {
            component: SectionHead,
            props: {
              kicker: { yo: 'Alẹ́ náà', en: 'The evening' },
              title: 'The evening',
              id: 'evening-heading',
            },
          },
          { component: Prose, props: { text: GALA_EVENING_INTRO } },
        ],
        ...(schedule === 'shown'
          ? {
              aside: {
                component: Schedule,
                props: { items: GALA_RUNNING_ORDER_PLACEHOLDERS, pending: 'the running order' },
              },
            }
          : {}),
      },
    },
  },
});

export const seam: SlotValue = { component: Divider, props: { kind: 'seam' } };

/**
 * Seats and tables on the tint as the `tiers` and `emphasis` options draw them: placeholder tiers (the
 * Studio holds none), no Eventbrite link yet, so the buy-now tiers show the chip where their button goes.
 */
export const seats = (tiers: 'columns' | 'rows', emphasis: 'seats' | 'tables'): SlotValue => ({
  component: Section,
  props: { id: 'seats', ground: 'alt', labelledby: 'seats-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ìjókòó', en: 'Seats' },
          title: 'Seats and tables',
          intro: GALA_TIERS_INTRO,
          id: 'seats-heading',
        },
      },
      {
        component: TicketTiers,
        props: {
          tiers: TIER_PLACEHOLDERS,
          layout: tiers,
          emphasis,
          pending: 'three prices and what each includes',
        },
      },
    ],
  },
});

/** The closing band on the tint: the seed's four rows, the give row last with its quiet Donate. */
export const takePart = (labels: TakePartLabels): SlotValue => ({
  component: Section,
  props: { id: 'take-part', ground: 'alt', labelledby: 'take-part-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ẹ dara pọ̀ mọ́ wa', en: 'Join us' },
          title: 'Take part',
          intro: `${countWord(GALA_TAKE_PART.length)} ways to be part of the evening, whether or not you can be in the room.`,
          id: 'take-part-heading',
        },
      },
      {
        component: TakePartBand,
        props: {
          rows: GALA_TAKE_PART,
          labels,
          rowPending: 'a way in, its title or its button label',
        },
      },
    ],
  },
});

/** Sponsor the Gala: placeholder levels, the one gold action with its line, the impact handoff. */
export const sponsor: SlotValue = {
  component: Section,
  props: { id: 'sponsor', labelledby: 'sponsor-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Àtìlẹ́yìn', en: 'Support' },
          title: 'Sponsor the Gala',
          intro: GALA_SPONSOR_INTRO,
          id: 'sponsor-heading',
        },
      },
      { component: SponsorLevels, props: { levels: SPONSOR_LEVEL_PLACEHOLDERS } },
      {
        component: ButtonRow,
        slots: {
          default: [
            {
              component: ActionButton,
              props: {
                action: { label: 'Sponsor the Gala', kind: 'enquiry', enquiryKind: 'sponsor' },
                variant: 'primary',
              },
            },
            '<span class="oy-button-row-note">Four questions, and we send the deck with our impact numbers.</span>',
          ],
        },
      },
      {
        component: Handoff,
        props: {
          shape: 'box',
          variant: 'quiet',
          text: 'Want the numbers before you commit? The impact page has them, with a source line under each one.',
          action: { label: 'See our impact', kind: 'url', href: '/impact' },
        },
      },
    ],
  },
};

/** Honorees on the tint, as the `awards` option shows them: placeholder cards without portraits. */
export const honorees: SlotValue = {
  component: Section,
  props: { id: 'honorees', ground: 'alt', labelledby: 'honorees-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          title: 'Honorees and recognitions',
          intro: GALA_HONOREES_INTRO,
          id: 'honorees-heading',
        },
      },
      {
        component: CardGrid,
        props: { columns: 3 },
        slots: {
          default: HONOREE_PLACEHOLDERS.map((person) => ({
            component: PersonCard,
            props: { person, variant: 'nophoto' },
          })),
        },
      },
    ],
  },
};

/**
 * Past galas as the `past` option shows them: the Gala 2025 album in the carousel with its credit and
 * the two links. `id` keeps the carousel's ids unique when a docs page renders several stories.
 */
export const pastGalas = (id: string): SlotValue => ({
  component: Section,
  props: { id: 'past', labelledby: `${id}-heading` },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ọdún tí ó kọjá', en: 'Years past' },
          title: 'Past galas',
          id: `${id}-heading`,
        },
      },
      {
        component: PhotoCarousel,
        props: { id, labelledby: `${id}-heading`, slides: GALA_PAST_SLIDES },
      },
      { component: CreditLine, props: GALA_ALBUM_CREDIT },
      {
        component: ButtonRow,
        slots: {
          default: [
            {
              component: Button,
              props: { variant: 'secondary', href: '/gallery', arrow: true },
              slots: { default: 'All gala albums' },
            },
            {
              component: Button,
              props: { variant: 'quiet', href: '/odunde', arrow: true },
              slots: { default: 'The other half of our year, Odunde' },
            },
          ],
        },
      },
    ],
  },
});
