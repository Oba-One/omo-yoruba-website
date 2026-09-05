# One enquiry-kinds spec drives schema, validation, markup and stories

`packages/content/src/enquiry-kinds.ts` is the single description of the eight enquiry
kinds and the newsletter: title, blurb, fields with labels, options and error phrases,
submit label, success copy. The Sanity `enquiry` schema, the Zod action schemas, the
Enquiry Modal markup and the Storybook stories are all generated from it, so a field added
once appears everywhere and cannot drift.

## Consequences

- Copy for a form changes in the spec, not in a component.
- Named contacts in success copy come from `siteSettings.contacts`, never from the spec.
