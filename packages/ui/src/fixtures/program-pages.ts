/**
 * Seed-shaped fixtures for the program-page stories (COMPONENT-MAP, Storybook organisation): the
 * confirmed copy the seed writes to `programsPage`, `lessonsPage` and `collectivePage`
 * (`packages/content/scripts/seed-data.ts`, spec Q14 of Phase 6), the register's photographs, and
 * Pending states in the registry's own wording. No cadence, age, fee, level, lesson step, teacher,
 * quote, status or date the register marks as invented.
 */
import { PROGRAMS } from './homepage';
import { PHOTOS } from './photos';

/**
 * The four programs as the Programs hub shows them: the seeded cadence of the Lessons and no ages yet
 * (both Pending), and the inline programs linking to their sections on the page.
 */
export const PROGRAM_CARDS = PROGRAMS.map((program) => ({
  ...program,
  cadence: program.page === 'lessons' ? 'Online, by arrangement' : null,
  ages: null,
  action:
    program.slug === 'kids-stem'
      ? { label: 'On this page', kind: 'anchor', href: '#kids' }
      : program.slug === 'cultural-exchange'
        ? { label: 'On this page', kind: 'anchor', href: '#exchange' }
        : program.action,
}));

export const PROGRAMS_HEADER = {
  kicker: { yo: 'Ohun tí a ń ṣe', en: 'What we do' },
  title: 'Our programs',
  line: 'What runs through the year, for children, teenagers, and adults, across Los Angeles. Two programs have their own page. The rest are described in full below.',
  actions: [{ label: 'Enrol a learner', kind: 'enquiry', enquiryKind: 'enrol' }],
};

/** The registry's wording for a sub-program's fact the Studio holds no value for. */
export const SUBPROGRAM_FACT_PENDING = 'ages and what they build';

/**
 * Kids & STEM as the seed writes it: the prose, and both halves with the prototype's photographs and
 * the labels of their facts, every value owed.
 */
export const KIDS_STEM = {
  title: 'Kids & STEM',
  blurb:
    "Kids & STEM is two things under one name. Àgbàlá Ọmọde is the children's compound: it runs at the Odunde Festival and through the year, and it is where the youngest members of this community meet each other. The STEM Hub is the technical half, built on the belief that a child who knows where they come from carries that into everything else they learn.",
  subprograms: [
    {
      _key: 'sub-1',
      name: 'Àgbàlá Ọmọde',
      blurb: "The children's compound. Games, art, and ayo, at the festival and through the year.",
      image: PHOTOS.momGames,
      facts: [{ _key: 'fact-1', label: 'Ages', pending: SUBPROGRAM_FACT_PENDING }],
      action: { label: 'See it at Odunde', kind: 'url', href: '/odunde' },
    },
    {
      _key: 'sub-2',
      name: 'STEM Hub',
      blurb: "The technical half of the children's program.",
      image: PHOTOS.kidsPaintArt,
      facts: [
        { _key: 'fact-1', label: 'Ages', pending: SUBPROGRAM_FACT_PENDING },
        { _key: 'fact-2', label: 'What they build', pending: SUBPROGRAM_FACT_PENDING },
      ],
      action: { label: 'Ask about joining', kind: 'enquiry', enquiryKind: 'contact' },
    },
  ],
};

/** Cultural Exchange as the seed leaves it: its name only, every fact and the photograph owed. */
export const CULTURAL_EXCHANGE = {
  title: 'Cultural Exchange',
  blurbPending: 'what the exchange is',
  facts: [
    { label: 'Who it is for', pending: 'who it is for' },
    { label: 'Cadence', pending: 'the cadence' },
    { label: 'How to join', pending: 'how to join' },
  ],
  imagePending: 'a photograph of the exchange',
};

/** The registry's wording for a year strip row without its when. */
export const YEAR_WHEN_PENDING = 'when it runs';

/**
 * The year strip as the seed writes it: the two event rows with their confirmed months, the three
 * program rows owing their cadence, and the notes the register confirms.
 */
export const YEAR_STRIP = [
  { _key: 'row-1', name: 'Yoruba Language Lessons', note: 'Online, scheduled with the teacher' },
  { _key: 'row-2', when: 'June', name: 'Odunde Festival', note: 'Leimert Park' },
  { _key: 'row-3', when: 'Nov or Dec', name: 'End-of-Year Gala' },
  { _key: 'row-4', name: 'Kids & STEM', note: 'Àgbàlá Ọmọde runs at the festival' },
  { _key: 'row-5', name: 'Yoruba Cultural Collective', note: 'Solar Hub, Green Goods' },
];

/** The Programs page's take-part rows as the seed writes them. */
export const PROGRAMS_TAKE_PART = [
  {
    _key: 'way-1',
    way: 'enrol',
    title: 'Start Yoruba lessons',
    line: 'Online lessons for children and adults, scheduled with the teacher. Write to her to start.',
    label: 'Enrol a learner',
  },
  {
    _key: 'way-2',
    way: 'volunteer',
    chip: 'Volunteer',
    title: 'Help with a program',
    line: 'One form, and we place you.',
    label: 'Volunteer',
  },
  {
    _key: 'way-3',
    way: 'give',
    title: 'Give toward the programs',
    line: "Gifts hold up the language lessons, the children's programs, and the festival.",
    label: 'Donate',
  },
];

export const LESSONS_HEADER = {
  kicker: { yo: 'Ẹ̀kọ́ èdè Yorùbá', en: 'Yoruba lessons' },
  title: 'Yoruba Language Lessons',
  line: 'Live online lessons with one teacher, for children and adults who want to speak, read, and carry the language forward. Times are set with her, one learner or one family at a time.',
  actions: [{ label: 'Write to the teacher', kind: 'enquiry', enquiryKind: 'enrol' }],
};

/** The glance as the seed writes it: format, when and cost confirmed, the ages owed. */
export const LESSONS_GLANCE = [
  { label: 'Format', value: 'Online, live', note: 'Video call', pending: 'a glance fact' },
  { label: 'When', value: 'Set with the teacher', pending: 'a glance fact' },
  { label: 'Ages', pending: 'a glance fact' },
  { label: 'Cost', value: 'Agreed with her', pending: 'a glance fact' },
];

export const TEACHER_INTRO =
  'There is no sign-up form and no fixed timetable. You write, she places the learner and proposes a time, and the first lesson follows.';

/** The teacher before the Studio links her: one teacher is confirmed, her name is owed. */
export const TEACHER_PENDING = {
  person: { role: 'Teacher' },
  namePending: "the teacher's name and bio",
  emailPending: "the teacher's email",
};

/** The registry's wording for a question the Studio has not answered. */
export const ANSWER_PENDING = 'an answer';

/** The five questions parents ask, as the seed writes them: every answer owed (the register invents all). */
export const LESSONS_FAQ = [
  'How much does it cost?',
  'When are the lessons?',
  'Can a parent sit in?',
  'What does a child need?',
  'What if my child already understands some Yoruba?',
].map((question, index) => ({ _key: `faq-${index + 1}`, question, answer: null }));

/** A Portable Text answer in the bracketed placeholder form, to show an answered question's layout. */
export const PLACEHOLDER_ANSWER = [
  {
    _type: 'block',
    _key: 'answer-1',
    style: 'normal',
    markDefs: [],
    children: [
      { _type: 'span', _key: 'answer-1-span', text: '[ The answer, in her words ]', marks: [] },
    ],
  },
];

/** The Lessons page's take-part rows as the seed writes them; the give row has no line. */
export const LESSONS_TAKE_PART = [
  {
    _key: 'way-1',
    way: 'volunteer',
    chip: 'Volunteer',
    title: 'Volunteer with us',
    line: 'One short form. You tell us when you are free and what you can do, and we place you where the gap is.',
    label: 'Raise your hand',
  },
  {
    _key: 'way-2',
    way: 'member',
    title: 'Become a member',
    line: 'Members carry the lessons and every other program.',
    label: 'Become a member',
  },
  { _key: 'way-3', way: 'give', title: 'Give toward the lessons', label: 'Donate' },
];

/** The Collective page's take-part rows as the seed writes them, with their own chips. */
export const COLLECTIVE_TAKE_PART = [
  {
    _key: 'way-1',
    way: 'sponsor',
    chip: 'Partner',
    title: 'Partner or fund a project',
    line: 'Organizations, funders, and civic partners. Four questions and we send the deck.',
    label: 'Talk to us',
  },
  {
    _key: 'way-2',
    way: 'volunteer',
    chip: 'Skills',
    title: 'Bring a skill',
    line: 'Tell us what you can do and we will find where it fits.',
    label: 'Volunteer a skill',
  },
  {
    _key: 'way-3',
    way: 'updates',
    title: 'Follow the Collective',
    line: 'Collective news goes out with our newsletter, once or twice a month.',
    label: 'Subscribe',
  },
];

/** The Collective's header as the seed writes it; "See what is on" goes to the events section. */
export const COLLECTIVE_HEADER = {
  kicker: { yo: 'Ẹgbẹ́ àṣà', en: 'The cultural collective' },
  title: 'Yoruba Cultural Collective',
  line: 'Culture put to work. A circle of members who meet, host events through the year, and run two member-led projects, the Solar Hub and Green Goods.',
  actions: [
    { label: 'Partner with the Collective', kind: 'enquiry', enquiryKind: 'sponsor' },
    { label: 'See what is on', kind: 'anchor', href: '#events' },
  ],
};

/** The registry's wording for the Collective's argument, which the register invents. */
export const ARGUMENT_PENDING = 'why culture and sustainability sit together, in your words';

/** The registry's wording for the Collective's one voice. */
export const COLLECTIVE_VOICE_PENDING = 'the quote and who said it';

/** The take-part lead as spec Q15 keeps it, for the seeded three rows. */
export const COLLECTIVE_TAKE_PART_INTRO =
  'The projects above are led by members. Three ways to join them.';
