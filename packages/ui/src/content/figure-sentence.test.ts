import { describe, expect, it } from 'vitest';
import { figureSentence } from './figure-sentence';

// Test values only: no edition in the development dataset holds an attendance figure.
describe('figureSentence', () => {
  it('writes the value and the label, then the source, each as a sentence', () => {
    expect(
      figureSentence({ value: '[ 0 ]', label: 'people came', source: '[ How it was counted ]' }),
    ).toBe('[ 0 ] people came. [ How it was counted ].');
    expect(figureSentence({ value: '[ 0 ]', label: 'people came.', source: null })).toBe(
      '[ 0 ] people came.',
    );
  });

  it('answers undefined while the value or the label is missing', () => {
    expect(figureSentence({ value: '[ 0 ]', label: ' ' })).toBeUndefined();
    expect(figureSentence({ label: 'people came' })).toBeUndefined();
    expect(figureSentence(null)).toBeUndefined();
  });
});
