#!/usr/bin/env bun
// Usage: bun packages/lint/src/cli.ts <dash|yoruba|colors|all> [files...]
//        bun packages/lint/src/cli.ts commit-msg <path-to-message-file>
// Paths are relative to the current directory or absolute; with none, every file git knows
// about is scanned. Exclusions: .lintignore at the repo root plus files.ts. Exit 1 on findings,
// 2 on usage or read errors.
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { findColorLiterals } from './color-literals';
import { checkCommitMessage } from './commit-msg';
import { findDashes } from './em-dash';
import {
  CHECKS,
  type Check,
  isExcluded,
  isMarkdown,
  listRepoFiles,
  normalisePath,
  repoRoot,
} from './files';
import { loadTerms } from './terms';
import { findBareTerms } from './yoruba';

interface CheckSpec {
  label: string;
  messages(text: string, file: string): string[];
}

const terms = loadTerms();

const SPECS: Record<Check, CheckSpec> = {
  dash: {
    label: 'em dash',
    messages: (text) =>
      findDashes(text).map(
        (f) =>
          `${f.line}:${f.column}: U+${f.char.codePointAt(0)?.toString(16).toUpperCase()} dash. Use a comma, period or colon. ${f.snippet}`,
      ),
  },
  yoruba: {
    label: 'Yoruba diacritics',
    messages: (text, file) =>
      findBareTerms(text, terms, { markdown: isMarkdown(file) }).map(
        (f) => `${f.line}:${f.column}: "${f.bare}" needs its marks: ${f.correct}. ${f.snippet}`,
      ),
  },
  colors: {
    label: 'colour literal',
    messages: (text) =>
      findColorLiterals(text).map(
        (f) =>
          `${f.line}:${f.column}: colour literal ${f.literal}. Use a token from @oy/tokens. ${f.snippet}`,
      ),
  },
};

function readText(path: string): string | null {
  const buffer = readFileSync(path);
  return buffer.includes(0) ? null : buffer.toString('utf8');
}

function runChecks(checks: readonly Check[], args: string[]): number {
  const root = repoRoot();
  // Arguments are relative to the current directory; git already lists repo-relative paths.
  const files = args.length > 0 ? args.map((f) => normalisePath(f, root)) : listRepoFiles(root);
  const counts: Record<Check, number> = { dash: 0, yoruba: 0, colors: 0 };
  const scanned: Record<Check, number> = { dash: 0, yoruba: 0, colors: 0 };
  let readErrors = 0;
  for (const file of files) {
    const applicable = checks.filter((check) => !isExcluded(file, check));
    if (applicable.length === 0) continue;
    const absolute = join(root, file);
    let text: string | null;
    try {
      if (statSync(absolute).isDirectory()) continue;
      text = readText(absolute);
    } catch (error) {
      readErrors += 1;
      console.error(`${file}: cannot read (${(error as NodeJS.ErrnoException).code ?? 'error'}).`);
      continue;
    }
    if (text === null) continue; // binary
    for (const check of applicable) {
      scanned[check] += 1;
      for (const message of SPECS[check].messages(text, file)) {
        counts[check] += 1;
        console.log(`${file}:${message}`);
      }
    }
  }
  let total = 0;
  for (const check of checks) {
    total += counts[check];
    console.log(
      `${SPECS[check].label} check: ${counts[check]} finding(s) in ${scanned[check]} file(s).`,
    );
  }
  if (readErrors > 0) return 2;
  return total === 0 ? 0 : 1;
}

function runCommitMessage(path: string | undefined): number {
  if (!path) {
    console.error('commit-msg needs the path to the message file.');
    return 2;
  }
  let message: string;
  try {
    message = readFileSync(path, 'utf8');
  } catch {
    console.error(`commit-msg: cannot read ${path}.`);
    return 2;
  }
  const errors = checkCommitMessage(message);
  for (const error of errors) console.error(error);
  return errors.length === 0 ? 0 : 1;
}

const [command, ...rest] = process.argv.slice(2);
if (command === 'all') {
  process.exitCode = runChecks(CHECKS, rest);
} else if (command === 'dash' || command === 'yoruba' || command === 'colors') {
  process.exitCode = runChecks([command], rest);
} else if (command === 'commit-msg') {
  process.exitCode = runCommitMessage(rest[0]);
} else {
  console.error('Usage: cli.ts <dash|yoruba|colors|all> [files...] | commit-msg <file>');
  process.exitCode = 2;
}
