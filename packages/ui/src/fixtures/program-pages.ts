/**
 * Seed-shaped fixtures for the program-page stories (COMPONENT-MAP, Storybook organisation): the
 * confirmed copy the seed writes to `programsPage`, `lessonsPage` and `collectivePage`
 * (`packages/content/scripts/seed-data.ts`, spec Q14 of Phase 6), the register's photographs, and
 * Pending states in the registry's own wording. No cadence, age, fee, level, lesson step, teacher,
 * quote, status or date the register marks as invented.
 */

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
