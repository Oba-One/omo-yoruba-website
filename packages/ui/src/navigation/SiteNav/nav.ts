/**
 * The nav's links and how a path maps to the page key the ported CSS marks as current
 * (`.oy-nav[data-page=...] [data-nav=...]` in @oy/tokens). Pure, so the layout and the tests
 * share it.
 */
export interface NavLink {
  href: string;
  label: string;
  nav: 'programs' | 'involved' | 'impact' | 'about';
}

export const EVENT_LINKS = [
  { href: '/odunde', label: 'Ọdúndé Festival' },
  { href: '/gala', label: 'End-of-Year Gala' },
] as const;

export const NAV_LINKS: readonly NavLink[] = [
  { href: '/programs', label: 'Programs', nav: 'programs' },
  { href: '/get-involved', label: 'Get Involved', nav: 'involved' },
  { href: '/impact', label: 'Impact', nav: 'impact' },
  { href: '/our-story', label: 'Our Story', nav: 'about' },
];

export type PageKey =
  | ''
  | 'odunde'
  | 'gala'
  | 'programs'
  | 'school'
  | 'collective'
  | 'involved'
  | 'impact'
  | 'news'
  | 'gallery'
  | 'about';

const PAGE_KEYS: ReadonlyArray<[prefix: string, key: PageKey]> = [
  ['/odunde', 'odunde'],
  ['/gala', 'gala'],
  ['/programs/yoruba-lessons', 'school'],
  ['/programs/cultural-collective', 'collective'],
  ['/programs', 'programs'],
  ['/get-involved', 'involved'],
  ['/impact', 'impact'],
  ['/news', 'news'],
  ['/gallery', 'gallery'],
  ['/our-story', 'about'],
];

/** The page key for a path: the first prefix that matches, the empty key for the rest. */
export function pageKeyFor(path: string | undefined): PageKey {
  const clean = (path ?? '/').split(/[?#]/)[0] ?? '/';
  const found = PAGE_KEYS.find(([prefix]) => clean === prefix || clean.startsWith(`${prefix}/`));
  return found ? found[1] : '';
}

/** Whether the Events dropdown is current for a page key. */
export const isEventsPage = (key: PageKey): boolean => key === 'odunde' || key === 'gala';

/** The exact link a path matches, for `aria-current="page"`. */
export function currentHref(path: string | undefined): string | undefined {
  const clean = (path ?? '/').split(/[?#]/)[0];
  const hrefs = [...EVENT_LINKS.map((l) => l.href), ...NAV_LINKS.map((l) => l.href)];
  return hrefs.find((href) => href === clean);
}
