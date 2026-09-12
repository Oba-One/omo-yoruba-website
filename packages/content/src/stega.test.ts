import { describe, expect, it } from 'vitest';
import { STEGA_LOGIC_KEYS, stegaFilter } from './stega';

type Props = Parameters<typeof stegaFilter>[0];
const call = (sourcePath: (string | number)[], fallback = true) => {
  let asked = false;
  const props = {
    sourcePath,
    resultPath: sourcePath,
    value: 'x',
    sourceDocument: { _id: 'homepage', _type: 'homepage' },
    filterDefault: () => {
      asked = true;
      return fallback;
    },
  } as unknown as Props;
  return { encoded: stegaFilter(props), asked };
};

describe('stegaFilter', () => {
  it('keeps the discriminators and the layout values clean', () => {
    for (const key of [
      'kind',
      'enquiryKind',
      'season',
      'motion',
      'context',
      'phone',
      'generalEmail',
    ]) {
      expect(STEGA_LOGIC_KEYS.has(key)).toBe(true);
    }
    expect(call(['layout', 'season'])).toEqual({ encoded: false, asked: false });
    expect(call(['hero', 'primaryAction', 'kind'])).toEqual({ encoded: false, asked: false });
    expect(call(['events', 0, 'kind'])).toEqual({ encoded: false, asked: false });
  });

  it('defers to the client default for everything else', () => {
    expect(call(['hero', 'title'])).toEqual({ encoded: true, asked: true });
    expect(call(['hero', 'title'], false)).toEqual({ encoded: false, asked: true });
  });
});
