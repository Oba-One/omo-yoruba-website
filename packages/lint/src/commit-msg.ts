import { findDashes } from './em-dash';

const TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
];
const SUBJECT = new RegExp(`^(?:${TYPES.join('|')})(?:\\([a-z0-9._/-]+\\))?!?: \\S.*$`);
const AUTOSQUASH = /^(?:fixup|squash|amend)! /;
const SCISSORS = /^# -{8,} >8 -{8,}$/;

/** Conventional subject line, and no em or en dash anywhere in the message. */
export function checkCommitMessage(message: string): string[] {
  const errors: string[] = [];
  const lines: string[] = [];
  for (const line of message.split(/\r?\n/)) {
    if (SCISSORS.test(line)) break; // git commit --verbose appends the diff below this line
    if (!line.startsWith('#')) lines.push(line);
  }
  const subject = (lines.find((line) => line.trim() !== '') ?? '').replace(AUTOSQUASH, '');
  const isMerge = /^Merge /.test(subject);
  const isRevert = /^Revert "/.test(subject);
  if (!isMerge && !isRevert && !SUBJECT.test(subject)) {
    errors.push(
      `Subject "${subject}" is not conventional. Use type(scope): summary, with type one of ${TYPES.join(', ')}.`,
    );
  }
  const dashes = findDashes(lines.join('\n'));
  if (dashes.length > 0) {
    errors.push(
      `The message contains ${dashes.length} em or en dash(es). Use commas, periods or colons.`,
    );
  }
  return errors;
}
