import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

export type Check = 'dash' | 'yoruba' | 'colors';
export const CHECKS: readonly Check[] = ['dash', 'yoruba', 'colors'];

export interface IgnoreRule {
  /** undefined applies to every check */
  check?: Check;
  pattern: RegExp;
  source: string;
}

const STRUCTURAL = [
  /(^|\/)node_modules\//,
  /(^|\/)dist\//,
  /(^|\/)\.astro\//,
  /(^|\/)\.vercel\//,
  /(^|\/)storybook-static\//,
  /(^|\/)\.git\//,
];
const BINARY = /\.(png|jpe?g|gif|webp|avif|ico|pdf|zip|woff2?|ttf|otf|eot|mp4|mov|mp3|lockb)$/i;
const COLOR_SCOPE = /^(apps\/web|packages\/ui)\//;

let cachedRoot: string | undefined;

/** The git worktree root, so every rule and listing is repo-relative wherever the CLI runs. */
export function repoRoot(): string {
  if (cachedRoot) return cachedRoot;
  try {
    cachedRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  } catch {
    cachedRoot = process.cwd();
  }
  return cachedRoot;
}

/** Repo-relative POSIX path for a path given relative to the current directory or absolute. */
export function normalisePath(path: string, root: string = repoRoot()): string {
  return relative(root, resolve(process.cwd(), path)).split(sep).join('/');
}

/** gitignore-style glob to a regular expression over repo-relative POSIX paths. */
export function globToRegExp(glob: string): RegExp {
  let g = glob.trim();
  const dirOnly = g.endsWith('/');
  if (dirOnly) g = g.slice(0, -1);
  const anchored = g.includes('/');
  let re = '';
  for (let i = 0; i < g.length; i += 1) {
    const c = g[i] ?? '';
    if (c === '*') {
      if (g[i + 1] === '*') {
        re += '.*';
        i += 1;
        if (g[i + 1] === '/') i += 1;
      } else {
        re += '[^/]*';
      }
    } else if (c === '?') {
      re += '[^/]';
    } else {
      re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`${anchored ? '^' : '(?:^|/)'}${re}(?:/|$)`);
}

/**
 * Parse a .lintignore: one glob per line, `#` comments, and an optional `[dash]`, `[yoruba]`
 * or `[colors]` prefix that limits the line to one check.
 */
export function parseLintIgnore(text: string): IgnoreRule[] {
  const rules: IgnoreRule[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) continue;
    const scoped = /^\[(dash|yoruba|colors)\]\s+(.+)$/.exec(line);
    const glob = scoped?.[2] ?? line;
    rules.push({
      check: scoped?.[1] as Check | undefined,
      pattern: globToRegExp(glob),
      source: line,
    });
  }
  return rules;
}

let cachedRules: IgnoreRule[] | undefined;

export function loadLintIgnore(root: string = repoRoot()): IgnoreRule[] {
  if (cachedRules) return cachedRules;
  const file = join(root, '.lintignore');
  cachedRules = existsSync(file) ? parseLintIgnore(readFileSync(file, 'utf8')) : [];
  return cachedRules;
}

/** `path` is repo-relative and POSIX (see normalisePath). */
export function isExcluded(
  path: string,
  check: Check,
  rules: IgnoreRule[] = loadLintIgnore(),
): boolean {
  const p = path.replace(/^\.\//, '');
  if (p.startsWith('../')) return true; // outside the repo
  if (STRUCTURAL.some((rule) => rule.test(p)) || BINARY.test(p)) return true;
  if (
    rules.some((rule) => (rule.check === undefined || rule.check === check) && rule.pattern.test(p))
  )
    return true;
  if (check === 'colors') return !COLOR_SCOPE.test(p);
  return false;
}

export function isMarkdown(path: string): boolean {
  return /\.(md|mdx)$/i.test(path);
}

/** Every file git knows about plus untracked files that are not ignored, repo-relative. */
export function listRepoFiles(root: string = repoRoot()): string[] {
  const out = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return out.split('\0').filter((f) => f.length > 0);
}
