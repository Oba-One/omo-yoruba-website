// The voice checks and the shared word lists, for the Sanity validation rules and the
// content-lint function. Browser and function bundles import the pure modules directly
// (`@oy/lint/em-dash`, `@oy/lint/yoruba`, `@oy/lint/sentence-case`) and the JSON files; this
// entry adds the Node file loaders. The CLI and file walking stay internal to this package.
export { checkCommitMessage } from './commit-msg';
export type { DashFinding } from './em-dash';
export { findDashes } from './em-dash';
export type { TitleCaseFinding, TitleCaseOptions } from './sentence-case';
export { findTitleCase } from './sentence-case';
export { loadProperNouns, loadTerms } from './terms';
export type { FindOptions, Term, TermFinding } from './yoruba';
export { findBareTerms } from './yoruba';
