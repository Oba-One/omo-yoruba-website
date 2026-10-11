import { type ConditionalPropertyCallback, defineField, defineType } from 'sanity';
import { STUDIO_API_VERSION } from '../../api-version';
import { DOOR_CHIPS, DOOR_KEYS } from '../../doors';
import {
  type EditionField,
  EVENT_KIND_TITLES,
  EVENT_KINDS,
  editionFieldShown,
} from '../../edition-fields';
import { COLLECTIVE_NAME, EVENT_PAGE_NAMES } from '../../routes';
import {
  PARTNER_SCOPE_TITLES,
  PARTNER_SCOPES,
  SPONSOR_SCOPE_TITLES,
  SPONSOR_SCOPES,
} from '../../scopes';
import { forMembers } from '../../studio/roles';
import { voice } from '../../validation/rules';
import { calendarDate, instantDate, LA_DATETIME, US_DATE } from '../format';
import { lines, order, slug, text, titled } from '../helpers';

export { EVENT_KINDS };

/** Hides an input the event's kind never shows (edition-fields.ts, ADR 0042). */
const editionHidden =
  (field: EditionField): ConditionalPropertyCallback =>
  ({ document }) =>
    !editionFieldShown(document?.kind as string | undefined, field);

/**
 * One edition of the festival or the Gala, or one Collective event; every per-edition fact lives
 * here (ADR 0013), and the form shows only what the event's kind shows on the site (ADR 0042).
 */
export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    { name: 'edition', title: 'Edition', default: true },
    { name: 'day', title: 'The day' },
    { name: 'vendors', title: 'Vendors' },
  ],
  fields: [
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      description: 'Which page lists it. The form shows only what that page reads.',
      options: {
        list: titled(EVENT_KINDS, EVENT_KIND_TITLES),
        layout: 'radio',
        direction: 'horizontal',
      },
      group: 'edition',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'edition',
      description:
        'As the site shows it, for example "Odunde Festival 2027". Odunde is one word, written without marks here.',
      validation: voice.requiredHeading,
    }),
    defineField({
      name: 'edition',
      title: 'Edition year',
      type: 'number',
      group: 'edition',
      description: 'The year of this edition, "2027". A Collective event needs none.',
      hidden: editionHidden('edition'),
      // Required wherever it shows; a hidden input checks nothing (skipValidationWhenHidden).
      validation: (rule) => rule.required().integer().min(1997),
    }),
    defineField({
      name: 'start',
      title: 'Starts',
      type: 'datetime',
      group: 'edition',
      options: LA_DATETIME,
      description:
        'Los Angeles time. Empty shows a Pending date on the event pages; a Collective event is listed only once it has one.',
    }),
    defineField({
      name: 'end',
      title: 'Ends',
      type: 'datetime',
      group: 'edition',
      options: LA_DATETIME,
    }),
    defineField({
      name: 'doors',
      title: 'Doors',
      type: 'string',
      group: 'edition',
      description: '"6pm"',
      hidden: editionHidden('doors'),
      validation: voice.text,
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'object',
      group: 'edition',
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.text }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'string',
          hidden: editionHidden('venue.address'),
          validation: voice.text,
        }),
        defineField({
          name: 'line',
          title: 'One line',
          type: 'string',
          description: '"43rd Place at Degnan Boulevard"',
          hidden: editionHidden('venue.line'),
          validation: voice.text,
        }),
      ],
    }),
    defineField({
      name: 'cost',
      title: 'Cost',
      type: 'string',
      group: 'edition',
      description: '"Free entry"',
      hidden: editionHidden('cost'),
      validation: voice.text,
    }),
    defineField({
      name: 'dress',
      title: 'Dress',
      type: 'string',
      group: 'edition',
      hidden: editionHidden('dress'),
      validation: voice.text,
    }),
    {
      ...text(
        'summary',
        'Summary',
        3,
        'One or two sentences. The homepage band and the Collective list show it.',
      ),
      group: 'edition',
    },
    defineField({
      name: 'ticketsUrl',
      title: 'Tickets link',
      type: 'url',
      group: 'edition',
      description: 'Eventbrite, for Gala seats.',
      hidden: editionHidden('ticketsUrl'),
    }),
    defineField({
      name: 'attendance',
      title: 'Attendance',
      type: 'sourcedFigure',
      group: 'edition',
      description: 'For a past edition, with its source.',
      hidden: editionHidden('attendance'),
    }),
    defineField({
      name: 'schedule',
      title: 'Schedule',
      type: 'array',
      of: [{ type: 'scheduleItem' }],
      group: 'day',
      hidden: editionHidden('schedule'),
    }),
    defineField({
      name: 'vendorsHosted',
      title: 'Vendors hosted',
      type: 'sourcedFigure',
      group: 'vendors',
      hidden: editionHidden('vendorsHosted'),
      description:
        'For a past edition: how many vendors the market hosted, with the source ("Vendor register, 2026"). Impact shows it beside the attendance.',
    }),
    defineField({
      name: 'vendorTerms',
      title: 'Vendor terms',
      type: 'object',
      group: 'vendors',
      hidden: editionHidden('vendorTerms'),
      fields: [
        text('fees', 'Booth fees', 3, 'One line per booth size.'),
        defineField({
          name: 'closeDate',
          title: 'Applications close',
          type: 'date',
          options: US_DATE,
        }),
        defineField({
          name: 'decisionDate',
          title: 'Decisions by',
          type: 'date',
          options: US_DATE,
        }),
        defineField({
          name: 'permitNote',
          title: 'Permit note',
          type: 'string',
          validation: voice.text,
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Newest edition first',
      name: 'editionDesc',
      by: [{ field: 'edition', direction: 'desc' }],
    },
    { title: 'Latest first', name: 'startDesc', by: [{ field: 'start', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', kind: 'kind', start: 'start', edition: 'edition' },
    prepare: ({ title, kind, start, edition }) => ({
      title,
      subtitle: [
        EVENT_KIND_TITLES[kind as keyof typeof EVENT_KIND_TITLES] ?? kind,
        start ? instantDate(start) : edition ? `${edition}, date pending` : 'Date pending',
      ]
        .filter(Boolean)
        .join(' • '),
    }),
  },
});

export const zone = defineType({
  name: 'zone',
  title: 'Festival zone',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'bilingual',
      description: 'Yoruba with marks, then the English translation.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'line',
      title: 'One line',
      type: 'text',
      rows: 2,
      description: 'Empty shows Pending.',
      validation: voice.text,
    }),
    defineField({ name: 'image', title: 'Photo', type: 'oyImage' }),
    order,
    defineField({ name: 'active', title: 'Active', type: 'boolean', initialValue: true }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { yo: 'name.yo', en: 'name.en', media: 'image' },
    prepare: ({ yo, en, media }) => ({ title: yo, subtitle: en, media }),
  },
});

/** The Gala edition a tier, level or honoree belongs to: only Gala editions, never a new one here. */
const galaEdition = (description: string, required?: string) =>
  defineField({
    name: 'event',
    title: 'Edition',
    type: 'reference',
    to: [{ type: 'event' }],
    description,
    options: { filter: 'kind == $kind', filterParams: { kind: 'gala' }, disableNew: true },
    validation: (rule) => (required ? rule.required().error(required) : rule),
  });

export const ticketTier = defineType({
  name: 'ticketTier',
  title: 'Ticket tier',
  type: 'document',
  fields: [
    galaEdition(
      'The Gala edition this tier sells seats for.',
      'Choose the Gala edition this tier sells seats for.',
    ),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredHeading }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: '"$125"',
      validation: voice.text,
    }),
    lines('includes', 'Includes'),
    defineField({
      name: 'variant',
      title: 'How it is bought',
      type: 'string',
      options: {
        list: [
          { title: 'Buy now (Eventbrite)', value: 'buyNow' },
          { title: 'Enquiry (a table)', value: 'enquiry' },
        ],
        layout: 'radio',
      },
      initialValue: 'buyNow',
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    order,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', price: 'price', edition: 'event.title' },
    prepare: ({ title, price, edition }) => ({
      title,
      subtitle: [price, edition ?? 'no edition'].filter(Boolean).join(' • '),
    }),
  },
});

export const sponsorLevel = defineType({
  name: 'sponsorLevel',
  title: 'Sponsor level',
  type: 'document',
  fields: [
    defineField({
      name: 'scope',
      title: 'Scope',
      type: 'string',
      description: 'The Gala page lists the Gala levels and the organization levels.',
      options: {
        list: titled(SPONSOR_SCOPES, SPONSOR_SCOPE_TITLES),
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
    galaEdition('The Gala edition. Empty shows the level every year.'),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredText }),
    defineField({ name: 'amount', title: 'Amount', type: 'string', validation: voice.text }),
    lines('recognition', 'Recognition'),
    order,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', amount: 'amount', edition: 'event.title', scope: 'scope' },
    prepare: ({ title, amount, edition, scope }) => ({
      title,
      subtitle: [
        amount,
        edition ?? SPONSOR_SCOPE_TITLES[scope as keyof typeof SPONSOR_SCOPE_TITLES] ?? scope,
      ]
        .filter(Boolean)
        .join(' • '),
    }),
  },
});

export const honoree = defineType({
  name: 'honoree',
  title: 'Honoree',
  type: 'document',
  fields: [
    galaEdition(
      'The Gala edition that honors them. The honorees show once an administrator turns the awards on.',
      'Choose the Gala edition that honors them.',
    ),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredText }),
    defineField({ name: 'award', title: 'Award', type: 'string', validation: voice.text }),
    text('blurb', 'Blurb', 2),
    defineField({ name: 'image', title: 'Photo', type: 'oyImage' }),
  ],
  preview: {
    select: { title: 'name', award: 'award', edition: 'event.title', media: 'image' },
    prepare: ({ title, award, edition, media }) => ({
      title,
      subtitle: [award, edition ?? 'no edition'].filter(Boolean).join(' • '),
      media,
    }),
  },
});

export const PROGRAM_PAGES = ['lessons', 'collective'] as const;

export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredHeading }),
    slug('name'),
    defineField({ name: 'kicker', title: 'Kicker', type: 'bilingual' }),
    text('blurb', 'Blurb', 3),
    defineField({ name: 'image', title: 'Photo', type: 'oyImage' }),
    defineField({
      name: 'cadence',
      title: 'Cadence',
      type: 'string',
      description: '"Monthly", "Online, by arrangement". Empty shows Pending.',
      validation: voice.text,
    }),
    defineField({ name: 'ages', title: 'Ages', type: 'string', validation: voice.text }),
    defineField({
      name: 'page',
      title: 'Own page',
      type: 'string',
      description:
        'Only the Lessons and the Collective have a page of their own; their cards link to it.',
      options: {
        list: titled(PROGRAM_PAGES, {
          lessons: 'Yoruba Language Lessons',
          collective: COLLECTIVE_NAME,
        }),
      },
    }),
    defineField({
      name: 'action',
      title: 'Card action',
      type: 'cta',
      description: 'The quiet link on the program card. Empty shows no link.',
    }),
    defineField({
      ...order,
      description: 'Lower shows first. The homepage shows the first three.',
    }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'cadence', media: 'image' } },
});

/** One of the Collective's initiatives: an item of the Collective page's list (ADR 0042). */
export const initiative = defineType({
  name: 'initiative',
  title: 'Initiative',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredHeading }),
    defineField({ name: 'memberLed', title: 'Member led', type: 'boolean', initialValue: true }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: titled(['planned', 'piloting', 'running'] as const),
        layout: 'radio',
        direction: 'horizontal',
      },
      description: 'Empty shows Pending.',
    }),
    defineField({
      name: 'statusLine',
      title: 'Status line',
      type: 'string',
      validation: voice.text,
    }),
    text('blurb', 'Blurb', 3),
    defineField({ name: 'image', title: 'Photo', type: 'oyImage' }),
    defineField({ name: 'serves', title: 'Serves', type: 'string', validation: voice.text }),
    defineField({ name: 'since', title: 'Since', type: 'string', validation: voice.text }),
    defineField({ name: 'next', title: 'Next', type: 'string', validation: voice.text }),
  ],
  preview: { select: { title: 'name', subtitle: 'status', media: 'image' } },
});

/** The groups Our Story lists. The teacher is the person the Lessons page picks, in no group (ADR 0042). */
export const PERSON_GROUPS = ['board', 'staff', 'volunteer'] as const;

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredText }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: '"Chair", "Head teacher".',
      validation: voice.heading,
    }),
    defineField({
      name: 'group',
      title: 'Group',
      type: 'string',
      description:
        'Our Story lists the board, the staff and the volunteers. Leave it empty for someone only the Lessons page shows: the teacher it picks.',
      options: {
        list: titled(PERSON_GROUPS, { volunteer: 'Volunteers' }),
        layout: 'radio',
        direction: 'horizontal',
      },
      // Empty is right only for the teacher the Lessons page picks; anyone else would show nowhere.
      validation: (rule) =>
        rule
          .custom(async (group, context) => {
            if (group) return true;
            const id = context.document?._id?.replace(/^drafts\./, '');
            const picked = await context
              .getClient({ apiVersion: STUDIO_API_VERSION })
              .fetch<string | null>('*[_id == "lessonsPage"][0].teacher._ref');
            return picked === id
              ? true
              : 'Our Story lists no one without a group. Leave it empty only for the teacher the Lessons page picks.';
          })
          .warning(),
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'oyImage',
      description: 'Optional; the card without a portrait is a real design.',
    }),
    text('bioShort', 'Short bio', 3),
    defineField({ name: 'bioFull', title: 'Full bio', type: 'blockContent' }),
    order,
  ],
  orderings: [
    {
      title: 'Group, then order',
      name: 'groupOrder',
      by: [
        { field: 'group', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'name', role: 'role', group: 'group', media: 'portrait' },
    prepare: ({ title, role, group, media }) => ({
      title,
      subtitle: [role, group].filter(Boolean).join(' • '),
      media,
    }),
  },
});

/**
 * One entry on Our Story's timeline (ADR 0035): a year or a span and one line, as `15 People and
 * History.dc.html` draws it; a milestone (the founding, today) is drawn apart from the rest.
 */
/** One entry of Our Story's timeline: an item of the page's list (ADR 0042). */
export const timelineEntry = defineType({
  name: 'timelineEntry',
  title: 'Timeline entry',
  type: 'object',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: '"2003", "1998 to 2002", "Today".',
      validation: voice.requiredText,
    }),
    defineField({
      name: 'blurb',
      title: 'What happened',
      type: 'text',
      rows: 2,
      description: 'One line.',
      validation: voice.requiredText,
    }),
    defineField({
      name: 'milestone',
      title: 'Milestone',
      type: 'boolean',
      description: 'Drawn apart from the other entries, as the founding and today are.',
      initialValue: false,
    }),
  ],
  preview: { select: { title: 'year', subtitle: 'blurb' } },
});

export const TESTIMONIAL_CONTEXTS = ['lessons', 'festival', 'collective', 'general'] as const;

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Member voice',
  type: 'document',
  fields: [
    text('quote', 'Quote', 4),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.text }),
    defineField({
      name: 'relation',
      title: 'Relation',
      type: 'string',
      description: '"Parent, Language Lessons".',
      validation: voice.text,
    }),
    defineField({
      name: 'permissionToName',
      title: 'Permission to name',
      type: 'boolean',
      description: 'Off shows initials only.',
      initialValue: false,
    }),
    defineField({
      name: 'context',
      title: 'Context',
      type: 'string',
      options: {
        list: titled(TESTIMONIAL_CONTEXTS, { festival: 'Odunde Festival' }),
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'relation' } },
});

export const album = defineType({
  name: 'album',
  title: 'Album',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: voice.requiredHeading,
    }),
    slug('title'),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: US_DATE,
      description:
        "When the photographs were taken. Empty takes the year of the album's edition; an album with neither shows Pending (the summer camp's year is unconfirmed).",
    }),
    defineField({
      name: 'event',
      title: 'Edition',
      type: 'reference',
      to: [{ type: 'event' }],
      description:
        "The edition the photographs come from: its year dates the album, the album page links to the edition's page, and the edition's page shows the first album that names it under past years.",
    }),
    defineField({ name: 'cover', title: 'Cover', type: 'oyImage' }),
    defineField({
      name: 'photos',
      title: 'Photographs',
      type: 'array',
      of: [{ type: 'oyImage' }],
      description:
        "In the order the album page and the photo viewer show them; the first is the gallery tile's photograph when no cover is chosen. A shared link to a photograph keeps working while the photograph stays in the album. The album's credit applies to every photograph unless one sets its own.",
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [{ type: 'video' }],
      description:
        "Videos from YouTube, in the order the album page shows them, above the photographs. The first one also shows on the edition's page under past years. Nothing is requested from YouTube until a visitor presses play.",
    }),
    defineField({
      name: 'credit',
      title: 'Photographer',
      type: 'reference',
      to: [{ type: 'photographer' }],
    }),
    defineField({
      name: 'creditConfirmed',
      title: 'Credit confirmed',
      type: 'boolean',
      initialValue: false,
    }),
    text(
      'consentNote',
      'Consent note',
      2,
      'Anything specific to this album about faces and permission.',
    ),
  ],
  orderings: [
    { title: 'Newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      editionYear: 'event.edition',
      count: 'photos.length',
      media: 'cover',
      confirmed: 'creditConfirmed',
    },
    // The date, else the edition's year, as the gallery dates an album (ADR 0039).
    prepare: ({ title, date, editionYear, media, confirmed }) => ({
      title,
      subtitle: [
        date ? calendarDate(date) : editionYear ? String(editionYear) : 'year to confirm',
        confirmed ? 'credit confirmed' : 'credit to confirm',
      ].join(' • '),
      media,
    }),
  },
});

export const photographer = defineType({
  name: 'photographer',
  title: 'Photographer',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredText }),
    defineField({
      name: 'defaultCredit',
      title: 'Credit line',
      type: 'string',
      description: 'As printed under a photo.',
      validation: voice.text,
    }),
    defineField({
      name: 'url',
      title: 'Link',
      type: 'url',
      description: 'Their own page. The name in their credits links to it.',
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'defaultCredit' } },
});

export const PARTNER_KINDS = ['funder', 'partner', 'sponsor'] as const;

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredText }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'oyImage',
      description: 'Optional; a text chip shows without one.',
    }),
    defineField({ name: 'url', title: 'Link', type: 'url' }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: { list: titled(PARTNER_KINDS), layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'scope',
      title: 'Shown on',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Impact lists every partner; the Odunde page lists its own.',
      options: { list: titled(PARTNER_SCOPES, PARTNER_SCOPE_TITLES) },
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'kind', media: 'logo' } },
});

export const OUTCOME_KINDS = ['festival', 'gala'] as const;

/**
 * What one program or event produced (ADR 0035): exactly one subject, a program or an event page's kind,
 * as a year strip row names one (ADR 0031); its heading on Impact is the subject's name. A figure carries
 * its source line; without one, the plain statement says what is being measured.
 */
/** What one program or event produced: an item of Impact's list (ADR 0042). */
export const outcome = defineType({
  name: 'outcome',
  title: 'Outcome',
  type: 'object',
  validation: (rule) =>
    rule.custom((item) => {
      const value = item as { program?: unknown; kind?: string } | undefined;
      if (!value) return true;
      if (value.program && value.kind) return 'Choose a program or an event, not both.';
      if (!value.program && !value.kind)
        return 'Choose the program or the event this outcome is for.';
      return true;
    }),
  fields: [
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
      description: 'The event whose page the outcome names; its name shows without a year.',
      options: {
        list: OUTCOME_KINDS.map((kind) => ({ title: EVENT_PAGE_NAMES[kind], value: kind })),
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'figure',
      title: 'Figure',
      type: 'sourcedFigure',
      description:
        'The number and what it counts ("Learners taught since 2019"), with its source. Leave empty while nothing is measured yet, and write the plain statement instead.',
    }),
    text(
      'plainStatement',
      'Plain statement',
      2,
      'What is being measured this year, when there is no figure.',
    ),
  ],
  preview: {
    select: { program: 'program.name', kind: 'kind', value: 'figure.value' },
    prepare: ({ program, kind, value }) => {
      const event = OUTCOME_KINDS.find((known) => known === kind);
      return {
        title: program ?? (event ? EVENT_PAGE_NAMES[event] : 'An outcome'),
        subtitle: value ?? 'no figure yet',
      };
    },
  },
});

export const stat = defineType({
  name: 'stat',
  title: 'Headline figure',
  type: 'document',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: '"29", "3,000+"',
      validation: voice.requiredText,
    }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: voice.requiredText }),
    defineField({
      name: 'shortLabel',
      title: 'Short label',
      type: 'string',
      description:
        'The label in the homepage strip, where the space is small: "years serving SoCal". Empty uses the label.',
      validation: voice.text,
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Empty shows Pending on the Impact page.',
      validation: voice.text,
    }),
  ],
  preview: {
    select: { value: 'value', label: 'label', source: 'source' },
    prepare: ({ value, label, source }) => ({
      title: `${value} ${label}`,
      subtitle: source ?? 'Source pending',
    }),
  },
});

/**
 * One of the ways in, shown by the homepage, Get Involved and Donate (ADR 0013); the vendor door joined in
 * Phase 7 (ADR 0034). The Studio calls it a way to get involved.
 */
export const door = defineType({
  name: 'door',
  title: 'Way to get involved',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Kind',
      type: 'string',
      options: { list: titled(DOOR_KEYS, DOOR_CHIPS), layout: 'radio', direction: 'horizontal' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: voice.requiredHeading,
    }),
    text('blurb', 'Blurb', 3),
    lines(
      'bullets',
      'What it asks and gives',
      'One thing per line. An empty list shows Pending on the site.',
    ),
    defineField({ name: 'action', title: 'Action', type: 'cta' }),
    defineField({ name: 'image', title: 'Photo', type: 'oyImage' }),
  ],
  preview: {
    select: { title: 'title', key: 'key', media: 'image' },
    prepare: ({ title, key, media }) => ({
      title,
      subtitle: DOOR_CHIPS[key as keyof typeof DOOR_CHIPS] ?? key,
      media,
    }),
  },
});

export const hometownAssociation = defineType({
  name: 'hometownAssociation',
  title: 'Hometown association',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredText }),
    defineField({ name: 'url', title: 'Link', type: 'url' }),
  ],
  preview: { select: { title: 'name', subtitle: 'url' } },
});

/** One preset amount and what it pays for: an item of the Donate page's list (ADR 0042). */
export const givingLevel = defineType({
  name: 'givingLevel',
  title: 'Giving level',
  type: 'object',
  fields: [
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'string',
      description: '"$25"',
      validation: voice.requiredText,
    }),
    text('what', 'What it does', 2, 'Gets checked, so it must be true.'),
    defineField({
      name: 'frequency',
      title: 'Frequency',
      type: 'string',
      options: {
        list: titled(['once', 'monthly'] as const),
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Where the cost comes from.',
      validation: voice.text,
    }),
  ],
  preview: { select: { title: 'amount', subtitle: 'what' } },
});

export const GOVERNANCE_KINDS = ['form990', 'annualReport', 'audit'] as const;

export const governanceDoc = defineType({
  name: 'governanceDoc',
  title: 'Governance document',
  type: 'document',
  fields: [
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          { title: 'Form 990', value: 'form990' },
          { title: 'Annual report', value: 'annualReport' },
          { title: 'Audit', value: 'audit' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'year', title: 'Year', type: 'string', validation: voice.text }),
    defineField({ name: 'file', title: 'File', type: 'file' }),
    text('note', 'Note', 2, 'What the page says when there is no file: "Copies on request".'),
  ],
  preview: { select: { title: 'kind', subtitle: 'year' } },
});

export const LINT_FINDING_KINDS = ['em-dash', 'marks'] as const;

/**
 * Written by the content-lint function for a published document (ADR 0014); the Studio calls it
 * wording to check (ADR 0042).
 */
export const lintReport = defineType({
  name: 'lintReport',
  title: 'Wording to check',
  type: 'document',
  fields: [
    defineField({
      name: 'documentId',
      title: 'Document id',
      type: 'string',
      readOnly: true,
      hidden: forMembers,
    }),
    defineField({
      name: 'documentType',
      title: 'Document type',
      type: 'string',
      readOnly: true,
      hidden: forMembers,
    }),
    defineField({ name: 'title', title: 'Document', type: 'string', readOnly: true }),
    defineField({
      name: 'checkedRev',
      title: 'Revision checked',
      type: 'string',
      readOnly: true,
      hidden: forMembers,
    }),
    defineField({
      name: 'checkedAt',
      title: 'Checked',
      type: 'datetime',
      options: LA_DATETIME,
      readOnly: true,
    }),
    defineField({
      name: 'findings',
      title: 'What to fix',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          name: 'lintFinding',
          fields: [
            defineField({ name: 'path', title: 'Field', type: 'string' }),
            defineField({
              name: 'kind',
              title: 'Kind',
              type: 'string',
              options: {
                list: titled(LINT_FINDING_KINDS, { 'em-dash': 'Em dash', marks: 'Missing marks' }),
              },
            }),
            defineField({ name: 'message', title: 'Message', type: 'string' }),
            defineField({ name: 'excerpt', title: 'Excerpt', type: 'string' }),
          ],
          preview: { select: { title: 'message', subtitle: 'path' } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', count: 'findings.length' },
    prepare: ({ title, count }) => ({
      title: title ?? 'Untitled document',
      subtitle: count ? `${count} to fix` : 'Nothing to fix',
    }),
  },
});

export const contentDocumentTypes = [
  event,
  zone,
  ticketTier,
  sponsorLevel,
  honoree,
  program,
  person,
  testimonial,
  album,
  photographer,
  partner,
  stat,
  door,
  hometownAssociation,
  governanceDoc,
  lintReport,
];

/** The items of the pages' own lists: once documents, now objects the page holds (ADR 0042). */
export const pageListTypes = [initiative, outcome, timelineEntry, givingLevel];
