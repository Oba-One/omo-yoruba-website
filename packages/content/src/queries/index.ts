/**
 * The GROQ the site runs, one file per page or concern (the only package where GROQ lives,
 * ADR 0003). Every query is a `defineQuery` literal so TypeGen registers its result on
 * `SanityQueries` and `client.fetch` returns it typed (`bun typegen` after any change).
 */
export * from './event-pages';
export * from './homepage';
export * from './program-pages';
export * from './site';
export * from './trust-pages';
