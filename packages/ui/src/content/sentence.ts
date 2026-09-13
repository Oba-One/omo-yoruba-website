/**
 * Sentence punctuation that survives Sanity's stega. In draft mode a string carries an invisible tail
 * of zero-width characters (U+200B, U+200C, U+200D, U+FEFF) that powers click-to-edit, so a check on
 * the string's last character would read the tail, not the text: these helpers read the visible text
 * and keep the tail after it.
 */
const STEGA_TAIL = /[​-‍﻿]+$/;

/** The visible text and its invisible tail, apart. */
function splitTail(text: string): [visible: string, tail: string] {
  const tail = STEGA_TAIL.exec(text)?.[0] ?? '';
  return [text.slice(0, text.length - tail.length), tail];
}

/** The text as a sentence: a period added unless it already ends with one, or with ? or !. */
export function sentence(text: string): string {
  const [visible, tail] = splitTail(text);
  const words = visible.trimEnd();
  return /[.!?]$/.test(words) ? text : `${words}.${tail}`;
}

/** The text without its closing periods, commas or semicolons, so list items join into one sentence. */
export function withoutClosingPunctuation(text: string): string {
  const [visible, tail] = splitTail(text);
  return `${visible.trimEnd().replace(/[.,;]+$/, '')}${tail}`;
}
