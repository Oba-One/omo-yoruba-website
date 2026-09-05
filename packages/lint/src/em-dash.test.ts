import { describe, expect, it } from 'vitest';
import { findDashes } from './em-dash';

const EM = '\u2014';
const EN = '\u2013';

describe('findDashes', () => {
  it('flags an em dash anywhere in the text', () => {
    const findings = findDashes(`Ẹ káàbọ̀ ${EM} welcome`);
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ line: 1, column: 10, char: EM });
  });

  it('flags an en dash used as a dash, with a space on either side', () => {
    expect(findDashes(`festival ${EN} June`)).toHaveLength(1);
    expect(findDashes(`festival${EN} June`)).toHaveLength(1);
    expect(findDashes(`festival ${EN}June`)).toHaveLength(1);
  });

  it('leaves an en dash between digits alone', () => {
    expect(findDashes(`1997${EN}2026`)).toHaveLength(0);
  });

  it('leaves hyphens and the glyph set alone', () => {
    expect(findDashes('take-part band • Ẹ ṣé! ✓ → close ×')).toHaveLength(0);
  });

  it('reports one-based line and column for every occurrence', () => {
    const text = `first line\nsecond ${EM} line ${EM}\nthird`;
    const findings = findDashes(text);
    expect(findings.map((f) => [f.line, f.column])).toEqual([
      [2, 8],
      [2, 15],
    ]);
  });

  it('returns nothing for clean text', () => {
    expect(
      findDashes('Ẹ káàbọ̀ sí Ọjà Balógun, Àgbàlá Ọmọde àti Ẹgbẹ́ Ìbílẹ̀. Odún dé! Ẹ ṣeun.'),
    ).toEqual([]);
  });
});
