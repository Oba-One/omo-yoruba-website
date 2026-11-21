#!/usr/bin/env node
// Stops two kinds of text the purge removed from growing back, judged only on what a change adds
// (adapted from Green Goods, scripts/quality/check-regrowth.mjs at d0a6b30a3):
//
// - Comments the comment codemod's narrow pass removes (banners, commented-out code, labels and
//   notes that restate a name) on added lines of package source (`packages/*/src`, tests aside).
//   The codemod (scripts/comment-policy.mjs) decides, so a comment whose place carries its
//   meaning stays allowed.
// - New markdown that reads as a report (an audit, findings, a summary, a handoff, a dated note)
//   outside docs/adr and docs/research, and any new file under the retired docs/plans. A
//   session's report goes in its pull request body. Until the move to Linear, new tickets may
//   still go under docs/tickets/review/issues or docs/tickets/wayfinder/issues.
//
// Existing text is not judged: a file is compared with the merge base, so only its added lines
// and added files count.
//
//   node scripts/check-regrowth.mjs [--base <ref>]
//
// CI names its base in REGROWTH_BASE_REF; when that does not resolve the check fails rather than
// judge nothing.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { purgeSource } from './comment-policy.mjs';

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

function runGit(root, args, { allowFailure = false } = {}) {
  const result = spawnSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  if ((result.error || result.status !== 0) && !allowFailure) {
    throw new Error(
      `git ${args.join(' ')} failed: ${result.error?.message ?? result.stderr.trim()}`,
    );
  }
  return result;
}

function parseBase(argv) {
  if (argv.length === 0) return undefined;
  if (argv[0] === '--base' && argv[1] && argv.length === 2) return argv[1];
  throw new Error(`usage: check-regrowth.mjs [--base <ref>] (got ${argv.join(' ')})`);
}

const resolves = (root, ref) =>
  runGit(root, ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`], { allowFailure: true })
    .status === 0;

const PACKAGE_SOURCE = /^packages\/[^/]+\/src\/.+\.(ts|tsx|js|jsx|mjs|cjs|mts|cts|sol)$/;
const TEST_PATH = /(^|\/)(__tests__|__mocks__|test|tests)\/|\.(test|spec|stories)\.[cm]?[jt]sx?$/;
const GENERATED =
  /\.d\.[cm]?ts$|(^|\/)(generated|vendor|dist)\/|\.generated\.|(^|\/)sanity\.types\.ts$/;

const MARKDOWN = /\.(md|mdx)$/i;
// Where a report may live: decisions and verified facts, and a skill's own templates.
const REPORT_HOMES = ['docs/adr/', 'docs/research/', '.claude/skills/', '.agents/skills/'];
const RETIRED = ['docs/plans/'];
const TICKET_HOMES = ['docs/tickets/review/issues/', 'docs/tickets/wayfinder/issues/'];
const REPORT_NAME =
  /(^|[-_.\s])(report|reports|audit|audits|findings|summary|analysis|handoff|handover|retro|retrospective|postmortem|investigation|status|notes|prompt)([-_.\s]|$)|\d{4}-\d{2}-\d{2}/i;

export function isPackageSource(file) {
  return PACKAGE_SOURCE.test(file) && !TEST_PATH.test(file) && !GENERATED.test(file);
}

/** Why a new markdown file may not be added where it is, or null when it may. */
export function markdownProblem(file) {
  if (!MARKDOWN.test(file)) return null;
  if (RETIRED.some((home) => file.startsWith(home))) {
    return "is under docs/plans, which is retired; a session's report goes in its pull request body";
  }
  if (file.startsWith('docs/tickets/') && !TICKET_HOMES.some((home) => file.startsWith(home))) {
    return 'is a new effort folder under docs/tickets, which is being retired (docs/agents/issue-tracker.md)';
  }
  if (REPORT_HOMES.some((home) => file.startsWith(home))) return null;
  if (TICKET_HOMES.some((home) => file.startsWith(home))) return null;
  if (REPORT_NAME.test(path.posix.basename(file).replace(MARKDOWN, ''))) {
    return "reads as a report; a session's report goes in its pull request body, a decision in docs/adr, a verified fact in docs/research";
  }
  return null;
}

/** Line numbers (1-based, in the new file) that a unified diff with no context adds. */
export function addedLines(diff) {
  const lines = new Set();
  for (const match of diff.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
    const start = Number(match[1]);
    const count = match[2] === undefined ? 1 : Number(match[2]);
    for (let line = start; line < start + count; line += 1) lines.add(line);
  }
  return lines;
}

function lineOf(code, index) {
  return code.slice(0, index).split(/\r\n|[\n\r\u2028\u2029]/).length;
}

/** The comments the narrow purge would remove whose first line the change added. */
export function regrownComments(code, file, added) {
  return purgeSource(code, file)
    .removed.map((comment) => ({
      line: lineOf(code, comment.start),
      kind: comment.kind,
      text: code.slice(comment.start, comment.end),
    }))
    .filter((comment) => added === 'all' || added.has(comment.line));
}

/**
 * Paths the change adds or modifies, committed and uncommitted work and untracked files too, as
 * `{ how, from }`: a rename or copy is judged against the file it came from, so a move adds nothing.
 */
export function changedPaths(root, ref) {
  const entries = new Map();
  const status = runGit(root, ['diff', '--name-status', '-M', '-z', ref])
    .stdout.split('\0')
    .filter(Boolean);
  for (let index = 0; index < status.length; ) {
    const how = status[index][0];
    if (how === 'R' || how === 'C') {
      entries.set(status[index + 2], { how, from: status[index + 1] });
      index += 3;
    } else {
      entries.set(status[index + 1], { how, from: null });
      index += 2;
    }
  }
  const untracked = runGit(root, ['ls-files', '--others', '--exclude-standard', '-z'])
    .stdout.split('\0')
    .filter(Boolean);
  for (const file of untracked) entries.set(file, { how: 'A', from: null });
  return entries;
}

export function judge(root, ref) {
  const problems = [];
  let sourceFiles = 0;
  for (const [file, { how, from }] of changedPaths(root, ref)) {
    if (how === 'D') continue;
    // A move lands markdown somewhere new, unless the file was already where it may not be.
    if (how === 'A' || (from && !markdownProblem(from))) {
      const problem = markdownProblem(file);
      if (problem) problems.push(`${file}: ${problem}.`);
    }
    if (!isPackageSource(file)) continue;
    const absolute = path.join(root, file);
    if (!existsSync(absolute)) continue;
    sourceFiles += 1;
    const code = readFileSync(absolute, 'utf8');
    // Whitespace is ignored, so re-indenting old comments (wrapping code in a block) adds none.
    const paths = from ? [from, file] : [file];
    const added =
      how === 'A'
        ? 'all'
        : addedLines(
            runGit(root, ['diff', '-U0', '-w', '-M', '--no-color', ref, '--', ...paths]).stdout,
          );
    let comments;
    try {
      comments = regrownComments(code, file, added);
    } catch (error) {
      problems.push(`${file}: could not be parsed for comments (${error.message}).`);
      continue;
    }
    for (const comment of comments) {
      const shown = comment.text.split(/\r?\n/)[0].slice(0, 100);
      problems.push(
        `${file}:${comment.line}: new ${comment.kind} comment, which the purge removed: ${shown}`,
      );
    }
  }
  return { problems, sourceFiles };
}

function main(argv = process.argv.slice(2)) {
  const required = parseBase(argv) ?? process.env.REGROWTH_BASE_REF;
  const base = required ?? 'origin/main';
  if (!resolves(repoRoot, base)) {
    console.error(
      `regrowth: the base ${base} is not available, so nothing can be compared with it`,
    );
    return 2;
  }
  const ref =
    runGit(repoRoot, ['merge-base', 'HEAD', base], { allowFailure: true }).stdout.trim() || base;
  const { problems, sourceFiles } = judge(repoRoot, ref);
  for (const problem of problems) console.error(`regrowth: ${problem}`);
  if (problems.length) {
    console.error(
      'regrowth: delete the comment (the code or a name should carry it), and put a report in the pull request body.',
    );
    return 1;
  }
  console.log(
    `regrowth: nothing regrown since ${base} (${sourceFiles} package source file(s) read).`,
  );
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    process.exitCode = main();
  } catch (error) {
    console.error(`regrowth check could not run: ${error.message}`);
    process.exitCode = 2;
  }
}
