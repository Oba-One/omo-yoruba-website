import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

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

const groqImport = 'import groq from \'groq\';\nexport const query = groq`*[_type == "x"]`;\n';
const clientImport =
  "import { createClient } from '@sanity/client';\nexport const client = createClient({});\n";
const stegaImport =
  "import { createClient } from '@sanity/client/stega';\nexport const c = createClient({});\n";
const virtualImport =
  "import { sanityClient } from 'sanity:client';\nexport const c = sanityClient;\n";
const typeOnlyImport =
  "import type { ClientReturn } from '@sanity/client';\nexport type R = ClientReturn<string>;\n";

const probes = [
  ['packages/ui/src/core/probe.ts', groqImport, true],
  ['packages/web/src/pages/stega.ts', stegaImport, true],
  ['packages/web/src/pages/virtual.ts', virtualImport, true],
  ['packages/ui/src/core/types.ts', typeOnlyImport, true],
  ['packages/web/src/lib/sanity/view.ts', stegaImport, false],
  ['packages/web/src/pages/api/preview/enable.ts', clientImport, false],
  ['packages/web/src/pages/probe.ts', clientImport, true],
  ['packages/web/src/lib/sanity/probe.ts', clientImport, false],
  ['packages/web/src/lib/forms/site-deps.ts', clientImport, false],
  ['packages/content/src/probe.ts', groqImport, false],
] as const;

type Diagnostic = { category: string; message: string; location: { path: string } };
let diagnostics: Diagnostic[];

beforeAll(() => {
  for (const [file, source] of probes) {
    mkdirSync(path.dirname(path.join(work, file)), { recursive: true });
    writeFileSync(path.join(work, file), source);
  }
  // One startup for all probes keeps process overhead out of each test's five-second budget.
  const result = spawnSync(
    path.join(root, 'node_modules/.bin/biome'),
    ['lint', '--reporter=json', ...probes.map(([file]) => file)],
    { cwd: work, encoding: 'utf8', timeout: 5_000 },
  );
  expect(result.error).toBeUndefined();
  expect(result.status, result.stderr).toBe(1);
  const report = JSON.parse(result.stdout);
  expect(report.summary.unchanged).toBe(probes.length);
  expect(report.summary.skipped).toBe(0);
  expect(report.summary.diagnosticsNotPrinted).toBe(0);
  diagnostics = report.diagnostics;
});

describe('package boundaries', () => {
  it.each(probes)('%s', (file, source, restricted) => {
    const findings = diagnostics.filter((diagnostic) => diagnostic.location.path === file);
    if (restricted) {
      expect(findings).toHaveLength(1);
      expect(findings[0]?.category).toBe('lint/style/noRestrictedImports');
      if (source === groqImport) expect(findings[0]?.message).toContain('@oy/content');
    } else {
      expect(findings).toEqual([]);
    }
  });
});
