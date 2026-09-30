import type { LayoutValue } from './schema/objects/layoutOption';

/**
 * The layout options of every page singleton (ROUTES section 5, ADR 0006): the same names and
 * values as the prototype's tweak props, the first value the default. A plain module with no
 * Sanity import, so the site reads the defaults (`layoutDefaults`) without pulling the Studio
 * into a page's bundle; the schema builds its `layout` object from the same list. A plain value
 * shows in sentence case; a titled value keeps the stored value while the Studio shows the site's
 * words (ADR 0042). `heldBack` marks a held-back switch: read-only for members.
 */
export interface LayoutSpec {
  name: string;
  title: string;
  options: readonly LayoutValue[];
  description?: string;
  /** A held-back switch: it publishes content that waits for an owner decision (ADR 0042). */
  heldBack?: boolean;
}

export const PAGE_LAYOUTS = {
  homepage: [
    {
      name: 'season',
      title: 'Leading event',
      options: [
        { value: 'auto', title: 'By date' },
        { value: 'gala', title: 'End-of-Year Gala' },
        { value: 'odunde', title: 'Odunde Festival' },
      ],
      description: 'Which event leads the homepage. By date picks the nearest one still to come.',
    },
    // The prototype's value is "school"; the Studio shows the repo's word for it (AGENTS.md: never "School").
    // "festival" highlights no card: the festival has none, and the hero keeps its own button (ADR 0042).
    {
      name: 'highlight',
      title: 'Highlight',
      options: [
        { value: 'festival', title: 'No program' },
        { value: 'school', title: 'Lessons' },
        'collective',
      ],
      description:
        'The program card the homepage leans on moves first with the gold ring. No program keeps the cards in order.',
    },
    {
      name: 'gallery',
      title: 'Gallery tiles',
      options: [
        { value: '7', title: '7 photographs' },
        { value: '5', title: '5 photographs' },
        { value: '3', title: '3 photographs' },
      ],
    },
    {
      name: 'involved',
      title: 'Get involved',
      options: [{ value: 'doors', title: 'Cards' }, 'rows'],
    },
    {
      name: 'newsletter',
      title: 'Newsletter',
      options: [
        { value: 'footer', title: 'In the footer' },
        { value: 'band', title: 'As a band before the footer' },
      ],
    },
    { name: 'pattern', title: 'Pattern', options: ['rich', 'subtle'] },
    {
      name: 'motion',
      title: 'Motion',
      options: ['on', 'off'],
      description: 'The hero photograph breathes slowly.',
    },
  ],
  festivalPage: [
    {
      name: 'phead',
      title: 'Header',
      options: [{ value: 'photo', title: 'With a photograph' }, 'slim'],
    },
    {
      name: 'zones',
      title: 'Zones',
      options: ['mosaic', { value: 'five', title: 'Five tiles' }, 'grid', 'list'],
    },
    { name: 'schedule', title: 'Schedule', options: ['shown', 'collapsed', 'hidden'] },
    {
      name: 'labels',
      title: 'Take-part labels',
      options: [
        { value: 'column', title: 'In a column' },
        'none',
        { value: 'kicker', title: 'As kickers' },
      ],
    },
  ],
  galaPage: [
    { name: 'treatment', title: 'Treatment', options: ['formal', 'warm'] },
    { name: 'tiers', title: 'Tiers', options: ['columns', 'rows'] },
    {
      name: 'awards',
      title: 'Awards',
      options: ['hidden', 'shown'],
      description:
        'Shows the honorees. Held back until the owner decides the Gala gives awards; shown with no honoree yet gives the Pending line.',
      heldBack: true,
    },
    { name: 'schedule', title: 'Running order', options: ['shown', 'hidden'] },
    { name: 'past', title: 'Past galas', options: ['shown', 'hidden'] },
    {
      name: 'labels',
      title: 'Take-part labels',
      options: [
        { value: 'column', title: 'In a column' },
        'none',
        { value: 'kicker', title: 'As kickers' },
      ],
    },
  ],
  programsPage: [
    {
      name: 'cards',
      title: 'Cards',
      options: [
        { value: 'four', title: 'Four cards' },
        { value: 'three', title: 'Three cards' },
        { value: 'pairs', title: 'In pairs' },
      ],
    },
    { name: 'inline', title: 'Inline programs', options: ['expanded', 'collapsed'] },
    { name: 'yearstrip', title: 'Year strip', options: ['shown', 'hidden'] },
  ],
  lessonsPage: [
    { name: 'lesson', title: 'What a lesson looks like', options: ['shown', 'hidden'] },
    { name: 'portraits', title: 'Portraits', options: ['shown', 'hidden'] },
    { name: 'faq', title: 'Questions', options: ['closed', 'open'] },
  ],
  collectivePage: [
    {
      name: 'initiatives',
      title: 'Initiatives',
      options: [{ value: 'side', title: 'Side by side' }, 'stacked'],
    },
    {
      name: 'green',
      title: 'Green',
      options: [{ value: 'signal', title: 'A signal' }, 'strong'],
    },
    { name: 'status', title: 'Status lines', options: ['shown', 'hidden'] },
    { name: 'events', title: 'Events', options: ['shown', 'hidden'] },
  ],
  getInvolvedPage: [
    { name: 'doors', title: 'Ways to get involved', options: ['cards', 'rows'] },
    { name: 'hta', title: 'Hometown associations', options: ['shown', 'hidden'] },
  ],
  impactPage: [
    { name: 'stats', title: 'Headline figures', options: ['four', 'six'] },
    { name: 'outcomes', title: 'Outcomes', options: ['cards', 'rows'] },
    { name: 'sources', title: 'Source lines', options: ['shown', 'hidden'] },
    { name: 'funders', title: 'Funders', options: ['shown', 'hidden'] },
  ],
  storyPage: [
    {
      name: 'timeline',
      title: 'Timeline',
      options: ['hidden', 'shown'],
      description: 'Shows the timeline. Held back until the owner confirms its entries.',
      heldBack: true,
    },
    { name: 'bios', title: 'Bios', options: ['short', 'full'] },
    { name: 'portraits', title: 'Portraits', options: ['shown', 'hidden'] },
  ],
  donatePage: [{ name: 'impact', title: 'What your gift does', options: ['shown', 'hidden'] }],
  // The prototype names the photo viewer "viewer"; the value keeps the prototype's name (ADR 0006, ADR 0039).
  galleryPage: [
    {
      name: 'open',
      title: 'Opening an album',
      options: [
        { value: 'viewer', title: 'In the photo viewer' },
        { value: 'grid', title: 'As a page of photographs' },
      ],
      description:
        "The photo viewer opens on the album's first photograph; a page of photographs lists them all.",
    },
    {
      name: 'captions',
      title: 'Captions',
      options: ['always', { value: 'hover', title: 'On hover' }],
      description:
        'Album titles on the gallery and photograph captions on album pages: always shown, or on hover where a mouse can hover (a phone always shows them).',
    },
    {
      name: 'state',
      title: 'Albums',
      options: [
        { value: 'built', title: 'Shown' },
        { value: 'soon', title: 'Coming soon' },
      ],
      description:
        'Coming soon takes the albums off the site while photo consent is settled: the gallery and every album page show one sentence pointing to the Odunde and Gala pages, and those pages show no photographs of past years. Photographs a page shows in its own fields, such as headers, the homepage and the ways to get involved, stay even when an album holds them too, so change those on their pages. A page may show its old photographs to one more visitor after the change.',
      heldBack: true,
    },
  ],
  newsPage: [
    { name: 'order', title: 'Order', options: ['events-led', 'feed-led'] },
    { name: 'filtersShown', title: 'Filters', options: ['shown', 'hidden'] },
  ],
} satisfies Record<string, readonly LayoutSpec[]>;
