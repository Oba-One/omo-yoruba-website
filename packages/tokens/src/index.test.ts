import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The port is plain CSS, so these tests guard the facts a browser would only reveal at runtime:
// the layer order that lets oy-components.css win, the files each @import and url() points at,
// and the decisions the interaction layer made over the design system (docs/design/README.md
// section 3).

const src = new URL('./', import.meta.url);
const read = (file: string) => readFileSync(new URL(file, src), 'utf8');
const quotedAfter = (pattern: string) => new RegExp(`${pattern}\\(?["']([^"']+)["']\\)?`, 'g');

const index = read('index.css');
const imports = [...index.matchAll(quotedAfter('@import\\s*'))].map((m) => m[1] ?? '');

describe('@oy/tokens index.css', () => {
  it('loads the layers in order: fonts, tokens, base, components, interaction layer', () => {
    expect(imports).toEqual([
      './fonts.css',
      './tokens/colors.css',
      './tokens/typography.css',
      './tokens/spacing.css',
      './tokens/patterns.css',
      './tokens/themes.css',
      './base.css',
      './components.css',
      './oy-components.css',
    ]);
  });

  it('imports only files that exist', () => {
    for (const file of imports) expect(existsSync(new URL(file, src)), file).toBe(true);
  });
});

describe('pattern tokens', () => {
  const patterns = read('tokens/patterns.css');
  const urls = [...patterns.matchAll(quotedAfter('url'))].map((m) => m[1] ?? '');

  it('exposes the five handoff SVGs as url tokens that resolve inside the package', () => {
    expect(urls).toHaveLength(5);
    for (const url of urls) {
      expect(url.startsWith('../patterns/'), url).toBe(true);
      expect(existsSync(new URL(url, new URL('tokens/', src))), url).toBe(true);
    }
  });

  it('keeps the interaction layer free of paths into the design handoff', () => {
    const layer = read('oy-components.css');
    expect(layer).not.toMatch(/images\/patterns/);
    expect(layer).not.toMatch(/docs\/design\/design\/images/);
    expect(layer).toMatch(/var\(--pattern-batik-wash\)/);
    expect(layer).toMatch(/var\(--pattern-motif-band\)/);
  });
});

describe('the interaction layer wins on conflict', () => {
  it('cards are 6px, media 4px', () => {
    const spacing = read('tokens/spacing.css');
    expect(spacing).toMatch(/--radius-card:\s*6px/);
    expect(spacing).toMatch(/--radius-media:\s*4px/);
    expect(spacing).not.toMatch(/--radius-card:\s*14px/);
  });

  it('no hover lift survives after the interaction layer loads', () => {
    const layer = read('oy-components.css');
    expect(layer).toMatch(/\.oy-btn:hover\s*\{\s*transform:\s*none/);
    expect(layer).toMatch(
      /\.oy-card:hover,\s*\.oy-path:hover\s*\{\s*transform:\s*none;\s*box-shadow:\s*none/,
    );
  });

  it('leaves the retired and canvas-only selectors out', () => {
    const layer = read('oy-components.css').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const selector of ['.oy-amount', '.oy-freq', '.oy-step', '.cx-cardlab', '.sc-host']) {
      expect(layer, selector).not.toContain(selector);
    }
  });
});
