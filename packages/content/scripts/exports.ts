import { homedir } from 'node:os';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';

const REPO = resolve(import.meta.dirname, '../../..');

/**
 * Where exports and snapshots go: `OY_EXPORT_DIR`, else `~/omo-yoruba-exports`. Never inside the
 * repo: an export holds every enquiry and subscriber, which must never reach git.
 */
export function exportDirectory(env: Record<string, string | undefined> = process.env): string {
  const directory = resolve(env.OY_EXPORT_DIR ?? join(homedir(), 'omo-yoruba-exports'));
  const inside = relative(REPO, directory);
  const outside = isAbsolute(inside) || inside === '..' || inside.startsWith(`..${sep}`);
  if (!outside) {
    throw new Error(
      `exports go outside the repository, and ${directory} is inside it; set OY_EXPORT_DIR elsewhere.`,
    );
  }
  return directory;
}

/** A timestamp for a file name: `2026-09-26T21-04-05-123Z`. */
export const stamp = (date = new Date()) => date.toISOString().replace(/[:.]/g, '-');

/** NDJSON as documents, one per non-empty line. */
export const readNdjson = <T>(text: string): T[] =>
  text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as T);

export const toNdjson = (values: readonly unknown[]) =>
  `${values.map((value) => JSON.stringify(value)).join('\n')}\n`;
