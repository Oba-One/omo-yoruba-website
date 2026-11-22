#!/usr/bin/env node
// Budgets the inline JavaScript in .astro components, which neither astro check nor Biome reads
// (ADR 0018). Three kinds of finding, counted per file against a shrink-only baseline
// (scripts/data/inline-scripts-baseline.json, read by scripts/baseline.mjs, the agent kit's tool):
//
// - inline-script-line: one per line of each script Astro leaves inline (is:inline, define:vars,
//   any attribute but type="module"), so a block may shrink but never grow, and a shrink must be
//   locked into the baseline in the same change;
// - zero-delay-timer: setTimeout or setInterval with a delay of 0, or with none, in any package
//   source file, so no new one is copied in;
// - ts:<code>: an error TypeScript reports when it checks each inline body as JavaScript
//   (checkJs, with the DOM types).
//
//   node scripts/check-inline-scripts.mjs           check against the baseline (bun run check)
//   node scripts/check-inline-scripts.mjs --json    print the findings
//   node scripts/check-inline-scripts.mjs --shrink  lower the baseline after a block shrinks
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE = 'scripts/data/inline-scripts-baseline.json';

/**
 * The bodies of the <script> blocks Astro leaves unprocessed in an .astro source, with the line each
 * starts on. Astro bundles and type-checks a script with no attributes or only type="module"; any
 * other attribute (is:inline, define:vars, data-*) leaves it inline. External (src) and non-JavaScript
 * (JSON-LD and the like) scripts have no body to budget.
 */
export function inlineBlocks(source) {
  const blocks = [];
  let from = 0;
  for (;;) {
    const open = source.indexOf('<script', from);
    if (open < 0) break;
    // The opening tag ends at the first > outside quotes and braces (define:vars={{ a: 2 > 1 }}).
    let i = open + '<script'.length;
    let quote = '';
    let depth = 0;
    for (; i < source.length; i += 1) {
      const ch = source[i];
      if (quote) {
        if (ch === quote) quote = '';
      } else if (ch === '"' || ch === "'" || ch === '`') quote = ch;
      else if (ch === '{') depth += 1;
      else if (ch === '}') depth -= 1;
      else if (ch === '>' && depth <= 0) break;
    }
    const attributes = source.slice(open + '<script'.length, i).trim();
    const close = source.indexOf('</script>', i);
    if (close < 0) break;
    from = close + '</script>'.length;
    const processed = attributes === '' || /^type=["']module["']$/.test(attributes);
    const external = /(^|\s)src=/.test(attributes);
    const typed = attributes.match(/(?:^|\s)type=["']([^"']+)["']/);
    const javascript =
      !typed || /^(module|text\/javascript|application\/javascript)$/.test(typed[1]);
    if (processed || external || !javascript) continue;
    const startLine = source.slice(0, i + 1).split('\n').length;
    const body = source
      .slice(i + 1, close)
      .replace(/^\n/, '')
      .replace(/\n[ \t]*$/, '');
    blocks.push({ startLine, body, lines: body ? body.split('\n').length : 0 });
  }
  return blocks;
}

/** setTimeout or setInterval calls with a delay of 0 or no delay at all. */
export function zeroDelayTimers(source) {
  const found = [];
  const call = /\bset(?:Timeout|Interval)\s*\(/g;
  for (const match of source.matchAll(call)) {
    let depth = 1;
    let i = match.index + match[0].length;
    let topLevelComma = -1;
    for (; i < source.length && depth > 0; i += 1) {
      const ch = source[i];
      if (ch === '(' || ch === '[' || ch === '{') depth += 1;
      else if (ch === ')' || ch === ']' || ch === '}') depth -= 1;
      else if (ch === ',' && depth === 1 && topLevelComma < 0) topLevelComma = i;
    }
    const args = source.slice(match.index + match[0].length, i - 1);
    const delay =
      topLevelComma < 0
        ? ''
        : source
            .slice(topLevelComma + 1, i - 1)
            .split(',')[0]
            .trim();
    if (args.trim() && (delay === '' || delay === '0')) {
      found.push(source.slice(0, match.index).split('\n').length);
    }
  }
  return found;
}

function trackedSources() {
  return execFileSync('git', ['-C', root, 'ls-files', '--', 'packages'], { encoding: 'utf8' })
    .split('\n')
    .filter(
      (file) =>
        /^packages\/[^/]+\/src\/.+\.(astro|ts|js|mjs)$/.test(file) &&
        !/\.(test|spec|stories)\.[jt]s$/.test(file),
    );
}

/** TypeScript's errors for each inline body, checked as JavaScript with the DOM types. */
function checkJsFindings(blocks) {
  const work = mkdtempSync(path.join(tmpdir(), 'oy-inline-'));
  try {
    const owners = new Map();
    blocks.forEach(({ file, body }, index) => {
      const name = `block-${index}.js`;
      owners.set(name, file);
      writeFileSync(path.join(work, name), `// @ts-check\n${body}\n`);
    });
    const tsc = path.join(root, 'node_modules/.bin/tsc');
    const result = spawnSync(
      tsc,
      [
        '--noEmit',
        '--allowJs',
        '--checkJs',
        '--skipLibCheck',
        '--target',
        'es2022',
        '--lib',
        'es2023,dom,dom.iterable',
        ...owners.keys(),
      ],
      { cwd: work, encoding: 'utf8' },
    );
    if (result.error) throw result.error;
    const findings = [];
    for (const line of `${result.stdout}`.split('\n')) {
      const error = line.match(/^(block-\d+\.js)\(\d+,\d+\): error (TS\d+)/);
      if (error) findings.push({ rule: `ts:${error[2]}`, file: owners.get(error[1]) });
    }
    if (result.status !== 0 && findings.length === 0) {
      throw new Error(`tsc failed without reporting errors:\n${result.stdout}${result.stderr}`);
    }
    return findings;
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

export function collectFindings() {
  const findings = [];
  const blocks = [];
  for (const file of trackedSources()) {
    const source = readFileSync(path.join(root, file), 'utf8');
    for (const line of zeroDelayTimers(source))
      findings.push({ rule: 'zero-delay-timer', file, line });
    if (!file.endsWith('.astro')) continue;
    for (const block of inlineBlocks(source)) {
      blocks.push({ file, body: block.body });
      for (let i = 0; i < block.lines; i += 1) findings.push({ rule: 'inline-script-line', file });
    }
  }
  return [...findings, ...checkJsFindings(blocks)];
}

function main(argv) {
  const findings = { findings: collectFindings() };
  if (argv.includes('--json')) {
    console.log(JSON.stringify(findings, null, 2));
    return 0;
  }
  const work = mkdtempSync(path.join(tmpdir(), 'oy-inline-findings-'));
  try {
    const file = path.join(work, 'findings.json');
    writeFileSync(file, JSON.stringify(findings));
    const mode = argv.includes('--shrink') ? 'shrink' : argv.includes('--init') ? 'init' : 'check';
    const result = spawnSync(
      process.execPath,
      [path.join(root, 'scripts/baseline.mjs'), mode, BASELINE, file],
      { cwd: root, encoding: 'utf8' },
    );
    process.stdout.write(result.stdout ?? '');
    process.stderr.write(result.stderr ?? '');
    // Shrink-only means a count that went down is locked in by the same change, so the lines it
    // freed cannot be spent again unreviewed.
    if (mode === 'check' && result.status === 0 && /went down/.test(result.stdout ?? '')) {
      console.error(
        'check-inline-scripts: a count went down; run node scripts/check-inline-scripts.mjs --shrink and commit the baseline.',
      );
      return 1;
    }
    return result.status ?? 1;
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
