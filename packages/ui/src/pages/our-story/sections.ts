/**
 * Our Story's sections as configured components for the page-section stories (ROUTES section 5: one story
 * per layout option). Every part comes from the fixtures; the site composes the same parts in packages/web
 * from `buildStoryPage`. The headings and kickers are the page's copy, as on the site. No named person's
 * face: the one portrait is a photograph with no one in it.
 */

import PersonCard from '../../cards/PersonCard/PersonCard.astro';
import ContactBlock from '../../content/ContactBlock/ContactBlock.astro';
import FactList from '../../content/FactList/FactList.astro';
import Timeline from '../../content/Timeline/Timeline.astro';
import Pending from '../../core/Pending/Pending.astro';
import {
  BOARD_PLACEHOLDERS,
  FOUNDING_FACTS,
  FOUNDING_PENDING,
  FOUNDING_PHOTO_WHAT,
  PEOPLE_PENDING,
  REACH_US,
  STAFF_INTRO,
  STAFF_PLACEHOLDERS,
  STORY_HEADER,
  STORY_TAKE_PART,
  TALK,
  TIMELINE_PLACEHOLDERS,
} from '../../fixtures/trust-pages';
import EnquiryCard from '../../forms/EnquiryCard/EnquiryCard.astro';
import PhotoTile from '../../media/PhotoTile/PhotoTile.astro';
import CardGrid from '../../page/CardGrid/CardGrid.astro';
import Handoff from '../../page/Handoff/Handoff.astro';
import PageHeader from '../../page/PageHeader/PageHeader.astro';
import Section from '../../page/Section/Section.astro';
import SectionHead from '../../page/SectionHead/SectionHead.astro';
import Split from '../../page/Split/Split.astro';
import TakePartBand from '../../page/TakePartBand/TakePartBand.astro';
import type { SlotValue } from '../../storybook';

export const header: SlotValue = {
  component: PageHeader,
  props: { variant: 'slim', ...STORY_HEADER },
};

/** How it began: the story owed, the founding facts, the placeholder for the earliest photograph. */
export const founding: SlotValue = {
  component: Section,
  props: { id: 'origin', labelledby: 'origin-heading' },
  slots: {
    default: {
      component: Split,
      slots: {
        default: [
          { component: SectionHead, props: { title: 'How it began, 1997', id: 'origin-heading' } },
          { component: Pending, props: { what: FOUNDING_PENDING } },
          { component: FactList, props: { facts: FOUNDING_FACTS, columns: 1 } },
        ],
        aside: {
          component: PhotoTile,
          props: { shape: 'figure', height: 340, what: FOUNDING_PHOTO_WHAT },
        },
      },
    },
  },
};

/** 1997 to now: the entries (bracketed) or the Pending line. */
export const timeline = (entries: boolean): SlotValue => ({
  component: Section,
  props: { id: 'timeline', ground: 'alt', labelledby: 'timeline-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          title: '1997 to now',
          intro: 'The years before Odunde, and everything since.',
          id: 'timeline-heading',
        },
      },
      { component: Timeline, props: { entries: entries ? TIMELINE_PLACEHOLDERS : [] } },
    ],
  },
});

/** The board as the `bios` and `portraits` options draw it; `listed` false shows the group owed. */
export const board = ({
  bios = 'short',
  portraits = 'shown',
  listed = true,
}: {
  bios?: 'short' | 'full';
  portraits?: 'shown' | 'hidden';
  listed?: boolean;
} = {}): SlotValue => ({
  component: Section,
  props: { id: 'board', labelledby: 'board-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ìgbìmọ̀', en: 'The board' },
          title: 'Board of directors',
          id: 'board-heading',
        },
      },
      listed
        ? {
            component: CardGrid,
            props: { columns: 4 },
            slots: {
              default: BOARD_PLACEHOLDERS.map((person) => ({
                component: PersonCard,
                props: {
                  person: portraits === 'shown' ? person : { ...person, image: undefined },
                  variant: portraits === 'shown' && person.image ? 'portrait' : 'nophoto',
                  full: bios === 'full',
                  rolePending: PEOPLE_PENDING.role,
                  bioPending: PEOPLE_PENDING.bio,
                },
              })),
            },
          }
        : { component: Pending, props: { variant: 'line', what: PEOPLE_PENDING.board } },
    ],
  },
});

/** Staff and volunteers: compact cards (bracketed) or the Pending line, then the box to the teacher. */
export const staff = (listed = true): SlotValue => ({
  component: Section,
  props: { id: 'staff', ground: 'alt', labelledby: 'staff-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: { title: 'Staff and volunteers', intro: STAFF_INTRO, id: 'staff-heading' },
      },
      listed
        ? {
            component: CardGrid,
            props: { columns: 5 },
            slots: {
              default: STAFF_PLACEHOLDERS.map((person) => ({
                component: PersonCard,
                props: { person, variant: 'compact', rolePending: PEOPLE_PENDING.role },
              })),
            },
          }
        : { component: Pending, props: { variant: 'line', what: PEOPLE_PENDING.staff } },
      {
        component: Handoff,
        props: {
          shape: 'box',
          variant: 'quiet',
          text: 'Meet the teacher on the Language Lessons page.',
          action: { label: 'The teacher', kind: 'url', href: '/programs/yoruba-lessons#teacher' },
        },
      },
    ],
  },
});

/** Reach us as the development dataset stands: the contact facts owed beside the contact form's card. */
export const reach: SlotValue = {
  component: Section,
  props: { id: 'contact', labelledby: 'contact-heading' },
  slots: {
    default: {
      component: Split,
      slots: {
        default: [
          {
            component: SectionHead,
            props: {
              kicker: { yo: 'Ẹ kàn sí wa', en: 'Reach us' },
              title: REACH_US.title,
              intro: REACH_US.intro,
              id: 'contact-heading',
            },
          },
          {
            component: ContactBlock,
            props: {
              part: 'facts',
              rows: ['email', 'phone', 'address', 'name'],
              nameLabel: 'Who receives this',
              namePending: TALK.namePending,
            },
          },
          {
            component: Handoff,
            props: {
              shape: 'box',
              variant: 'quiet',
              text: 'Governance, tax status, and financial documents.',
              action: { label: 'Impact', kind: 'url', href: '/impact#governance' },
            },
          },
        ],
        // Outline: the member row's gold below shares a screen view with it (ticket 12).
        aside: { component: EnquiryCard, props: { kind: 'contact', variant: 'secondary' } },
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
        props: { title: 'Take part', intro: 'Two ways to join in.', id: 'take-part-heading' },
      },
      {
        component: TakePartBand,
        props: {
          rows: STORY_TAKE_PART,
          pending: 'the ways in',
          rowPending: 'a way in, its title or its button label',
        },
      },
    ],
  },
};
