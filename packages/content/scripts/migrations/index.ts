import type { Migration } from './core';
import { retiredFieldsMigration } from './retired-fields';

/** Every migration the runner knows, by name (`bun run migrate -- list`). */
export const MIGRATIONS: readonly Migration[] = [retiredFieldsMigration];

export const migrationNamed = (name: string) =>
  MIGRATIONS.find((migration) => migration.name === name);
