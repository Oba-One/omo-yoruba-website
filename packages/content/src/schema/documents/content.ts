import { defineField, defineType } from 'sanity';
import { DOOR_KEYS } from '../../doors';
import { EVENT_PAGE_NAMES } from '../../routes';
import { voice } from '../../validation/rules';
import { lines, order, slug, text } from '../helpers';

export const EVENT_KINDS = ['festival', 'gala', 'collective', 'other'] as const;

/** One edition of an event; every per-edition fact lives here (ADR 0013). */
export const event = defineType({
  name: 'event',
  title: 'Event edition',
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
      options: { list: [...EVENT_KINDS], layout: 'radio', direction: 'horizontal' },
      group: 'edition',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'edition',
      description: '"Odunde Festival 2027": one word, no marks, in display text (ADR 0009).',
      validation: voice.requiredHeading,
    }),
    defineField({
      name: 'edition',
      title: 'Edition year',
      type: 'number',
      group: 'edition',
      validation: (rule) => rule.required().integer().min(1997),
    }),
    defineField({
      name: 'start',
      title: 'Starts',
      type: 'datetime',
      group: 'edition',
      description: 'Empty shows a Pending date.',
    }),
    defineField({ name: 'end', title: 'Ends', type: 'datetime', group: 'edition' }),
    defineField({
      name: 'doors',
      title: 'Doors',
      type: 'string',
      group: 'edition',
      description: '"6pm"',
      validation: voice.text,
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'object',
      group: 'edition',
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.text }),
        defineField({ name: 'address', title: 'Address', type: 'string', validation: voice.text }),
        defineField({
          name: 'line',
          title: 'One line',
          type: 'string',
          description: '"43rd Place at Degnan Boulevard"',
          validation: voice.text,
        }),
      ],
    }),
    defineField({
      name: 'cost',
      title: 'Cost',
      type: 'string',
      group: 'edition',
      description: '"Free entry", "Seats from ..."',
      validation: voice.text,
    }),
    defineField({
      name: 'dress',
      title: 'Dress',
      type: 'string',
      group: 'edition',
      validation: voice.text,
    }),
    defineField({ name: 'heroImage', title: 'Hero image', type: 'oyImage', group: 'edition' }),
    text('summary', 'Summary', 3),
    defineField({
      name: 'ticketsUrl',
      title: 'Tickets URL',
      type: 'url',
      group: 'edition',
      description: 'Eventbrite for Gala seats.',
    }),
    defineField({
      name: 'album',
      title: 'Album',
      type: 'reference',
      to: [{ type: 'album' }],
      group: 'edition',
    }),
    defineField({
      name: 'attendance',
      title: 'Attendance',
      type: 'sourcedFigure',
      group: 'edition',
      description: 'For a past edition.',
    }),
    defineField({
      name: 'schedule',
      title: 'Schedule',
      type: 'array',
      of: [{ type: 'scheduleItem' }],
      group: 'day',
    }),
    defineField({
      name: 'vendorsHosted',
      title: 'Vendors hosted',
      type: 'sourcedFigure',
      group: 'vendors',
      hidden: ({ document }) => document?.kind !== 'festival',
      description:
        'For a past edition: how many vendors the market hosted, with the source ("Vendor register, 2026"). Impact shows it beside the attendance (ADR 0035).',
    }),
    defineField({
      name: 'vendorTerms',
      title: 'Vendor terms',
      type: 'object',
      group: 'vendors',
      hidden: ({ document }) => document?.kind !== 'festival',
      fields: [
        text('fees', 'Booth fees', 3, 'One line per booth size.'),
        defineField({ name: 'closeDate', title: 'Applications close', type: 'date' }),
        defineField({ name: 'decisionDate', title: 'Decisions by', type: 'date' }),
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
  ],
  preview: {
    select: { title: 'title', kind: 'kind', start: 'start', edition: 'edition' },
    prepare: ({ title, kind, start, edition }) => ({
      title,
      subtitle: [
        kind,
        start ? new Date(start).toLocaleDateString('en-GB') : `${edition}, date pending`,
      ].join(' • '),
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

export const ticketTier = defineType({
  name: 'ticketTier',
  title: 'Ticket tier',
  type: 'document',
  fields: [
    defineField({
      name: 'event',
      title: 'Edition',
      type: 'reference',
      to: [{ type: 'event' }],
      validation: (rule) => rule.required(),
    }),
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
  preview: { select: { title: 'name', subtitle: 'price' } },
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
      options: { list: ['odunde', 'gala', 'org'], layout: 'radio', direction: 'horizontal' },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'event', title: 'Edition', type: 'reference', to: [{ type: 'event' }] }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredText }),
    defineField({ name: 'amount', title: 'Amount', type: 'string', validation: voice.text }),
    lines('recognition', 'Recognition'),
    order,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'amount' } },
});

export const honoree = defineType({
  name: 'honoree',
  title: 'Honoree',
  type: 'document',
  fields: [
    defineField({ name: 'event', title: 'Edition', type: 'reference', to: [{ type: 'event' }] }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredText }),
    defineField({ name: 'award', title: 'Award', type: 'string', validation: voice.text }),
    text('blurb', 'Blurb', 2),
    defineField({ name: 'image', title: 'Photo', type: 'oyImage' }),
  ],
  preview: { select: { title: 'name', subtitle: 'award', media: 'image' } },
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
      description: 'Only Lessons and the Collective have a page; the site derives whether to link.',
      options: { list: [...PROGRAM_PAGES] },
    }),
    defineField({
      name: 'action',
      title: 'Card action',
      type: 'cta',
      description:
        'The quiet link on the program card. When the homepage highlights this program, it is also the gold button in the hero. Empty shows no link.',
    }),
    defineField({
      ...order,
      description: 'Lower shows first. The homepage shows the first three.',
    }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'cadence', media: 'image' } },
});

export const initiative = defineType({
  name: 'initiative',
  title: 'Collective initiative',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredHeading }),
    defineField({ name: 'memberLed', title: 'Member led', type: 'boolean', initialValue: true }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['planned', 'piloting', 'running'],
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
    defineField({
      name: 'proceedsReturn',
      title: 'Proceeds return to the Collective',
      type: 'boolean',
    }),
    order,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'status', media: 'image' } },
});

export const PERSON_GROUPS = ['board', 'staff', 'volunteer', 'teacher'] as const;

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
      options: { list: [...PERSON_GROUPS], layout: 'radio', direction: 'horizontal' },
      validation: (rule) => rule.required(),
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
export const timelineEntry = defineType({
  name: 'timelineEntry',
  title: 'Timeline entry',
  type: 'document',
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
    order,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'year', subtitle: 'blurb' } },
});

export const TESTIMONIAL_CONTEXTS = ['lessons', 'festival', 'collective', 'general'] as const;

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
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
      options: { list: [...TESTIMONIAL_CONTEXTS], layout: 'radio', direction: 'horizontal' },
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'relation' } },
});

export const newsPost = defineType({
  name: 'newsPost',
  title: 'News post',
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
      description: 'Cards show the month and year.',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'kicker', title: 'Kicker', type: 'bilingual' }),
    text('summary', 'Summary', 3),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      description: 'Empty shows Pending on the post page.',
    }),
    defineField({ name: 'image', title: 'Image', type: 'oyImage' }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'program' }, { type: 'event' }] }],
      description:
        'The programs and events the post is about. Until the News page exists, Read more on the homepage opens the page of the first of them that has one (a festival or gala edition, a program); a post without one shows no Read more.',
    }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'person' }] }),
  ],
  orderings: [
    { title: 'Newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: { select: { title: 'title', subtitle: 'date', media: 'image' } },
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
      description: 'Empty shows Pending (the summer camp year is unconfirmed).',
    }),
    defineField({ name: 'event', title: 'Edition', type: 'reference', to: [{ type: 'event' }] }),
    defineField({ name: 'cover', title: 'Cover', type: 'oyImage' }),
    defineField({
      name: 'photos',
      title: 'Photographs',
      type: 'array',
      of: [{ type: 'oyImage' }],
      description:
        'Each photo key is its lightbox deep link. Credits here apply to every photo unless one sets its own.',
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
      count: 'photos.length',
      media: 'cover',
      confirmed: 'creditConfirmed',
    },
    prepare: ({ title, date, media, confirmed }) => ({
      title,
      subtitle: [date ?? 'date pending', confirmed ? 'credit confirmed' : 'credit to confirm'].join(
        ' • ',
      ),
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
    defineField({ name: 'url', title: 'URL', type: 'url' }),
    defineField({
      name: 'defaultCredit',
      title: 'Credit line',
      type: 'string',
      description: 'As printed under a photo.',
      validation: voice.text,
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'defaultCredit' } },
});

export const PARTNER_KINDS = ['funder', 'partner', 'sponsor'] as const;
export const PARTNER_SCOPES = ['odunde', 'gala', 'org', 'collective'] as const;

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
    defineField({ name: 'url', title: 'URL', type: 'url' }),
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: { list: [...PARTNER_KINDS], layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'scope',
      title: 'Shown on',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: [...PARTNER_SCOPES] },
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
export const outcome = defineType({
  name: 'outcome',
  title: 'Outcome',
  type: 'document',
  validation: (rule) =>
    rule.custom((document) => {
      const value = document as { program?: unknown; kind?: string } | undefined;
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
    order,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
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
    defineField({ name: 'asOf', title: 'As of', type: 'date' }),
  ],
  preview: {
    select: { value: 'value', label: 'label', source: 'source' },
    prepare: ({ value, label, source }) => ({
      title: `${value} ${label}`,
      subtitle: source ?? 'source pending',
    }),
  },
});

/**
 * One of the ways in, shown by the homepage, Get Involved and Donate (ADR 0013); the vendor door joined in
 * Phase 7 (ADR 0034).
 */
export const door = defineType({
  name: 'door',
  title: 'Door',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Door',
      type: 'string',
      options: { list: [...DOOR_KEYS], layout: 'radio', direction: 'horizontal' },
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
      'Empty rows show Pending where the register lists them.',
    ),
    defineField({ name: 'action', title: 'Action', type: 'cta' }),
    defineField({ name: 'image', title: 'Photo', type: 'oyImage' }),
    order,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'key', media: 'image' } },
});

export const hometownAssociation = defineType({
  name: 'hometownAssociation',
  title: 'Hometown association',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: voice.requiredText }),
    defineField({ name: 'url', title: 'URL', type: 'url' }),
  ],
  preview: { select: { title: 'name', subtitle: 'url' } },
});

export const givingLevel = defineType({
  name: 'givingLevel',
  title: 'Giving level',
  type: 'document',
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
      options: { list: ['once', 'monthly'], layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Where the cost comes from.',
      validation: voice.text,
    }),
    order,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
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

/** Written by the content-lint function for a published document (ADR 0014). */
export const lintReport = defineType({
  name: 'lintReport',
  title: 'Lint report',
  type: 'document',
  fields: [
    defineField({ name: 'documentId', title: 'Document id', type: 'string', readOnly: true }),
    defineField({ name: 'documentType', title: 'Document type', type: 'string', readOnly: true }),
    defineField({ name: 'title', title: 'Document', type: 'string', readOnly: true }),
    defineField({ name: 'checkedRev', title: 'Revision checked', type: 'string', readOnly: true }),
    defineField({ name: 'checkedAt', title: 'Checked', type: 'datetime', readOnly: true }),
    defineField({
      name: 'findings',
      title: 'Findings',
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
              options: { list: [...LINT_FINDING_KINDS] },
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
    select: { title: 'title', type: 'documentType', count: 'findings.length' },
    prepare: ({ title, type }) => ({ title: title ?? 'Untitled document', subtitle: type }),
  },
});

export const contentDocumentTypes = [
  event,
  zone,
  ticketTier,
  sponsorLevel,
  honoree,
  program,
  initiative,
  person,
  timelineEntry,
  testimonial,
  newsPost,
  album,
  photographer,
  partner,
  outcome,
  stat,
  door,
  hometownAssociation,
  givingLevel,
  governanceDoc,
  lintReport,
];
