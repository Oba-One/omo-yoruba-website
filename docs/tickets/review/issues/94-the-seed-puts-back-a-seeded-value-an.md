# 94: The seed puts back a seeded value an editor emptied on purpose

Labels: bug
Status: open
Blocked by: none

**Finding** (R94 in `docs/plans/review-alignment-and-quality.md`; packages/content (seed); minor; correctness): A deletion is an edit too: the Studio unsets a field an editor clears, and the next bun seed, which the runbook uses to land fields added to the schema, writes the seed's value back. On development, which members will edit while D3 is open, a hidden proverb or a plain white heading comes back without anyone noticing.

**Evidence:** packages/content/scripts/seed-data.ts:1183-1226 (missingFields) fills every absent top-level and one-level field. Seeded fields whose description makes empty a choice: hero.emphasis ("Empty leaves the whole heading white", schema/singletons/index.ts:44-48), voicesProverb ("Empty hides the line", :89-94), a stat's shortLabel (schema/documents/content.ts:869-876), a take-part row's chip (schema/objects/takePartRow.ts:30-37), a program's card action (content.ts:417-422). bun probe: a homepage with hero.emphasis and voicesProverb removed gives missingFields ["hero.emphasis", "voicesProverb"]. packages/content/README.md:48-50 says an editor's change stays; docs/runbook.md:233-235 says the default never overwrites an owner's edit.

**What to build:** Fill only fields a document has never held (for example the fields added to the schema since the document was seeded, or a per-document seed marker), or state in the README and runbook that emptying a seeded field does not survive bun seed. Size M.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
