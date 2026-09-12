/**
 * The voice rules as pure checks returning a Sanity validation message or `true`. They reuse
 * the repo lint (ADR 0010) and import the two shared lists as JSON so the browser Studio and a
 * Sanity Function can bundle them without Node built-ins.
 */
import { findDashes } from '@oy/lint/em-dash';
import nounsJson from '@oy/lint/proper-nouns.json';
import { findTitleCase } from '@oy/lint/sentence-case';
import { findBareTerms, type Term } from '@oy/lint/yoruba';
import termsJson from '@oy/lint/yoruba-terms.json';

export const TERMS: Term[] = termsJson.terms;
export const PROPER_NOUNS: string[] = nounsJson.properNouns;

export type Message = string | true;

export const EM_DASH_MESSAGE = 'Replace the em dash with a comma, a colon or a new sentence.';

export function emDashMessage(value: unknown): Message {
  if (typeof value !== 'string' || value === '') return true;
  return findDashes(value).length === 0 ? true : EM_DASH_MESSAGE;
}

export function marksMessage(value: unknown): Message {
  if (typeof value !== 'string' || value === '') return true;
  const findings = findBareTerms(value, TERMS, { markdown: false });
  if (findings.length === 0) return true;
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const finding of findings) {
    const key = `${finding.bare}>${finding.correct}`;
    if (seen.has(key)) continue;
    seen.add(key);
    parts.push(`${finding.bare} should be ${finding.correct}`);
  }
  return `Add the marks: ${parts.join(', ')}.`;
}

export function sentenceCaseMessage(value: unknown): Message {
  if (typeof value !== 'string' || value === '') return true;
  const findings = findTitleCase(value, { properNouns: PROPER_NOUNS });
  const first = findings[0];
  if (!first) return true;
  return `Use sentence case: only the first word and names take a capital (${first.words.join(', ')}).`;
}

interface SpanLike {
  _type?: string;
  text?: unknown;
}
interface BlockLike {
  _type?: string;
  children?: SpanLike[];
}

/** Every voice finding across the spans of a Portable Text value, in reading order. */
export function voiceMessages(blocks: unknown): string[] {
  if (!Array.isArray(blocks)) return [];
  const messages: string[] = [];
  for (const block of blocks as BlockLike[]) {
    if (block?._type !== 'block' || !Array.isArray(block.children)) continue;
    for (const span of block.children) {
      for (const check of [emDashMessage, marksMessage]) {
        const message = check(span?.text);
        if (message !== true) messages.push(message);
      }
    }
  }
  return messages;
}
