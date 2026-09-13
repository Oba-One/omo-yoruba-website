/**
 * Seed-shaped fixtures for the event-page stories (COMPONENT-MAP, Storybook organisation): the
 * confirmed copy the seed writes to `festivalPage` and `galaPage`
 * (`packages/content/scripts/seed-data.ts`), the register's photographs, and Pending states in the
 * registry's own wording. No mock name, price, date, time or address: the editions carry no date,
 * and the tiers, sponsor levels, honorees and partners do not exist yet, as in the development
 * dataset.
 */
import { PHOTOS } from './photos';

type Block = {
  _type: 'block';
  _key: string;
  style: 'normal' | 'h3' | 'blockquote';
  markDefs: { _type: 'link'; _key: string; href: string }[];
  children: { _type: 'span'; _key: string; text: string; marks: string[] }[];
};

const paragraph = (key: string, text: string): Block => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}-span`, text, marks: [] }],
});

export const FESTIVAL_HEADER = {
  kicker: { yo: 'Ọdúndé', en: 'The new year has arrived' },
  title: 'Odunde Festival',
  line: 'A day of Yoruba culture at Leimert Park, held each June. Four zones, one village, open to everyone.',
  image: PHOTOS.processionDrummer,
  actions: [
    { label: 'Plan your day', kind: 'anchor', href: '#plan' },
    { label: 'Apply as a vendor', kind: 'enquiry', enquiryKind: 'vendor' },
  ],
};

/** The header line under the buttons for Odunde 2027 as the seed holds it: every fact Pending. */
export const FESTIVAL_META = [
  { pending: 'the date' },
  { pending: 'the hours' },
  { pending: 'the cost' },
];

/** The glance for Odunde 2027 as the seed holds it: the venue's name and the Family fact. */
export const FESTIVAL_GLANCE = [
  { label: 'Date', pending: 'the date' },
  { label: 'Time', pending: 'the hours' },
  { label: 'Where', value: 'Leimert Park', notePending: 'the exact venue line' },
  { label: 'Cost', pending: 'the cost' },
  { label: 'Family', value: 'All ages', note: "Children's compound on site" },
];

/** "What Odunde is", as the seed writes it. */
export const WHAT_IT_IS: Block[] = [
  paragraph(
    'what-1',
    'Odunde marks the Yoruba new year. It is held in June at Leimert Park, and it is open to the whole neighborhood, not only to Yoruba families. The park is laid out as a village for the day, with four zones and a program that runs from the opening procession to the last drum.',
  ),
  paragraph(
    'what-2',
    'If you have never been: this sits alongside Lunar New Year, Diwali, and Nowruz. Communities that pause the world for a day to celebrate who they are, in public, with their neighbors, and with anyone who wants to come and eat.',
  ),
];

/** The figure beside it: the prototype's photograph, framing and place caption. */
export const WHAT_IT_IS_FIGURE = {
  image: {
    src: PHOTOS.kidWithMasquerade.src,
    alt: PHOTOS.kidWithMasquerade.alt,
    position: '45% 50%',
  },
  caption: 'Festival day • Leimert Park',
};

/**
 * Every node `blockContent` allows, written from the seed's own copy: paragraphs with strong, em
 * and a link to a page of the site, an h3, a blockquote of the homepage proverb, and a pull quote in
 * the voices' Pending form. For the Prose story and its node coverage test.
 */
export const PROSE_EVERY_NODE = [
  {
    _type: 'block',
    _key: 'every-1',
    style: 'normal',
    markDefs: [{ _type: 'link', _key: 'link-1', href: '/gala' }],
    children: [
      { _type: 'span', _key: 'every-1-a', text: 'Odunde marks the ', marks: [] },
      { _type: 'span', _key: 'every-1-b', text: 'Yoruba new year', marks: ['strong'] },
      { _type: 'span', _key: 'every-1-c', text: '. It is ', marks: [] },
      { _type: 'span', _key: 'every-1-d', text: 'open to the whole neighborhood', marks: ['em'] },
      { _type: 'span', _key: 'every-1-e', text: '. The other half of our year is ', marks: [] },
      { _type: 'span', _key: 'every-1-f', text: 'the Gala', marks: ['link-1'] },
      { _type: 'span', _key: 'every-1-g', text: '.', marks: [] },
    ],
  },
  {
    _type: 'block',
    _key: 'every-2',
    style: 'h3',
    markDefs: [],
    children: [{ _type: 'span', _key: 'every-2-a', text: 'Four zones, one village', marks: [] }],
  },
  {
    _type: 'block',
    _key: 'every-3',
    style: 'blockquote',
    markDefs: [],
    children: [
      { _type: 'span', _key: 'every-3-a', text: 'Àgbájọ ọwọ́ la fi ń sọ̀yà.', marks: ['em'] },
    ],
  },
  {
    _type: 'pullQuote',
    _key: 'every-4',
    quote:
      '[ Quote from a vendor at Ọjà Balógun, two or three sentences on what festival day does for the business. ]',
    name: 'Name pending',
    relation: 'Vendor, Ọjà Balógun',
  },
];

/** The two zone documents the seed writes: names with marks and translations, photographs, no lines. */
export const ZONES = [
  {
    _id: 'zone-oja-balogun',
    name: { yo: 'Ọjà Balógun', en: 'The market' },
    line: null,
    image: PHOTOS.atMarket,
  },
  {
    _id: 'zone-agbala-omode',
    name: { yo: 'Àgbàlá Ọmọde', en: "The children's yard" },
    line: null,
    image: PHOTOS.kidsCrafts,
  },
];

/**
 * Schedule rows in the bracketed placeholder form the prototypes use for owed content: the times
 * and what happens are invented in the prototype, so the rows name what they wait for. The zone
 * names are the two confirmed zones.
 */
export const SCHEDULE_PLACEHOLDERS = [
  {
    _key: 'row-1',
    title: { en: '[ The opening of the day ]' },
    detail: '[ One line on what happens and who leads it ]',
    zone: { yo: 'Ọjà Balógun', en: 'The market' },
  },
  {
    _key: 'row-2',
    title: { en: '[ What the children do ]' },
    detail: '[ One line on what happens and where ]',
    zone: { yo: 'Àgbàlá Ọmọde', en: "The children's yard" },
  },
  {
    _key: 'row-3',
    title: { en: '[ The close of the day ]' },
    detail: '[ One line on how the day ends ]',
    zone: null,
  },
];

/** Plan your visit as the seed writes it: the eight labels, every value owed. */
export const PLAN_FACTS = [
  'Getting there',
  'Parking',
  'Transit',
  'Accessibility',
  'Seating',
  'What to bring',
  'What not to bring',
  'Lost children',
].map((label) => ({ label, pending: 'a practical fact' }));

/** The festival page's take-part rows as the seed writes them (ADR 0025): no fee, date or level in a line. */
export const FESTIVAL_TAKE_PART = [
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
  {
    _key: 'way-3',
    way: 'performer',
    title: 'Drummers, dancers, cultural groups',
    line: 'One short form, and the program committee sees every one.',
    label: 'Ask about performing',
  },
  {
    _key: 'way-4',
    way: 'volunteer',
    title: 'Festival day needs hands',
    line: 'One short form, and we place you where the gap is.',
    label: 'Volunteer',
  },
];

/** The Gala's take-part rows as the seed writes them, the give row last. */
export const GALA_TAKE_PART = [
  {
    _key: 'way-1',
    way: 'sponsor',
    title: 'Sponsor the evening',
    line: 'Four questions and we send the deck. One enquiry covers the Gala, Odunde, or both.',
    label: 'Sponsor the Gala',
  },
  {
    _key: 'way-2',
    way: 'table',
    title: 'Bring your table',
    line: 'Ten seats together, placed by hand and invoiced afterwards.',
    label: 'Reserve a table',
  },
  {
    _key: 'way-3',
    way: 'volunteer',
    title: 'The night needs hands',
    line: 'One form, and we place you.',
    label: 'Volunteer',
  },
  {
    _key: 'way-4',
    way: 'give',
    title: 'Cannot come this year?',
    line: 'A gift does the same work as a seat, and monthly does more.',
    label: 'Donate',
  },
];

/** The registry's wording for the vendor row while the edition holds no terms, as Odunde 2027 does. */
export const VENDOR_TERMS_PENDING = 'fees, deadline and permit rules';

/** The page's give handoff under the Odunde band (the prototype's own line). */
export const FESTIVAL_GIVE_HANDOFF = {
  text: 'Too small to sponsor, but want the day to happen? A gift does the same work.',
  action: { label: 'Donate', kind: 'give' },
};

/** A carousel slide from a register photograph: the seed stores its caption as the alt text too. */
const slide = (key: string, photo: { src: string; alt: string }) => ({
  _key: key,
  image: photo.src,
  alt: photo.alt,
  caption: photo.alt,
});

/** The first eight photographs of the Odunde 2026 album, in album order, as the dataset holds them. */
export const ODUNDE_PAST_SLIDES = [
  slide('odunde-2026-kid-playing-with-elder', PHOTOS.kidWithElder),
  slide('odunde-2026-procession-begins', PHOTOS.processionBegins),
  slide('odunde-2026-procession-with-drummer', PHOTOS.processionDrummer),
  slide('odunde-2026-procession-zoomed', PHOTOS.processionZoomed),
  slide('odunde-2026-president-receiving-gift', PHOTOS.receivingGift),
  slide('odunde-2026-performer-speaking-with-theater-backdrop', PHOTOS.performerSpeaking),
  slide('odunde-2026-performer-gele-speaking', PHOTOS.performerGeleSpeaking),
  slide('odunde-2026-performer-doing-gele-tying', PHOTOS.geleTying),
];

/** The six photographs of the End-of-Year Gala 2025 album, in album order. */
export const GALA_PAST_SLIDES = [
  slide('gala-2025-attendees-group-photo', PHOTOS.galaGroupPortrait),
  slide('gala-2025-three-friends-selfie', PHOTOS.galaSelfie),
  slide('gala-2025-attendees-smiling', PHOTOS.galaSmiling),
  slide('gala-2025-group-photo', PHOTOS.galaGroup),
  slide('gala-2025-attendees-sitting', PHOTOS.galaSitting),
  slide('gala-2025-attendees-getting-food', PHOTOS.galaGettingFood),
];

/** The albums' credits as the dataset holds them, neither confirmed yet. */
export const ODUNDE_ALBUM_CREDIT = { credit: 'Red Carpet Media', confirmed: false };
export const GALA_ALBUM_CREDIT = { credit: 'Members and volunteers', confirmed: false };

export const GALA_HEADER = {
  kicker: { yo: 'Àsè ọdún', en: "The year's celebration" },
  title: 'End-of-Year Gala',
  line: 'An evening of culture, community, and celebration, held each year in November or December.',
  image: PHOTOS.galaSitting,
  actions: [
    { label: 'Get tickets', kind: 'anchor', href: '#seats' },
    { label: 'Sponsor the evening', kind: 'enquiry', enquiryKind: 'sponsor' },
  ],
};

/** The header line for Gala 2026 as the seed holds it: the date, the venue and the seats all owed. */
export const GALA_META = [
  { pending: 'the date' },
  { pending: 'the venue' },
  { pending: 'three prices and what each includes' },
];

/** The glance for Gala 2026: every fact owed, the date's note from the confirmed season. */
export const GALA_GLANCE = [
  { label: 'Date', pending: 'the date', note: 'Held each November or December' },
  { label: 'Doors', pending: 'the doors time' },
  { label: 'Venue', pending: 'the venue' },
  { label: 'Dress', pending: 'the dress code' },
  { label: 'Seats from', pending: 'three prices and what each includes' },
];

export const GALA_GLANCE_CAPTION =
  'Everything you need to say yes: the date, the dress, and the price.';

/** The evening intro as the seed writes it. */
export const GALA_EVENING_INTRO =
  "The Gala closes our year. It is the night the community dresses, sits down together, and pays for the work of the next twelve months: the language lessons, the children's programs, and the festival.";

/** Running order rows in the bracketed placeholder form: the prototype's times and acts are invented. */
export const GALA_RUNNING_ORDER_PLACEHOLDERS = [
  { _key: 'row-1', title: { en: '[ The reception ]' }, detail: '[ One line on the arrival ]' },
  { _key: 'row-2', title: { en: '[ Dinner ]' }, detail: '[ One line on how dinner is served ]' },
  { _key: 'row-3', title: { en: '[ The performance ]' }, detail: '[ One line on who performs ]' },
];

/** The seats intro as the seed writes it. */
export const GALA_TIERS_INTRO =
  'Single seats and couples are sold through Eventbrite, which opens in a new tab. A table of ten is arranged with us directly: tell us who is coming and we place the table and send an invoice.';

/**
 * Ticket tiers in the bracketed placeholder form: the dataset holds none, and the prototype's names,
 * prices and includes are invented. Two buy-now tiers, the second featured, then the table tier.
 */
export const TIER_PLACEHOLDERS = [
  {
    _id: 'tier-seat',
    name: '[ A single seat ]',
    price: '[ Price ]',
    includes: ['[ What the seat includes ]'],
    variant: 'buyNow',
    featured: false,
  },
  {
    _id: 'tier-pair',
    name: '[ Two seats ]',
    price: '[ Price ]',
    includes: ['[ What the seats include ]'],
    variant: 'buyNow',
    featured: true,
  },
  {
    _id: 'tier-table',
    name: '[ A table of ten ]',
    price: '[ Price ]',
    includes: ['[ What the table includes ]'],
    variant: 'enquiry',
    featured: false,
  },
];

/** Eventbrite's own address, standing in for an edition's event link (none is held yet). */
export const EVENTBRITE_STAND_IN = 'https://www.eventbrite.com';
