/**
 * The Pending registry (ADR 0014): every required-for-launch field, mirroring the rows of
 * docs/design/design/19 Mock Content Register.dc.html. The Studio's Pending group builds one
 * GROQ list per entry, and a site component renders `<Pending what={pendingWhat(type, field)} />`
 * when it finds the field empty, so the chip and the row never disagree.
 */

export interface PendingEntry {
  /** The document type. */
  type: string;
  /** Fields that must be defined; a trailing `[]` means the array must not be empty. */
  fields?: readonly string[];
  /** A raw GROQ condition instead of `fields`, for anything a defined check cannot say. */
  condition?: string;
  /** Narrows the type: `kind == "festival"`. */
  filter?: string;
  /** The register's Where column: the page or block. */
  where: string;
  /** The register's What column, in chip wording: "2027 date and hours". */
  what: string;
}

export interface PresenceEntry {
  /** The document type. */
  type: string;
  /** How many documents the site expects before the block stops rendering Pending. */
  minimum: number;
  /** Narrows the count: `kind == "festival"`. */
  filter?: string;
  where: string;
  what: string;
}

const FESTIVAL = 'kind == "festival"';
const GALA = 'kind == "gala"';

export const PENDING: readonly PendingEntry[] = [
  // Across the whole site
  { type: 'siteSettings', fields: ['ein'], where: 'Everywhere', what: 'EIN' },
  { type: 'siteSettings', fields: ['address'], where: 'Everywhere', what: 'mailing address' },
  { type: 'siteSettings', fields: ['phone'], where: 'Everywhere', what: 'phone number' },
  {
    type: 'siteSettings',
    fields: ['generalEmail'],
    where: 'Every form',
    what: 'the general inbox',
  },
  {
    type: 'siteSettings',
    condition:
      '!defined(contacts) || count(contacts) == 0 || count(contacts[!defined(email) || !defined(name) || !defined(responds)]) > 0',
    where: 'Every form',
    what: 'named contacts, their emails and response times',
  },
  { type: 'siteSettings', fields: ['socials[]'], where: 'Footer', what: 'social links' },
  { type: 'siteSettings', fields: ['zeffyEmbedUrl'], where: 'Donate', what: 'the Zeffy link' },
  {
    type: 'siteSettings',
    fields: ['eventbriteUrl'],
    where: 'Gala tickets',
    what: 'the Eventbrite link',
  },

  // Odunde Festival
  {
    type: 'event',
    fields: ['start'],
    filter: FESTIVAL,
    where: 'Odunde, at a glance',
    what: 'the date',
  },
  {
    type: 'event',
    fields: ['end'],
    filter: FESTIVAL,
    where: 'Odunde, at a glance',
    what: 'the hours',
  },
  {
    type: 'event',
    fields: ['cost'],
    filter: FESTIVAL,
    where: 'Odunde, at a glance',
    what: 'the cost',
  },
  {
    type: 'event',
    fields: ['venue.name'],
    filter: FESTIVAL,
    where: 'Odunde, at a glance',
    what: 'the venue',
  },
  {
    type: 'event',
    fields: ['venue.line'],
    filter: FESTIVAL,
    where: 'Odunde, at a glance',
    what: 'the exact venue line',
  },
  {
    type: 'event',
    fields: ['schedule[]'],
    filter: FESTIVAL,
    where: 'Odunde, schedule',
    what: 'the rows, times and content',
  },
  {
    type: 'event',
    fields: ['vendorTerms.fees', 'vendorTerms.closeDate', 'vendorTerms.decisionDate'],
    filter: FESTIVAL,
    where: 'Odunde, vendor dialog',
    what: 'fees, deadline and permit rules',
  },
  {
    type: 'event',
    fields: ['attendance'],
    filter: `${FESTIVAL} && defined(album)`,
    where: 'Odunde, past years',
    what: 'the attendance figure',
  },
  { type: 'zone', fields: ['line'], where: 'Odunde, zones', what: 'the zone description' },
  {
    type: 'festivalPage',
    condition: 'count(extraFacts[!defined(value)]) > 0',
    where: 'Odunde, at a glance',
    what: 'a glance fact',
  },
  {
    type: 'festivalPage',
    fields: ['whatItIs'],
    where: 'Odunde, what the day is',
    what: 'what Odunde is, in your words',
  },
  {
    type: 'festivalPage',
    fields: ['whatItIsImage'],
    where: 'Odunde, what the day is',
    what: 'a photograph of festival day',
  },
  {
    type: 'festivalPage',
    fields: ['planYourVisit[]'],
    where: 'Odunde, plan your visit',
    what: 'the eight practical facts',
  },
  {
    type: 'festivalPage',
    condition: 'count(planYourVisit[!defined(value)]) > 0',
    where: 'Odunde, plan your visit',
    what: 'a practical fact',
  },

  // End-of-Year Gala
  { type: 'event', fields: ['start'], filter: GALA, where: 'Gala, at a glance', what: 'the date' },
  {
    type: 'event',
    fields: ['doors'],
    filter: GALA,
    where: 'Gala, at a glance',
    what: 'the doors time',
  },
  {
    type: 'event',
    fields: ['venue.name'],
    filter: GALA,
    where: 'Gala, at a glance',
    what: 'the venue',
  },
  {
    type: 'event',
    fields: ['dress'],
    filter: GALA,
    where: 'Gala, at a glance',
    what: 'the dress code',
  },
  {
    type: 'galaPage',
    condition: 'count(extraFacts[!defined(value)]) > 0',
    where: 'Gala, at a glance',
    what: 'a glance fact',
  },
  {
    type: 'event',
    fields: ['schedule[]'],
    filter: GALA,
    where: 'Gala, the evening',
    what: 'the running order',
  },
  {
    type: 'event',
    fields: ['ticketsUrl'],
    filter: GALA,
    where: 'Gala, tickets',
    what: 'the Eventbrite link',
  },

  // Programs and lessons
  { type: 'program', fields: ['blurb'], where: 'Programs, cards', what: 'what the program is' },
  { type: 'program', fields: ['cadence'], where: 'Programs, cards', what: 'the cadence' },
  { type: 'program', fields: ['ages'], where: 'Programs, cards', what: 'the ages' },
  {
    type: 'programsPage',
    fields: ['kidsStem.ages', 'kidsStem.subprograms[]'],
    where: 'Programs, Kids & STEM',
    what: 'ages and what they build',
  },
  {
    type: 'programsPage',
    fields: [
      'culturalExchange.blurb',
      'culturalExchange.cadence',
      'culturalExchange.eligibility',
      'culturalExchange.howToJoin',
    ],
    where: 'Programs, Cultural Exchange',
    what: 'everything about this program',
  },
  {
    type: 'lessonsPage',
    condition: 'count(glance[!defined(value)]) > 0',
    where: 'Lessons, at a glance',
    what: 'format, ages and fee',
  },
  {
    type: 'lessonsPage',
    fields: ['teacher'],
    where: 'Lessons, teacher',
    what: 'the teacher, her bio and how she wants enquiries',
  },
  {
    type: 'lessonsPage',
    fields: ['levels[]'],
    where: 'Lessons, levels',
    what: 'what each level covers',
  },
  {
    type: 'lessonsPage',
    fields: ['oneLesson[]'],
    where: 'Lessons, one lesson',
    what: 'the shape of a lesson',
  },
  {
    type: 'lessonsPage',
    fields: ['faq[]'],
    where: 'Lessons, questions',
    what: 'the questions parents ask',
  },
  {
    type: 'lessonsPage',
    condition: 'count(faq[!defined(answer)]) > 0',
    where: 'Lessons, questions',
    what: 'an answer',
  },
  {
    type: 'lessonsPage',
    fields: ['voices[]'],
    where: 'Lessons, voices',
    what: 'two testimonials with permission to name',
  },

  // Cultural Collective
  {
    type: 'collectivePage',
    fields: ['argument'],
    where: 'Collective, the argument',
    what: 'why culture and sustainability sit together, in your words',
  },
  {
    type: 'collectivePage',
    fields: ['voice'],
    where: 'Collective, one voice',
    what: 'the quote and who said it',
  },
  {
    type: 'initiative',
    fields: ['blurb'],
    where: 'Collective, initiatives',
    what: 'what the initiative is',
  },
  {
    type: 'initiative',
    fields: ['status', 'serves', 'since', 'next'],
    where: 'Collective, initiatives',
    what: 'status, reach and dates',
  },

  // Get Involved and Donate
  {
    type: 'door',
    fields: ['bullets[]'],
    where: 'Get Involved, doors',
    what: 'what this way in asks and gives',
  },
  {
    type: 'donatePage',
    fields: ['whatYourGiftDoes[]'],
    where: 'Donate',
    what: 'the preset amounts and what each buys',
  },
  {
    type: 'donatePage',
    fields: ['otherWays[]'],
    where: 'Donate',
    what: 'which other ways to give you accept',
  },

  // Impact and Our Story
  {
    type: 'stat',
    fields: ['source'],
    where: 'Impact, numbers',
    what: 'a source line under the figure',
  },
  {
    type: 'impactPage',
    fields: ['howWeWork'],
    where: 'Impact, how we work',
    what: 'your account of the organisation',
  },
  {
    type: 'impactPage',
    fields: ['outcomes[]'],
    where: 'Impact, outcomes',
    what: 'participation figures per program',
  },
  {
    type: 'storyPage',
    fields: ['founding'],
    where: 'About, founding',
    what: 'the 1997 story, in your words',
  },

  // News and Gallery
  { type: 'newsPost', fields: ['body'], where: 'News', what: 'the body of the post' },
  {
    type: 'album',
    condition: 'creditConfirmed != true',
    where: 'Gallery, credit',
    what: 'photographer credit to confirm',
  },
  { type: 'album', fields: ['date'], where: 'Gallery, albums', what: 'the year of the album' },
  {
    type: 'galleryPage',
    fields: ['creditsAndConsent'],
    where: 'Gallery, consent',
    what: 'your photo consent and removal policy',
  },

  // Homepage
  { type: 'homepage', fields: ['hero.title'], where: 'Homepage, hero', what: 'the hero heading' },
  {
    type: 'homepage',
    fields: ['hero.image'],
    where: 'Homepage, hero',
    what: 'the hero photograph',
  },
  {
    type: 'homepage',
    fields: ['stats[]'],
    where: 'Homepage, figures',
    what: 'the headline figures',
  },
  { type: 'homepage', fields: ['voices[]'], where: 'Homepage, voices', what: 'member voices' },
  {
    type: 'homepage',
    fields: ['raiseYourHand.title'],
    where: 'Homepage, raise your hand',
    what: 'the heading',
  },
  { type: 'door', fields: ['blurb'], where: 'Doors', what: 'the blurb' },
];

export const PRESENCE: readonly PresenceEntry[] = [
  { type: 'zone', minimum: 4, where: 'Odunde, zones', what: 'the two unnamed zones' },
  {
    type: 'ticketTier',
    minimum: 1,
    where: 'Gala, seats and tables',
    what: 'three prices and what each includes',
  },
  { type: 'sponsorLevel', minimum: 1, where: 'Sponsorship', what: 'level names and amounts' },
  { type: 'honoree', minimum: 1, where: 'Gala, honorees', what: 'whether awards exist, and who' },
  {
    type: 'testimonial',
    minimum: 1,
    where: 'Homepage, Lessons, Impact',
    what: 'member voices with permission to name',
  },
  { type: 'person', minimum: 1, where: 'About, board and staff', what: 'names, roles and bios' },
  { type: 'partner', minimum: 1, where: 'Partner rows', what: 'partner and funder names' },
  {
    type: 'outcome',
    minimum: 1,
    where: 'Impact, outcomes',
    what: 'participation figures per program',
  },
  {
    type: 'governanceDoc',
    minimum: 1,
    where: 'Impact, governance',
    what: '990, annual report and audit position',
  },
  { type: 'timelineEntry', minimum: 1, where: 'About, timeline', what: 'the dated entries' },
  {
    type: 'givingLevel',
    minimum: 1,
    where: 'Donate',
    what: 'the preset amounts and what each buys',
  },
  {
    type: 'hometownAssociation',
    minimum: 9,
    where: 'Get Involved',
    what: 'the nine association names',
  },
];

function fieldCondition(field: string): string {
  if (field.endsWith('[]')) {
    const name = field.slice(0, -2);
    return `!defined(${name}) || count(${name}) == 0`;
  }
  return `!defined(${field})`;
}

/** The GROQ filter of the documents this entry lists. */
export function pendingFilter(entry: PendingEntry): string {
  const parts = [`_type == "${entry.type}"`];
  if (entry.filter) parts.push(entry.filter);
  const inner = entry.condition ?? (entry.fields ?? []).map(fieldCondition).join(' || ');
  parts.push(`(${inner})`);
  return parts.join(' && ');
}

/** The row title in the Studio: "Everywhere: EIN". */
export function pendingTitle(entry: PendingEntry | PresenceEntry): string {
  return `${entry.where}: ${entry.what}`;
}

export interface VoiceSlot {
  /** What the missing quote should be, shown in brackets in the quote's own face. */
  quote: string;
  /** Who it should come from, after "Name pending •". */
  role: string;
  /** The testimonial `context` that fills the slot: a voice with it takes the slot's place. */
  context: 'lessons' | 'festival' | 'collective' | 'general';
}

/**
 * The homepage's three member voices while the testimonials are missing, in the prototype's own
 * placeholder form (`02 Homepage.dc.html`): the quote the slot waits for in brackets and "Name
 * pending" with the voice it wants, under the registry's chip for the voices (ADR 0014 holds). A
 * testimonial whose context matches a slot fills it, so the page never asks again for a voice it
 * shows. The prototype's parent quote mentions Saturday mornings, which the Lessons rule retires,
 * so that slot asks what the lessons changed instead.
 */
export const HOMEPAGE_VOICE_SLOTS: readonly VoiceSlot[] = [
  {
    quote:
      'Quote from a Language Lessons parent, two or three sentences on what the lessons changed at home.',
    role: 'Parent, Language Lessons',
    context: 'lessons',
  },
  {
    quote:
      'Quote from an elder of Ẹgbẹ́ Ìbílẹ̀, two or three sentences on passing the language to the grandchildren.',
    role: 'Elder, Ẹgbẹ́ Ìbílẹ̀',
    context: 'general',
  },
  {
    quote:
      'Quote from a vendor at Ọjà Balógun, two or three sentences on what festival day does for the business.',
    role: 'Vendor, Ọjà Balógun',
    context: 'festival',
  },
];

/**
 * The chip wording for an empty field, or undefined when the field is not required for launch.
 * `kind` picks the row for one kind of document (an event's `gala` or `festival`) where the
 * registry keeps a row per kind; without a matching row the first row for the field answers. An
 * array's name without `[]` answers the row for one of its items missing a value.
 */
export function pendingWhat(type: string, field: string, kind?: string): string | undefined {
  const rows = PENDING.filter((entry) => entry.type === type && entry.fields?.includes(field));
  const narrowed = kind
    ? rows.find((entry) => entry.filter?.includes(`kind == "${kind}"`))
    : undefined;
  const found = (narrowed ?? rows[0])?.what;
  if (found) return found;
  // One item of an array missing its value ("a practical fact") is a condition row on the array.
  return PENDING.find((entry) => entry.type === type && entry.condition?.includes(`${field}[`))
    ?.what;
}

/**
 * The chip wording for a type the page expects more documents of (the zones, the tiers, the
 * partners), from the same presence rows the Studio lists, with the count the page expects.
 */
export function presenceWhat(type: string): { what: string; minimum: number } | undefined {
  const entry = PRESENCE.find((row) => row.type === type);
  return entry ? { what: entry.what, minimum: entry.minimum } : undefined;
}

/** The GROQ count of a presence entry; run it with the `drafts` perspective so a draft counts once. */
export function presenceCountQuery(entry: PresenceEntry): string {
  const filter = entry.filter ? ` && ${entry.filter}` : '';
  return `count(*[_type == "${entry.type}"${filter}])`;
}
