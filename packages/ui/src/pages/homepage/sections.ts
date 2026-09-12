/**
 * The homepage sections as configured components for the page-section stories (ROUTES section
 * 5: one story per layout option so the owner compares the values without touching content).
 * Every part comes from the fixtures; the site composes the same parts in packages/web, where
 * `buildHomepage` makes the same choices (the highlighted program's action in the hero, the first
 * three programs, the three voice slots).
 */
import { HOMEPAGE_VOICE_SLOTS } from '@oy/content/pending';
import EventBand from '../../bands/EventBand/EventBand.astro';
import NewsletterBand from '../../bands/NewsletterBand/NewsletterBand.astro';
import DoorCard from '../../cards/DoorCard/DoorCard.astro';
import PathRow from '../../cards/PathRow/PathRow.astro';
import ProgramCard from '../../cards/ProgramCard/ProgramCard.astro';
import PullQuote from '../../cards/PullQuote/PullQuote.astro';
import PathRows from '../../content/PathRows/PathRows.astro';
import ProverbLine from '../../content/ProverbLine/ProverbLine.astro';
import { usableAction } from '../../core/ActionButton/action';
import {
  DOORS,
  GALA_2026,
  HERO,
  NEWSLETTER,
  ODUNDE_2027,
  PROGRAMS,
  PROVERB,
  RAISE_YOUR_HAND,
  TILES,
  VOICES_INTRO,
} from '../../fixtures/homepage';
import PhotoMosaic from '../../media/PhotoMosaic/PhotoMosaic.astro';
import SiteFooter from '../../navigation/SiteFooter/SiteFooter.astro';
import CardGrid from '../../page/CardGrid/CardGrid.astro';
import Hero from '../../page/Hero/Hero.astro';
import Section from '../../page/Section/Section.astro';
import SectionHead from '../../page/SectionHead/SectionHead.astro';
import type { SlotValue } from '../../storybook';

export type Highlight = 'festival' | 'school' | 'collective';

/** The hero's gold button per highlight: the Studio's own, or the highlighted program's action. */
const HIGHLIGHT_ACTIONS: Record<Highlight, (typeof PROGRAMS)[number]['action'] | undefined> = {
  festival: undefined,
  school: PROGRAMS.find((program) => program.page === 'lessons')?.action,
  collective: PROGRAMS.find((program) => program.page === 'collective')?.action,
};

export const hero = (motion: boolean, highlight: Highlight = 'festival'): SlotValue => ({
  component: Hero,
  props: {
    image: HERO.image.src,
    alt: HERO.image.alt,
    kicker: HERO.kicker,
    title: HERO.title,
    emphasis: HERO.emphasis,
    sub: HERO.sub,
    blessing: HERO.blessing,
    primary: usableAction(HIGHLIGHT_ACTIONS[highlight], HERO.primary),
    secondary: HERO.secondary,
    motion,
  },
});

export const eventBand = (season: 'gala' | 'odunde'): SlotValue => ({
  component: EventBand,
  props: { event: season === 'odunde' ? ODUNDE_2027 : GALA_2026 },
});

export const programs: SlotValue = {
  component: Section,
  props: { id: 'programs', labelledby: 'programs-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ohun tí a ń ṣe', en: 'What we do' },
          title: 'Our programs',
          id: 'programs-heading',
          link: { label: 'All programs', href: '/programs' },
        },
      },
      {
        component: CardGrid,
        props: { columns: 3 },
        slots: {
          default: PROGRAMS.slice(0, 3).map((program) => ({
            component: ProgramCard,
            props: { program },
          })),
        },
      },
    ],
  },
};

export const voices: SlotValue = {
  component: Section,
  props: { id: 'voices', ground: 'paper', texture: 'batik', labelledby: 'voices-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Àwọn ohùn wa', en: 'Our voices' },
          title: 'Member voices',
          intro: VOICES_INTRO,
          id: 'voices-heading',
        },
      },
      {
        component: CardGrid,
        props: { columns: 3 },
        slots: {
          default: HOMEPAGE_VOICE_SLOTS.map((placeholder) => ({
            component: PullQuote,
            props: { placeholder },
          })),
        },
      },
      { component: ProverbLine, props: PROVERB },
    ],
  },
};

export const gallery = (count: '7' | '5' | '3'): SlotValue => ({
  component: Section,
  props: { id: 'gallery', ground: 'alt', labelledby: 'gallery-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ìgbésí ayé wa', en: 'Our life together' },
          title: 'A year in the life',
          id: 'gallery-heading',
        },
      },
      {
        component: PhotoMosaic,
        props: {
          count,
          tiles: TILES.map((tile) => ({
            image: tile.image.src,
            alt: tile.image.alt,
            caption: tile.caption,
          })),
        },
      },
    ],
  },
});

export const involved = (variant: 'doors' | 'rows'): SlotValue => ({
  component: Section,
  props: { id: 'get-involved', labelledby: 'involved-heading' },
  slots: {
    default: [
      {
        component: SectionHead,
        props: {
          kicker: { yo: 'Ẹ dara pọ̀ mọ́ wa', en: 'Join us' },
          title: RAISE_YOUR_HAND.title,
          intro: RAISE_YOUR_HAND.blurb,
          id: 'involved-heading',
        },
      },
      variant === 'doors'
        ? {
            component: CardGrid,
            props: { columns: 2 },
            slots: {
              default: DOORS.map((door, index) => ({
                component: DoorCard,
                props: { door, primary: index === 0 },
              })),
            },
          }
        : {
            component: PathRows,
            slots: {
              default: DOORS.map((door, index) => ({
                component: PathRow,
                props: { door, primary: index === 0 },
              })),
            },
          },
    ],
  },
});

export const footer = (newsletter: 'footer' | 'band'): SlotValue[] => [
  ...(newsletter === 'band'
    ? [{ component: NewsletterBand, props: { ...NEWSLETTER, source: '/' } }]
    : []),
  {
    component: SiteFooter,
    props: {
      settings: { newsletterTitle: NEWSLETTER.title, newsletterBlurb: NEWSLETTER.blurb },
      source: '/',
      newsletter: newsletter === 'footer',
    },
  },
];
