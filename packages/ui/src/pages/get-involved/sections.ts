/**
 * Get Involved's sections as configured components for the page-section stories (ROUTES section 5: one
 * story per layout option). Every part comes from the fixtures; the site composes the same parts in
 * packages/web from `buildGetInvolvedPage`. The doors come first with no header action, so the first door
 * is the page's gold (ADR 0034); the headings are the page's copy, as on the site.
 */

import DoorCard from '../../cards/DoorCard/DoorCard.astro';
import ContactBlock from '../../content/ContactBlock/ContactBlock.astro';
import PartnerRow from '../../content/PartnerRow/PartnerRow.astro';
import Prose from '../../content/Prose/Prose.astro';
import {
  ASSOCIATIONS_CELLS,
  ASSOCIATIONS_LISTED,
  ASSOCIATIONS_PROSE,
  GET_INVOLVED_DOORS,
  GET_INVOLVED_HEADER,
  GIVE_BOX,
  TALK,
} from '../../fixtures/trust-pages';
import CardGrid from '../../page/CardGrid/CardGrid.astro';
import GlanceStrip from '../../page/GlanceStrip/GlanceStrip.astro';
import Handoff from '../../page/Handoff/Handoff.astro';
import PageHeader from '../../page/PageHeader/PageHeader.astro';
import Section from '../../page/Section/Section.astro';
import SectionHead from '../../page/SectionHead/SectionHead.astro';
import Split from '../../page/Split/Split.astro';
import type { SlotValue } from '../../storybook';

export const header: SlotValue = {
  component: PageHeader,
  props: { variant: 'slim', ...GET_INVOLVED_HEADER },
};

/** The four doors as the `doors` option lays them out: two cards across, or one row each. */
export const doors = (option: 'cards' | 'rows'): SlotValue => ({
  component: Section,
  props: { id: 'doors', labelledby: 'doors-heading' },
  slots: {
    default: [
      '<h2 class="oy-visually-hidden" id="doors-heading">Ways in</h2>',
      {
        component: CardGrid,
        props: { columns: option === 'rows' ? 1 : 2 },
        slots: {
          default: GET_INVOLVED_DOORS.map((door, index) => ({
            component: DoorCard,
            props: {
              door,
              id: door.key,
              label: true,
              bullets: true,
              primary: index === 0,
              layout: option === 'rows' ? 'row' : 'card',
            },
          })),
        },
      },
    ],
  },
});

/**
 * The hometown associations: the seeded prose beside its cells, and under the prose the names once the
 * Studio lists them (bracketed here).
 */
export const associations = (listed = false): SlotValue => ({
  component: Section,
  props: { id: 'associations', ground: 'alt', labelledby: 'associations-heading' },
  slots: {
    default: {
      component: Split,
      slots: {
        default: [
          {
            component: SectionHead,
            props: { title: 'Hometown associations', id: 'associations-heading' },
          },
          { component: Prose, props: { value: ASSOCIATIONS_PROSE } },
          ...(listed
            ? [
                {
                  component: PartnerRow,
                  props: { partners: ASSOCIATIONS_LISTED },
                },
              ]
            : []),
        ],
        aside: {
          component: GlanceStrip,
          props: {
            band: false,
            facts: listed
              ? ASSOCIATIONS_CELLS.filter((cell) => cell.label !== 'Listed publicly')
              : ASSOCIATIONS_CELLS,
          },
        },
      },
    },
  },
});

/** Or just talk to someone, as the development dataset stands: every contact fact owed. */
export const talk: SlotValue = {
  component: Section,
  props: { id: 'talk', labelledby: 'talk-heading' },
  slots: {
    default: [
      {
        component: Split,
        slots: {
          default: [
            {
              component: SectionHead,
              props: { title: TALK.title, intro: TALK.intro, id: 'talk-heading' },
            },
            {
              component: ContactBlock,
              props: { part: 'actions', call: true, variant: 'quiet' },
            },
          ],
          aside: {
            component: ContactBlock,
            props: {
              part: 'facts',
              rows: ['email', 'phone', 'name', 'responds'],
              nameLabel: 'Who answers',
              namePending: TALK.namePending,
              respondsPending: TALK.respondsPending,
            },
          },
        },
      },
      {
        component: Handoff,
        props: {
          shape: 'box',
          variant: 'quiet',
          text: 'Meet the people you are writing to.',
          action: { label: 'Our Story', kind: 'url', href: '/our-story' },
        },
      },
      {
        component: Handoff,
        props: { shape: 'box', variant: 'primary', text: GIVE_BOX.text, action: GIVE_BOX.action },
      },
    ],
  },
};
