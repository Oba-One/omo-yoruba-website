/**
 * The Gala page's sections as configured components for the page-section stories (ROUTES section 5:
 * one story per layout option, so the owner compares the values without touching content). Every
 * part comes from the fixtures; the site composes the same parts in packages/web from
 * `buildGalaPage`. The section kickers and headings are the page's copy, as on the site.
 */
import { countWord } from '../../content/count-word';
import Prose from '../../content/Prose/Prose.astro';
import Schedule from '../../content/Schedule/Schedule.astro';
import Divider from '../../core/Divider/Divider.astro';
import {
  GALA_EVENING_INTRO,
  GALA_GLANCE,
  GALA_GLANCE_CAPTION,
  GALA_HEADER,
  GALA_META,
  GALA_RUNNING_ORDER_PLACEHOLDERS,
  GALA_TAKE_PART,
} from '../../fixtures/event-pages';
import GlanceStrip from '../../page/GlanceStrip/GlanceStrip.astro';
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
