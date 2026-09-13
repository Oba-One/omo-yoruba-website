import { defineField } from 'sanity';
import { PAGE_LAYOUTS } from '../../layout-options';
import { voice } from '../../validation/rules';
import { facts, refs, text } from '../helpers';
import { definePage } from './page';
import { siteSettings } from './siteSettings';

const takePart = defineField({
  name: 'takePart',
  title: 'Take-part band',
  type: 'array',
  of: [{ type: 'takePartRow' }],
  description: 'The ways in, in the order the closing band shows them; each way in once.',
  validation: (rule) =>
    rule.custom((rows) => {
      const ways = ((rows ?? []) as { way?: string }[]).map((row) => row.way).filter(Boolean);
      return new Set(ways).size === ways.length ? true : 'Each way in appears once.';
    }),
});

export const homepage = definePage({
  name: 'homepage',
  title: 'Homepage',
  header: false,
  actions: false,
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({ name: 'kicker', title: 'Kicker', type: 'bilingual' }),
        defineField({
          name: 'title',
          title: 'Heading',
          type: 'string',
          validation: voice.requiredHeading,
        }),
        defineField({
          name: 'emphasis',
          title: 'Words in gold',
          type: 'string',
          description:
            'Part of the heading set in gold italic, copied exactly as it appears there: "alive". Empty leaves the whole heading white.',
          validation: (rule) => [
            ...voice.text(rule),
            rule
              .custom((value, context) => {
                const title = (context.parent as { title?: string } | undefined)?.title;
                if (!value?.trim() || !title) return true;
                // Marks typed as one character or as a letter and a combining mark read the same.
                return title.normalize('NFC').includes(value.trim().normalize('NFC'))
                  ? true
                  : 'These words are not in the heading as written, so the heading shows with no gold. Copy them from the heading.';
              })
              .warning(),
          ],
        }),
        text('sub', 'Line under the heading', 2),
        defineField({ name: 'image', title: 'Photo', type: 'oyImage' }),
        defineField({
          name: 'blessing',
          title: 'Blessing line',
          type: 'bilingual',
          description: 'The line under the buttons: "Oòdúà á gbè wá o! • May Odùduwà bless us".',
        }),
        defineField({
          name: 'primaryAction',
          title: 'Primary action',
          type: 'cta',
          description:
            "The gold button. When the layout's Highlight names Language Lessons or the Collective, that program's card action takes its place.",
        }),
        defineField({
          name: 'secondaryActions',
          title: 'Secondary actions',
          type: 'array',
          of: [{ type: 'cta' }],
        }),
      ],
    }),
    defineField({
      name: 'leadEvent',
      title: 'Event band',
      type: 'reference',
      to: [{ type: 'event' }],
      description: 'Empty picks the next upcoming edition by date.',
    }),
    refs('stats', 'Stat strip', 'stat', 'Four figures, in order.'),
    text('programsIntro', 'Programs intro', 2),
    text('voicesIntro', 'Member voices intro', 2),
    refs('voices', 'Member voices', 'testimonial'),
    defineField({
      name: 'voicesProverb',
      title: 'Proverb under the voices',
      type: 'bilingual',
      description: 'Yoruba first, then the English sense. Empty hides the line.',
    }),
    text('newsIntro', 'News intro', 2),
    defineField({
      name: 'yearInLife',
      title: 'A year in the life',
      type: 'array',
      of: [{ type: 'oyImage' }],
      description: 'Up to seven tiles; the layout option picks how many show.',
      validation: (rule) => rule.max(7),
    }),
    defineField({
      name: 'raiseYourHand',
      title: 'Raise your hand',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Heading', type: 'string', validation: voice.heading }),
        text('blurb', 'Blurb', 2),
        refs('doors', 'Doors', 'door', 'Which doors show, in order.'),
      ],
    }),
  ],
  layout: PAGE_LAYOUTS.homepage,
});

export const festivalPage = definePage({
  name: 'festivalPage',
  title: 'Odunde Festival page',
  fields: [
    facts(
      'extraFacts',
      'Extra glance facts',
      'The glance holds five facts and the edition fills four (date, time, place and cost), so the first row here shows and later rows wait for a free place.',
    ),
    defineField({
      name: 'whatItIs',
      title: 'What Odunde is',
      type: 'blockContent',
      description: 'Includes the Lunar New Year, Diwali and Nowruz framing.',
    }),
    defineField({
      name: 'whatItIsImage',
      title: 'Photograph beside What Odunde is',
      type: 'oyImage',
      description:
        'A festival-day photograph; its caption shows over it ("Festival day • Leimert Park"). Empty shows Pending.',
    }),
    text('zonesIntro', 'Zones intro', 2),
    facts('planYourVisit', 'Plan your visit', 'Eight practical facts. Empty values show Pending.'),
    takePart,
    text('pastYearsIntro', 'Past years intro', 2),
    text('partnersIntro', 'Partners intro', 2),
  ],
  layout: PAGE_LAYOUTS.festivalPage,
});

export const galaPage = definePage({
  name: 'galaPage',
  title: 'End-of-Year Gala page',
  fields: [
    facts(
      'extraFacts',
      'Extra glance facts',
      'The glance holds five facts and the edition fills all five (date, doors, venue, dress and seats from), so rows here show only if the page drops one of those.',
    ),
    text('eveningIntro', 'The evening intro'),
    text('tiersIntro', 'Seats and tables intro', 2),
    text('sponsorIntro', 'Sponsor intro', 2),
    text('honoreesIntro', 'Honorees intro', 2),
    text('pastIntro', 'Past galas intro', 2),
    takePart,
  ],
  layout: PAGE_LAYOUTS.galaPage,
});

/**
 * One half of Kids & STEM (ADR 0031): its own photograph and facts, since the two cards' facts differ
 * ("Ages" on both, "What they build" on the STEM Hub).
 */
const subprogram = {
  type: 'object',
  name: 'subprogram',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredHeading }),
    text('blurb', 'Blurb', 2),
    defineField({ name: 'image', title: 'Photo', type: 'oyImage' }),
    facts(
      'facts',
      'Facts',
      'Each a label and its value ("Ages"). Empty values show Pending on the card.',
    ),
    defineField({ name: 'action', title: 'Action', type: 'cta' }),
  ],
  preview: { select: { title: 'name', media: 'image' } },
};

export const programsPage = definePage({
  name: 'programsPage',
  title: 'Programs page',
  fields: [
    text('intro', 'Intro', 2),
    defineField({
      name: 'kidsStem',
      title: 'Kids & STEM',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Heading', type: 'string', validation: voice.heading }),
        text('blurb', 'Blurb'),
        defineField({
          name: 'subprograms',
          title: 'Sub programs',
          type: 'array',
          of: [subprogram],
        }),
      ],
    }),
    defineField({
      name: 'culturalExchange',
      title: 'Cultural Exchange',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Heading', type: 'string', validation: voice.heading }),
        text('blurb', 'Blurb'),
        defineField({ name: 'image', title: 'Photo', type: 'oyImage' }),
        defineField({ name: 'cadence', title: 'Cadence', type: 'string', validation: voice.text }),
        defineField({
          name: 'eligibility',
          title: 'Who it is for',
          type: 'string',
          validation: voice.text,
        }),
        defineField({
          name: 'howToJoin',
          title: 'How to join',
          type: 'string',
          validation: voice.text,
        }),
      ],
    }),
    defineField({
      name: 'yearStrip',
      title: 'When things run',
      type: 'array',
      description: 'Five columns, one per program or event, in order.',
      of: [
        {
          type: 'object',
          name: 'yearStripRow',
          // A row names a program or an event page's kind, never an edition, which would go stale the
          // day it ends (ADR 0031).
          validation: (rule) =>
            rule.custom((row) => {
              const value = row as { program?: unknown; kind?: string } | undefined;
              if (!value) return true;
              return Boolean(value.program) !== Boolean(value.kind)
                ? true
                : 'Choose a program or an event, not both.';
            }),
          fields: [
            defineField({
              name: 'when',
              title: 'When',
              type: 'string',
              description: '"June", "Nov or Dec". Empty shows Pending.',
              validation: voice.text,
            }),
            defineField({
              name: 'program',
              title: 'Program',
              type: 'reference',
              to: [{ type: 'program' }],
            }),
            defineField({
              name: 'kind',
              title: 'Event',
              type: 'string',
              description: 'The event whose page the row names; its name shows without a year.',
              options: {
                list: [
                  { title: 'Odunde Festival', value: 'festival' },
                  { title: 'End-of-Year Gala', value: 'gala' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
            }),
            defineField({ name: 'note', title: 'Note', type: 'string', validation: voice.text }),
          ],
          preview: {
            select: { when: 'when', program: 'program.name', kind: 'kind', note: 'note' },
            prepare: ({ when, program, kind, note }) => ({
              title:
                program ??
                (kind === 'gala' ? 'End-of-Year Gala' : kind ? 'Odunde Festival' : 'A row'),
              subtitle: [when ?? 'when pending', note].filter(Boolean).join(' • '),
            }),
          },
        },
      ],
    }),
    takePart,
  ],
  layout: PAGE_LAYOUTS.programsPage,
});

export const lessonsPage = definePage({
  name: 'lessonsPage',
  title: 'Yoruba Language Lessons page',
  fields: [
    facts('glance', 'At a glance', 'Format, when, ages, cost.'),
    defineField({ name: 'teacher', title: 'Teacher', type: 'reference', to: [{ type: 'person' }] }),
    text('teacherIntro', 'Teacher intro', 2),
    defineField({
      name: 'levels',
      title: 'Levels',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'level',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: voice.requiredHeading,
            }),
            text('blurb', 'What it covers', 2),
          ],
          preview: { select: { title: 'name' } },
        },
      ],
    }),
    defineField({
      name: 'oneLesson',
      title: 'What a lesson looks like',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'lessonStep',
          fields: [
            defineField({
              name: 'step',
              title: 'Step',
              type: 'string',
              description: '"Before", "First half", "Break".',
              validation: voice.text,
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: voice.requiredHeading,
            }),
            text('detail', 'Detail', 2),
          ],
          preview: { select: { title: 'title', subtitle: 'step' } },
        },
      ],
    }),
    defineField({
      name: 'faq',
      title: 'Questions parents ask',
      type: 'array',
      of: [{ type: 'faqItem' }],
    }),
    takePart,
  ],
  layout: PAGE_LAYOUTS.lessonsPage,
});

export const collectivePage = definePage({
  name: 'collectivePage',
  title: 'Yoruba Cultural Collective page',
  fields: [
    defineField({
      name: 'argument',
      title: 'Why culture and sustainability sit together',
      type: 'blockContent',
      description: 'Must be in your words. Empty shows Pending.',
    }),
    refs('initiatives', 'Initiatives', 'initiative', 'Solar Hub and Green Goods, in order.'),
    defineField({
      name: 'voice',
      title: 'One voice',
      type: 'reference',
      to: [{ type: 'testimonial' }],
    }),
    defineField({
      name: 'keepsOwnList',
      title: 'The Collective keeps its own mailing list',
      type: 'boolean',
      description: 'Off points the updates row at the footer newsletter.',
      initialValue: false,
    }),
    takePart,
  ],
  layout: PAGE_LAYOUTS.collectivePage,
});

export const getInvolvedPage = definePage({
  name: 'getInvolvedPage',
  title: 'Get Involved page',
  fields: [
    refs('doors', 'Doors', 'door', 'The four ways in, in order.'),
    defineField({
      name: 'hometownAssociations',
      title: 'Hometown associations',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Heading', type: 'string', validation: voice.heading }),
        defineField({ name: 'prose', title: 'Prose', type: 'blockContent' }),
      ],
    }),
    defineField({
      name: 'fallback',
      title: 'Or just talk to someone',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Heading', type: 'string', validation: voice.heading }),
        text('blurb', 'Blurb', 2),
      ],
    }),
  ],
  layout: PAGE_LAYOUTS.getInvolvedPage,
});

export const impactPage = definePage({
  name: 'impactPage',
  title: 'Impact page',
  fields: [
    refs('stats', 'Headline numbers', 'stat', 'Four or six, in order.'),
    defineField({ name: 'howWeWork', title: 'How we work', type: 'blockContent' }),
    refs('outcomes', 'What each program produced', 'outcome'),
    defineField({
      name: 'civicInfra',
      title: 'Odunde as civic infrastructure',
      type: 'blockContent',
    }),
    refs('voices', 'In their words', 'testimonial'),
    defineField({
      name: 'photos',
      title: 'The work in photographs',
      type: 'array',
      of: [{ type: 'oyImage' }],
    }),
    text('fundersIntro', 'Partners and funders intro', 2),
    defineField({
      name: 'nextYear',
      title: 'Fund the next year',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Heading', type: 'string', validation: voice.heading }),
        text('blurb', 'Blurb', 2),
      ],
    }),
  ],
  layout: PAGE_LAYOUTS.impactPage,
});

export const storyPage = definePage({
  name: 'storyPage',
  title: 'Our Story page',
  fields: [
    defineField({
      name: 'founding',
      title: 'How it began',
      type: 'blockContent',
      description: 'The 1997 story, in your words.',
    }),
    refs('timeline', 'Timeline', 'timelineEntry'),
    text('boardIntro', 'Board intro', 2),
    text('staffIntro', 'Staff and volunteers intro', 2),
    defineField({
      name: 'reachUs',
      title: 'Reach us',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Heading', type: 'string', validation: voice.heading }),
        text('blurb', 'Blurb', 2),
      ],
    }),
  ],
  layout: PAGE_LAYOUTS.storyPage,
});

export const donatePage = definePage({
  name: 'donatePage',
  title: 'Donate page',
  fields: [
    defineField({
      name: 'giveNow',
      title: 'Give now',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Heading', type: 'string', validation: voice.heading }),
        text('blurb', 'Blurb'),
      ],
    }),
    defineField({
      name: 'largerScale',
      title: 'Giving at a larger scale',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Heading', type: 'string', validation: voice.heading }),
        text('blurb', 'Blurb', 2),
        refs('doors', 'Doors', 'door', 'The partner and sponsor doors.'),
      ],
    }),
    refs('whatYourGiftDoes', 'What your gift does', 'givingLevel'),
    defineField({
      name: 'otherWays',
      title: 'Other ways to give',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'otherWay',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: voice.requiredHeading,
            }),
            text('blurb', 'Blurb', 2),
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),
    defineField({
      name: 'taxLine',
      title: 'Tax-deductible line',
      type: 'string',
      validation: voice.text,
    }),
  ],
  layout: PAGE_LAYOUTS.donatePage,
});

export const galleryPage = definePage({
  name: 'galleryPage',
  title: 'Photo Gallery page',
  fields: [
    text('intro', 'Intro', 2),
    defineField({
      name: 'creditsAndConsent',
      title: 'Photography credit and permissions',
      type: 'blockContent',
      description: 'This wording must be yours. Empty shows Pending.',
    }),
  ],
  layout: PAGE_LAYOUTS.galleryPage,
});

export const newsPage = definePage({
  name: 'newsPage',
  title: 'News & Events page',
  actions: false,
  fields: [],
  layout: PAGE_LAYOUTS.newsPage,
});

export const singletonTypes = [
  siteSettings,
  homepage,
  festivalPage,
  galaPage,
  programsPage,
  lessonsPage,
  collectivePage,
  getInvolvedPage,
  impactPage,
  storyPage,
  donatePage,
  galleryPage,
  newsPage,
];

/** The fixed document id of each singleton is its type name. */
export const SINGLETON_NAMES = singletonTypes.map((type) => type.name);
export { siteSettings };
