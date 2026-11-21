import { describe, expect, it } from 'vitest';
// @ts-expect-error: a plain .mjs script without type declarations
import { inlineBlocks, zeroDelayTimers } from '../../../scripts/check-inline-scripts.mjs';

describe('the inline script budget (scripts/check-inline-scripts.mjs)', () => {
  it('reads every script Astro leaves inline, and none it bundles or that holds no JavaScript', () => {
    const source = [
      '---',
      'const a = 1;',
      '---',
      '<script>bundled();</script>',
      '<script type="module">alsoBundled();</script>',
      '<script is:inline>',
      '  one();',
      '  two();',
      '</script>',
      '<script define:vars={{ many: 2 > 1 }} is:inline>three();</script>',
      '<script define:vars={{ limit: 3 }}>',
      '  four();',
      '</script>',
      '<script data-oy>five();</script>',
      '<script src="/x.js"></script>',
      '<script type="application/ld+json">{"a": 1}</script>',
    ].join('\n');
    const blocks = inlineBlocks(source);
    expect(blocks.map((block: { lines: number }) => block.lines)).toEqual([2, 1, 1, 1]);
    expect(blocks[0].body).toContain('two();');
    expect(blocks[1].body).toBe('three();');
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
