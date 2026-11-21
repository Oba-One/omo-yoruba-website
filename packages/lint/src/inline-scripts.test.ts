import { describe, expect, it } from 'vitest';
// @ts-expect-error: a plain .mjs script without type declarations
import { inlineBlocks, zeroDelayTimers } from '../../../scripts/check-inline-scripts.mjs';

describe('the inline script budget (scripts/check-inline-scripts.mjs)', () => {
  it('reads the body of each is:inline block, and only those', () => {
    const source = [
      '---',
      'const a = 1;',
      '---',
      '<script>bundled();</script>',
      '<script is:inline>',
      '  one();',
      '  two();',
      '</script>',
      '<script type="module" is:inline data-x>three();</script>',
    ].join('\n');
    const blocks = inlineBlocks(source);
    expect(blocks.map((block: { lines: number }) => block.lines)).toEqual([2, 1]);
    expect(blocks[0].body).toContain('two();');
  });

  it('finds timers with a zero or missing delay, and leaves real delays alone', () => {
    const source = [
      'setTimeout(run, 0);',
      'window.setTimeout(() => sync(a, b), 0);',
      'setInterval(tick);',
      'setTimeout(fail, timeout);',
      'window.setInterval(mountFrame, 200);',
      'setTimeout(() => { go(1, 2); }, 10);',
    ].join('\n');
    expect(zeroDelayTimers(source)).toEqual([1, 2, 3]);
  });
});
