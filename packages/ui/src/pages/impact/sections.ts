/**
 * Impact's sections as configured components for the page-section stories (ROUTES section 5: one story
 * per layout option). Every part comes from the fixtures; the site composes the same parts in
 * packages/web from `buildImpactPage`. The headings and kickers are the page's copy, as on the site; the
 * heading of the civic block is unmarked (ADR 0009).
 */

import { IMPACT_VOICE_SLOTS } from '@oy/content/pending';
import OutcomeCard from '../../cards/OutcomeCard/OutcomeCard.astro';
import PullQuote from '../../cards/PullQuote/PullQuote.astro';
import FactList from '../../content/FactList/FactList.astro';
import PartnerRow from '../../content/PartnerRow/PartnerRow.astro';
import Prose from '../../content/Prose/Prose.astro';
import ActionButton from '../../core/ActionButton/ActionButton.astro';
import Button from '../../core/Button/Button.astro';
import {
  CIVIC_CELLS,
  CIVIC_PROSE,
  FUND,
  FUNDERS_INTRO,
  GOVERNANCE_CELLS,
  GOVERNANCE_FACTS,
  HOW_WE_WORK_PHOTO,
  IMPACT_HEADER,
  IMPACT_PHOTOS,
  IMPACT_STATS,
  OUTCOME_PLACEHOLDER,
  OUTCOME_SLOTS,
  OUTCOME_SOURCE_PENDING,
  OUTCOMES_PENDING,
  SOURCES_LEAD,
} from '../../fixtures/trust-pages';
import PhotoMosaic from '../../media/PhotoMosaic/PhotoMosaic.astro';
import PhotoTile from '../../media/PhotoTile/PhotoTile.astro';
import ButtonRow from '../../page/ButtonRow/ButtonRow.astro';
import CardGrid from '../../page/CardGrid/CardGrid.astro';
import GlanceStrip from '../../page/GlanceStrip/GlanceStrip.astro';
import PageHeader from '../../page/PageHeader/PageHeader.astro';
import Section from '../../page/Section/Section.astro';
import SectionHead from '../../page/SectionHead/SectionHead.astro';
import Split from '../../page/Split/Split.astro';
import StatStrip from '../../page/StatStrip/StatStrip.astro';
import type { SlotValue } from '../../storybook';

export const header: SlotValue = {
  component: PageHeader,
  props: { variant: 'slim', ...IMPACT_HEADER },
};

/** The headline numbers as the `stats` and `sources` options draw them. */
export const numbers = (
  stats: 'four' | 'six',
  sources: 'shown' | 'hidden' = 'shown',
): SlotValue => ({
  component: Section,
  props: { id: 'numbers', labelledby: 'numbers-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ní ṣókí', en: 'In brief' },
          title: 'Headline numbers',
          intro: sources === 'shown' ? SOURCES_LEAD : undefined,
          id: 'numbers-heading',
        },
      },
      {
        component: StatStrip,
        props: {
          variant: 'framed',
          stats: IMPACT_STATS,
          sources: sources === 'shown',
          columns: stats === 'six' ? 6 : 4,
          padPending:
            stats === 'six' ? 'attendance and learners served, with their sources' : undefined,
          what: 'the headline figures',
        },
      },
    ],
  },
});

/** How we work: the account owed, beside the partners photograph. */
export const how: SlotValue = {
  component: Section,
  props: { id: 'how', ground: 'alt', labelledby: 'how-heading' },
  slots: {
    default: {
      component: Split,
      slots: {
        default: [
          { component: SectionHead, props: { title: 'How we work', id: 'how-heading' } },
          '<p><span class="oy-pend">Pending: your account of the organisation</span></p>',
        ],
        aside: {
          component: PhotoTile,
          props: {
            shape: 'figure',
            height: 320,
            image: HOW_WE_WORK_PHOTO.src,
            alt: HOW_WE_WORK_PHOTO.alt,
            caption: HOW_WE_WORK_PHOTO.caption,
          },
        },
      },
    },
  },
};

/**
 * What each program produced as the `outcomes` option lays it out. Without an outcome the four slots name
 * their subjects; `placeholder` puts a bracketed outcome with its figure and source first, as an owner's
 * outcome takes its place.
 */
export const outcomes = (
  layout: 'cards' | 'rows',
  {
    sources = 'shown',
    placeholder = false,
  }: { sources?: 'shown' | 'hidden'; placeholder?: boolean } = {},
): SlotValue => {
  const slots = placeholder
    ? OUTCOME_SLOTS.filter((slot) => slot.title !== OUTCOME_PLACEHOLDER.title)
    : OUTCOME_SLOTS;
  return {
    component: Section,
    props: { id: 'outcomes', labelledby: 'outcomes-heading' },
    slots: {
      default: [
        {
          component: SectionHead,
          props: {
            kicker: { yo: 'Èsì', en: 'Results' },
            title: 'What each program produced',
            intro: 'Where a program has no number yet, we say what is being measured this year.',
            id: 'outcomes-heading',
          },
        },
        {
          component: CardGrid,
          props: { columns: layout === 'rows' ? 1 : 4, class: 'oy-outcomes' },
          slots: {
            default: [
              ...(placeholder
                ? [
                    {
                      component: OutcomeCard,
                      props: {
                        ...OUTCOME_PLACEHOLDER,
                        sources: sources === 'shown',
                        sourcePending: OUTCOME_SOURCE_PENDING,
                        variant: layout === 'rows' ? 'row' : 'card',
                      },
                    },
                  ]
                : []),
              ...slots.map((slot) => ({
                component: OutcomeCard,
                props: {
                  title: slot.title,
                  pending: OUTCOMES_PENDING,
                  variant: layout === 'rows' ? 'row' : 'card',
                },
              })),
            ],
          },
        },
        {
          component: ButtonRow,
          slots: {
            default: OUTCOME_SLOTS.map((slot) => ({
              component: Button,
              props: { variant: 'quiet', href: slot.href, arrow: true },
              slots: { default: slot.title },
            })),
          },
        },
      ],
    },
  };
};

/** Odunde as civic infrastructure: the seeded prose beside the cells the editions owe. */
export const civic: SlotValue = {
  component: Section,
  props: { id: 'civic', ground: 'alt', labelledby: 'civic-heading' },
  slots: {
    default: {
      component: Split,
      slots: {
        default: [
          {
            component: SectionHead,
            props: { title: 'Odunde as civic infrastructure', id: 'civic-heading' },
          },
          { component: Prose, props: { value: CIVIC_PROSE } },
          {
            component: Button,
            props: { variant: 'quiet', href: '/odunde', arrow: true },
            slots: { default: 'The festival page' },
          },
        ],
        aside: { component: GlanceStrip, props: { band: false, facts: CIVIC_CELLS } },
      },
    },
  },
};

/** In their words: the three slots while no testimonial exists. */
export const voices: SlotValue = {
  component: Section,
  props: { id: 'voices', labelledby: 'voices-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          title: 'In their words',
          intro: 'A parent, an elder, and a vendor, in their own words.',
          id: 'voices-heading',
        },
      },
      {
        component: CardGrid,
        props: { columns: 3 },
        slots: {
          default: IMPACT_VOICE_SLOTS.map((placeholder) => ({
            component: PullQuote,
            props: { placeholder, pending: 'voices with permission to name' },
          })),
        },
      },
    ],
  },
};

/** The work, in photographs: six tiles and the way to the gallery. */
export const photographs: SlotValue = {
  component: Section,
  props: { id: 'photographs', ground: 'alt', labelledby: 'photographs-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          title: 'The work, in photographs',
          intro: 'Across years and programs, captioned with the year and what is happening.',
          id: 'photographs-heading',
        },
      },
      {
        component: PhotoMosaic,
        props: {
          count: 6,
          tiles: IMPACT_PHOTOS.map((tile) => ({
            image: tile.image.src,
            alt: tile.image.alt,
            caption: tile.caption,
          })),
        },
      },
      {
        component: ButtonRow,
        slots: {
          default: {
            component: Button,
            props: { variant: 'secondary', href: '/gallery', arrow: true },
            slots: { default: 'Open the gallery' },
          },
        },
      },
    ],
  },
};

/** Governance and accountability as the development dataset stands. */
export const governance: SlotValue = {
  component: Section,
  props: { id: 'governance', labelledby: 'governance-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ìdúró', en: 'Standing' },
          title: 'Governance and accountability',
          intro:
            'What we are, how we are governed, and what we publish. Where a document is not ready yet, we say when it will be.',
          id: 'governance-heading',
        },
      },
      { component: GlanceStrip, props: { band: false, facts: GOVERNANCE_CELLS } },
      { component: FactList, props: { facts: GOVERNANCE_FACTS, class: 'oy-governance-facts' } },
    ],
  },
};

/** Partners and funders: the Pending line while the Studio holds none. */
export const funders: SlotValue = {
  component: Section,
  props: { id: 'funders', ground: 'alt', labelledby: 'funders-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: { title: 'Partners and funders', intro: FUNDERS_INTRO, id: 'funders-heading' },
      },
      { component: PartnerRow, props: { partners: [], pending: 'partner and funder names' } },
    ],
  },
};

/** Fund the next year: the dark band with the partnerships lead's sentence and the two actions. */
export const fund: SlotValue = {
  component: Section,
  props: { id: 'fund', ground: 'dark', labelledby: 'fund-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: FUND.kicker,
          title: FUND.title,
          intro: FUND.line,
          notePending: FUND.linePending,
          id: 'fund-heading',
        },
      },
      {
        component: ButtonRow,
        slots: {
          default: [
            { component: ActionButton, props: { action: FUND.actions[0], variant: 'primary' } },
            {
              component: ActionButton,
              props: { action: FUND.actions[1], variant: 'secondary', arrow: false },
            },
          ],
        },
      },
    ],
  },
};
