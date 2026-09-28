import { albumLinkMigration } from './album-link';
import type { Migration } from './core';
import { inlineListsMigration } from './inline-lists';
import { oneControlMigration } from './one-control';
import { retiredFieldsMigration } from './retired-fields';
import { scopesMigration } from './scopes';
import { teacherGroupMigration } from './teacher-group';

/** Every migration the runner knows, by name (`bun run migrate -- list`). */
export const MIGRATIONS: readonly Migration[] = [
  albumLinkMigration,
  inlineListsMigration,
  oneControlMigration,
  retiredFieldsMigration,
  scopesMigration,
  teacherGroupMigration,
];

export const migrationNamed = (name: string) =>
  MIGRATIONS.find((migration) => migration.name === name);
