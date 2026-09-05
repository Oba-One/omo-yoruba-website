import { describe, expect, it } from 'vitest';
import { globToRegExp, isExcluded, parseLintIgnore } from './files';

describe('globToRegExp', () => {
  it('matches directories, single-level wildcards and any-depth patterns like gitignore', () => {
    expect(globToRegExp('docs/design/design/').test('docs/design/design/08 Build Brief.md')).toBe(
      true,
    );
    expect(globToRegExp('docs/design/design/').test('docs/design/README.md')).toBe(false);
    expect(globToRegExp('docs/design/*.md').test('docs/design/README.md')).toBe(true);
    expect(globToRegExp('docs/design/*.md').test('docs/design/design/08 Build Brief.md')).toBe(
      false,
    );
    expect(globToRegExp('**/sanity.types.ts').test('packages/content/sanity.types.ts')).toBe(true);
    expect(globToRegExp('bun.lock').test('bun.lock')).toBe(true);
    expect(globToRegExp('bun.lock').test('apps/web/bun.lock')).toBe(true);
    expect(globToRegExp('bun.lock').test('bun.lockb')).toBe(false);
  });
});

describe('parseLintIgnore', () => {
  it('reads globs, skips comments and blank lines, and scopes prefixed lines to one check', () => {
    const rules = parseLintIgnore('# comment\n\nfoo/\n[yoruba] bar/*.md\n');
    expect(rules).toHaveLength(2);
    expect(rules[0]?.check).toBeUndefined();
    expect(rules[1]?.check).toBe('yoruba');
    expect(rules[1]?.pattern.test('bar/x.md')).toBe(true);
  });
});

describe('isExcluded with the repo .lintignore', () => {
  it('excludes the vendored prototypes, dependencies and build output for every check', () => {
    for (const check of ['dash', 'yoruba', 'colors'] as const) {
      expect(isExcluded('docs/design/design/08 Build Brief.md', check)).toBe(true);
      expect(isExcluded('node_modules/astro/index.js', check)).toBe(true);
      expect(isExcluded('apps/web/dist/index.html', check)).toBe(true);
      expect(isExcluded('apps/web/.astro/types.d.ts', check)).toBe(true);
      expect(isExcluded('.claude/skills/git-guardrails-claude-code/SKILL.md', check)).toBe(true);
      expect(isExcluded('packages/content/sanity.types.ts', check)).toBe(true);
    }
  });

  it('keeps the handoff companion docs in the em dash check but out of the diacritics check', () => {
    expect(isExcluded('docs/design/README.md', 'dash')).toBe(false);
    expect(isExcluded('docs/design/COMPONENT-MAP.md', 'yoruba')).toBe(true);
  });

  it('excludes binary and lock files', () => {
    expect(isExcluded('docs/design/design/images/logo-mark.png', 'dash')).toBe(true);
    expect(isExcluded('packages/tokens/src/fonts/SourceSerif4.woff2', 'dash')).toBe(true);
    expect(isExcluded('bun.lock', 'dash')).toBe(true);
  });

  it('exempts only the word list and the lint package fixtures from the diacritics check', () => {
    expect(isExcluded('packages/lint/yoruba-terms.json', 'yoruba')).toBe(true);
    expect(isExcluded('packages/lint/src/yoruba.test.ts', 'yoruba')).toBe(true);
    expect(isExcluded('packages/lint/src/yoruba.test.ts', 'dash')).toBe(false);
    expect(isExcluded('apps/web/src/lib/csp.test.ts', 'yoruba')).toBe(false);
  });

  it('limits the colour check to ui and web and exempts tokens', () => {
    expect(isExcluded('packages/tokens/src/colors.css', 'colors')).toBe(true);
    expect(isExcluded('packages/ui/src/core/Button/Button.astro', 'colors')).toBe(false);
    expect(isExcluded('apps/web/src/pages/index.astro', 'colors')).toBe(false);
    expect(isExcluded('docs/adr/0001-server-output.md', 'colors')).toBe(true);
  });

  it('keeps prose, stories, workflows and skills in scope for voice checks', () => {
    expect(isExcluded('CLAUDE.md', 'dash')).toBe(false);
    expect(isExcluded('packages/ui/src/core/Kicker/Kicker.stories.ts', 'yoruba')).toBe(false);
    expect(isExcluded('.github/workflows/ci.yml', 'dash')).toBe(false);
    expect(isExcluded('.claude/skills/oy-voice/SKILL.md', 'yoruba')).toBe(false);
    expect(isExcluded('../outside.md', 'dash')).toBe(true);
  });
});
