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

// Our Story

export const STORY_HEADER = {
  kicker: { yo: 'Àwọn ènìyàn wa', en: 'Our people' },
  title: 'People and history',
  line: 'Who carries this work, and how it started in 1997.',
};

/** The founding facts as the seed writes them: the two confirmed values, the two owed as chips. */
export const FOUNDING_FACTS = [
  { label: 'Founded', value: '1997, Los Angeles', pending: owed('storyPage', 'foundingFacts') },
  { label: 'Founders', pending: owed('storyPage', 'foundingFacts') },
  { label: 'Status', value: '501(c)(3) nonprofit', pending: owed('storyPage', 'foundingFacts') },
  { label: 'First year', pending: owed('storyPage', 'foundingFacts') },
];

export const FOUNDING_PENDING = owed('storyPage', 'founding');
export const FOUNDING_PHOTO_WHAT = owed('storyPage', 'foundingImage');

/** Timeline entries in the bracketed form: the prototype's dates and lines are invented. */
export const TIMELINE_PLACEHOLDERS = [
  { _id: 'entry-1', year: '[ Year ]', line: '[ The founding, in one line ]', milestone: true },
  { _id: 'entry-2', year: '[ Year to year ]', line: '[ What happened across these years ]' },
  { _id: 'entry-3', year: '[ Year ]', line: '[ What happened that year ]' },
  { _id: 'entry-4', year: '[ Today ]', line: '[ Where the work stands now ]', milestone: true },
];

const fullBio = blocks('[ The full bio, in their words ]');

/**
 * Board members in the bracketed form, for the stories of a page that lists them. The one portrait is
 * the Yoruba lesson's whiteboard, a photograph with no one in it, so no one reads as a named person.
 */
export const BOARD_PLACEHOLDERS = [
  {
    _id: 'board-1',
    name: '[ Name ]',
    role: '[ Role ]',
    bio: '[ A short bio ]',
    bioFull: fullBio,
    image: { ...PHOTOS.teachingSession, alt: '[ Portrait ]' },
  },
  { _id: 'board-2', name: '[ Name ]', role: '[ Role ]', bio: '[ A short bio ]', bioFull: fullBio },
  { _id: 'board-3', name: '[ Name ]', role: '[ Role ]', bio: '[ A short bio ]' },
  { _id: 'board-4', name: '[ Name ]', role: null, bio: null },
];

export const STAFF_PLACEHOLDERS = [1, 2, 3, 4, 5].map((n) => ({
  _id: `staff-${n}`,
  name: '[ Name ]',
  role: n === 5 ? '[ Volunteer, since the year ]' : '[ Role ]',
}));

export const PEOPLE_PENDING = {
  board: "the board's names, roles and bios",
  staff: 'the staff and volunteers to list',
  role: owed('person', 'role', 'board'),
  bio: owed('person', 'bioShort', 'board'),
};

export const STAFF_INTRO =
  'The people who run the programs, and the volunteers who have been here longest.';

export const REACH_US = {
  title: 'Reach us',
  intro: 'For anything not covered on Get Involved. Write, call, or send a message.',
};

export const STORY_TAKE_PART = [
  { _key: 'way-1', way: 'member', title: 'Become a member', label: 'Become a member' },
  {
    _key: 'way-2',
    way: 'volunteer',
    title: 'Raise your hand',
    line: 'One form. We place you where you are needed.',
    label: 'Volunteer',
  },
];

// Donate

export const DONATE_HEADER = {
  kicker: { yo: 'Ẹ ṣe àánú', en: 'Give' },
  title: 'Give to Omo Yorùbá',
  line: "Gifts hold up the language lessons, the festival at Leimert Park, and the children's programs.",
  actions: [
    { label: 'Give now', kind: 'give' },
    { label: 'Partner or sponsor', kind: 'enquiry', enquiryKind: 'sponsor' },
  ],
};

export const GIVE_NOW = {
  title: 'Give now',
  blurb:
    'Choose an amount, one time or monthly, and pay securely through Zeffy without leaving this page. Your receipt arrives by email straight away.',
};

/** The give-now facts as the seed writes them: only the Give Dialog's own fallback is ours to state. */
export const GIVE_FACTS = [
  { label: 'Fees', pending: owed('donatePage', 'giveNow.facts') },
  { label: 'Receipt', pending: owed('donatePage', 'giveNow.facts') },
  { label: 'Monthly', pending: owed('donatePage', 'giveNow.facts') },
  {
    label: 'If the form fails',
    value: 'The dialog offers contact and a mailing address instead.',
    pending: owed('donatePage', 'giveNow.facts'),
  },
];

export const LARGER_SCALE = {
  title: 'Giving at a larger scale',
  intro:
    'Organizations, funders, and civic partners. Named levels, recognition, and a conversation with a person. Four questions and we send the deck.',
  door: seededDoor('partner'),
};

/** Giving levels in the bracketed form: the prototype's amounts and what they buy are invented. */
export const GIVING_LEVEL_PLACEHOLDERS = [
  {
    figure: '[ Amount ]',
    line: '[ What this amount pays for ]',
    source: '[ Where the cost comes from ]',
  },
  { figure: '[ Amount ] a month', line: '[ What this amount pays for ]', source: null },
  { figure: '[ Amount ]', line: null, source: null },
];

export const GIFTS_PENDING = {
  levels: owed('donatePage', 'whatYourGiftDoes[]'),
  line: owed('givingLevel', 'what'),
  source: owed('givingLevel', 'source'),
};

export const OTHER_WAYS_PENDING = owed('donatePage', 'otherWays[]');

export const TRUST_CELLS = [
  { label: 'Tax status', value: '501(c)(3)', note: 'Since 1997' },
  { label: 'EIN', pending: owed('siteSettings', 'ein') },
  { label: 'Deductible', value: 'To the extent allowed by law' },
  { label: 'Receipt', pending: owed('donatePage', 'giveNow.facts') },
];
