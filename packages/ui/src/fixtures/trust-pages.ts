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
