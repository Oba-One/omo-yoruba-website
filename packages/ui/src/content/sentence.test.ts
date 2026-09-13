import { describe, expect, it } from 'vitest';
import { sentence, withoutClosingPunctuation } from './sentence';

// The characters Sanity's stega payload is made of, as @vercel/stega 1.1.0 writes them.
const tail = '​‍‌﻿﻿‌';

describe('sentence punctuation', () => {
  it('ends a sentence once, with or without the draft-mode tail', () => {
    expect(sentence('Gate count by volunteers, 2026')).toBe('Gate count by volunteers, 2026.');
    expect(sentence('Gate count by volunteers, 2026.')).toBe('Gate count by volunteers, 2026.');
    expect(sentence('Who is coming?')).toBe('Who is coming?');
    expect(sentence(`Gate count by volunteers, 2026.${tail}`)).toBe(
      `Gate count by volunteers, 2026.${tail}`,
    );
    expect(sentence(`Lifetime award${tail}`)).toBe(`Lifetime award.${tail}`);
  });

  it('drops closing punctuation before the tail and keeps the tail', () => {
    expect(withoutClosingPunctuation('[ Second booth size and fee ].')).toBe(
      '[ Second booth size and fee ]',
    );
    expect(withoutClosingPunctuation(`[ fee ];${tail}`)).toBe(`[ fee ]${tail}`);
    expect(withoutClosingPunctuation('[ fee ]')).toBe('[ fee ]');
  });
});
