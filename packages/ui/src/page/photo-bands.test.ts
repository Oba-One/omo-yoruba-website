import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { PhotoBand } from '../media/image';
import { HERO_BAND, PHOTO_HEADER_BAND } from './photo-bands';

// The tokens' interaction layer. Read from disk by path: Vitest hands a test an empty string for an
// imported stylesheet, and Vite rewrites `new URL(file, import.meta.url)` to an address that is no
// file's.
const tokens = readFileSync(
  resolve(import.meta.dirname, '../../../tokens/src/oy-components.css'),
  'utf8',
);

const escaped = (selector: string) => selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** What opens the block a position sits in ("@media (max-width: 760px)"), or undefined at the top. */
function enclosing(css: string, index: number): { prelude: string; index: number } | undefined {
  let closed = 0;
  for (let at = index - 1; at >= 0; at -= 1) {
    if (css[at] === '}') closed += 1;
    else if (css[at] === '{' && closed > 0) closed -= 1;
    else if (css[at] === '{') {
      const start = Math.max(css.lastIndexOf('}', at), css.lastIndexOf(';', at)) + 1;
      return { prelude: css.slice(start, at).trim(), index: start };
    }
  }
  return undefined;
}

/**
 * A band's heights as a stylesheet sets them, in the shape `photoBandSizes` takes: the `min-height`
 * of the band's own rule at the top of the stylesheet, and the one its rule inside a `max-width`
 * block gives it. A rule is the band's own when its selector is the band's alone and opens its line,
 * so `.band .part` and `.page .band` are other rules, and a height reaching the band through one of
 * those, or through `height` or its padding, is not seen here. What it does read it reads whole: a
 * height that is not in pixels, a second declaration or rule, or any other kind of block throws.
 */
function bandIn(stylesheet: string, selector: string): PhotoBand {
  const css = stylesheet.replace(/\/\*[\s\S]*?\*\//g, '');
  const rule = new RegExp(`(?:^|[}\\n])[ \\t]*${escaped(selector)}\\s*\\{([^}]*)\\}`, 'g');
  const heights = [...css.matchAll(rule)].flatMap((match) => {
    const values = [...(match[1] ?? '').matchAll(/(?:^|[;\s])min-height:\s*([^;}]+?)\s*(?:;|$)/g)];
    if (values.length === 0) return [];
    const value = values[0]?.[1] ?? '';
    const pixels = /^(\d+)px$/.exec(value)?.[1] ?? (value === '0' ? '0' : undefined);
    if (values.length > 1 || pixels === undefined) {
      throw new Error(`${selector}: expected one min-height in pixels in a rule`);
    }
    const index = match.index + match[0].indexOf(selector);
    return [{ minHeight: Number(pixels), block: enclosing(css, index) }];
  });
  const top = heights.filter(({ block }) => !block);
  const nested = heights.filter(({ block }) => block);
  const [base] = top;
  const [narrow] = nested;
  if (top.length !== 1 || nested.length !== 1 || !base || !narrow?.block) {
    throw new Error(`${selector}: expected one min-height at the top and one in a media block`);
  }
  const maxWidth = /^@media \(max-width: (\d+)px\)$/.exec(narrow.block.prelude)?.[1];
  if (!maxWidth || enclosing(css, narrow.block.index)) {
    throw new Error(`${selector}: its second min-height is not in a max-width block at the top`);
  }
  return {
    minHeight: base.minHeight,
    narrow: { maxWidth: Number(maxWidth), minHeight: narrow.minHeight },
  };
}

describe('the bands a photograph fills', () => {
  it('are as tall here as the tokens make them', () => {
    expect(HERO_BAND).toEqual(bandIn(tokens, '.v2-hero'));
    expect(PHOTO_HEADER_BAND).toEqual(bandIn(tokens, '.oy-phead--photo'));
  });

  it('are read from the rules of the band itself, whole or not at all', () => {
    const sample = `
      .band { position: relative; min-height: 500px; }
      .band .part { min-height: 90px; }
      .flat { min-height: 300px; }
      .tall { min-height: 60vh; }
      .twice { min-height: 10px; }
      .twice { min-height: 20px; }
      .doubled { min-height: 10px; min-height: 20px; }
      .wide { min-height: 10px; }
      .held { min-height: 10px; }
      /* .band { min-height: 1px; } */
      @media (max-width: 700px) {
        .band { min-height: 0; }
        .page .band { min-height: 80px; }
        .tall { min-height: 40vh; }
        .twice { min-height: 5px; }
        .doubled { min-height: 5px; }
      }
      @media (min-width: 900px) {
        .wide { min-height: 20px; }
      }
      .holder {
        .held { min-height: 5px; }
      }
    `;
    expect(bandIn(sample, '.band')).toEqual({
      minHeight: 500,
      narrow: { maxWidth: 700, minHeight: 0 },
    });
    expect(() => bandIn(sample, '.tall')).toThrow(/one min-height in pixels/);
    expect(() => bandIn(sample, '.doubled')).toThrow(/one min-height in pixels/);
    expect(() => bandIn(sample, '.twice')).toThrow(/one min-height at the top/);
    expect(() => bandIn(sample, '.flat')).toThrow(/one in a media block/);
    expect(() => bandIn(sample, '.missing')).toThrow(/one min-height at the top/);
    expect(() => bandIn(sample, '.wide')).toThrow(/not in a max-width block/);
    // A rule nested in another rule sits after a closed media block: that block is not its own.
    expect(() => bandIn(sample, '.held')).toThrow(/not in a max-width block/);
  });
});
