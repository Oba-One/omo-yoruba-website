import { describe, expect, it } from 'vitest';
import { CONTACT_ROLES } from '../src/enquiry-kinds';
import { documentTypes, SINGLETON_NAMES } from '../src/schema';
import {
  buildRevisions,
  buildSeed,
  missingFields,
  retiredFields,
  revisedFields,
  type SeedAssets,
  type SeedRevision,
} from './seed-data';

const assets: SeedAssets = new Map(
  [
    'community-dance.jpg',
    'odunde-2026-ayo-game.jpg',
    'odunde-2026-attendees-learning-yoruba.jpg',
    'odunde-2026-attendee-smiling-2.jpg',
    'odunde-2026-group-guests-smiling.jpg',
    'odunde-2026-mom-playing-games-with-kids.jpg',
    'odunde-2026-kids-doing-paint-art.jpg',
    'gala-2025-group-photo.jpg',
  ].map((file) => [
    file,
    {
      assetId: `image-${file.replace(/\W/g, '')}-10x10-jpg`,
      caption: `Caption for ${file}`,
      album: file.startsWith('gala')
        ? 'gala-2025'
        : file.startsWith('odunde')
          ? 'odunde-2026'
          : 'summer-camp',
      photographer: 'red-carpet-media',
    },
  ]),
);
const docs = buildSeed(assets);
const byId = new Map(docs.map((doc) => [doc._id, doc]));
const text = JSON.stringify(docs);

describe('buildSeed', () => {
  it('uses deterministic ids without periods, each once, and only registered types', () => {
    const types = new Set(documentTypes.map((type) => type.name));
    for (const doc of docs) {
      expect(doc._id, doc._id).toMatch(/^[a-zA-Z0-9-]+$/);
      expect(types, doc._type).toContain(doc._type);
    }
    expect(new Set(docs.map((d) => d._id)).size).toBe(docs.length);
  });

  it('creates every singleton under its type name and nothing the register says not to create', () => {
    for (const name of SINGLETON_NAMES) expect(byId.get(name)?._type).toBe(name);
    for (const type of [
      'person',
      'partner',
      'testimonial',
      'timelineEntry',
      'ticketTier',
      'sponsorLevel',
      'honoree',
      'givingLevel',
      'hometownAssociation',
      'outcome',
      'governanceDoc',
      'enquiry',
      'subscriber',
    ]) {
      expect(
        docs.filter((d) => d._type === type),
        type,
      ).toHaveLength(0);
    }
  });

  it('seeds the confirmed facts and leaves the pending ones empty', () => {
    const settings = byId.get('siteSettings') as Record<string, unknown>;
    expect(settings.orgName).toBe('Omo Yorùbá of Southern California');
    expect(settings.ein).toBeUndefined();
    expect(settings.address).toBeUndefined();
    expect(settings.phone).toBeUndefined();
    const contacts = settings.contacts as { role: string; name?: string; email?: string }[];
    expect(contacts.map((c) => c.role).sort()).toEqual([...CONTACT_ROLES].sort());
    for (const contact of contacts) {
      expect(contact.name).toBeUndefined();
      expect(contact.email).toBeUndefined();
    }
    const stats = docs.filter((d) => d._type === 'stat') as unknown as {
      value: string;
      source?: string;
    }[];
    expect(stats.map((s) => s.value).sort()).toEqual(['29', '3,000+', '4', '9']);
    for (const stat of stats) expect(stat.source).toBeUndefined();
    const zones = docs.filter((d) => d._type === 'zone') as unknown as {
      name: { yo: string; en: string };
      line?: string;
    }[];
    expect(zones.map((z) => z.name.yo).sort()).toEqual(['Àgbàlá Ọmọde', 'Ọjà Balógun']);
    for (const zone of zones) expect(zone.line).toBeUndefined();
    const events = docs.filter((d) => d._type === 'event') as unknown as {
      _id: string;
      kind: string;
      edition: number;
      start?: string;
    }[];
    expect(events.map((e) => e._id).sort()).toEqual([
      'event-gala-2025',
      'event-gala-2026',
      'event-odunde-2026',
      'event-odunde-2027',
    ]);
    for (const event of events) expect(event.start).toBeUndefined();
    expect(docs.filter((d) => d._type === 'program')).toHaveLength(4);
    expect(docs.filter((d) => d._type === 'initiative')).toHaveLength(2);
    expect(docs.filter((d) => d._type === 'newsPost')).toHaveLength(3);
    expect(docs.filter((d) => d._type === 'photographer')).toHaveLength(3);
    expect(docs.filter((d) => d._type === 'door')).toHaveLength(5);
  });

  it('invents nothing: no mock figures, addresses, phone numbers, names or the mock EIN', () => {
    expect(text).not.toMatch(/95-4612387|Leimert Boulevard|555-0148|4,200|\$\d/);
    expect(text).not.toMatch(/Adeyemi|Bakare|Ogunlesi|Yetunde|Balogun,|Sofolahan/);
    expect(text).not.toMatch(/12 June 2027|5 December 2026|The Ebell/);
  });

  it('builds three albums whose photos carry alt, caption, a key and the album-level unconfirmed credit', () => {
    const albums = docs.filter((d) => d._type === 'album') as unknown as {
      _id: string;
      creditConfirmed: boolean;
      credit: { _ref: string };
      photos: { _key: string; alt: string; caption: string; asset: { _ref: string } }[];
      cover?: unknown;
      date?: string;
    }[];
    expect(albums.map((a) => a._id).sort()).toEqual([
      'album-gala-2025',
      'album-odunde-2026',
      'album-summer-camp',
    ]);
    for (const album of albums) {
      expect(album.creditConfirmed).toBe(false);
      expect(album.credit._ref).toMatch(/^photographer-/);
      for (const photo of album.photos) {
        expect(photo._key).toBeTruthy();
        expect(photo.alt).toBe(photo.caption);
        expect(photo.asset._ref).toMatch(/^image-/);
      }
      expect(album.cover).toBeDefined();
    }
    expect(byId.get('album-summer-camp')).not.toHaveProperty('date');
  });

  it('stores the three real news posts on the first of their month', () => {
    const posts = docs.filter((d) => d._type === 'newsPost') as unknown as {
      date: string;
      slug: { current: string };
    }[];
    expect(posts.map((p) => p.date).sort()).toEqual(['2026-07-01', '2026-08-01', '2026-11-01']);
    expect(posts.map((p) => p.slug.current).sort()).toEqual([
      'end-of-year-gala-2026',
      'language-lessons-fall-term',
      'odunde-2026-recap',
    ]);
  });
});

describe('missingFields', () => {
  it('fills a top-level field the document lacks and one level into an object', () => {
    const seed = {
      hero: { title: 'Seed title', blessing: { yo: 'a', en: 'b' } },
      voicesIntro: 'Intro',
      leadEvent: { _type: 'reference', _ref: 'event-gala-2026' },
      layout: { season: 'auto' },
    };
    const current = { hero: { title: 'Owner title' }, layout: { season: 'gala' } };
    expect(missingFields(seed, current)).toEqual({
      'hero.blessing': { yo: 'a', en: 'b' },
      voicesIntro: 'Intro',
      leadEvent: { _type: 'reference', _ref: 'event-gala-2026' },
    });
  });

  it('never overwrites a value the owner filled, at either level, and skips an undefined seed value', () => {
    expect(missingFields({ hero: { title: 'x' } }, { hero: { title: 'kept' } })).toEqual({});
    expect(missingFields({ title: 'x' }, { title: 'kept' })).toEqual({});
    expect(missingFields({ image: undefined, hero: { image: undefined } }, { hero: {} })).toEqual(
      {},
    );
  });

  it('fills a missing field inside a keyed array item and leaves removed or re-keyed items alone', () => {
    const seed = {
      yearInLife: [
        { _key: 'tile-0', caption: 'Seed caption', hotspot: { x: 0.5, y: 0.35 } },
        { _key: 'tile-1', caption: 'Second', hotspot: { x: 0.5, y: 0.4 } },
      ],
      stats: [{ _key: 'stat-0', _type: 'reference', _ref: 'stat-years' }],
    };
    const current = {
      yearInLife: [{ _key: 'tile-0', caption: 'Owner caption' }, { _key: 'owner-tile' }],
      stats: [{ _key: 'stat-0', _type: 'reference', _ref: 'stat-zones' }],
    };
    expect(missingFields(seed, current)).toEqual({
      'yearInLife[_key=="tile-0"].hotspot': { x: 0.5, y: 0.35 },
    });
  });

  it("fills a missing field inside a keyed item of an object's array, as the Kids & STEM sub-programs keep them", () => {
    const facts = [{ _key: 'fact-1', label: 'Ages' }];
    const seed = {
      kidsStem: {
        title: 'Kids & STEM',
        subprograms: [
          { _key: 'sub-1', name: 'Seed name', facts },
          { _key: 'sub-2', name: 'Second', facts },
        ],
      },
    };
    const current = {
      kidsStem: {
        title: 'Owner title',
        subprograms: [
          { _key: 'sub-1', name: 'Owner name' },
          { _key: 'owner-sub', name: 'Added by the owner' },
        ],
      },
    };
    expect(missingFields(seed, current)).toEqual({
      'kidsStem.subprograms[_key=="sub-1"].facts': facts,
    });
  });

  it('leaves a photograph the owner replaced with its own framing and words', () => {
    const seeded = { _ref: 'image-seed-1024x683-jpg' };
    const owners = { _ref: 'image-owner-1200x800-jpg' };
    const seed = {
      image: { asset: seeded, caption: 'Seed caption', hotspot: { x: 0.6, y: 0.35 } },
      yearInLife: [{ _key: 'tile-1', asset: seeded, caption: 'Seed', hotspot: { x: 0.5, y: 0.4 } }],
    };
    const replaced = {
      image: { asset: owners },
      yearInLife: [{ _key: 'tile-1', asset: owners }],
    };
    expect(missingFields(seed, replaced)).toEqual({});
    const removed = { image: { alt: 'kept' }, yearInLife: [{ _key: 'tile-1' }] };
    expect(missingFields(seed, removed)).toEqual({});
    const same = { image: { asset: seeded }, yearInLife: [{ _key: 'tile-1', asset: seeded }] };
    expect(missingFields(seed, same)).toEqual({
      'image.caption': 'Seed caption',
      'image.hotspot': { x: 0.6, y: 0.35 },
      'yearInLife[_key=="tile-1"].caption': 'Seed',
      'yearInLife[_key=="tile-1"].hotspot': { x: 0.5, y: 0.4 },
    });
  });

  it('seeds the program and door photographs and the prototype copy', () => {
    const lessons = byId.get('program-yoruba-lessons') as {
      image?: unknown;
      action?: { label: string };
    };
    expect(lessons.image).toBeDefined();
    expect(lessons.action?.label).toBe('Enrol a learner');
    const exchange = byId.get('program-cultural-exchange') as { image?: unknown; action?: unknown };
    expect(exchange.image).toBeUndefined();
    expect(exchange.action).toBeUndefined();
    // The Collective carries the prototype's interim photograph, framed as the prototype frames it.
    const collective = byId.get('program-cultural-collective') as {
      image?: { hotspot?: { x: number; y: number } };
    };
    expect(collective.image?.hotspot).toMatchObject({ x: 0.5, y: 0.25 });
    const years = byId.get('stat-years') as unknown as { label: string; shortLabel?: string };
    expect(years.label).toBe('years serving Southern California');
    expect(years.shortLabel).toBe('years serving SoCal');
    const member = byId.get('door-member') as { image?: { alt: string } };
    expect(member.image?.alt).toBe('Caption for odunde-2026-group-guests-smiling.jpg');
    const home = byId.get('homepage') as unknown as {
      hero: { title: string; emphasis: string; blessing: { yo: string; en: string } };
      voicesProverb: { yo: string };
    };
    expect(home.hero.title).toContain(home.hero.emphasis);
    expect(home.hero.blessing.yo).toBe('Oòdúà á gbè wá o!');
    expect(home.voicesProverb.yo).toBe('Àgbájọ ọwọ́ la fi ń sọ̀yà.');
  });
});

describe('the take-part rows and the retired fields', () => {
  it('seeds each event page with its rows, each way in once and no invented fact', () => {
    for (const [id, ways] of [
      ['festivalPage', ['vendor', 'sponsor', 'performer', 'volunteer']],
      ['galaPage', ['sponsor', 'table', 'volunteer', 'give']],
    ] as const) {
      const rows = (byId.get(id)?.takePart ?? []) as {
        way: string;
        title: string;
        line: string;
        label: string;
      }[];
      expect(rows.map((row) => row.way)).toEqual(ways);
      for (const row of rows) {
        expect(row.title && row.label, `${id} ${row.way}`).toBeTruthy();
        expect(`${row.title} ${row.line}`).not.toMatch(/\$\d|\d+(am|pm)|April|March|free/i);
      }
      expect(byId.get(id)).not.toHaveProperty('takePartOrder');
    }
  });

  it('seeds each program page with its rows and chips, and none of the facts the register invents', () => {
    for (const [id, rows] of [
      [
        'programsPage',
        [
          ['enrol', undefined, 'Enrol a learner'],
          ['volunteer', 'Volunteer', 'Volunteer'],
          ['give', undefined, 'Donate'],
        ],
      ],
      [
        'lessonsPage',
        [
          ['volunteer', 'Volunteer', 'Raise your hand'],
          ['member', undefined, 'Become a member'],
          ['give', undefined, 'Donate'],
        ],
      ],
      [
        'collectivePage',
        [
          ['sponsor', 'Partner', 'Talk to us'],
          ['volunteer', 'Skills', 'Volunteer a skill'],
          ['updates', undefined, 'Subscribe'],
        ],
      ],
    ] as const) {
      const stored = (byId.get(id)?.takePart ?? []) as {
        way: string;
        chip?: string;
        title: string;
        line?: string;
        label: string;
      }[];
      expect(
        stored.map((row) => [row.way, row.chip, row.label]),
        id,
      ).toEqual(rows);
      for (const row of stored) {
        expect(row.title, `${id} ${row.way}`).toBeTruthy();
        // Dues, member benefits, volunteer roles and hours, what a gift buys, the fee policy.
        expect(`${row.title} ${row.line ?? ''}`).not.toMatch(
          /\$\d|a year|vote|hours|classroom|second adult|books|cannot pay|engineering|permitting/i,
        );
      }
    }
    // Lessons' give row states nothing a gift buys, so it has no line.
    const lessons = byId.get('lessonsPage')?.takePart as { way: string; line?: string }[];
    expect(lessons.find((row) => row.way === 'give')).not.toHaveProperty('line');
  });

  it('seeds the Kids & STEM sub-programs with their photographs and the labels of their owed facts', () => {
    const kids = (
      byId.get('programsPage') as unknown as {
        kidsStem: Record<string, unknown> & {
          subprograms: {
            name: string;
            image?: { hotspot?: unknown };
            facts?: { label: string; value?: string }[];
          }[];
        };
      }
    ).kidsStem;
    expect(kids).not.toHaveProperty('image');
    expect(kids).not.toHaveProperty('ages');
    expect(kids.subprograms.map((sub) => [sub.name, sub.facts?.map((fact) => fact.label)])).toEqual(
      [
        ['Àgbàlá Ọmọde', ['Ages']],
        ['STEM Hub', ['Ages', 'What they build']],
      ],
    );
    for (const sub of kids.subprograms) {
      expect(sub.image?.hotspot, sub.name).toBeDefined();
      // "4 to 10", "10 to 14", "Saturdays" and the robotics are invented: no value is seeded.
      expect(sub.facts?.every((fact) => fact.value === undefined)).toBe(true);
      expect(sub).not.toHaveProperty('ages');
      expect(sub).not.toHaveProperty('detail');
    }
  });

  it('seeds the year strip by program or by kind, with only the notes the register confirms', () => {
    const rows = (
      byId.get('programsPage') as unknown as {
        yearStrip: {
          _key: string;
          when?: string;
          kind?: string;
          program?: { _ref: string };
          note?: string;
        }[];
      }
    ).yearStrip;
    expect(
      rows.map((row) => [row._key, row.when, row.kind ?? row.program?._ref, row.note]),
    ).toEqual([
      ['row-1', undefined, 'program-yoruba-lessons', 'Online, scheduled with the teacher'],
      ['row-2', 'June', 'festival', 'Leimert Park'],
      ['row-3', 'Nov or Dec', 'gala', undefined],
      ['row-4', undefined, 'program-kids-stem', 'Àgbàlá Ọmọde runs at the festival'],
      ['row-5', undefined, 'program-cultural-collective', 'Solar Hub, Green Goods'],
    ]);
    // An edition reference would go stale the day the edition ends (ADR 0031).
    expect(rows.some((row) => 'event' in row)).toBe(false);
    expect(JSON.stringify(rows)).not.toMatch(/Year-round|Saturdays|Monthly|Date pending/);
  });

  it('unsets retired fields at nested paths, item by item, only where they are stored', () => {
    const stored = {
      kidsStem: {
        image: { asset: { _ref: 'image-x' } },
        subprograms: [
          { _key: 'sub-1', ages: 'x', detail: 'y' },
          { _key: 'sub-2', name: 'kept' },
        ],
      },
    };
    expect(retiredFields('programsPage', stored)).toEqual([
      'kidsStem.image',
      'kidsStem.subprograms[_key=="sub-1"].ages',
      'kidsStem.subprograms[_key=="sub-1"].detail',
    ]);
    const strip = {
      yearStrip: [
        { _key: 'row-1', program: { _ref: 'program-yoruba-lessons' } },
        { _key: 'row-2', event: { _ref: 'event-odunde-2027' }, when: 'June' },
      ],
    };
    expect(retiredFields('programsPage', strip)).toEqual(['yearStrip[_key=="row-2"].event']);
    expect(
      retiredFields('lessonsPage', { voices: [{ _key: 'v', _ref: 'testimonial-1' }] }),
    ).toEqual(['voices']);
    expect(retiredFields('programsPage', { kidsStem: { title: 'Kids & STEM' } })).toEqual([]);
  });

  it('unsets a retired field only where it is still stored', () => {
    expect(retiredFields('festivalPage', { takePartOrder: ['vendor'] })).toEqual(['takePartOrder']);
    expect(retiredFields('festivalPage', {})).toEqual([]);
    expect(retiredFields('galaPage', { takePartOrder: ['table'] })).toEqual(['takePartOrder']);
    expect(retiredFields('siteSettings', { eventbriteUrl: 'https://x' })).toEqual([
      'eventbriteUrl',
    ]);
    expect(retiredFields('homepage', { takePartOrder: [] })).toEqual([]);
  });
});

describe('revisedFields', () => {
  const action = { _type: 'cta', label: 'Become a member', kind: 'enquiry', enquiryKind: 'member' };
  const revisions: SeedRevision[] = [
    { type: 'getInvolvedPage', path: 'primaryAction', was: action },
    {
      type: 'impactPage',
      path: 'photos[_key=="photo-1"].caption',
      was: 'A long description',
      now: 'Odunde • 2026',
    },
    {
      type: 'getInvolvedPage',
      path: 'doors',
      was: [{ _key: 'door-1', _type: 'reference', _ref: 'door-member' }],
      now: [
        { _key: 'door-1', _type: 'reference', _ref: 'door-member' },
        { _key: 'door-2', _type: 'reference', _ref: 'door-vendor' },
      ],
    },
  ];

  it('moves a value still exactly as the earlier seed wrote it, whatever the order of its keys', () => {
    const stored = {
      primaryAction: {
        enquiryKind: 'member',
        kind: 'enquiry',
        label: 'Become a member',
        _type: 'cta',
      },
      doors: [{ _ref: 'door-member', _type: 'reference', _key: 'door-1' }],
    };
    expect(revisedFields('getInvolvedPage', stored, revisions)).toEqual({
      set: { doors: revisions[2]?.now },
      unset: ['primaryAction'],
    });
  });

  it('leaves a value anyone changed, and a value that is not stored at all', () => {
    const edited = {
      primaryAction: { ...action, label: 'Join us' },
      doors: [
        { _key: 'door-1', _type: 'reference', _ref: 'door-member' },
        { _key: 'owner', _type: 'reference', _ref: 'door-give' },
      ],
    };
    expect(revisedFields('getInvolvedPage', edited, revisions)).toEqual({ set: {}, unset: [] });
    expect(revisedFields('getInvolvedPage', {}, revisions)).toEqual({ set: {}, unset: [] });
  });

  it('reaches a keyed item of an array, and never another type', () => {
    const photos = [
      { _key: 'photo-1', caption: 'A long description' },
      { _key: 'photo-2', caption: 'A long description' },
    ];
    expect(revisedFields('impactPage', { photos }, revisions)).toEqual({
      set: { 'photos[_key=="photo-1"].caption': 'Odunde • 2026' },
      unset: [],
    });
    expect(revisedFields('impactPage', { photos: [{ _key: 'owner-photo' }] }, revisions)).toEqual({
      set: {},
      unset: [],
    });
    expect(revisedFields('storyPage', { primaryAction: action }, revisions)).toEqual({
      set: {},
      unset: [],
    });
  });
});

describe('Get Involved', () => {
  it('seeds the vendor door with its photograph and button, owing its blurb and bullets', () => {
    const vendor = byId.get('door-vendor') as unknown as {
      key: string;
      title: string;
      blurb?: string;
      bullets?: string[];
      action: { label: string; kind: string; enquiryKind?: string };
      image?: { hotspot?: { x: number; y: number } };
    };
    expect(vendor).toMatchObject({ key: 'vendor', title: 'Sell at Odunde' });
    expect(vendor.action).toMatchObject({
      label: 'Apply for a booth',
      kind: 'enquiry',
      enquiryKind: 'vendor',
    });
    expect(vendor.blurb).toBeUndefined();
    expect(vendor.bullets).toBeUndefined();
    // No fee, date or crowd the register marks invented.
    expect(JSON.stringify(vendor)).not.toMatch(/\$|April|thousand|permit/i);
  });

  it('lists the four cards and the give door, with no header action and the associations stat', () => {
    const page = byId.get('getInvolvedPage') as unknown as {
      doors: { _ref: string }[];
      primaryAction?: unknown;
      hometownAssociations: { stat?: { _ref: string } };
    };
    expect(page.doors.map((door) => door._ref)).toEqual([
      'door-member',
      'door-volunteer',
      'door-vendor',
      'door-partner',
      'door-give',
    ]);
    expect(page.primaryAction).toBeUndefined();
    expect(page.hometownAssociations.stat?._ref).toBe('stat-associations');
  });

  it('revises the header action and the door list only where the earlier seed left them', () => {
    const earlier = {
      primaryAction: {
        _type: 'cta',
        label: 'Become a member',
        kind: 'enquiry',
        enquiryKind: 'member',
      },
      doors: ['door-member', 'door-volunteer', 'door-partner', 'door-give'].map((id, index) => ({
        _key: `door-${index + 1}`,
        _type: 'reference',
        _ref: id,
      })),
    };
    const revised = revisedFields('getInvolvedPage', earlier, buildRevisions(assets));
    expect(revised.unset).toEqual(['primaryAction']);
    expect((revised.set.doors as { _ref: string }[]).map((door) => door._ref)).toEqual([
      'door-member',
      'door-volunteer',
      'door-vendor',
      'door-partner',
      'door-give',
    ]);
    const owners = { ...earlier, doors: earlier.doors.slice(0, 2) };
    expect(revisedFields('getInvolvedPage', owners, buildRevisions(assets)).set).toEqual({});
  });
});
