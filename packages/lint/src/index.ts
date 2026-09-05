// The two voice checks and the shared word list, for the Sanity validation rules and the
// content-lint function (Phase 2). The CLI and file walking stay internal to this package.
export { checkCommitMessage } from './commit-msg';
export type { DashFinding } from './em-dash';
export { findDashes } from './em-dash';
export type { FindOptions, Term, TermFinding } from './yoruba';
export { findBareTerms, loadTerms } from './yoruba';
