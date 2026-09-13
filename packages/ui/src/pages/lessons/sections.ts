/**
 * The Lessons page's sections as configured components for the page-section stories (ROUTES section
 * 5: one story per layout option). Every part comes from the fixtures; the site composes the same parts
 * in packages/web from `buildLessonsPage`. The section kickers and headings are the page's copy, as on
 * the site. Yoruba Language Lessons, never "School".
 */

import PersonCard from '../../cards/PersonCard/PersonCard.astro';
import { PHOTOS } from '../../fixtures/photos';
import {
  LESSONS_GLANCE,
  LESSONS_HEADER,
  LESSONS_TAKE_PART,
  TEACHER_INTRO,
  TEACHER_PENDING,
} from '../../fixtures/program-pages';
import EnquiryCard from '../../forms/EnquiryCard/EnquiryCard.astro';
import GlanceStrip from '../../page/GlanceStrip/GlanceStrip.astro';
import Handoff from '../../page/Handoff/Handoff.astro';
import PageHeader from '../../page/PageHeader/PageHeader.astro';
import Section from '../../page/Section/Section.astro';
import SectionHead from '../../page/SectionHead/SectionHead.astro';
import Split from '../../page/Split/Split.astro';
import TakePartBand from '../../page/TakePartBand/TakePartBand.astro';
import type { SlotValue } from '../../storybook';

export const header: SlotValue = {
  component: PageHeader,
  props: { variant: 'slim', ...LESSONS_HEADER },
};

export const glance: SlotValue = { component: GlanceStrip, props: { facts: LESSONS_GLANCE } };

/**
 * The teacher beside her form, as the `portraits` option draws her card. The linked teacher is a
 * placeholder in brackets on a crowd photograph from the register, so no one reads as named.
 */
export const teacher = (portraits: 'shown' | 'hidden', linked = false): SlotValue => ({
  component: Section,
  props: { id: 'teacher', labelledby: 'teacher-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Olùkọ́ wa', en: 'Our teacher' },
          title: 'One teacher, and you start by writing to her',
          intro: TEACHER_INTRO,
          id: 'teacher-heading',
        },
      },
      {
        component: Split,
        props: { shape: 'person' },
        slots: {
          default: {
            component: PersonCard,
            props: linked
              ? {
                  person: {
                    role: 'Teacher',
                    name: '[ Teacher name ]',
                    bio: '[ A short bio in her words ]',
                    image: portraits === 'shown' ? PHOTOS.learningYoruba : undefined,
                  },
                  variant: portraits === 'shown' ? 'portrait' : 'nophoto',
                }
              : {
                  person: TEACHER_PENDING.person,
                  variant: 'nophoto',
                  namePending: TEACHER_PENDING.namePending,
                },
          },
          aside: {
            component: EnquiryCard,
            props: {
              kind: 'enrol',
              label: 'Write to the teacher',
              variant: 'secondary',
              email: null,
              emailPending: TEACHER_PENDING.emailPending,
            },
          },
        },
      },
    ],
  },
});

export const takePart: SlotValue = {
  component: Section,
  props: { id: 'take-part', labelledby: 'take-part-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ẹ dara pọ̀ mọ́ wa', en: 'Join us' },
          title: 'Take part',
          id: 'take-part-heading',
        },
      },
      {
        component: TakePartBand,
        props: {
          rows: LESSONS_TAKE_PART,
          pending: 'the ways in',
          rowPending: 'a way in, its title or its button label',
        },
      },
      {
        component: Handoff,
        props: {
          shape: 'box',
          variant: 'quiet',
          text: 'Back to the programs hub, or across to Kids & STEM.',
          action: { label: 'All programs', kind: 'url', href: '/programs' },
        },
      },
    ],
  },
};
