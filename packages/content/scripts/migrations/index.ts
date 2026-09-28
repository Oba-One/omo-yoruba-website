import { albumLinkMigration } from './album-link';
import type { Migration } from './core';
import { inlineListsMigration } from './inline-lists';
import { retiredFieldsMigration } from './retired-fields';
import { teacherGroupMigration } from './teacher-group';

/** Every migration the runner knows, by name (`bun run migrate -- list`). */
export const MIGRATIONS: readonly Migration[] = [
  albumLinkMigration,
  inlineListsMigration,
  retiredFieldsMigration,
  teacherGroupMigration,
];

export const migrationNamed = (name: string) =>
  MIGRATIONS.find((migration) => migration.name === name);
