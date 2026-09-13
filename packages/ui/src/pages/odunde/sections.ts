/**
 * The festival page's sections as configured components for the page-section stories (ROUTES
 * section 5: one story per layout option, so the owner compares the values without touching
 * content). Every part comes from the fixtures; the site composes the same parts in packages/web
 * from `buildFestivalPage`. The section kickers and headings are the page's copy, as on the site.
 */

import FactList from '../../content/FactList/FactList.astro';
import Prose from '../../content/Prose/Prose.astro';
import Schedule from '../../content/Schedule/Schedule.astro';
import ZoneGrid, { type ZonesLayout } from '../../content/ZoneGrid/ZoneGrid.astro';
import Button from '../../core/Button/Button.astro';
import {
  FESTIVAL_GLANCE,
  FESTIVAL_HEADER,
  FESTIVAL_META,
  PLAN_FACTS,
  SCHEDULE_PLACEHOLDERS,
  WHAT_IT_IS,
  WHAT_IT_IS_FIGURE,
  ZONES,
} from '../../fixtures/event-pages';
import PhotoTile from '../../media/PhotoTile/PhotoTile.astro';
import ButtonRow from '../../page/ButtonRow/ButtonRow.astro';
import GlanceStrip from '../../page/GlanceStrip/GlanceStrip.astro';
import PageHeader from '../../page/PageHeader/PageHeader.astro';
import Section from '../../page/Section/Section.astro';
import SectionHead from '../../page/SectionHead/SectionHead.astro';
import Split from '../../page/Split/Split.astro';
import type { SlotValue } from '../../storybook';

export const header = (variant: 'photo' | 'slim'): SlotValue => ({
  component: PageHeader,
  props: {
    variant,
    kicker: FESTIVAL_HEADER.kicker,
    title: FESTIVAL_HEADER.title,
    line: FESTIVAL_HEADER.line,
    image: FESTIVAL_HEADER.image.src,
    actions: FESTIVAL_HEADER.actions,
    facts: FESTIVAL_META,
    dots: true,
  },
});

export const glance: SlotValue = { component: GlanceStrip, props: { facts: FESTIVAL_GLANCE } };

export const whatItIs: SlotValue = {
  component: Section,
  props: { id: 'about-festival', labelledby: 'about-festival-heading' },
  slots: {
    default: {
      component: Split,
      slots: {
        default: [
          {
            component: SectionHead,
            props: {
              kicker: { yo: 'Ìtàn ọjọ́ náà', en: 'What the day is' },
              title: 'What Odunde is',
              id: 'about-festival-heading',
            },
          },
          { component: Prose, props: { value: WHAT_IT_IS } },
          {
            component: ButtonRow,
            slots: {
              default: [
                {
                  component: Button,
                  props: { variant: 'quiet', href: '/impact', arrow: true },
                  slots: { default: 'What the festival produces' },
                },
                {
                  component: Button,
                  props: { variant: 'quiet', href: '/gala', arrow: true },
                  slots: { default: 'The other half of our year, the Gala' },
                },
              ],
            },
          },
        ],
        aside: {
          component: PhotoTile,
          props: {
            shape: 'figure',
            image: WHAT_IT_IS_FIGURE.image,
            caption: WHAT_IT_IS_FIGURE.caption,
          },
        },
      },
    },
  },
};

export const zones = (layout: ZonesLayout): SlotValue => ({
  component: Section,
  props: { id: 'zones', ground: 'alt', labelledby: 'zones-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ìlú kan', en: 'One village' },
          title: 'Four zones, one village',
          intro:
            'The plaza is divided the way a Yoruba town is divided. Each zone has its own name, its own people, and its own reason to stand there all day.',
          id: 'zones-heading',
        },
      },
      {
        component: ZoneGrid,
        props: { layout, zones: ZONES.map((zone) => ({ ...zone, image: zone.image.src })) },
      },
    ],
  },
});

/** The schedule as the option shows it: the rows name what they wait for, the prototype's are invented. */
export const schedule = (option: 'shown' | 'collapsed'): SlotValue => ({
  component: Section,
  props: { id: 'schedule', labelledby: 'schedule-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ètò ọjọ́', en: 'Order of the day' },
          title: 'The day, hour by hour',
          intro: 'Enough for a family to decide when to arrive and what not to miss.',
          id: 'schedule-heading',
        },
      },
      {
        component: Schedule,
        props: {
          items: SCHEDULE_PLACEHOLDERS,
          toggle: true,
          open: option === 'shown',
          pending: 'the rows, times and content',
        },
      },
    ],
  },
});

export const plan: SlotValue = {
  component: Section,
  props: { id: 'plan', ground: 'alt', labelledby: 'plan-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ẹ múra', en: 'Get ready' },
          title: 'Plan your visit',
          intro: 'Everything you need on the day, from getting there to what to bring.',
          id: 'plan-heading',
        },
      },
      { component: FactList, props: { facts: PLAN_FACTS } },
    ],
  },
};
