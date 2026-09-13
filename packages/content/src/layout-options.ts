import type { LayoutValue } from './schema/objects/layoutOption';

/**
 * The layout options of every page singleton (ROUTES section 5, ADR 0006): the same names and
 * values as the prototype's tweak props, the first value the default. A plain module with no
 * Sanity import, so the site reads the defaults (`layoutDefaults`) without pulling the Studio
 * into a page's bundle; the schema builds its `layout` object from the same list.
 */
export interface LayoutSpec {
  name: string;
  title: string;
  options: readonly LayoutValue[];
  description?: string;
}

export const PAGE_LAYOUTS = {
  homepage: [
    {
      name: 'season',
      title: 'Season',
      options: ['auto', 'gala', 'odunde'],
      description: 'Which event leads; auto picks by date.',
    },
    // The prototype's value is "school"; the Studio shows the repo's word for it (AGENTS.md: never "School").
    {
      name: 'highlight',
      title: 'Highlight',
      options: ['festival', { value: 'school', title: 'lessons' }, 'collective'],
      description:
        "The program the homepage leans on: its card moves first with the gold ring, and its card action becomes the hero's gold button. Festival keeps the hero's own button.",
    },
    { name: 'gallery', title: 'Gallery tiles', options: ['7', '5', '3'] },
    { name: 'involved', title: 'Get involved', options: ['doors', 'rows'] },
    { name: 'newsletter', title: 'Newsletter', options: ['footer', 'band'] },
    { name: 'pattern', title: 'Pattern', options: ['rich', 'subtle'] },
    {
      name: 'motion',
      title: 'Motion',
      options: ['on', 'off'],
      description: 'The hero photo breathe.',
    },
  ],
  festivalPage: [
    { name: 'phead', title: 'Header', options: ['photo', 'slim'] },
    { name: 'zones', title: 'Zones', options: ['mosaic', 'five', 'grid', 'list'] },
    { name: 'schedule', title: 'Schedule', options: ['shown', 'collapsed', 'hidden'] },
    { name: 'takepart', title: 'Take part first row', options: ['vendor', 'sponsor'] },
    { name: 'labels', title: 'Take-part labels', options: ['column', 'none', 'kicker'] },
  ],
  galaPage: [
    { name: 'treatment', title: 'Treatment', options: ['formal', 'warm'] },
    { name: 'tiers', title: 'Tiers', options: ['columns', 'rows'] },
    { name: 'emphasis', title: 'Emphasis', options: ['seats', 'tables'] },
    {
      name: 'awards',
      title: 'Awards',
      options: ['hidden', 'shown'],
      description:
        'Hidden until the Gala names honorees; shown with none gives the Pending line (ADR 0024).',
    },
    { name: 'schedule', title: 'Running order', options: ['shown', 'hidden'] },
    { name: 'past', title: 'Past galas', options: ['shown', 'hidden'] },
    { name: 'labels', title: 'Take-part labels', options: ['column', 'none', 'kicker'] },
  ],
  programsPage: [
    { name: 'cards', title: 'Cards', options: ['four', 'three', 'pairs'] },
    { name: 'inline', title: 'Inline programs', options: ['expanded', 'collapsed'] },
    { name: 'yearstrip', title: 'Year strip', options: ['shown', 'hidden'] },
  ],
  lessonsPage: [
    { name: 'lesson', title: 'What a lesson looks like', options: ['shown', 'hidden'] },
    { name: 'portraits', title: 'Portraits', options: ['shown', 'hidden'] },
    { name: 'faq', title: 'Questions', options: ['closed', 'open'] },
  ],
  collectivePage: [
    { name: 'initiatives', title: 'Initiatives', options: ['side', 'stacked'] },
    { name: 'green', title: 'Green', options: ['signal', 'strong'] },
    { name: 'status', title: 'Status lines', options: ['shown', 'hidden'] },
    { name: 'events', title: 'Events', options: ['shown', 'hidden'] },
  ],
  getInvolvedPage: [
    { name: 'doors', title: 'Doors', options: ['cards', 'rows'] },
    { name: 'hta', title: 'Hometown associations', options: ['shown', 'hidden'] },
  ],
  impactPage: [
    { name: 'stats', title: 'Headline numbers', options: ['four', 'six'] },
    { name: 'outcomes', title: 'Outcomes', options: ['cards', 'rows'] },
    { name: 'sources', title: 'Source lines', options: ['shown', 'hidden'] },
    { name: 'funders', title: 'Funders', options: ['shown', 'hidden'] },
  ],
  storyPage: [
    {
      name: 'timeline',
      title: 'Timeline',
      options: ['hidden', 'shown'],
      description: 'Hidden until the owner confirms the entries (wayfinder ticket 07).',
    },
    { name: 'bios', title: 'Bios', options: ['short', 'full'] },
    { name: 'portraits', title: 'Portraits', options: ['shown', 'hidden'] },
  ],
  donatePage: [{ name: 'impact', title: 'What your gift does', options: ['shown', 'hidden'] }],
  galleryPage: [
    { name: 'open', title: 'Opening an album', options: ['viewer', 'grid'] },
    { name: 'captions', title: 'Captions', options: ['always', 'hover'] },
    { name: 'state', title: 'State', options: ['built', 'soon'] },
  ],
  newsPage: [
    { name: 'order', title: 'Order', options: ['events-led', 'feed-led'] },
    { name: 'filtersShown', title: 'Filters', options: ['shown', 'hidden'] },
  ],
} satisfies Record<string, readonly LayoutSpec[]>;
