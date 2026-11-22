import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  addedLines,
  isPackageSource,
  judge,
  markdownProblem,
  regrownComments,
} from '../check-regrowth.mjs';

function fixtureGitEnvironment(environment = process.env) {
  const inherited = Object.entries(environment).filter(
    ([variable]) => !variable.startsWith('GIT_'),
  );
  return {
    ...Object.fromEntries(inherited),
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_SYSTEM: '/dev/null',
    GIT_AUTHOR_NAME: 'Fixture',
    GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Fixture',
    GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
  };
}

test('a handoff under docs/plans fails, and an ADR or a research note passes (plan item 17)', () => {
  assert.ok(markdownProblem('docs/plans/handoff-x.md'));
  assert.ok(markdownProblem('docs/plans/roadmap.md'));
  for (const file of [
    'docs/adr/0058-a-new-decision.md',
    'docs/research/biome-astro-support.md',
    'docs/research/audit-of-zeffy-embeds.md',
    'docs/runbook.md',
    'docs/content-ops.md',
    'packages/ui/README.md',
    'docs/tickets/review/issues/166-a-new-finding.md',
    'docs/tickets/wayfinder/issues/25-a-decision.md',
    'docs/tickets/review/README.md',
    '.claude/skills/review/SKILL.md',
    '.claude/skills/review/report-template.md',
    'scripts/check.mjs',
  ]) {
    assert.equal(markdownProblem(file), null, file);
  }
  for (const file of [
    'docs/session-handoff.md',
    'packages/web/AUDIT_REPORT.md',
    'docs/notes-2026-11-21.md',
    'SUMMARY.md',
    'docs/tickets/phase-9/issues/01-x.md',
    'docs/tickets/phase-9/spec.md',
  ]) {
    assert.ok(markdownProblem(file), file);
  }
});

test('package source excludes tests, stories, mocks, declarations and generated files', () => {
  assert.ok(isPackageSource('packages/web/src/lib/forms/handlers.ts'));
  assert.ok(isPackageSource('packages/content/src/pending.ts'));
  assert.ok(isPackageSource('packages/content/scripts/seed.ts'));
  assert.ok(isPackageSource('packages/content/functions/enquiry-notify/index.ts'));
  for (const file of [
    'packages/ui/src/core/ActionButton/action.test.ts',
    'packages/ui/src/core/ActionButton/ActionButton.stories.ts',
    'packages/content/src/sanity.types.ts',
    'packages/web/src/env.d.ts',
    'packages/content/scripts/seed.test.ts',
    'scripts/check-regrowth.mjs',
  ]) {
    assert.ok(!isPackageSource(file), file);
  }
});

test("added lines come from each hunk's new-file range", () => {
  const diff = '@@ -3,0 +4,2 @@\n+a\n+b\n@@ -10 +12 @@\n-x\n+y\n@@ -20,3 +23,0 @@\n-p\n';
  assert.deepEqual([...addedLines(diff)], [4, 5, 12]);
});

test('only purge-shaped comments on added lines count, and a comment whose place carries meaning stays', () => {
  const code = [
    '// ===== Setup =====',
    'const a = 1;',
    '// Submit batch transaction',
    'const b = 2; // explains b',
    '// Safari drops the event when the tab is hidden, so poll instead.',
    'const c = gql(/* GraphQL */ `query Q { a }`);',
  ].join('\n');
  const all = regrownComments(code, 'packages/shared/src/x.ts', 'all').map(
    (comment) => comment.line,
  );
  assert.deepEqual(all, [1, 3]);
  assert.deepEqual(
    regrownComments(code, 'packages/shared/src/x.ts', new Set([3, 4, 5, 6])).map(
      (comment) => comment.line,
    ),
    [3],
  );
});

test('the check judges a change against its merge base, uncommitted and untracked work included', (t) => {
  const root = mkdtempSync(path.join(tmpdir(), 'regrowth-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const env = fixtureGitEnvironment();
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { env, encoding: 'utf8' });
  const write = (file, text) => {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), text);
  };
  git('init', '-q', '-b', 'develop');
  write('packages/shared/src/old.ts', '// ===== Old banner =====\nexport const a = 1;\n');
  write('packages/indexer/legacy-notes.md', 'old\n');
  git('add', '.');
  git('commit', '-q', '-m', 'base');
  const base = git('rev-parse', 'HEAD').trim();

  assert.deepEqual(judge(root, base).problems, []);

  write(
    'packages/shared/src/old.ts',
    '// ===== Old banner =====\nexport const a = 1;\n// Submit batch transaction\nconst b = 2;\nexport { b };\n',
  );
  write('packages/shared/src/new.ts', '// ----- Section -----\nexport const c = 3;\n');
  write('packages/shared/REVIEW_FINDINGS.md', 'findings\n');
  write('packages/indexer/legacy-notes.md', 'edited, not added\n');
  const { problems } = judge(root, base);
  assert.equal(problems.length, 3, problems.join('\n'));

  // A move and a re-indent add no comment: the moved file is judged against its source, and
  // whitespace is ignored.
  git('add', '.');
  git('commit', '-q', '-m', 'change');
  const changed = git('rev-parse', 'HEAD').trim();
  git('mv', 'packages/shared/src/old.ts', 'packages/shared/src/moved.ts');
  write(
    'packages/shared/src/moved.ts',
    'if (true) {\n  // ===== Old banner =====\n}\nexport const a = 1;\n// Submit batch transaction\nconst b = 2;\nexport { b };\n',
  );
  assert.deepEqual(judge(root, changed).problems, []);

  // Moving markdown into a place it may not be is an addition there; moving it within one is not.
  git('mv', 'packages/indexer/legacy-notes.md', 'packages/indexer/kept-notes.md');
  assert.deepEqual(judge(root, changed).problems, []);
  write('docs/research/findings.md', 'research\n');
  git('add', '.');
  git('commit', '-q', '-m', 'research note');
  const planned = git('rev-parse', 'HEAD').trim();
  git('mv', 'docs/research/findings.md', 'packages/shared/findings.md');
  assert.equal(judge(root, planned).problems.length, 1);
  assert.ok(
    problems.some((problem) =>
      problem.startsWith('packages/shared/src/old.ts:3: new label comment'),
    ),
  );
  assert.ok(
    problems.some((problem) =>
      problem.startsWith('packages/shared/src/new.ts:1: new banner comment'),
    ),
  );
  assert.ok(
    problems.some((problem) =>
      problem.startsWith('packages/shared/REVIEW_FINDINGS.md: reads as a report'),
    ),
  );
});

test('re-indenting old comments, as wrapping code in a function does, adds none', (t) => {
  const root = mkdtempSync(path.join(tmpdir(), 'regrowth-indent-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const env = fixtureGitEnvironment();
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { env, encoding: 'utf8' });
  const file = path.join(root, 'packages/shared/src/flow.ts');
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(
    file,
    'const a = 1;\n// Submit batch transaction\nconst b = a + 1;\nconsole.log(b);\n',
  );
  git('init', '-q', '-b', 'develop');
  git('add', '.');
  git('commit', '-q', '-m', 'base');
  const base = git('rev-parse', 'HEAD').trim();
  writeFileSync(
    file,
    'function run() {\n  const a = 1;\n  // Submit batch transaction\n  const b = a + 1;\n  return b;\n}\nrun();\n',
  );
  assert.deepEqual(judge(root, base).problems, []);
  writeFileSync(
    file,
    'function run() {\n  const a = 1;\n  // Submit batch transaction\n  const b = a + 1;\n  // Return the result\n  return b;\n}\nrun();\n',
  );
  assert.equal(judge(root, base).problems.length, 1);
});
