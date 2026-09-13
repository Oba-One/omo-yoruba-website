/**
 * The Programs hub's sections as configured components for the page-section stories (ROUTES section
 * 5: one story per layout option, so the owner compares the values without touching content). Every
 * part comes from the fixtures; the site composes the same parts in packages/web from
 * `buildProgramsPage`. The section kickers and headings are the page's copy, as on the site. The two
 * inline programs come from small compositions in markup (`KidsStemSection.astro`,
 * `ExchangeSection.astro`), whose nesting the slot descriptors cannot carry.
 */

import ProgramCard from '../../cards/ProgramCard/ProgramCard.astro';
import { countWord } from '../../content/count-word';
import {
  PROGRAM_CARDS,
  PROGRAMS_HEADER,
  PROGRAMS_TAKE_PART,
  YEAR_STRIP,
  YEAR_WHEN_PENDING,
} from '../../fixtures/program-pages';
import CardGrid from '../../page/CardGrid/CardGrid.astro';
import Handoff from '../../page/Handoff/Handoff.astro';
import PageHeader from '../../page/PageHeader/PageHeader.astro';
import Section from '../../page/Section/Section.astro';
import SectionHead from '../../page/SectionHead/SectionHead.astro';
import TakePartBand from '../../page/TakePartBand/TakePartBand.astro';
import YearStrip from '../../page/YearStrip/YearStrip.astro';
import type { SlotValue } from '../../storybook';
import ExchangeSection from './ExchangeSection.astro';
import KidsStemSection from './KidsStemSection.astro';

export type CardsOption = 'four' | 'three' | 'pairs';

export const header: SlotValue = {
  component: PageHeader,
  props: { variant: 'slim', ...PROGRAMS_HEADER },
};

/** The program cards as the `cards` option draws them: four or pairs show every program, three the first three. */
export const cards = (option: CardsOption): SlotValue => {
  const programs = option === 'three' ? PROGRAM_CARDS.slice(0, 3) : PROGRAM_CARDS;
  return {
    component: Section,
    props: { id: 'four', labelledby: 'programs-heading' },
    slots: {
      default: [
        '<h2 class="oy-visually-hidden" id="programs-heading">The programs</h2>',
        {
          component: CardGrid,
          props: {
            columns: option === 'three' ? 3 : option === 'pairs' ? 2 : 4,
            note: 'Each card says who it is for and when it runs, so you can find the right one at a glance.',
          },
          slots: {
            default: programs.map((program) => ({
              component: ProgramCard,
              props: { program, when: true, mediaHeight: option === 'three' ? 200 : 160 },
            })),
          },
        },
      ],
    },
  };
};

export type InlineOption = 'expanded' | 'collapsed';

/** Kids & STEM behind its toggle: the prose and both halves, their facts owed. */
export const kids = (option: InlineOption): SlotValue => ({
  component: KidsStemSection,
  props: { open: option === 'expanded' },
});

/** Cultural Exchange behind its toggle: every fact and the photograph owed. */
export const exchange = (option: InlineOption): SlotValue => ({
  component: ExchangeSection,
  props: { open: option === 'expanded' },
});

/** When things run: the five rows as seeded, then the impact handoff. */
export const year: SlotValue = {
  component: Section,
  props: { id: 'year', ground: 'alt', labelledby: 'year-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ọdún kan', en: 'One year' },
          title: 'When things run',
          intro: 'One line per program, across one year. Worth a screenshot.',
          id: 'year-heading',
        },
      },
      {
        component: YearStrip,
        props: { rows: YEAR_STRIP, whenPending: YEAR_WHEN_PENDING },
      },
      {
        component: Handoff,
        props: {
          shape: 'box',
          variant: 'quiet',
          text: 'What these programs have produced, with a source line under every number.',
          action: { label: 'See our impact', kind: 'url', href: '/impact' },
        },
      },
    ],
  },
};

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
          intro: `${countWord(PROGRAMS_TAKE_PART.length)} ways to be part of the programs.`,
          id: 'take-part-heading',
        },
      },
      {
        component: TakePartBand,
        props: {
          rows: PROGRAMS_TAKE_PART,
          pending: 'the ways in',
          rowPending: 'a way in, its title or its button label',
        },
      },
    ],
  },
};
