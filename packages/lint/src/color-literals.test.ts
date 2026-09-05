import { describe, expect, it } from 'vitest';
import { findColorLiterals } from './color-literals';

describe('findColorLiterals', () => {
  it('flags hex literals of every length', () => {
    const findings = findColorLiterals(
      'a { color: #E8A13A; background: #fff; border-color: #22222A80 }',
    );
    expect(findings.map((f) => f.literal)).toEqual(['#E8A13A', '#fff', '#22222A80']);
  });

  it('flags colour functions built from numbers, including the modern spaces', () => {
    const text =
      'rgb(20, 29, 64) rgba(255,255,255,.18) hsl(230 50% 20%) hsla(0,0%,0%,.5) oklch(62% 0.2 40) color(display-p3 1 0 0)';
    expect(findColorLiterals(text)).toHaveLength(6);
  });

  it('accepts colour functions built from tokens', () => {
    expect(findColorLiterals('rgb(var(--gold-500) / 50%)')).toEqual([]);
    expect(findColorLiterals('rgb(from var(--indigo-700) r g b / 0.5)')).toEqual([]);
    expect(findColorLiterals('color-mix(in srgb, currentColor 10%, transparent)')).toEqual([]);
  });

  it('flags a named colour used as a whole declaration value', () => {
    expect(findColorLiterals('p { color: white; }').map((f) => f.literal)).toEqual(['white']);
    expect(findColorLiterals('color: var(--white);')).toEqual([]);
  });

  it('accepts token references, fragments, selectors and markdown headings', () => {
    const text = [
      'color: var(--gold-500);',
      '<a href="#give">Give</a> <a href="#add">Add</a> <a href={"#dad"}>Dad</a> <a href="/give/#dad">Deep</a>',
      'See [Add](#add) and [Face](#face).',
      '# Heading',
      'fill="url(#fade)"',
      '#accede { color: var(--x) } #face:hover { } #bad > .x { }',
    ].join('\n');
    expect(findColorLiterals(text)).toEqual([]);
  });

  it('flags a hex literal inside a TypeScript string', () => {
    expect(findColorLiterals("const gold = '#E8A13A';")).toHaveLength(1);
  });

  it('reports one-based line and column', () => {
    const findings = findColorLiterals('x\ny { color: #fff }');
    expect(findings[0]).toMatchObject({ line: 2, column: 12 });
  });
});
