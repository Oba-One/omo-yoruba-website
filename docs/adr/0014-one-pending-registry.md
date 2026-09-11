# One Pending registry drives the Studio Pending view and the site's chips

Decided with the owner on 11 September 2026 (Phase 2 grill). `packages/content/src/pending.ts`
is the one list of required-for-launch fields, each with the wording of what is missing and
where it shows. The Studio structure builds the Pending group from it (one GROQ list per row,
`!defined(field)`), and a site component that finds the field empty renders
`<Pending what="...">` with the same wording, so the chip on the page and the row in the
Studio never disagree. A field query cannot find documents that do not exist, so the same
group carries presence rows (a small React pane inside the Studio) for types with no
documents yet or fewer than expected, and lists the lint reports the `content-lint` function
writes, since a function cannot raise a Studio validation warning.

## Consequences

- Adding a required-for-launch field means adding its registry entry in the same change; the
  registry test fails on a field the schema does not have.
- `creditConfirmed: false` and an unnamed zone slot count as pending.
- The React pane exists only inside the Studio at `/admin`; ADR 0002 still holds for the site.
