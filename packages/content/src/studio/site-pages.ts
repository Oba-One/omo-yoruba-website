import { COLLECTIVE_NAME, EVENT_PAGE_NAMES } from '../routes';

/**
 * The site's pages as the Studio names them, in the order the site's navigation walks them: the
 * sidebar's Pages list and the To do view's groups (ADR 0042). Each is the singleton of that page.
 */
export const SITE_PAGES = [
  { type: 'homepage', title: 'Homepage' },
  { type: 'festivalPage', title: EVENT_PAGE_NAMES.festival },
  { type: 'galaPage', title: EVENT_PAGE_NAMES.gala },
  { type: 'programsPage', title: 'Programs' },
  { type: 'lessonsPage', title: 'Yoruba Language Lessons' },
  { type: 'collectivePage', title: COLLECTIVE_NAME },
  { type: 'getInvolvedPage', title: 'Get Involved' },
  { type: 'impactPage', title: 'Impact' },
  { type: 'storyPage', title: 'Our Story' },
  { type: 'donatePage', title: 'Donate' },
  { type: 'galleryPage', title: 'Photo Gallery' },
] as const;

export type SitePage = (typeof SITE_PAGES)[number]['type'];
