/**
 * Seed-shaped fixtures for the trust-page stories (COMPONENT-MAP, Storybook organisation): the confirmed
 * copy the seed writes to `getInvolvedPage`, `impactPage`, `storyPage` and `donatePage`
 * (`packages/content/scripts/seed-data.ts`, `docs/tickets/phase-7/spec.md`), the register's photographs,
 * and Pending states in the registry's own wording. No dues, role, fee, figure, source, name, date, amount
 * or address the register marks as invented; owed copy a layout needs to show takes the bracketed
 * placeholder form.
 */
import {
  GENERAL_CONTACT_PENDING,
  GENERAL_RESPONDS_PENDING,
  pendingWhat,
} from '@oy/content/pending';
import { DOORS, OTHER_DOORS, STATS } from './homepage';
import { PHOTOS } from './photos';

/** The registry's own wording for a field, so a story never drifts from the chip the site shows. */
const owed = (type: string, field: string, kind?: string) => pendingWhat(type, field, kind) ?? '';

type Block = {
  _type: 'block';
  _key: string;
  style: 'normal';
  markDefs: never[];
  children: { _type: 'span'; _key: string; text: string; marks: never[] }[];
};

const blocks = (...paragraphs: string[]): Block[] =>
  paragraphs.map((text, index) => ({
    _type: 'block',
    _key: `block-${index + 1}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `span-${index + 1}`, text, marks: [] }],
  }));

// Get Involved

export const GET_INVOLVED_HEADER = {
  kicker: { yo: 'Ẹ dara pọ̀ mọ́ wa', en: 'Join us' },
  title: 'Raise your hand',
  line: 'Àgbájọ ọwọ́ la fi ń sọ̀yà. Many hands make the load light. Four ways in. Each one explains what it asks of you before you fill anything in.',
};

/** The vendor door as the seed writes it (ADR 0034): its photograph and button; its blurb and bullets owed. */
export const VENDOR_DOOR = {
  _id: 'door-vendor',
  key: 'vendor',
  title: 'Sell at Odunde',
  blurb: null,
  bullets: null,
  action: { label: 'Apply for a booth', kind: 'enquiry', enquiryKind: 'vendor' },
  image: PHOTOS.vendorSuya,
};

/** One of the seeded doors the homepage fixtures hold. */
function seededDoor(key: string) {
  const door = [...DOORS, ...OTHER_DOORS].find((candidate) => candidate.key === key);
  if (!door) throw new Error(`The homepage fixtures hold no ${key} door.`);
  return door;
}

/** Get Involved's four cards in the page's order, each anchored by its key; the partner door's two seeded bullets. */
export const GET_INVOLVED_DOORS = [
  { ...seededDoor('member'), bullets: null },
  { ...seededDoor('volunteer'), bullets: null },
  VENDOR_DOOR,
  {
    ...seededDoor('partner'),
    bullets: [
      'One enquiry covers Odunde, the Gala, or both',
      'Four questions. This is a conversation, not an application',
    ],
  },
];

/** The give door's words and button, the box that closes the page. */
export const GIVE_BOX = { text: seededDoor('give').blurb, action: seededDoor('give').action };

export const ASSOCIATIONS_PROSE = blocks(
  'Nine hometown associations sit inside this community. They are the older structure underneath Omo Yorùbá: family and town networks that predate the organization in Southern California and still do much of the work of holding people together, from naming ceremonies to funerals.',
  'You do not have to belong to one to be a member here. If you already do, say so when you join and we will connect you to the others from your town.',
);

/** The associations' three cells as the page draws them while no name is listed. */
export const ASSOCIATIONS_CELLS = [
  {
    label: 'Associations',
    value: STATS[3]?.value,
    pending: owed('getInvolvedPage', 'hometownAssociations.stat'),
  },
  { label: 'Listed publicly', value: 'Not yet' },
  { label: 'To connect', value: 'Ask when you join' },
];

/** Associations listed in the bracketed form, for the story of a page that lists them. */
export const ASSOCIATIONS_LISTED = [
  { _id: 'hta-1', name: '[ Association name ]', url: null },
  { _id: 'hta-2', name: '[ Association name ]', url: 'https://example.org' },
];

export const TALK = {
  title: 'Or just talk to someone',
  intro: 'A phone call or an email works just as well as any form on this page.',
  namePending: GENERAL_CONTACT_PENDING,
  respondsPending: GENERAL_RESPONDS_PENDING,
};

// Impact

export const IMPACT_HEADER = {
  kicker: { yo: 'Iṣẹ́ wa', en: 'Our work' },
  title: 'What we have built since 1997',
  line: 'A 501(c)(3) serving the Yoruba community of Southern California through language, festival, and family programs.',
  actions: [
    { label: 'Sponsor or partner', kind: 'enquiry', enquiryKind: 'sponsor' },
    { label: 'Talk to us', kind: 'enquiry', enquiryKind: 'contact' },
  ],
};

/** The four confirmed figures with the Impact page's full labels, each still waiting for its source. */
export const IMPACT_STATS = STATS.map(({ value, label }) => ({ value, label, source: null }));

export const SOURCES_LEAD =
  'Every number carries a source line: the year it covers and how it was counted.';

export const HOW_WE_WORK_PHOTO = {
  ...PHOTOS.atMarket,
  caption: 'Àjọṣe • Partners and friends at the table',
};

/** The registry's wording for an outcome slot's chip and a figure's missing source. */
export const OUTCOMES_PENDING = owed('impactPage', 'outcomes[]');
export const OUTCOME_SOURCE_PENDING = owed('outcome', 'figure.source');

/** The four slots Impact keeps while the Studio holds no outcome, each named as the page names it. */
export const OUTCOME_SLOTS = [
  { title: 'Yoruba Language Lessons', href: '/programs/yoruba-lessons' },
  { title: 'Odunde Festival', href: '/odunde' },
  { title: 'Kids & STEM', href: '/programs#kids' },
  { title: 'Yoruba Cultural Collective', href: '/programs/cultural-collective' },
];

/** An outcome with its figure and source in the bracketed form, to show the layout an owner's outcome takes. */
export const OUTCOME_PLACEHOLDER = {
  title: 'Odunde Festival',
  figure: '[ Figure ]',
  line: '[ What the figure counts, and for which year ]',
  source: '[ How it was counted ]',
};

export const CIVIC_PROSE = blocks(
  'Odunde is a public cultural day held in Leimert Park. It is open to the whole neighborhood, not only to Yoruba families, and it is one of the few days in the year when the park is programmed end to end by a community organization rather than rented out.',
);

/** The civic cells as the development dataset stands: every edition fact owed. */
export const CIVIC_CELLS = [
  { label: 'Attendance', pending: owed('event', 'attendance', 'festival') },
  { label: 'Vendors hosted', pending: owed('event', 'vendorsHosted', 'festival') },
  { label: 'Partners', pending: 'partner and funder names' },
  { label: 'Cost to attend', pending: owed('event', 'cost', 'festival') },
];

/** Impact's six photographs with the short captions the seed writes. */
export const IMPACT_PHOTOS = [
  { image: PHOTOS.processionBegins, caption: 'Odunde • 2026' },
  { image: PHOTOS.kidsCrafts, caption: 'Àgbàlá Ọmọde • 2026' },
  { image: PHOTOS.teachingSession, caption: 'Yoruba lesson • Odunde 2026' },
  { image: PHOTOS.vendorSuya, caption: 'Ọjà Balógun • 2026' },
  { image: PHOTOS.galaGroupPortrait, caption: 'End-of-Year Gala • 2025' },
  { image: PHOTOS.summerCampArt, caption: 'Summer camp' },
];

/** Governance as the development dataset stands: the tax status confirmed, everything else owed. */
export const GOVERNANCE_CELLS = [
  { label: 'Tax status', value: '501(c)(3)', note: 'Since 1997' },
  { label: 'EIN', pending: owed('siteSettings', 'ein') },
  { label: 'Board', pending: "the board's names, roles and bios" },
  { label: 'Financials', pending: 'the annual report position' },
];

export const GOVERNANCE_FACTS = [
  { label: 'Mailing address', pending: owed('siteSettings', 'address') },
  { label: 'Form 990', pending: 'the Form 990 position' },
  { label: 'Annual report', pending: 'the annual report position' },
  { label: 'Audit', pending: 'the audit position' },
];

export const FUNDERS_INTRO = 'Everyone who has supported the work.';

/** The closing band while the partnerships lead is unnamed: the role and the chip for how soon. */
export const FUND = {
  kicker: { yo: 'Ọdún tí ń bọ̀', en: 'The year ahead' },
  title: 'Fund the next year',
  line: 'Our partnerships lead answers',
  linePending: 'how soon the partnerships lead replies',
  actions: [
    { label: 'Sponsor or partner', kind: 'enquiry', enquiryKind: 'sponsor' },
    { label: 'Talk to us', kind: 'enquiry', enquiryKind: 'contact' },
  ],
};
