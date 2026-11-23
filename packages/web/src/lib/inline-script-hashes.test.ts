import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { cspDirectives } from './csp';
import { INLINE_SCRIPT_HASHES } from './csp-hashes';
import {
  componentScriptHashes,
  hashesModule,
  inlineScriptBodies,
  scriptHash,
} from './inline-script-hashes';

// ADR 0062: the policy allows inline scripts by the hashes of the components' own source.
const root = fileURLToPath(new URL('../../../../', import.meta.url));

describe('csp-hashes.ts', () => {
  it('matches every <script is:inline> in the components; run `bun run csp:hashes` after changing one', () => {
    const generated = readFileSync(new URL('./csp-hashes.ts', import.meta.url), 'utf8');
    expect(generated).toBe(hashesModule(componentScriptHashes(root)));
  });

  it('puts every hash in script-src, quoted, and nothing that runs any inline script', () => {
    expect(INLINE_SCRIPT_HASHES.length).toBeGreaterThan(0);
    for (const hash of INLINE_SCRIPT_HASHES) {
      expect(cspDirectives['script-src']).toContain(`'${hash}'`);
    }
    expect(cspDirectives['script-src']).not.toContain("'unsafe-inline'");
  });
});

describe('inlineScriptBodies', () => {
  it('takes the body of each inline script exactly, and skips bundled and data scripts', () => {
    const source = [
      '<script is:inline>\n  one();\n</script>',
      '<script>bundled();</script>',
      '<script type="application/ld+json">{}</script>',
      '<script is:inline>two()</script>',
    ].join('\n');
    expect(inlineScriptBodies(source)).toEqual(['\n  one();\n', 'two()']);
  });

  it('skips the frontmatter and comments, keeping a comment marker inside a body', () => {
    const source = [
      '---',
      "const note = '<script is:inline>not this</script>';",
      '---',
      '<!-- <script is:inline>nor this</script> -->',
      '<script is:inline>keep("<!--")</script>',
    ].join('\n');
    expect(inlineScriptBodies(source)).toEqual(['keep("<!--")']);
  });

  it('refuses any other script Astro would ship inline, and leaves a src or a data type alone', () => {
    expect(() => inlineScriptBodies('<script data-x>x()</script>', 'D.astro')).toThrow(/D\.astro/);
    expect(() => inlineScriptBodies('<script type="module">x()</script>', 'M.astro')).toThrow(
      /M\.astro/,
    );
    expect(
      inlineScriptBodies(
        '<script src="/a.js"></script><script type="application/ld+json">{}</script>',
      ),
    ).toEqual([]);
  });

  it('refuses an inline script whose body changes per render', () => {
    expect(() =>
      inlineScriptBodies('<script is:inline define:vars={{ a }}>x()</script>', 'X.astro'),
    ).toThrow(/X\.astro.*define:vars/);
    expect(() => inlineScriptBodies('<script is:inline set:html={code} />', 'Y.astro')).toThrow(
      /Y\.astro/,
    );
  });

  it('hashes as a browser does, SHA-256 of the UTF-8 body in base64', () => {
    // The CSP specification's own example: alert('Hello, world.');
    expect(scriptHash("alert('Hello, world.');")).toBe(
      'sha256-qznLcsROx4GACP2dm0UCKCzCG+HiZ1guq6ZZDob/Tng=',
    );
  });
});
