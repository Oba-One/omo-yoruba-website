/**
 * The seed documents (CONTENT-MODEL section 6, ADR 0005, ADR 0013): confirmed facts and the
 * copy the prototypes carry, nothing invented. Every value the register marks as mock stays
 * empty so the site renders Pending and the Studio lists the row. Ids are deterministic and
 * contain no period (a period makes a document private, see the client research note).
 */
import { CONTACT_ROLES } from '../src/enquiry-kinds';
import { layoutDefaults } from '../src/layout';
import type { AlbumId, PhotographerId } from './register';

export interface SeedAsset {
  assetId: string;
  caption: string;
  album: AlbumId;
  photographer: PhotographerId;
}
export type SeedAssets = Map<string, SeedAsset>;

export interface SeedDocument {
  _id: string;
  _type: string;
  [field: string]: unknown;
}

const PHOTOGRAPHERS: Record<PhotographerId, { name: string; credit: string }> = {
  'red-carpet-media': { name: 'Red Carpet Media', credit: 'Red Carpet Media' },
  'members-and-volunteers': { name: 'Members and volunteers', credit: 'Members and volunteers' },
  'omo-yoruba-archive': { name: 'Omo Yorùbá archive', credit: 'Omo Yorùbá archive' },
};

const ALBUMS: Record<AlbumId, { title: string; event?: string; cover: string }> = {
  'odunde-2026': {
    title: 'Odunde 2026',
    event: 'event-odunde-2026',
    cover: 'odunde-2026-kid-playing-with-elder.jpg',
  },
  'gala-2025': {
    title: 'End-of-Year Gala 2025',
    event: 'event-gala-2025',
    cover: 'gala-2025-attendees-group-photo.jpg',
  },
  'summer-camp': { title: 'Summer camp', cover: 'summer-camp-kids-art-class.jpg' },
};

const ref = (id: string) => ({ _type: 'reference', _ref: id });
const key = (prefix: string, index: number) => `${prefix}-${index + 1}`;

function span(text: string, index: number) {
  return {
    _type: 'block',
    _key: key('block', index),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key('span', index), text, marks: [] }],
  };
}
const blocks = (...paragraphs: string[]) => paragraphs.map(span);

const bilingual = (yo: string | undefined, en: string) => (yo ? { yo, en } : { en });
const cta = (label: string, kind: 'enquiry' | 'give' | 'url' | 'anchor', target?: string) => ({
  _type: 'cta',
  label,
  kind,
  ...(kind === 'enquiry' ? { enquiryKind: target } : {}),
  ...(kind === 'url' || kind === 'anchor' ? { href: target } : {}),
});
const fact = (label: string, value?: string, note?: string) => ({
  label,
  ...(value ? { value } : {}),
  ...(note ? { note } : {}),
});

/** A focus point in percent, copied from the prototype's `object-position` for the photograph. */
type Focus = readonly [x: number, y: number];

function image(assets: SeedAssets, file: string, caption?: string, focus?: Focus) {
  const asset = assets.get(file);
  if (!asset) return undefined;
  const text = caption ?? asset.caption;
  return {
    _type: 'oyImage',
    asset: ref(asset.assetId),
    alt: asset.caption,
    caption: text,
    // The hotspot carries the prototype's framing; the site turns it back into object-position.
    ...(focus
      ? {
          hotspot: {
            _type: 'sanity.imageHotspot',
            x: focus[0] / 100,
            y: focus[1] / 100,
            width: 0.4,
            height: 0.4,
          },
          crop: { _type: 'sanity.imageCrop', top: 0, bottom: 0, left: 0, right: 0 },
        }
      : {}),
  };
}

function withKeys<T extends object>(
  prefix: string,
  items: (T | undefined)[],
): (T & { _key: string })[] {
  return items
    .filter((item): item is T => item !== undefined)
    .map((item, index) => ({ _key: key(prefix, index), ...item }));
}

function page(name: string, fields: Record<string, unknown>): SeedDocument {
  const layout = layoutDefaults(name);
  return { _id: name, _type: name, ...fields, ...(layout ? { layout } : {}) };
}

export function buildSeed(assets: SeedAssets): SeedDocument[] {
  const docs: SeedDocument[] = [];

  docs.push({
    _id: 'siteSettings',
    _type: 'siteSettings',
    orgName: 'Omo Yorùbá of Southern California',
    wordmarkLine2: 'of Southern California',
    contacts: withKeys(
      'contact',
      CONTACT_ROLES.map((role) => ({ _type: 'contactRole', role })),
    ),
    newsletterTitle: 'Festival news and updates, in your inbox',
    newsletterBlurb: 'Once or twice a month. Save-the-dates, program news, and ways to help.',
    analyticsEnabled: true,
    theme: 'adire',
  });

  // The Impact page reads the full label; the homepage strip reads the short one (02 Homepage).
  const stats: { id: string; value: string; label: string; shortLabel?: string }[] = [
    {
      id: 'stat-years',
      value: '29',
      label: 'years serving Southern California',
      shortLabel: 'years serving SoCal',
    },
    {
      id: 'stat-community',
      value: '3,000+',
      label: 'Yoruba community in Southern California',
      shortLabel: 'Yoruba community in SoCal',
    },
    { id: 'stat-zones', value: '4', label: 'festival zones at Odunde' },
    { id: 'stat-associations', value: '9', label: 'hometown associations' },
  ];
  for (const stat of stats)
    docs.push({
      _id: stat.id,
      _type: 'stat',
      value: stat.value,
      label: stat.label,
      ...(stat.shortLabel ? { shortLabel: stat.shortLabel } : {}),
    });

  for (const [id, photographer] of Object.entries(PHOTOGRAPHERS)) {
    docs.push({
      _id: `photographer-${id}`,
      _type: 'photographer',
      name: photographer.name,
      defaultCredit: photographer.credit,
    });
  }

  // The card photographs, their framing and the links follow the homepage prototype, the
  // Collective's interim photograph included; Cultural Exchange keeps the placeholder.
  const programs: {
    id: string;
    name: string;
    slug: string;
    page?: string;
    cadence?: string;
    blurb?: string;
    image?: string;
    focus?: Focus;
    action?: ReturnType<typeof cta>;
  }[] = [
    {
      id: 'program-yoruba-lessons',
      name: 'Yoruba Language Lessons',
      slug: 'yoruba-lessons',
      page: 'lessons',
      cadence: 'Online, by arrangement',
      blurb:
        'Speaking, reading, and tone marks, taught over video call by our teacher. Times are set with her.',
      image: 'odunde-2026-attendees-learning-yoruba.jpg',
      focus: [60, 35],
      action: cta('Enrol a learner', 'url', '/programs/yoruba-lessons'),
    },
    {
      id: 'program-cultural-collective',
      name: 'Yoruba Cultural Collective',
      slug: 'cultural-collective',
      page: 'collective',
      blurb:
        'Members who put culture to work: the Solar Hub, Green Goods, and a circle that keeps ideas moving.',
      image: 'odunde-2026-attendee-smiling-2.jpg',
      focus: [50, 25],
      action: cta('Meet the Collective', 'url', '/programs/cultural-collective'),
    },
    {
      id: 'program-kids-stem',
      name: 'Kids & STEM',
      slug: 'kids-stem',
      blurb: "Àgbàlá Ọmọde, the children's compound, and the STEM Hub.",
      image: 'odunde-2026-kids-doing-crafts.jpg',
      focus: [60, 55],
      action: cta('See youth programs', 'url', '/programs#kids'),
    },
    { id: 'program-cultural-exchange', name: 'Cultural Exchange', slug: 'cultural-exchange' },
  ];
  programs.forEach((program, index) => {
    docs.push({
      _id: program.id,
      _type: 'program',
      name: program.name,
      slug: { _type: 'slug', current: program.slug },
      ...(program.blurb ? { blurb: program.blurb } : {}),
      ...(program.cadence ? { cadence: program.cadence } : {}),
      ...(program.page ? { page: program.page } : {}),
      ...(program.image ? { image: image(assets, program.image, undefined, program.focus) } : {}),
      ...(program.action ? { action: program.action } : {}),
      order: index + 1,
    });
  });

  docs.push({
    _id: 'initiative-solar-hub',
    _type: 'initiative',
    name: 'Solar Hub',
    memberLed: true,
    order: 1,
  });
  docs.push({
    _id: 'initiative-green-goods',
    _type: 'initiative',
    name: 'Green Goods',
    memberLed: true,
    order: 2,
  });

  docs.push({
    _id: 'zone-oja-balogun',
    _type: 'zone',
    name: bilingual('Ọjà Balógun', 'The market'),
    image: image(assets, 'odunde-2026-attendees-sitting-at-market.jpg'),
    order: 1,
    active: true,
  });
  docs.push({
    _id: 'zone-agbala-omode',
    _type: 'zone',
    name: bilingual('Àgbàlá Ọmọde', "The children's yard"),
    image: image(assets, 'odunde-2026-kids-doing-crafts.jpg'),
    order: 2,
    active: true,
  });

  docs.push({
    _id: 'event-odunde-2027',
    _type: 'event',
    kind: 'festival',
    title: 'Odunde Festival 2027',
    edition: 2027,
    venue: { name: 'Leimert Park' },
    // The edition's line on the homepage band (02 Homepage); four zones is a confirmed fact.
    summary: 'One village, four zones, one family.',
  });
  docs.push({
    _id: 'event-gala-2026',
    _type: 'event',
    kind: 'gala',
    title: 'End-of-Year Gala 2026',
    edition: 2026,
  });
  docs.push({
    _id: 'event-odunde-2026',
    _type: 'event',
    kind: 'festival',
    title: 'Odunde Festival 2026',
    edition: 2026,
    venue: { name: 'Leimert Park' },
    heroImage: image(assets, 'odunde-2026-procession-with-drummer.jpg'),
    album: ref('album-odunde-2026'),
  });
  docs.push({
    _id: 'event-gala-2025',
    _type: 'event',
    kind: 'gala',
    title: 'End-of-Year Gala 2025',
    edition: 2025,
    heroImage: image(assets, 'gala-2025-attendees-sitting.jpg'),
    album: ref('album-gala-2025'),
  });

  const posts = [
    {
      id: 'news-odunde-2026-recap',
      title: 'Odunde 2026: the recap',
      slug: 'odunde-2026-recap',
      date: '2026-07-01',
      summary:
        'Four zones, one village. Photos, video, and the numbers from our biggest festival yet.',
      tag: 'event-odunde-2026',
      image: 'odunde-2026-procession-begins.jpg',
    },
    {
      id: 'news-language-lessons-fall-term',
      title: 'Language Lessons fall term',
      slug: 'language-lessons-fall-term',
      date: '2026-08-01',
      summary: 'New learners welcome. Write to the teacher to find a time that suits your family.',
      tag: 'program-yoruba-lessons',
      image: 'odunde-2026-attendees-learning-yoruba.jpg',
    },
    {
      id: 'news-end-of-year-gala-2026',
      title: 'End-of-Year Gala',
      slug: 'end-of-year-gala-2026',
      date: '2026-11-01',
      summary: 'An evening of culture, community, and celebration. Tables available now.',
      tag: 'event-gala-2026',
      image: 'gala-2025-attendees-sitting.jpg',
    },
  ];
  for (const post of posts) {
    docs.push({
      _id: post.id,
      _type: 'newsPost',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      date: post.date,
      summary: post.summary,
      image: image(assets, post.image),
      tags: withKeys('tag', [ref(post.tag)]),
    });
  }

  for (const [albumId, album] of Object.entries(ALBUMS) as [AlbumId, (typeof ALBUMS)[AlbumId]][]) {
    const files = [...assets.entries()].filter(([, asset]) => asset.album === albumId);
    const photographer = files[0]?.[1].photographer;
    docs.push({
      _id: `album-${albumId}`,
      _type: 'album',
      title: album.title,
      slug: { _type: 'slug', current: albumId },
      ...(album.event ? { event: ref(album.event) } : {}),
      cover: image(assets, album.cover) ?? image(assets, files[0]?.[0] ?? ''),
      photos: files.map(([file, asset]) => ({
        _key: file.replace(/\.jpg$/, ''),
        _type: 'oyImage',
        asset: ref(asset.assetId),
        alt: asset.caption,
        caption: asset.caption,
      })),
      ...(photographer ? { credit: ref(`photographer-${photographer}`) } : {}),
      creditConfirmed: false,
    });
  }

  const doors = [
    {
      id: 'door-member',
      key: 'member',
      title: 'Become a member',
      blurb:
        'Members carry the lessons, the festival, and each other. Dues run the year between events, when nothing is being sold and the bills still arrive.',
      action: cta('Become a member', 'enquiry', 'member'),
      image: 'odunde-2026-group-guests-smiling.jpg',
      focus: [50, 30] as Focus,
    },
    {
      id: 'door-volunteer',
      key: 'volunteer',
      title: 'Volunteer',
      blurb:
        'One short form. You tell us when you are free and what you can do, and we place you where the gap is.',
      action: cta('Raise your hand', 'enquiry', 'volunteer'),
    },
    {
      id: 'door-partner',
      key: 'partner',
      title: 'Partner or sponsor',
      blurb:
        'For organizations and funders. Sponsorship is what keeps Odunde open to all of Leimert Park, and what carries the lessons through the year.',
      bullets: [
        'One enquiry covers Odunde, the Gala, or both',
        'Four questions. This is a conversation, not an application',
      ],
      action: cta('Partner with us', 'enquiry', 'sponsor'),
      image: 'odunde-2026-president-receiving-gift.jpg',
      focus: [50, 22] as Focus,
    },
    {
      id: 'door-give',
      key: 'give',
      title: 'Give',
      blurb: 'Would rather give than join? That takes about a minute.',
      action: cta('Donate', 'give'),
    },
  ];
  doors.forEach((door, index) => {
    docs.push({
      _id: door.id,
      _type: 'door',
      key: door.key,
      title: door.title,
      blurb: door.blurb,
      ...(door.bullets ? { bullets: door.bullets } : {}),
      action: door.action,
      ...(door.image ? { image: image(assets, door.image, undefined, door.focus) } : {}),
      order: index + 1,
    });
  });

  const yearInLife: [string, string, Focus][] = [
    ['odunde-2026-procession-zoomed.jpg', 'Ọdúndé • Festival day at Leimert Park', [50, 35]],
    ['odunde-2026-vendor-selling-suya.jpg', 'Oúnjẹ • Festival food at Ọjà Balógun', [50, 40]],
    [
      'odunde-2026-mom-playing-games-with-kids.jpg',
      'Àgbàlá Ọmọde • Kids at play in the park',
      [50, 45],
    ],
    [
      'odunde-2026-attendees-sitting-at-market.jpg',
      'Àjọṣe • Partners and friends at the table',
      [50, 50],
    ],
    ['gala-2025-three-friends-selfie.jpg', 'Àsè ọdún • End-of-Year Gala 2025', [35, 40]],
    [
      'odunde-2026-yoruba-language-teaching-session.jpg',
      'Ẹ̀kọ́ èdè • Yoruba lesson at the festival',
      [50, 50],
    ],
    ['odunde-2026-vendor-necklaces.jpg', 'Ọjà Balógun • Vendors at the market', [50, 35]],
  ];

  docs.push(
    page('homepage', {
      hero: {
        kicker: bilingual('Ẹ káàbọ̀', 'Welcome'),
        title: 'Yoruba culture, alive in Southern California',
        emphasis: 'alive',
        sub: 'Language, festival, family. Since 1997.',
        image: image(assets, 'community-dance.jpg', undefined, [35, 35]),
        blessing: bilingual('Oòdúà á gbè wá o!', 'May Odùduwà bless us'),
        primaryAction: cta('See the Odunde Festival', 'url', '/odunde'),
        secondaryActions: withKeys('action', [cta('Get involved', 'url', '/get-involved')]),
      },
      stats: withKeys(
        'stat',
        stats.map((stat) => ref(stat.id)),
      ),
      voicesIntro: 'Families, elders, and vendors on what this community holds for them.',
      voicesProverb: bilingual(
        'Àgbájọ ọwọ́ la fi ń sọ̀yà.',
        'With joined hands we beat the chest. Many hands make the load light.',
      ),
      yearInLife: withKeys(
        'tile',
        yearInLife.map(([file, caption, focus]) => image(assets, file, caption, focus)),
      ),
      raiseYourHand: {
        title: 'Raise your hand',
        blurb:
          'Many hands make the load light. Two ways in, whether you are a family in Southern California or an organization that wants to build with us.',
        doors: withKeys('door', [ref('door-member'), ref('door-partner')]),
      },
    }),
  );

  docs.push(
    page('festivalPage', {
      header: {
        kicker: bilingual('Ọdúndé', 'The new year has arrived'),
        title: 'Odunde Festival',
        line: 'A day of Yoruba culture at Leimert Park, held each June. Four zones, one village, open to everyone.',
        image: image(assets, 'odunde-2026-procession-with-drummer.jpg'),
      },
      extraFacts: withKeys('fact', [fact('Family', 'All ages', "Children's compound on site")]),
      // The prototype's figure beside the prose, with its framing and its place caption.
      whatItIsImage: image(
        assets,
        'odunde-2026-kid-playing-with-masquerade-performer.jpg',
        'Festival day • Leimert Park',
        [45, 50],
      ),
      whatItIs: blocks(
        'Odunde marks the Yoruba new year. It is held in June at Leimert Park, and it is open to the whole neighborhood, not only to Yoruba families. The park is laid out as a village for the day, with four zones and a program that runs from the opening procession to the last drum.',
        'If you have never been: this sits alongside Lunar New Year, Diwali, and Nowruz. Communities that pause the world for a day to celebrate who they are, in public, with their neighbors, and with anyone who wants to come and eat.',
      ),
      zonesIntro:
        'The plaza is divided the way a Yoruba town is divided. Each zone has its own name, its own people, and its own reason to stand there all day.',
      planYourVisit: withKeys(
        'fact',
        [
          'Getting there',
          'Parking',
          'Transit',
          'Accessibility',
          'Seating',
          'What to bring',
          'What not to bring',
          'Lost children',
        ].map((label) => fact(label)),
      ),
      // The prototype's rows without the facts the register marks as invented (fees, deadlines,
      // level amounts, times, roles); the vendor row's terms come from the edition (ADR 0025).
      takePart: withKeys('way', [
        {
          _type: 'takePartRow',
          way: 'vendor',
          title: 'Sell at Ọjà Balógun',
          line: 'A booth is held once the fee is paid.',
          label: 'Apply for a booth',
        },
        {
          _type: 'takePartRow',
          way: 'sponsor',
          title: 'Keep the day open',
          line: 'Four questions, and we send the deck with our impact numbers.',
          label: 'Sponsor Odunde',
        },
        {
          _type: 'takePartRow',
          way: 'performer',
          title: 'Drummers, dancers, cultural groups',
          line: 'One short form, and the program committee sees every one.',
          label: 'Ask about performing',
        },
        {
          _type: 'takePartRow',
          way: 'volunteer',
          title: 'Festival day needs hands',
          line: 'One short form, and we place you where the gap is.',
          label: 'Volunteer',
        },
      ]),
      partnersIntro: 'The day is open because these organizations help pay for it.',
      primaryAction: cta('Plan your day', 'anchor', '#plan'),
      secondaryActions: withKeys('action', [cta('Apply as a vendor', 'enquiry', 'vendor')]),
    }),
  );

  docs.push(
    page('galaPage', {
      header: {
        kicker: bilingual('Àsè ọdún', "The year's celebration"),
        title: 'End-of-Year Gala',
        line: 'An evening of culture, community, and celebration, held each year in November or December.',
        image: image(assets, 'gala-2025-attendees-sitting.jpg'),
      },
      eveningIntro:
        "The Gala closes our year. It is the night the community dresses, sits down together, and pays for the work of the next twelve months: the language lessons, the children's programs, and the festival.",
      tiersIntro:
        'Single seats and couples are sold through Eventbrite, which opens in a new tab. A table of ten is arranged with us directly: tell us who is coming and we place the table and send an invoice.',
      sponsorIntro: 'One enquiry covers this evening, Odunde, or both: just tick which.',
      honoreesIntro: 'Who we are honoring this year, and who has been honored before.',
      takePart: withKeys('way', [
        {
          _type: 'takePartRow',
          way: 'sponsor',
          title: 'Sponsor the evening',
          line: 'Four questions and we send the deck. One enquiry covers the Gala, Odunde, or both.',
          label: 'Sponsor the Gala',
        },
        {
          _type: 'takePartRow',
          way: 'table',
          title: 'Bring your table',
          line: 'Ten seats together, placed by hand and invoiced afterwards.',
          label: 'Reserve a table',
        },
        {
          _type: 'takePartRow',
          way: 'volunteer',
          title: 'The night needs hands',
          line: 'One form, and we place you.',
          label: 'Volunteer',
        },
        {
          _type: 'takePartRow',
          way: 'give',
          title: 'Cannot come this year?',
          line: 'A gift does the same work as a seat, and monthly does more.',
          label: 'Donate',
        },
      ]),
      primaryAction: cta('Get tickets', 'anchor', '#seats'),
      secondaryActions: withKeys('action', [cta('Sponsor the evening', 'enquiry', 'sponsor')]),
    }),
  );

  docs.push(
    page('programsPage', {
      header: {
        kicker: bilingual('Ohun tí a ń ṣe', 'What we do'),
        title: 'Our programs',
        line: 'What runs through the year, for children, teenagers, and adults, across Los Angeles. Two programs have their own page. The rest are described in full below.',
      },
      kidsStem: {
        title: 'Kids & STEM',
        blurb:
          "Kids & STEM is two things under one name. Àgbàlá Ọmọde is the children's compound: it runs at the Odunde Festival and through the year, and it is where the youngest members of this community meet each other. The STEM Hub is the technical half, built on the belief that a child who knows where they come from carries that into everything else they learn.",
        image: image(assets, 'odunde-2026-kids-doing-paint-art.jpg'),
        subprograms: withKeys('sub', [
          {
            _type: 'subprogram',
            name: 'Àgbàlá Ọmọde',
            blurb:
              "The children's compound. Games, art, and ayo, at the festival and through the year.",
            action: cta('See it at Odunde', 'url', '/odunde'),
          },
          {
            _type: 'subprogram',
            name: 'STEM Hub',
            blurb: "The technical half of the children's program.",
            action: cta('Ask about joining', 'enquiry', 'contact'),
          },
        ]),
      },
      culturalExchange: { title: 'Cultural Exchange' },
      yearStrip: withKeys('row', [
        {
          _type: 'yearStripRow',
          program: ref('program-yoruba-lessons'),
          note: 'Online, scheduled with the teacher',
        },
        {
          _type: 'yearStripRow',
          when: 'June',
          event: ref('event-odunde-2027'),
          note: 'Leimert Park',
        },
        { _type: 'yearStripRow', when: 'Nov or Dec', event: ref('event-gala-2026') },
        { _type: 'yearStripRow', program: ref('program-kids-stem') },
        { _type: 'yearStripRow', program: ref('program-cultural-collective') },
      ]),
      primaryAction: cta('Enrol a learner', 'enquiry', 'enrol'),
    }),
  );

  docs.push(
    page('lessonsPage', {
      header: {
        kicker: bilingual('Ẹ̀kọ́ èdè Yorùbá', 'Yoruba lessons'),
        title: 'Yoruba Language Lessons',
        line: 'Live online lessons with one teacher, for children and adults who want to speak, read, and carry the language forward. Times are set with her, one learner or one family at a time.',
      },
      glance: withKeys('fact', [
        fact('Format', 'Online, live', 'Video call'),
        fact('When', 'Set with the teacher'),
        fact('Ages'),
        fact('Cost', 'Agreed with her'),
      ]),
      teacherIntro:
        'There is no sign-up form and no fixed timetable. You write, she places the learner and proposes a time, and the first lesson follows.',
      faq: withKeys(
        'faq',
        [
          'How much does it cost?',
          'When are the lessons?',
          'Can a parent sit in?',
          'What does a child need?',
          'What if my child already understands some Yoruba?',
        ].map((question) => ({ _type: 'faqItem', question })),
      ),
      primaryAction: cta('Write to the teacher', 'enquiry', 'enrol'),
    }),
  );

  docs.push(
    page('collectivePage', {
      header: {
        kicker: bilingual('Ẹgbẹ́ àṣà', 'The cultural collective'),
        title: 'Yoruba Cultural Collective',
        line: 'Culture put to work. A circle of members who meet, host events through the year, and run two member-led projects, the Solar Hub and Green Goods.',
      },
      initiatives: withKeys('initiative', [
        ref('initiative-solar-hub'),
        ref('initiative-green-goods'),
      ]),
      keepsOwnList: false,
      primaryAction: cta('Partner with the Collective', 'enquiry', 'sponsor'),
      secondaryActions: withKeys('action', [cta('See what is on', 'anchor', '#events')]),
    }),
  );

  docs.push(
    page('getInvolvedPage', {
      header: {
        kicker: bilingual('Ẹ dara pọ̀ mọ́ wa', 'Join us'),
        title: 'Raise your hand',
        line: 'Àgbájọ ọwọ́ la fi ń sọ̀yà. Many hands make the load light. Four ways in. Each one explains what it asks of you before you fill anything in.',
      },
      doors: withKeys(
        'door',
        ['door-member', 'door-volunteer', 'door-partner', 'door-give'].map(ref),
      ),
      hometownAssociations: {
        title: 'Hometown associations',
        prose: blocks(
          'Nine hometown associations sit inside this community. They are the older structure underneath Omo Yorùbá: family and town networks that predate the organization in Southern California and still do much of the work of holding people together, from naming ceremonies to funerals.',
          'You do not have to belong to one to be a member here. If you already do, say so when you join and we will connect you to the others from your town.',
        ),
      },
      fallback: {
        title: 'Or just talk to someone',
        blurb: 'A phone call or an email works just as well as any form on this page.',
      },
      primaryAction: cta('Become a member', 'enquiry', 'member'),
    }),
  );

  docs.push(
    page('impactPage', {
      header: {
        kicker: bilingual('Iṣẹ́ wa', 'Our work'),
        title: 'What we have built since 1997',
        line: 'A 501(c)(3) serving the Yoruba community of Southern California through language, festival, and family programs.',
      },
      stats: withKeys(
        'stat',
        stats.map((stat) => ref(stat.id)),
      ),
      civicInfra: blocks(
        'Odunde is a public cultural day held in Leimert Park. It is open to the whole neighborhood, not only to Yoruba families, and it is one of the few days in the year when the park is programmed end to end by a community organization rather than rented out.',
      ),
      photos: withKeys('photo', [
        image(assets, 'odunde-2026-procession-begins.jpg'),
        image(assets, 'odunde-2026-kids-doing-crafts.jpg'),
        image(assets, 'odunde-2026-yoruba-language-teaching-session.jpg'),
        image(assets, 'odunde-2026-vendor-selling-suya.jpg'),
        image(assets, 'gala-2025-attendees-group-photo.jpg'),
        image(assets, 'summer-camp-kids-art.jpg'),
      ]),
      nextYear: { title: 'Fund the next year' },
      primaryAction: cta('Sponsor or partner', 'enquiry', 'sponsor'),
      secondaryActions: withKeys('action', [cta('Talk to us', 'enquiry', 'contact')]),
    }),
  );

  docs.push(
    page('storyPage', {
      header: {
        kicker: bilingual('Àwọn ènìyàn wa', 'Our people'),
        title: 'People and history',
        line: 'Who carries this work, and how it started in 1997.',
      },
      reachUs: {
        title: 'Reach us',
        blurb: 'For anything not covered on Get Involved. Write, call, or send a message.',
      },
      primaryAction: cta('Send a message', 'enquiry', 'contact'),
    }),
  );

  docs.push(
    page('donatePage', {
      header: {
        kicker: bilingual('Ẹ ṣe àánú', 'Give'),
        title: 'Give to Omo Yorùbá',
        line: "Gifts hold up the language lessons, the festival at Leimert Park, and the children's programs.",
      },
      giveNow: {
        title: 'Give now',
        blurb:
          'Choose an amount, one time or monthly, and pay securely through Zeffy without leaving this page. Your receipt arrives by email straight away.',
      },
      largerScale: {
        title: 'Giving at a larger scale',
        blurb:
          'Organizations, funders, and civic partners. Named levels, recognition, and a conversation with a person. Four questions and we send the deck.',
        doors: withKeys('door', [ref('door-partner')]),
      },
      primaryAction: cta('Give now', 'give'),
      secondaryActions: withKeys('action', [cta('Partner or sponsor', 'enquiry', 'sponsor')]),
    }),
  );

  docs.push(
    page('galleryPage', {
      header: {
        kicker: bilingual('Àwòrán', 'Photographs'),
        title: 'Photographs',
        line: 'Odunde, the Gala, the lessons, and the Collective, year by year. Open an album and start looking.',
      },
    }),
  );

  docs.push(page('newsPage', { header: { title: 'News and events' } }));

  return docs;
}

/**
 * Fields a schema change retired, per document type: a re-run unsets them where they are still
 * stored, so the Studio shows no unknown field (`takePartOrder` became `takePart`, ADR 0025; the
 * settings' Eventbrite link moved to each Gala edition's `ticketsUrl`, ADR 0024).
 */
export const RETIRED_FIELDS: Record<string, readonly string[]> = {
  festivalPage: ['takePartOrder'],
  galaPage: ['takePartOrder'],
  siteSettings: ['eventbriteUrl'],
};

/** The retired fields a stored document still carries. */
export function retiredFields(type: string, current: Record<string, unknown>): string[] {
  return (RETIRED_FIELDS[type] ?? []).filter((field) => current[field] !== undefined);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * The seed fields the document lacks, as `setIfMissing` paths: one level into plain objects
 * (`hero.emphasis`) and into the items of a keyed array matched by `_key`
 * (`yearInLife[_key=="tile-0"].hotspot`), so a field added to the schema later still lands on a
 * dataset seeded before it. An item the owner removed or re-keyed is left alone, and so is a
 * photograph whose stored asset is not the seed's: its framing and words belong to the photo the
 * owner chose (the Studio keeps an empty hotspot empty when an asset is swapped).
 */
export function missingFields(
  fields: Record<string, unknown>,
  current: Record<string, unknown>,
): Record<string, unknown> {
  const missing: Record<string, unknown> = {};
  const assetOf = (value: Record<string, unknown>) =>
    isPlainObject(value.asset) && typeof value.asset._ref === 'string'
      ? value.asset._ref
      : undefined;
  const fill = (
    prefix: string,
    value: Record<string, unknown>,
    stored: Record<string, unknown>,
  ) => {
    const seeded = assetOf(value);
    if (seeded !== undefined && assetOf(stored) !== seeded) return;
    for (const [sub, subValue] of Object.entries(value)) {
      if (subValue !== undefined && stored[sub] === undefined)
        missing[`${prefix}.${sub}`] = subValue;
    }
  };
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    const stored = current[key];
    if (stored === undefined) {
      missing[key] = value;
      continue;
    }
    if (isPlainObject(value) && isPlainObject(stored) && !('_ref' in value)) {
      fill(key, value, stored);
      continue;
    }
    if (Array.isArray(value) && Array.isArray(stored)) {
      for (const item of value) {
        if (!isPlainObject(item) || typeof item._key !== 'string' || '_ref' in item) continue;
        const match = stored.find((entry) => isPlainObject(entry) && entry._key === item._key);
        if (isPlainObject(match)) fill(`${key}[_key=="${item._key}"]`, item, match);
      }
    }
  }
  return missing;
}
