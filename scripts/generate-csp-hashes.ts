// Writes packages/web/src/lib/csp-hashes.ts: the hash of every `<script is:inline>` the site ships, which the
// Content Security Policy allows (ADR 0062). Run after changing a component's inline script; the CSP test fails
// until the file matches the source.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  componentScriptHashes,
  hashesModule,
} from '../packages/web/src/lib/inline-script-hashes.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const entries = componentScriptHashes(root);
writeFileSync(
  new URL('../packages/web/src/lib/csp-hashes.ts', import.meta.url),
  hashesModule(entries),
);
console.log(`csp:hashes: ${entries.length} inline script hashes written`);
