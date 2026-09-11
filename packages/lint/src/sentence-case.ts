export interface TitleCaseFinding {
  line: number;
  /** The capitalised words that counted, in order. */
  words: string[];
  snippet: string;
}

export interface TitleCaseOptions {
  /** Names to ignore, matched as whole phrases before counting. */
  properNouns?: readonly string[];
  /** A line warns when it has more capitalised words than this. Default 2. */
  threshold?: number;
}

const FILLER = String.fromCharCode(1);

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// A word counts when it is one capital ("A") or a capital followed by lowercase ("Member").
// "STEM" and "EIN" do not count (acronyms) and "iPhone" does not (no leading capital).
const CAPITALISED_WORD =
  /^[^\p{L}\p{N}]*(\p{Lu}(?:[\p{Ll}\p{M}][\p{L}\p{M}'-]*)?)(?![\p{L}\p{M}])/u;

/**
 * Headings and button labels are sentence case (docs/design/QUALITY.md section 1). A line with
 * more than `threshold` capitalised words, once proper nouns are masked, is Title Case. Two word
 * labels such as "Our Story" pass on purpose.
 */
export function findTitleCase(text: string, options: TitleCaseOptions = {}): TitleCaseFinding[] {
  const threshold = options.threshold ?? 2;
  const nouns = [...(options.properNouns ?? [])].sort((a, b) => b.length - a.length);
  const findings: TitleCaseFinding[] = [];
  text.split(/\r?\n/).forEach((original, index) => {
    let masked = original;
    for (const noun of nouns) {
      const pattern = new RegExp(
        `(?<![\\p{L}\\p{M}])${escapeRegExp(noun)}(?![\\p{L}\\p{M}])`,
        'gu',
      );
      masked = masked.replace(pattern, (match) => FILLER.repeat(match.length));
    }
    const words: string[] = [];
    for (const token of masked.split(/\s+/)) {
      const match = CAPITALISED_WORD.exec(token);
      if (match?.[1]) words.push(match[1]);
    }
    if (words.length > threshold) {
      findings.push({ line: index + 1, words, snippet: original.trim() });
    }
  });
  return findings;
}
