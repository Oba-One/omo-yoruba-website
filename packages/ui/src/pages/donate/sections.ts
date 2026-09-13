/**
 * Donate's sections as configured components for the page-section stories (ROUTES section 5: one story per
 * layout option). Every part comes from the fixtures; the site composes the same parts in packages/web from
 * `buildDonatePage`. The header's gold "Give now" is the page's one (polish pass 3); everything under it is
 * outline or quiet. The headings are the page's copy, as on the site.
 */

import DoorCard from '../../cards/DoorCard/DoorCard.astro';
import OutcomeCard from '../../cards/OutcomeCard/OutcomeCard.astro';
import EntryList from '../../content/EntryList/EntryList.astro';
import FactList from '../../content/FactList/FactList.astro';
import Prose from '../../content/Prose/Prose.astro';
import {
  DONATE_HEADER,
  GIFTS_PENDING,
  GIVE_FACTS,
  GIVE_NOW,
  GIVING_LEVEL_PLACEHOLDERS,
  LARGER_SCALE,
  OTHER_WAYS_PENDING,
  TRUST_CELLS,
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
  props: { variant: 'slim', ...DONATE_HEADER },
};

/** Give now: the seeded blurb beside the facts, the Zeffy ones owed; no second gold button. */
export const give: SlotValue = {
  component: Section,
  props: { id: 'give-now', labelledby: 'give-heading' },
  slots: {
    default: {
      component: Split,
      props: { align: 'center' },
      slots: {
        default: [
          {
            component: SectionHead,
            props: {
              kicker: { yo: 'Ẹ ṣe àánú', en: 'Give' },
              title: GIVE_NOW.title,
              id: 'give-heading',
            },
          },
          { component: Prose, props: { text: GIVE_NOW.blurb } },
        ],
        aside: { component: FactList, props: { facts: GIVE_FACTS, columns: 1 } },
      },
    },
  },
};

/** Giving at a larger scale: the one seeded door in the row form. */
export const larger: SlotValue = {
  component: Section,
  props: { id: 'larger', ground: 'alt', labelledby: 'larger-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Àtìlẹ́yìn', en: 'Support' },
          title: LARGER_SCALE.title,
          intro: LARGER_SCALE.intro,
          id: 'larger-heading',
        },
      },
      {
        component: CardGrid,
        props: { columns: 1 },
        slots: {
          default: { component: DoorCard, props: { door: LARGER_SCALE.door, layout: 'row' } },
        },
      },
    ],
  },
};

/** What your gift does: the levels (bracketed) as outcome cards, or the Pending line. */
export const gifts = (levels: boolean): SlotValue => ({
  component: Section,
  props: { id: 'what', labelledby: 'what-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          title: 'What your gift does',
          intro: 'What the preset amounts pay for.',
          id: 'what-heading',
        },
      },
      levels
        ? {
            component: CardGrid,
            props: { columns: 3 },
            slots: {
              default: GIVING_LEVEL_PLACEHOLDERS.map((level) => ({
                component: OutcomeCard,
                props: {
                  ...level,
                  linePending: GIFTS_PENDING.line,
                  sourcePending: GIFTS_PENDING.source,
                },
              })),
            },
          }
        : { component: EntryList, props: { entries: [], pending: GIFTS_PENDING.levels } },
    ],
  },
});

/** Other ways to give, and the trust block: as the development dataset stands. */
export const other: SlotValue = {
  component: Section,
  props: { id: 'other', ground: 'alt', labelledby: 'other-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          title: 'Other ways to give',
          intro: 'If a card online is not for you.',
          id: 'other-heading',
        },
      },
      { component: EntryList, props: { entries: [], pending: OTHER_WAYS_PENDING } },
    ],
  },
};

export const trust: SlotValue = {
  component: Section,
  props: { id: 'trust', labelledby: 'trust-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          title: 'Tax-deductible, and where it goes',
          intro: "The details your accountant or your employer's matching program will ask for.",
          id: 'trust-heading',
        },
      },
      { component: GlanceStrip, props: { band: false, facts: TRUST_CELLS } },
      {
        component: Handoff,
        props: {
          shape: 'box',
          variant: 'quiet',
          text: 'What your gift has built so far, with a source line under every number.',
          action: { label: 'See our impact', kind: 'url', href: '/impact' },
        },
      },
    ],
  },
};
