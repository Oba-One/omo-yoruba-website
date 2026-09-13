import { createImageSet } from '@oy/content/images';
import { describe, expect, it } from 'vitest';
import { buildGalaPage, type GalaPageData, seatsFrom } from './gala-page';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const image = (alt: string) => ({
  _type: 'oyImage' as const,
  alt,
  caption: null,
  hotspot: null,
  crop: null,
  asset: { _ref: 'image-0a1b2c3d-1100x728-jpg', _type: 'reference' as const },
});
const now = new Date('2026-09-12T12:00:00Z');
const options = { imageSet, draft: false, studioUrl: '/admin', now };

const edition = (id: string, year: number, extra: Record<string, unknown> = {}) => ({
  _id: id,
  kind: 'gala',
  title: `End-of-Year Gala ${year}`,
  edition: year,
  start: null,
  end: null,
  doors: null,
  venue: null,
  dress: null,
  ticketsUrl: null,
  schedule: null,
  tiers: [],
  album: null,
  ...extra,
});

// Test values only for tiers and facts: the development dataset holds none (12 September 2026).
const tier = (id: string, price: string | null, variant: 'buyNow' | 'enquiry' | null) => ({
  _id: id,
  name: `[ ${id} ]`,
  price,
  includes: null,
  variant,
  featured: null,
});

const seeded = {
  header: {
    kicker: { yo: 'Àsè ọdún', en: "The year's celebration" },
    title: 'End-of-Year Gala',
    line: 'An evening of culture, community, and celebration, held each year in November or December.',
    image: image('Guests seated at round tables'),
  },
  primaryAction: {
    label: 'Get tickets',
    kind: 'anchor',
    enquiryKind: null,
    href: '#seats',
    newTab: null,
  },
  secondaryActions: [
    {
      _key: 'action-1',
      label: 'Sponsor the evening',
      kind: 'enquiry',
      enquiryKind: 'sponsor',
      href: null,
      newTab: null,
    },
  ],
  extraFacts: null,
  eveningIntro: 'The Gala closes our year.',
  tiersIntro: null,
  sponsorIntro: null,
  honoreesIntro: null,
  pastIntro: null,
  takePart: [
    {
      _key: 'way-1',
      way: 'sponsor',
      title: 'Sponsor the evening',
      line: null,
      label: 'Sponsor the Gala',
    },
    {
      _key: 'way-2',
      way: 'table',
      title: 'Bring your table',
      line: null,
      label: 'Reserve a table',
    },
    {
      _key: 'way-3',
      way: 'volunteer',
      title: 'The night needs hands',
      line: null,
      label: 'Volunteer',
    },
    { _key: 'way-4', way: 'give', title: 'Cannot come this year?', line: null, label: 'Donate' },
  ],
  editions: [edition('event-gala-2026', 2026), edition('event-gala-2025', 2025)],
  sponsorLevels: [],
  honorees: [],
  layout: {
    treatment: 'formal',
    tiers: 'columns',
    emphasis: 'seats',
    awards: 'shown',
    schedule: 'shown',
    past: 'shown',
    labels: 'column',
  },
  seo: null,
} as unknown as GalaPageData;

describe('seatsFrom', () => {
  it('takes the first buy-now price by order and the table price as the note', () => {
    expect(
      seatsFrom([
        tier('table', '[ table price ]', 'enquiry'),
        tier('seat', '[ seat price ]', 'buyNow'),
        tier('couple', '[ couple price ]', 'buyNow'),
      ]),
    ).toEqual({ value: '[ seat price ]', note: 'Tables of ten from [ table price ]' });
  });

  it('reads an unset variant as buy now and skips a tier with no price', () => {
    expect(seatsFrom([tier('seat', ' ', null), tier('couple', '[ couple price ]', null)])).toEqual({
      value: '[ couple price ]',
    });
    expect(seatsFrom([])).toEqual({});
    expect(seatsFrom(null)).toEqual({});
  });
});

describe('buildGalaPage', () => {
  it('fills the layout defaults and puts every option on the body', () => {
    const view = buildGalaPage(
      { ...seeded, layout: { treatment: 'warm' } } as GalaPageData,
      options,
    );
    expect(view.layout.treatment).toBe('warm');
    expect(view.layout.labels).toBe('column');
    expect(view.root).toEqual(view.layout);
    expect(buildGalaPage(null, options).layout.treatment).toBe('formal');
  });

  it('shows the next gala, which stays ahead until its year ends', () => {
    expect(buildGalaPage(seeded, options).edition?._id).toBe('event-gala-2026');
    const january = buildGalaPage(seeded, { ...options, now: new Date('2027-01-05T12:00:00Z') });
    expect(january.edition).toBeUndefined();
  });

  it('writes the header facts and the glance with the registry chips for what is missing', () => {
    const view = buildGalaPage(seeded, options);
    expect(view.header.facts).toEqual([
      { pending: 'the date' },
      { pending: 'the venue' },
      { pending: 'three prices and what each includes' },
    ]);
    expect(view.glance).toEqual([
      {
        label: 'Date',
        value: undefined,
        pending: 'the date',
        note: 'Held each November or December',
      },
      { label: 'Doors', value: undefined, pending: 'the doors time' },
      { label: 'Venue', value: undefined, pending: 'the venue', note: undefined },
      { label: 'Dress', value: undefined, pending: 'the dress code' },
      {
        label: 'Seats from',
        value: undefined,
        pending: 'three prices and what each includes',
        note: undefined,
      },
    ]);
    expect(view.header.actions.map((action) => action?.label)).toEqual([
      'Get tickets',
      'Sponsor the evening',
    ]);
  });

  it('fills the facts the edition holds and derives the seats from its tiers', () => {
    const filled = {
      ...seeded,
      editions: [
        edition('event-gala-2026', 2026, {
          start: '2026-12-06T02:00:00.000Z',
          doors: '[ doors ]',
          venue: { name: '[ venue ]', address: '[ address ]', line: null },
          dress: '[ dress ]',
          tiers: [
            tier('seat', '[ seat price ]', 'buyNow'),
            tier('table', '[ table price ]', 'enquiry'),
          ],
        }),
      ],
    } as unknown as GalaPageData;
    const view = buildGalaPage(filled, options);
    expect(view.header.facts).toEqual([
      { text: 'Saturday 5 December 2026' },
      { text: '[ venue ]' },
      { text: 'Seats from [ seat price ]' },
    ]);
    expect(view.glance.map((fact) => fact.value)).toEqual([
      'Sat 5 December 2026',
      '[ doors ]',
      '[ venue ]',
      '[ dress ]',
      '[ seat price ]',
    ]);
    expect(view.glance[2]?.note).toBe('[ address ]');
    expect(view.glance[4]?.note).toBe('Tables of ten from [ table price ]');
  });

  it('keeps the glance to five facts, so the extra facts wait behind the derived ones', () => {
    const extra = {
      ...seeded,
      extraFacts: [{ _key: 'fact-1', label: '[ label ]', value: '[ value ]', note: null }],
    } as unknown as GalaPageData;
    expect(buildGalaPage(extra, options).glance.map((fact) => fact.label)).toEqual([
      'Date',
      'Doors',
      'Venue',
      'Dress',
      'Seats from',
    ]);
  });

  it('carries the evening intro, the running order the option shows and the take-part rows', () => {
    const view = buildGalaPage(seeded, options);
    expect(view.evening.intro).toBe('The Gala closes our year.');
    expect(view.evening.schedule).toEqual({ shown: true, items: [], pending: 'the running order' });
    const hidden = buildGalaPage(
      { ...seeded, layout: { schedule: 'hidden' } } as GalaPageData,
      options,
    );
    expect(hidden.evening.schedule.shown).toBe(false);
    expect(buildGalaPage(null, options).evening).toMatchObject({
      intro: undefined,
      introPending: 'the evening, in your words',
    });
    expect(view.takePart.rows.map((row) => row.way)).toEqual([
      'sponsor',
      'table',
      'volunteer',
      'give',
    ]);
    expect(view.takePart.intro).toBe(
      'Four ways to be part of the evening, whether or not you can be in the room.',
    );
    expect(view.takePart.labels).toBe('column');
  });

  it('resolves the header photograph, cleans the head and writes edit attributes only in draft', () => {
    const view = buildGalaPage(seeded, options);
    expect(view.header.image?.src).toContain('cdn.sanity.io');
    expect(view.title).toBe('End-of-Year Gala');
    expect(view.edit.treatment).toBeUndefined();
    const draft = buildGalaPage(seeded, { ...options, draft: true });
    expect(draft.edit.treatment).toContain('path=layout.treatment');
    expect(draft.takePart.rows[0]?.edit).toContain('path=takePart:way-1');
    expect(buildGalaPage(null, options).title).toBe('End-of-Year Gala');
  });

  it('carries the seats: the tiers with their edit attributes, the options and the edition link', () => {
    const view = buildGalaPage(seeded, options);
    expect(view.seats).toMatchObject({
      tiers: [],
      layout: 'columns',
      emphasis: 'seats',
      ticketsUrl: undefined,
      pending: 'three prices and what each includes',
      ticketsPending: 'the Eventbrite link',
      pricePending: 'the price',
      includesPending: 'what the ticket includes',
    });
    const sold = {
      ...seeded,
      tiersIntro: '[ intro ]',
      layout: { tiers: 'rows', emphasis: 'tables' },
      editions: [
        edition('event-gala-2026', 2026, {
          ticketsUrl: 'https://www.eventbrite.com/e/0',
          tiers: [tier('seat', '[ seat price ]', 'buyNow')],
        }),
      ],
    } as unknown as GalaPageData;
    const draft = buildGalaPage(sold, { ...options, draft: true });
    expect(draft.seats.intro).toBe('[ intro ]');
    expect(draft.seats.ticketsUrl).toBe('https://www.eventbrite.com/e/0');
    expect(draft.seats.layout).toBe('rows');
    expect(draft.seats.emphasis).toBe('tables');
    expect(draft.seats.tiers[0]?.edit).toContain('id=seat;type=ticketTier;path=name');
  });
});
