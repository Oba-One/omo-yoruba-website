import { positionOf, snippetAround } from './position';

export interface Term {
  bare: string;
  correct: string;
  /** Flagged in running prose only, never as a whole quoted value or a key. */
  proseOnly?: boolean;
  /** Match only as written (proper nouns that collide with English words). */
  caseSensitive?: boolean;
}

export interface TermFinding {
  line: number;
  column: number;
  bare: string;
  correct: string;
  snippet: string;
}

export interface FindOptions {
  /**
   * Markdown mode (default) masks inline code, fenced blocks and CSS names written bare, and
   * treats hyphenated words as prose. Code mode (false) also masks kebab-case identifiers.
   * The CLI sets it from the file extension.
   */
  markdown?: boolean;
}

// Masked characters become this filler (U+0001): not a letter and not whitespace, so a term can
// neither match inside a masked region nor bridge two words across one.
const FILLER = String.fromCharCode(1);

function mask(text: string, pattern: RegExp): string {
  return text.replace(pattern, (match) => match.replace(/[^\n]/g, FILLER));
}

const FENCED_BLOCK = /```[\s\S]*?```/g;
const INLINE_CODE = /`[^`\n]*`/g;
const URL_PATTERN = /\b(?:https?|mailto):[^\s)>\]"']+/g;
const SEGMENT = '[\\p{L}\\p{N}_.-]+';
// Paths: a leading slash form, a path ending in a file extension, or three or more segments.
const PATH_LEADING = new RegExp(`(?<![\\p{L}\\p{N}])\\.{0,2}/${SEGMENT}(?:/${SEGMENT})*`, 'gu');
const PATH_EXTENSION = new RegExp(`${SEGMENT}(?:/${SEGMENT})+\\.[a-z0-9]{1,5}\\b`, 'gu');
const PATH_DEEP = new RegExp(`${SEGMENT}(?:/${SEGMENT}){2,}`, 'gu');
// snake_case and dotted identifiers, in every mode.
const DOTTED_OR_SNAKE = /[\p{L}\p{N}]+(?:[._][\p{L}\p{N}]+)+/gu;
// kebab-case, code mode only (in prose a hyphen joins words: "adire-print"). BEM modifiers use two.
const KEBAB = /[\p{L}\p{N}]+(?:-+[\p{L}\p{N}]+)+/gu;
// CSS names written bare in prose: .oy-card, .oy-ph--adire, --token, #id
const CSS_NAME = /(?<![\p{L}\p{N}])(?:\.|--|#)[\p{L}\p{N}]+(?:-+[\p{L}\p{N}]+)*/gu;
const CAMEL_OR_PASCAL = /\b[A-Za-z][a-z0-9]+[A-Z][A-Za-z0-9]*\b/g;

function maskCodeLike(text: string, markdown: boolean): string {
  let out = text;
  if (markdown) {
    out = mask(out, FENCED_BLOCK);
    out = mask(out, INLINE_CODE);
  }
  out = mask(out, URL_PATTERN);
  out = mask(out, PATH_LEADING);
  out = mask(out, PATH_EXTENSION);
  out = mask(out, PATH_DEEP);
  out = mask(out, CSS_NAME);
  out = mask(out, DOTTED_OR_SNAKE);
  if (!markdown) out = mask(out, KEBAB);
  out = mask(out, CAMEL_OR_PASCAL);
  return out;
}

function termPattern(term: Term): RegExp {
  const escaped = term.bare.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(
    `(?<![\\p{L}\\p{N}\\p{M}])${escaped}(?![\\p{L}\\p{N}\\p{M}])`,
    term.caseSensitive ? 'gu' : 'giu',
  );
}

const patternCache = new WeakMap<Term[], RegExp[]>();

function patternsFor(terms: Term[]): RegExp[] {
  let patterns = patternCache.get(terms);
  if (!patterns) {
    patterns = terms.map(termPattern);
    patternCache.set(terms, patterns);
  }
  return patterns;
}

const QUOTES = new Set(['"', "'", '`']);

/** A prose-only term is exempt as a whole quoted value ("adire") or as a key (adire: or adire=). */
function isEnumOrKey(masked: string, start: number, end: number): boolean {
  const before = masked[start - 1] ?? '';
  const after = masked[end] ?? '';
  if (QUOTES.has(before) && after === before) return true;
  return /^\s*[:=]/.test(masked.slice(end, end + 3));
}

export function findBareTerms(
  text: string,
  terms: Term[],
  options: FindOptions = {},
): TermFinding[] {
  const masked = maskCodeLike(text, options.markdown ?? true);
  const patterns = patternsFor(terms);
  const findings: TermFinding[] = [];
  terms.forEach((term, i) => {
    const pattern = patterns[i];
    if (!pattern) return;
    pattern.lastIndex = 0;
    for (const match of masked.matchAll(pattern)) {
      const index = match.index ?? 0;
      if (term.proseOnly && isEnumOrKey(masked, index, index + match[0].length)) continue;
      findings.push({
        ...positionOf(text, index),
        bare: match[0].replace(/\s+/g, ' '),
        correct: term.correct,
        snippet: snippetAround(text, index),
      });
    }
  });
  return findings.sort((a, b) => a.line - b.line || a.column - b.column);
}
