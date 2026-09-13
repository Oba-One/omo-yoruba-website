import { describe, expect, it } from 'vitest';
import { countWord } from './count-word';

describe('countWord', () => {
  it('writes one to ten in words and anything else in figures', () => {
    expect(countWord(1)).toBe('One');
    expect(countWord(4)).toBe('Four');
    expect(countWord(10)).toBe('Ten');
    expect(countWord(12)).toBe('12');
    expect(countWord(2.5)).toBe('2.5');
  });
});
