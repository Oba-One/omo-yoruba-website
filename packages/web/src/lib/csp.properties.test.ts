import { URL } from 'node:url';
import { ZEFFY_ORIGIN } from '@oy/ui/forms/ZeffyDialog/zeffy.ts';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { framableSrc } from './csp';

// Properties of the frame guard (ADR 0045, ADR 0050): whatever a Studio field holds, a Give, Join or Tickets
// dialog frames Zeffy over https or nothing. Judged by the WHATWG parser browsers share (node:url's URL).

const PIECES = [
  'https://www.zeffy.com',
  'https://www.zeffy.com.evil.example',
  'https://evil.example',
  'https:www.zeffy.com',
  'HTTPS://WWW.ZEFFY.COM',
  'http://www.zeffy.com',
  'javascript:',
  'data:text/html,',
  '//www.zeffy.com',
  '@',
  ':443',
  ':8443',
  '/',
  '\\',
  '\t',
  '\n',
  ' ',
  '/en-US/embed/donation-form/x',
  '?modal=true',
  '#x',
];

/** Strings a Studio URL field could hold, written through the API with no Studio rule to stop them. */
const studioValue = fc.oneof(
  fc.array(fc.constantFrom(...PIECES), { maxLength: 6 }).map((pieces) => pieces.join('')),
  fc.string(),
  fc.webUrl({ withQueryParameters: true, withFragments: true }),
);

/** Any address on Zeffy's origin, with any path, query and fragment. */
const zeffyAddress = fc
  .webPath()
  .chain((path) =>
    fc
      .tuple(fc.webQueryParameters(), fc.webFragments())
      .map(([query, fragment]) => `${ZEFFY_ORIGIN}${path}?${query}#${fragment}`),
  );

describe('framableSrc, as properties', () => {
  it("answers only an https address on Zeffy's origin, already parsed", () => {
    fc.assert(
      fc.property(fc.oneof(studioValue, zeffyAddress), (value) => {
        const src = framableSrc(value);
        if (src === undefined) return true;
        const url = new URL(src);
        return url.protocol === 'https:' && url.origin === ZEFFY_ORIGIN && url.href === src;
      }),
      { numRuns: 2000 },
    );
  });

  it('gives back its own answer unchanged', () => {
    fc.assert(
      fc.property(fc.oneof(studioValue, zeffyAddress), (value) => {
        const src = framableSrc(value);
        return src === undefined || framableSrc(src) === src;
      }),
    );
  });

  it("frames every address on Zeffy's origin", () => {
    fc.assert(
      fc.property(zeffyAddress, (address) => {
        expect(framableSrc(address)).toBe(new URL(address).href);
      }),
    );
  });
});
