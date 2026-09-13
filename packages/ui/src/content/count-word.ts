/**
 * A count as the start of a sentence, the way the section intros write it ("Four ways in."): one to
 * ten in words, anything larger in figures.
 */
const WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
];

export function countWord(count: number): string {
  return Number.isInteger(count) && count >= 0 && count < WORDS.length
    ? (WORDS[count] as string)
    : String(count);
}
