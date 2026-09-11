# 03: Shared objects and the validation rules

Labels: content
Status: open
Blocked by: 01, 02

**What to build:** the ten shared objects from CONTENT-MODEL section 2 as `defineType` objects
(`bilingual` with English required, `cta` with `kind` plus `enquiryKind`, `oyImage` with required
alt and optional credit fields, `seo`, `fact`, `sourcedFigure`, `scheduleItem`, `faqItem`,
`contactRole` with the eight roles, and the `layoutOption` helper with the first option as the
initial value), plus the validation helpers every string and text field uses: no em dash (error),
a glossary term without marks (warning), sentence case on headings and labels (warning), alt
required (error). Tests cover the pure checks; the Studio shows the messages.

- [ ] Every object type is exported from `@oy/content` and registered in the schema
- [ ] The validation helpers are unit tested and reuse `@oy/lint`, never a copied word list
- [ ] A string field with an em dash blocks publishing; a market name typed without its marks warns with the correction
