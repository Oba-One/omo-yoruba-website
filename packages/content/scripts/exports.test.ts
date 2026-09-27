import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { exportDirectory, readNdjson, stamp, toNdjson } from './exports';

// Exports hold enquiries, subscribers and the preview secret: they never land inside the repository.

describe('where exports go', () => {
  const repo = resolve(import.meta.dirname, '../../..');

  it('defaults to a folder in the home directory, or OY_EXPORT_DIR', () => {
    expect(exportDirectory({})).toBe(join(homedir(), 'omo-yoruba-exports'));
    expect(exportDirectory({ OY_EXPORT_DIR: '/tmp/oy' })).toBe('/tmp/oy');
  });

  it('refuses the repository and any folder inside it', () => {
    expect(() => exportDirectory({ OY_EXPORT_DIR: repo })).toThrow('outside the repository');
    expect(() => exportDirectory({ OY_EXPORT_DIR: join(repo, 'packages', 'exports') })).toThrow(
      'outside the repository',
    );
  });

  it('writes and reads NDJSON, and stamps files without colons', () => {
    const lines = toNdjson([{ _id: 'a' }, { _id: 'b' }]);
    expect(lines).toBe('{"_id":"a"}\n{"_id":"b"}\n');
    expect(readNdjson(`${lines}\n`)).toEqual([{ _id: 'a' }, { _id: 'b' }]);
    expect(stamp(new Date('2026-09-26T21:04:05.123Z'))).toBe('2026-09-26T21-04-05-123Z');
  });
});
