import { readFileSync } from 'node:fs';
import type { Term } from './yoruba';

// The Node file loaders for the two shared lists. Browser and function bundles import the JSON
// files directly and pass them to the pure checks.

/** Reads the shared word list from disk. */
export function loadTerms(): Term[] {
  const file = new URL('../yoruba-terms.json', import.meta.url);
  const parsed = JSON.parse(readFileSync(file, 'utf8')) as { terms: Term[] };
  return parsed.terms;
}

/** Reads the shared proper nouns list from disk. */
export function loadProperNouns(): string[] {
  const file = new URL('../proper-nouns.json', import.meta.url);
  const parsed = JSON.parse(readFileSync(file, 'utf8')) as { properNouns: string[] };
  return parsed.properNouns;
}
