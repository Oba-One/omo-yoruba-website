import { positionOf, snippetAround } from './position';

export interface DashFinding {
  line: number;
  column: number;
  char: string;
  snippet: string;
}

// Built from code points so this file never contains the characters it forbids.
const EM_DASH = String.fromCharCode(0x2014);
const EN_DASH = String.fromCharCode(0x2013);

/** U+2014 anywhere, and U+2013 unless it sits between two digits (a numeric range). */
export function findDashes(text: string): DashFinding[] {
  const findings: DashFinding[] = [];
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char !== EM_DASH && char !== EN_DASH) continue;
    if (char === EN_DASH) {
      const numericRange = /\d/.test(text[i - 1] ?? '') && /\d/.test(text[i + 1] ?? '');
      if (numericRange) continue;
    }
    findings.push({ ...positionOf(text, i), char, snippet: snippetAround(text, i) });
  }
  return findings;
}
