import { positionOf, snippetAround } from './position';

export interface ColorFinding {
  line: number;
  column: number;
  literal: string;
  snippet: string;
}

const HEX = /(?<![\w-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
// rgb(), hsl(), oklch() and friends, allowing one level of nested parentheses.
const COLOR_FUNCTION = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\((?:[^()]|\([^()]*\))*\)/g;
// A named colour as the whole value of a declaration.
const NAMED =
  /(?<=:[ \t]*)\b(?:white|black|red|blue|green|yellow|orange|purple|pink|brown|gr[ae]y|gold|silver|navy|teal|maroon|olive|indigo|ivory|beige|tan|crimson|coral|salmon|khaki|lime|magenta|cyan|aqua|violet)\b(?=[ \t]*(?:!important)?[ \t]*(?:[;}]|$))/gim;

// A `#xxx` that is a fragment or a selector rather than a colour: after href=, url(, a markdown
// link opener, a path slash or a template backtick; or followed by selector syntax.
const FRAGMENT_BEFORE = /(?:href=\{?["'`]?|url\(|\]\(|\/|`)$/;
const SELECTOR_AFTER = /^[ \t]*(?:[{>~+[]|:[a-z])/;

/** Colour literals in CSS and code. Tokens (`var(--*)`), fragments, selectors and headings pass. */
export function findColorLiterals(text: string): ColorFinding[] {
  const hits: { index: number; literal: string }[] = [];
  for (const m of text.matchAll(HEX)) {
    const index = m.index ?? 0;
    if (FRAGMENT_BEFORE.test(text.slice(Math.max(0, index - 12), index))) continue;
    if (SELECTOR_AFTER.test(text.slice(index + m[0].length, index + m[0].length + 8))) continue;
    hits.push({ index, literal: m[0] });
  }
  for (const m of text.matchAll(COLOR_FUNCTION)) {
    const literal = m[0];
    if (!/\d/.test(literal) || /\bvar\(|\bfrom\b/.test(literal)) continue; // built from a token
    hits.push({ index: m.index ?? 0, literal });
  }
  for (const m of text.matchAll(NAMED)) {
    hits.push({ index: m.index ?? 0, literal: m[0] });
  }
  hits.sort((a, b) => a.index - b.index);
  return hits.map(({ index, literal }) => ({
    ...positionOf(text, index),
    literal,
    snippet: snippetAround(text, index),
  }));
}
