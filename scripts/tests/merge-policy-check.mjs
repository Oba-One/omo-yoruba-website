// Checks that .agents/merge-policy.json agrees with what the repository holds:
// - CODEOWNERS lists exactly the critical and sensitive paths, so the two cannot drift;
// - requiredChecks is exactly the jobs CI runs on every pull request;
// - every tier path matches a tracked file, and the files whose tier matters most land in it.
// Run by merge-policy.test.sh in CI's Shell scripts job.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');
const policy = JSON.parse(read('.agents/merge-policy.json'));
const problems = [];

const ownerPattern = (glob) =>
  glob.startsWith('**/')
    ? glob.slice(3)
    : glob.endsWith('/**')
      ? `/${glob.slice(0, -2)}`
      : `/${glob}`;
const globRegex = (glob) =>
  new RegExp(
    `^${glob.replace(/\*\*\/|\*\*|\*|\?|[.+^${}()|[\]\\]/g, (token) => {
      if (token === '**/') return '(.*/)?';
      if (token === '**') return '.*';
      if (token === '*') return '[^/]*';
      if (token === '?') return '[^/]';
      return `\\${token}`;
    })}$`,
  );

// CODEOWNERS mirrors the gated tiers. A leading **/ maps to a bare name, which GitHub matches at any
// depth only when it holds no slash, so **/a/b would map wrongly; such globs are refused.
for (const glob of ['critical', 'sensitive'].flatMap((tier) => policy.tiers[tier].paths)) {
  if (/^\*\*\/.*\//.test(glob))
    problems.push(`tier path ${glob}: a **/ glob may name only a file, not a path`);
}
const gated = ['critical', 'sensitive'].flatMap((tier) => policy.tiers[tier].paths);
const owners = read('.github/CODEOWNERS')
  .split('\n')
  .filter((line) => line.trim() && !line.startsWith('#'))
  .map((line) => line.trim().split(/\s+/));
const ownerPatterns = new Set(owners.map(([pattern]) => pattern));
for (const glob of gated) {
  if (!ownerPatterns.has(ownerPattern(glob))) problems.push(`CODEOWNERS has no line for ${glob}`);
}
const expected = new Set(gated.map(ownerPattern));
for (const [pattern, ...who] of owners) {
  if (!expected.has(pattern)) problems.push(`CODEOWNERS line ${pattern} is in no gated tier`);
  if (!who.length || who.some((owner) => !owner.startsWith('@')))
    problems.push(`CODEOWNERS line ${pattern} names no owner`);
}

// requiredChecks is every job CI runs on a pull request.
const jobNames = [];
for (const line of read('.github/workflows/ci.yml').matchAll(/^ {2}[\w-]+:\n {4}name: (.+)$/gm)) {
  jobNames.push(line[1].trim());
}
const doctor = read('.github/workflows/agents-doctor.yml');
if (
  /^ {2}agents-doctor:$/m.test(doctor) &&
  /uses: greenpill-dev-guild\/\.github\/\.github\/workflows\/agents-doctor\.yml@/.test(doctor)
) {
  jobNames.push('agents-doctor / Agents doctor');
}
const required = new Set(policy.requiredChecks);
for (const name of jobNames)
  if (!required.has(name)) problems.push(`CI job "${name}" is not in requiredChecks`);
for (const name of required)
  if (!jobNames.includes(name))
    problems.push(`requiredChecks names "${name}", which no workflow runs`);

// Tier paths match tracked files, and the riskiest files land in the critical tier.
const files = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);
const tierOf = (file) =>
  ['critical', 'sensitive', 'routine'].find((tier) =>
    policy.tiers[tier].paths.some((glob) => globRegex(glob).test(file)),
  );
for (const glob of gated) {
  if (!files.some((file) => globRegex(glob).test(file)))
    problems.push(`tier path ${glob} matches no tracked file`);
}
const mustBeCritical = [
  'packages/web/package.json',
  'package.json',
  'bun.lock',
  'packages/web/vercel.json',
  'packages/web/src/actions/index.ts',
  'packages/content/src/studio/enquiry-actions.tsx',
  'packages/content/sanity.config.ts',
  'scripts/setup-wizard.sh',
  'scripts/check-dataset-private.mjs',
  'scripts/tests/git-guard.test.sh',
  '.claude/hooks/block-dangerous-git.sh',
  '.codex/hooks.json',
  '.github/workflows/ci.yml',
  'packages/web/src/components/FormBridge.astro',
  'packages/web/src/components/ZeffyEmbed.astro',
  'packages/content/scripts/export.ts',
  'packages/content/scripts/dataset.ts',
  'packages/content/src/studio/roles.ts',
  'packages/content/src/schema/documents/enquiry.ts',
  'packages/ui/src/forms/EnquiryModal/EnquiryModal.astro',
  '.github/dependabot.yml',
  'packages/web/src/layouts/SiteLayout.astro',
  'packages/web/src/components/ZeffyFrame.astro',
  'packages/web/src/lib/cache.ts',
  'packages/content/src/studio/document-options.ts',
  'packages/content/src/studio/structure.ts',
];
for (const file of mustBeCritical) {
  if (!files.includes(file))
    problems.push(`${file} is pinned as critical but is not tracked; update the pin`);
  else if (tierOf(file) !== 'critical') problems.push(`${file} is ${tierOf(file)}, not critical`);
}

for (const problem of problems) console.log(`FAIL ${problem}`);
if (problems.length) process.exit(1);
console.log(
  `merge policy agrees with CODEOWNERS (${gated.length} paths), CI (${jobNames.length} jobs) and the tree`,
);
