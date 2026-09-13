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
