import { createImageSet } from '@oy/content/images';
import { describe, expect, it } from 'vitest';
import { buildFestivalPage, type FestivalPageData } from './festival-page';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const image = (alt: string, caption: string | null = null) => ({
  _type: 'oyImage' as const,
  alt,
  caption,
  hotspot: null,
  crop: null,
  asset: { _ref: 'image-0a1b2c3d-1100x728-jpg', _type: 'reference' as const },
});
const now = new Date('2026-09-12T12:00:00Z');
const options = { imageSet, draft: false, studioUrl: '/admin', now };

const edition = (id: string, year: number, extra: Record<string, unknown> = {}) => ({
  _id: id,
  kind: 'festival',
  title: `Odunde Festival ${year}`,
  edition: year,
  start: null,
  end: null,
  venue: null,
  cost: null,
  summary: null,
  schedule: null,
  vendorTerms: null,
  attendance: null,
  album: null,
  ...extra,
});

// The development dataset as the seed leaves it on 12 September 2026.
const seeded = {
  header: {
    kicker: { yo: 'Ọdúndé', en: 'The new year has arrived' },
    title: 'Odunde Festival',
    line: 'A day of Yoruba culture at Leimert Park, held each June.',
    image: image('The procession moves down Degnan Boulevard'),
  },
  primaryAction: {
    label: 'Plan your day',
    kind: 'anchor',
    enquiryKind: null,
    href: '#plan',
    newTab: null,
  },
  secondaryActions: [
    {
      _key: 'action-1',
      label: 'Apply as a vendor',
      kind: 'enquiry',
      enquiryKind: 'vendor',
      href: null,
      newTab: null,
    },
  ],
  extraFacts: [
    { _key: 'fact-1', label: 'Family', value: 'All ages', note: "Children's compound on site" },
  ],
  whatItIs: [
    {
      _type: 'block',
      _key: 'block-1',
      style: 'normal',
      markDefs: [],
      children: [
        { _type: 'span', _key: 'span-1', text: 'Odunde marks the Yoruba new year.', marks: [] },
      ],
    },
  ],
  whatItIsImage: image('A dancer plays with a young girl', 'Festival day • Leimert Park'),
  zonesIntro: null,
  planYourVisit: null,
  takePart: [
    {
      _key: 'way-1',
      way: 'vendor',
      title: 'Sell at Ọjà Balógun',
      line: 'A booth is held once the fee is paid.',
      label: 'Apply for a booth',
    },
    {
      _key: 'way-2',
      way: 'sponsor',
      title: 'Keep the day open',
      line: 'Four questions, and we send the deck with our impact numbers.',
      label: 'Sponsor Odunde',
    },
  ],
  pastYearsIntro: null,
  partnersIntro: null,
  editions: [
    edition('event-odunde-2027', 2027, {
      venue: { name: 'Leimert Park', address: null, line: null },
    }),
    edition('event-odunde-2026', 2026, {
      venue: { name: 'Leimert Park', address: null, line: null },
      album: {
        _id: 'album-odunde-2026',
        title: 'Odunde 2026',
        slug: 'odunde-2026',
        creditConfirmed: false,
        credit: 'Red Carpet Media',
        photos: [
          {
            _key: 'photo-1',
            ...image('An elder high-fives a toddler', 'An elder high-fives a toddler'),
          },
          { _key: 'photo-2', ...image('The procession begins', 'The procession begins') },
        ],
      },
    }),
  ],
  zones: [],
  partners: [],
  layout: {
    phead: 'photo',
    zones: 'mosaic',
    schedule: 'shown',
    takepart: 'vendor',
    labels: 'column',
  },
  seo: null,
} as unknown as FestivalPageData;

describe('buildFestivalPage', () => {
  it('fills the layout defaults and puts every option on the body', () => {
    const view = buildFestivalPage(
      { ...seeded, layout: { phead: 'slim' } } as FestivalPageData,
      options,
    );
    expect(view.layout).toEqual({
      phead: 'slim',
      zones: 'mosaic',
      schedule: 'shown',
      takepart: 'vendor',
      labels: 'column',
    });
    expect(view.root).toEqual(view.layout);
    expect(buildFestivalPage(null, options).layout.phead).toBe('photo');
  });

  it('shows the next festival edition, never the one that ended in June', () => {
    const view = buildFestivalPage(seeded, options);
    expect(view.edition?._id).toBe('event-odunde-2027');
    const july2027 = buildFestivalPage(seeded, {
      ...options,
      now: new Date('2027-07-02T12:00:00Z'),
    });
    expect(july2027.edition).toBeUndefined();
  });

  it('writes the header facts and the glance from the edition, with the registry chips for what is missing', () => {
    const view = buildFestivalPage(seeded, options);
    expect(view.header.facts).toEqual([
      { pending: 'the date' },
      { pending: 'the hours' },
      { pending: 'the cost' },
    ]);
    expect(view.glance).toEqual([
      { label: 'Date', value: undefined, pending: 'the date' },
      { label: 'Time', value: undefined, pending: 'the hours' },
      {
        label: 'Where',
        value: 'Leimert Park',
        pending: 'the venue',
        note: undefined,
        notePending: 'the exact venue line',
      },
      { label: 'Cost', value: undefined, pending: 'the cost' },
      {
        label: 'Family',
        value: 'All ages',
        note: "Children's compound on site",
        pending: 'a glance fact',
      },
    ]);
    const dated = {
      ...seeded,
      editions: [
        edition('event-odunde-2027', 2027, {
          start: '2027-06-12T18:00:00.000Z',
          end: '2027-06-13T02:00:00.000Z',
          cost: 'Free entry',
          venue: { name: 'Leimert Park', address: null, line: 'Degnan Boulevard' },
        }),
      ],
    } as unknown as FestivalPageData;
    const filled = buildFestivalPage(dated, options);
    expect(filled.header.facts).toEqual([
      { text: 'Saturday 12 June 2027' },
      { text: '11am to 7pm' },
      { text: 'Free entry' },
    ]);
    expect(filled.glance.slice(0, 3).map((fact) => fact.value)).toEqual([
      'Sat 12 June 2027',
      '11am to 7pm',
      'Leimert Park',
    ]);
    expect(filled.glance[2]?.note).toBe('Degnan Boulevard');
  });

  it('names the row that owes the hours: the end when it is missing, the date when the start is', () => {
    const startOnly = {
      ...seeded,
      editions: [edition('event-odunde-2027', 2027, { start: '2027-06-12T18:00:00.000Z' })],
    } as unknown as FestivalPageData;
    const view = buildFestivalPage(startOnly, options);
    expect(view.header.facts[1]).toEqual({ pending: 'the hours' });
    expect(view.glance[1]).toEqual({ label: 'Time', value: undefined, pending: 'the hours' });
    const endOnly = {
      ...seeded,
      editions: [edition('event-odunde-2027', 2027, { end: '2027-06-13T02:00:00.000Z' })],
    } as unknown as FestivalPageData;
    expect(buildFestivalPage(endOnly, options).header.facts[1]).toEqual({ pending: 'the date' });
  });

  it('keeps the glance to five facts and the actions to two', () => {
    const many = {
      ...seeded,
      extraFacts: [1, 2, 3].map((n) => ({
        _key: `f${n}`,
        label: `Fact ${n}`,
        value: 'x',
        note: null,
      })),
    } as unknown as FestivalPageData;
    expect(buildFestivalPage(many, options).glance).toHaveLength(5);
    const view = buildFestivalPage(seeded, options);
    expect(view.header.actions.map((action) => action?.label)).toEqual([
      'Plan your day',
      'Apply as a vendor',
    ]);
  });

  it('resolves the photographs with their alt and caption, and cleans the head of stega', () => {
    const view = buildFestivalPage(seeded, options);
    expect(view.header.image?.src).toContain('cdn.sanity.io');
    expect(view.figure.image?.alt).toBe('A dancer plays with a young girl');
    expect(view.figure.caption).toBe('Festival day • Leimert Park');
    expect(view.whatItIs).toHaveLength(1);
    expect(view.title).toBe('Odunde Festival');
    expect(view.description).toBe('A day of Yoruba culture at Leimert Park, held each June.');
    const empty = buildFestivalPage(null, options);
    expect(empty.title).toBe('Odunde Festival');
    expect(empty.whatItIs).toBeUndefined();
    expect(empty.glance.map((fact) => fact.label)).toEqual(['Date', 'Time', 'Where', 'Cost']);
  });

  it('carries the zones, the schedule the option shows and the plan facts with their chips', () => {
    const withDay = {
      ...seeded,
      zones: [
        {
          _id: 'zone-oja-balogun',
          name: { yo: 'Ọjà Balógun', en: 'The market' },
          line: null,
          image: image('Elders at the market'),
        },
      ],
      planYourVisit: [{ _key: 'fact-1', label: 'Parking', value: null, note: null }],
      editions: [
        edition('event-odunde-2027', 2027, {
          schedule: [
            {
              _key: 'row-1',
              time: null,
              day: null,
              title: { yo: null, en: 'Opening' },
              detail: null,
              zone: null,
            },
          ],
        }),
      ],
    } as unknown as FestivalPageData;
    const view = buildFestivalPage(withDay, options);
    expect(view.zones).toHaveLength(1);
    expect(view.zones[0]?.image?.alt).toBe('Elders at the market');
    expect(view.schedule).toMatchObject({
      shown: true,
      open: true,
      pending: 'the rows, times and content',
    });
    expect(view.schedule.items).toHaveLength(1);
    expect(view.plan.facts).toEqual([
      { _key: 'fact-1', label: 'Parking', value: null, pending: 'a practical fact' },
    ]);
    expect(view.plan.pending).toBe('the eight practical facts');
    const collapsed = buildFestivalPage(
      { ...withDay, layout: { schedule: 'collapsed' } } as FestivalPageData,
      options,
    );
    expect(collapsed.schedule).toMatchObject({ shown: true, open: false });
    const hidden = buildFestivalPage(
      { ...withDay, layout: { schedule: 'hidden' } } as FestivalPageData,
      options,
    );
    expect(hidden.schedule.shown).toBe(false);
  });

  it('writes edit attributes only in draft mode', () => {
    expect(buildFestivalPage(seeded, options).edit.phead).toBeUndefined();
    const draft = buildFestivalPage(seeded, { ...options, draft: true });
    expect(draft.edit.phead).toContain('path=layout.phead');
    expect(draft.header.imageEdit).toContain('path=header.image');
    expect(draft.figure.edit).toContain('path=whatItIsImage');
  });

  it('carries the take-part rows, the options that draw them and the vendor terms of the next edition', async () => {
    const view = buildFestivalPage(seeded, options);
    expect(view.takePart.rows.map((row) => row.way)).toEqual(['vendor', 'sponsor']);
    expect(view.takePart).toMatchObject({
      intro: 'Two ways in. Each one says what it asks of you, then opens a short form.',
      lead: 'vendor',
      labels: 'column',
      vendorTerms: null,
      vendorTermsPending: 'fees, deadline and permit rules',
      pending: 'the ways in',
      rowPending: 'a way in, its title or its button label',
    });
    const withTerms = {
      ...seeded,
      editions: [
        edition('event-odunde-2027', 2027, {
          vendorTerms: {
            fees: null,
            closeDate: '2027-04-01',
            decisionDate: null,
            permitNote: null,
          },
        }),
      ],
    } as unknown as FestivalPageData;
    expect(buildFestivalPage(withTerms, options).takePart.vendorTerms?.closeDate).toBe(
      '2027-04-01',
    );
    const none = buildFestivalPage(null, options);
    expect(none.takePart.rows).toEqual([]);
    expect(none.takePart.intro).toBeUndefined();
    const one = buildFestivalPage(
      { ...seeded, takePart: seeded.takePart?.slice(0, 1) } as FestivalPageData,
      options,
    );
    expect(one.takePart.intro).toBe(
      'One way in. It says what it asks of you, then opens a short form.',
    );
    const draft = buildFestivalPage(seeded, { ...options, draft: true });
    expect(draft.takePart.rows[1]?.edit).toContain('path=takePart:way-2');
  });

  it('carries the newest past album as slides, its credit and the attendance chip', () => {
    const view = buildFestivalPage(seeded, options);
    expect(view.past.slides.map((slide) => slide.alt)).toEqual([
      'An elder high-fives a toddler',
      'The procession begins',
    ]);
    expect(view.past.slides[0]?.image?.src).toContain('cdn.sanity.io');
    expect(view.past.slides[1]?.caption).toBe('The procession begins');
    expect(view.past.album).toMatchObject({
      credit: 'Red Carpet Media',
      confirmed: false,
      pending: 'photographer credit to confirm',
    });
    expect(view.past.attendance).toBeUndefined();
    expect(view.past.attendancePending).toBe('the attendance figure');
    expect(view.past.pending).toBe('the photo albums');

    const counted = {
      ...seeded,
      editions: seeded.editions?.map((event) =>
        event?.edition === 2026
          ? {
              ...event,
              attendance: { value: '[ 0 ]', label: 'people came', source: null, asOf: null },
            }
          : event,
      ),
    } as FestivalPageData;
    expect(buildFestivalPage(counted, options).past.attendance).toBe('[ 0 ] people came.');
  });

  it('shows no past album, credit or attendance chip when no past edition has photographs', () => {
    const bare = {
      ...seeded,
      editions: seeded.editions?.map((event) =>
        event?.album ? { ...event, album: { ...event.album, photos: [] } } : event,
      ),
    } as FestivalPageData;
    const view = buildFestivalPage(bare, options);
    expect(view.past.slides).toEqual([]);
    expect(view.past.album).toBeUndefined();
    expect(view.past.attendancePending).toBeUndefined();
    expect(buildFestivalPage(null, options).past.slides).toEqual([]);
  });

  it('carries the partners with their logos resolved, or the registry wording for none', () => {
    const withPartners = {
      ...seeded,
      partnersIntro: 'The day is open because these organizations help pay for it.',
      partners: [
        { _id: 'partner-1', name: '[ Partner name ]', url: null, kind: 'partner', logo: null },
        {
          _id: 'partner-2',
          name: '[ Funder name ]',
          url: 'https://example.org',
          kind: 'funder',
          logo: image('[ Funder name ]'),
        },
      ],
    } as unknown as FestivalPageData;
    const view = buildFestivalPage(withPartners, options);
    expect(view.partners.intro).toBe(
      'The day is open because these organizations help pay for it.',
    );
    expect(view.partners.items.map((partner) => partner.name)).toEqual([
      '[ Partner name ]',
      '[ Funder name ]',
    ]);
    expect(view.partners.items[0]?.logo).toBeUndefined();
    expect(view.partners.items[1]?.logo?.alt).toBe('[ Funder name ]');
    expect(buildFestivalPage(null, options).partners).toMatchObject({
      items: [],
      pending: 'partner and funder names',
    });
  });
});
