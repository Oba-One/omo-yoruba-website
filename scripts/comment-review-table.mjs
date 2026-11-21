#!/usr/bin/env node
// The owner's keep-or-drop table for the comment triage (decision 9): every comment the narrow pass
// leaves that carries a security, provenance or constraint mark, as Markdown. It reads the codemod's
// own report, so the rows are what `node scripts/comment-policy.mjs --report triage` lists.
//
//   node scripts/comment-review-table.mjs [path...]    (default: packages scripts)
//
// Marks: security, words about personal data, secrets, sessions, origins, frames, escaping and the
// dataset; provenance, a decision, ticket, owner, document or date the comment cites; constraint,
// the codemod's own kind for a claim the code must stay as it is.
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OWN_FILES =
  /^scripts\/(comment-policy\.mjs|comment-review-table\.mjs|check-regrowth\.mjs|tests\/)/;
const SECURITY =
  /\b(xss|csp|content.security|secret|token|auth|password|personal data|enquir|subscriber|sanitiz|escape|inject|origin|frame|iframe|cookie|session|hmac|signature|verif|privacy|pii|leak|off-site|offsite|https?:|noopener|noreferrer|safeHref|dataset)/i;
const PROVENANCE =
  /\b(ADR|R\d{2,3}\b|ticket|owner|decided|decision|handoff|docs\/|research|issue|wayfinder|phase \d|per the|as of|\d{1,2} (january|february|march|april|may|june|july|august|september|october|november|december))/i;

const paths = process.argv.slice(2);
const report = JSON.parse(
  execFileSync(
    process.execPath,
    [
      path.join(root, 'scripts/comment-policy.mjs'),
      '--report',
      'triage',
      ...(paths.length ? paths : ['packages', 'scripts']),
    ],
    { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  ),
);
const firstText = (text) =>
  text
    .replace(/^\s*(\/\/|\/\*\*?|\*\/?)\s?/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\|/g, '/')
    .slice(0, 140);
const rows = [];
const counts = { security: 0, provenance: 0, constraint: 0 };
for (const comment of report.triage.filter((c) => !OWN_FILES.test(c.file))) {
  const marks = [];
  if (SECURITY.test(comment.text)) marks.push('security');
  if (PROVENANCE.test(comment.text)) marks.push('provenance');
  if (comment.kind === 'constraint') marks.push('constraint');
  if (!marks.length) continue;
  for (const mark of marks) counts[mark] += 1;
  rows.push(
    `| \`${comment.file}:${comment.line}\` | ${comment.kind} | ${marks.join(', ')} | ${firstText(comment.text)} | |`,
  );
}
console.log(
  `${rows.length} rows: ${counts.security} security, ${counts.provenance} provenance, ${counts.constraint} constraint (a row can carry more than one).\n`,
);
console.log('| Where | Kind | Marks | Comment (first 140 characters) | Keep or drop |');
console.log('| --- | --- | --- | --- | --- |');
for (const row of rows) console.log(row);
