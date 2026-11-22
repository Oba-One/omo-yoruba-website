import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

// The package boundaries in biome.json (noRestrictedImports): GROQ and the Sanity client belong to
// @oy/content and the web loaders. Each probe is linted in a scratch copy of the repository's
// Biome config, so the real tree is never written.
const root = path.resolve(import.meta.dirname, '../../..');
const work = mkdtempSync(path.join(tmpdir(), 'oy-boundaries-'));
const config = JSON.parse(readFileSync(path.join(root, 'biome.json'), 'utf8'));
delete config.$schema;
config.vcs = { enabled: false };
writeFileSync(path.join(work, 'biome.json'), JSON.stringify(config));

afterAll(() => rmSync(work, { recursive: true, force: true }));

function lint(file: string, source: string) {
  mkdirSync(path.dirname(path.join(work, file)), { recursive: true });
  writeFileSync(path.join(work, file), source);
  const result = spawnSync(path.join(root, 'node_modules/.bin/biome'), ['lint', file], {
    cwd: work,
    encoding: 'utf8',
  });
  return { failed: result.status !== 0, output: `${result.stdout}${result.stderr}` };
}

const groqImport = 'import groq from \'groq\';\nexport const query = groq`*[_type == "x"]`;\n';
const clientImport =
  "import { createClient } from '@sanity/client';\nexport const client = createClient({});\n";

describe('package boundaries', () => {
  it('a GROQ import in packages/ui fails and names the content package', () => {
    const { failed, output } = lint('packages/ui/src/core/probe.ts', groqImport);
    expect(failed).toBe(true);
    expect(output).toContain('noRestrictedImports');
    expect(output).toContain('@oy/content');
  });

  it('subpaths of the client and the sanity:client module are refused outside the loaders', () => {
    const stega =
      "import { createClient } from '@sanity/client/stega';\nexport const c = createClient({});\n";
    const virtual =
      "import { sanityClient } from 'sanity:client';\nexport const c = sanityClient;\n";
    const typeOnly =
      "import type { ClientReturn } from '@sanity/client';\nexport type R = ClientReturn<string>;\n";
    for (const [file, source] of [
      ['packages/web/src/pages/stega.ts', stega],
      ['packages/web/src/pages/virtual.ts', virtual],
      ['packages/ui/src/core/types.ts', typeOnly],
    ] as const) {
      const { failed, output } = lint(file, source);
      expect(failed, file).toBe(true);
      expect(output).toContain('noRestrictedImports');
    }
    expect(lint('packages/web/src/lib/sanity/view.ts', stega).failed).toBe(false);
    expect(lint('packages/web/src/pages/api/preview/enable.ts', clientImport).failed).toBe(false);
  });

  it('the Sanity client is refused in a page but allowed in the web loaders and @oy/content', () => {
    expect(lint('packages/web/src/pages/probe.ts', clientImport).failed).toBe(true);
    expect(lint('packages/web/src/lib/sanity/probe.ts', clientImport).failed).toBe(false);
    expect(lint('packages/web/src/lib/forms/site-deps.ts', clientImport).failed).toBe(false);
    expect(lint('packages/content/src/probe.ts', groqImport).failed).toBe(false);
  });
});
