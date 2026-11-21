/**
 * Generators and judges the link guards' property tests share (`*.properties.test.ts`). The examples in each
 * guard's own tests name the cases we know; these look for the ones we do not, among values built from the
 * pieces that have opened another site before: slashes and backslashes, tabs and newlines, schemes in any
 * case, hosts, and Unicode a parser might fold into one of those. Addresses are judged by the WHATWG parser browsers share (node:url's URL).
 */
import { URL } from 'node:url';
import fc from 'fast-check';

export const SITE = 'https://www.omoyorubasocal.org/odunde';
export const LINK_OUT = /^(https?:|mailto:|tel:)/i;
export const SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);

const PIECES = [
  '/',
  '\\',
  '\t',
  '\n',
  '\r',
  ' ',
  '\u0000',
  '\u007f',
  ' ',
  '#',
  '?',
  ':',
  '@',
  '.',
  '%2F',
  '%5C',
  'evil.example',
  'javascript:',
  'JaVaScRiPt:',
  'data:',
  'http:',
  'HTTPS:',
  'mailto:',
  'tel:',
  'alert(1)',
  'odunde',
  // Unicode a parser might fold into a slash, a dot or nothing: the line separator, the fullwidth solidus and
  // full stop, the byte order mark.
  '\u2028',
  '\uff0f',
  '\uff0e',
  '\ufeff',
];

const joined = fc
  .array(fc.constantFrom(...PIECES), { maxLength: 8 })
  .map((pieces) => pieces.join(''));

/**
 * A path that a browser would turn into two slashes, or a slash and a backslash, once it drops the tabs and
 * newlines inside it: the shape PR 54 closed, so a regression in either half of that fix shows every run.
 */
const smuggledSlash = fc
  .tuple(
    fc.array(fc.constantFrom('\t', '\n', '\r'), { minLength: 1, maxLength: 3 }),
    fc.constantFrom('/', '\\'),
    fc.constantFrom('evil.example', 'javascript:alert(1)', 'www.zeffy.com'),
  )
  .map(([controls, slash, host]) => `/${controls.join('')}${slash}${host}`);

/**
 * Strings a Studio field could hold, written through the API with no Studio rule to stop them: joins of the
 * pieces above, any code points, and web addresses. Weighted toward values that open with a slash, since a path
 * is where a link meant for this site can leave it.
 */
export const studioValue = fc.oneof(
  { weight: 3, arbitrary: joined },
  { weight: 3, arbitrary: joined.map((rest) => `/${rest}`) },
  { weight: 1, arbitrary: smuggledSlash },
  { weight: 1, arbitrary: fc.string({ unit: 'binary' }) },
  { weight: 1, arbitrary: fc.webUrl({ withQueryParameters: true, withFragments: true }) },
);

/** A path, fragment or query on this site that any link check must let through. */
export const onSitePlace = fc.oneof(
  fc.webSegment().map((segment) => `/${segment}`),
  fc.webPath().filter((path) => path.startsWith('/') && !path.startsWith('//')),
  fc.webFragments().map((fragment) => `#${fragment}`),
  fc.webQueryParameters().map((query) => `?${query}`),
);

/** Where a browser goes when a link on SITE carries this href, or undefined when it goes nowhere. */
export function followed(href: string): URL | undefined {
  try {
    return new URL(href, SITE);
  } catch {
    return undefined;
  }
}

/** Whether a link a browser follows from SITE lands on http, https, mailto or tel, or nowhere. */
export function followsAKnownScheme(href: string): boolean {
  const url = followed(href);
  return url === undefined || SCHEMES.has(url.protocol);
}

/** Whether an href that is not a link out (a path, fragment or query) lands on SITE's own origin, or nowhere. */
export function staysOnSite(href: string): boolean {
  if (LINK_OUT.test(href)) return true;
  const url = followed(href);
  return url === undefined || url.origin === new URL(SITE).origin;
}
