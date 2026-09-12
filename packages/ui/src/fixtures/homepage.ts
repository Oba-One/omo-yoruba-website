/**
 * Seed-shaped fixtures for the homepage stories (COMPONENT-MAP, Storybook organisation): the
 * confirmed facts the seed writes (`packages/content/scripts/seed-data.ts`), the register's
 * photographs and Pending states. No mock name, price, date or address: the editions carry no
 * date and there are no testimonials yet, as in the development dataset.
 */
import { PHOTOS } from './photos';

export const HERO = {
  kicker: { yo: 'Ẹ káàbọ̀', en: 'Welcome' },
  title: 'Yoruba culture, alive in Southern California',
  sub: 'Language, festival, family. Since 1997.',
  blessing: { yo: 'Oòdúà á gbè wá o!', en: 'May Odùduwà bless us' },
  image: PHOTOS.communityDance,
  primary: { label: 'See the Odunde Festival', kind: 'url', href: '/odunde' },
  secondary: [{ label: 'Get involved', kind: 'url', href: '/get-involved' }],
};

export const GALA_2026 = {
  _id: 'event-gala-2026',
  kind: 'gala',
  title: 'End-of-Year Gala 2026',
  edition: 2026,
  start: null,
  end: null,
  venueName: null,
  summary: null,
};

export const ODUNDE_2027 = {
  _id: 'event-odunde-2027',
  kind: 'festival',
  title: 'Odunde Festival 2027',
  edition: 2027,
  start: null,
  end: null,
  venueName: 'Leimert Park',
  summary: null,
};

export const STATS = [
  { _id: 'stat-years', value: '29', label: 'years serving Southern California' },
  { _id: 'stat-community', value: '3,000+', label: 'Yoruba community in Southern California' },
  { _id: 'stat-zones', value: '4', label: 'festival zones at Odunde' },
  { _id: 'stat-associations', value: '9', label: 'hometown associations' },
];

export const PROGRAMS = [
  {
    _id: 'program-yoruba-lessons',
    name: 'Yoruba Language Lessons',
    slug: 'yoruba-lessons',
    page: 'lessons',
    blurb:
      'Speaking, reading, and tone marks, taught over video call by our teacher. Times are set with her.',
    image: PHOTOS.learningYoruba,
    action: { label: 'Enrol a learner', kind: 'url', href: '/programs/yoruba-lessons' },
  },
  {
    _id: 'program-cultural-collective',
    name: 'Yoruba Cultural Collective',
    slug: 'cultural-collective',
    page: 'collective',
    blurb:
      'Members who put culture to work: the Solar Hub, Green Goods, and a circle that keeps ideas moving.',
    image: null,
    action: { label: 'Meet the Collective', kind: 'url', href: '/programs/cultural-collective' },
  },
  {
    _id: 'program-kids-stem',
    name: 'Kids & STEM',
    slug: 'kids-stem',
    page: null,
    blurb: "Àgbàlá Ọmọde, the children's compound, and the STEM Hub.",
    image: PHOTOS.kidsCrafts,
    action: { label: 'See youth programs', kind: 'url', href: '/programs#kids' },
  },
  {
    _id: 'program-cultural-exchange',
    name: 'Cultural Exchange',
    slug: 'cultural-exchange',
    page: null,
    blurb: null,
    image: null,
    action: null,
  },
];

export const NEWS = [
  {
    _id: 'news-odunde-2026-recap',
    title: 'Odunde 2026: the recap',
    slug: 'odunde-2026-recap',
    date: '2026-07-01',
    summary:
      'Four zones, one village. Photos, video, and the numbers from our biggest festival yet.',
  },
  {
    _id: 'news-language-lessons-fall-term',
    title: 'Language Lessons fall term',
    slug: 'language-lessons-fall-term',
    date: '2026-08-01',
    summary: 'New learners welcome. Write to the teacher to find a time that suits your family.',
  },
  {
    _id: 'news-end-of-year-gala-2026',
    title: 'End-of-Year Gala',
    slug: 'end-of-year-gala-2026',
    date: '2026-11-01',
    summary: 'An evening of culture, community, and celebration. Tables available now.',
  },
];

export const TILES = [
  { image: PHOTOS.processionZoomed, caption: 'Ọdúndé • Festival day at Leimert Park' },
  { image: PHOTOS.vendorSuya, caption: 'Oúnjẹ • Festival food at Ọjà Balógun' },
  { image: PHOTOS.momGames, caption: 'Àgbàlá Ọmọde • Kids at play in the park' },
  { image: PHOTOS.atMarket, caption: 'Àjọṣe • Partners and friends at the table' },
  { image: PHOTOS.galaSelfie, caption: 'Àsè ọdún • End-of-Year Gala 2025' },
  { image: PHOTOS.teachingSession, caption: 'Ẹ̀kọ́ èdè • Yoruba lesson at the festival' },
  { image: PHOTOS.vendorNecklaces, caption: 'Ọjà Balógun • Vendors at the market' },
];

export const DOORS = [
  {
    _id: 'door-member',
    key: 'member',
    title: 'Become a member',
    blurb:
      'Members carry the lessons, the festival, and each other. Dues run the year between events, when nothing is being sold and the bills still arrive.',
    action: { label: 'Become a member', kind: 'enquiry', enquiryKind: 'member' },
    image: PHOTOS.guestsSmiling,
  },
  {
    _id: 'door-partner',
    key: 'partner',
    title: 'Partner or sponsor',
    blurb:
      'For organizations and funders. Sponsorship is what keeps Odunde open to all of Leimert Park, and what carries the lessons through the year.',
    action: { label: 'Partner with us', kind: 'enquiry', enquiryKind: 'sponsor' },
    image: PHOTOS.receivingGift,
  },
];

export const RAISE_YOUR_HAND = {
  title: 'Raise your hand',
  blurb:
    'Many hands make the load light. Two ways in, whether you are a family in Southern California or an organization that wants to build with us.',
};

export const VOICES_INTRO = 'Families, elders, and vendors on what this community holds for them.';

export const PROVERB = {
  yo: 'Àgbájọ ọwọ́ la fi ń sọ̀yà.',
  en: 'With joined hands we beat the chest. Many hands make the load light.',
};

export const NEWSLETTER = {
  title: 'Festival news and updates, in your inbox',
  blurb: 'Once or twice a month. Save-the-dates, program news, and ways to help.',
};
