/**
 * The festival page's sections as configured components for the page-section stories (ROUTES
 * section 5: one story per layout option, so the owner compares the values without touching
 * content). Every part comes from the fixtures; the site composes the same parts in packages/web
 * from `buildFestivalPage`. The section kickers and headings are the page's copy, as on the site.
 */

import Prose from '../../content/Prose/Prose.astro';
import Button from '../../core/Button/Button.astro';
import {
  FESTIVAL_GLANCE,
  FESTIVAL_HEADER,
  FESTIVAL_META,
  WHAT_IT_IS,
  WHAT_IT_IS_FIGURE,
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
