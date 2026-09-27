# 152: The wizard still hard-codes the public, empty production dataset and the domain that does not answer

Labels: bug
Status: open
Blocked by: none

**Finding** (R152 in `docs/plans/review-alignment-and-quality.md`; scripts/setup-wizard.sh; minor; correctness): The ticket's workaround depends on the owner remembering to answer no, and the wizard's own skip message points at the push that would switch the live site to an empty, public dataset and a host that does not answer. The fix belongs in the script, which no row tracks. Verified by reading the stages against the runbook and T17.

**Evidence:** setup-wizard.sh:252 asks for a public production dataset; :256-257 default the local dataset to production; :299 and :301 push PUBLIC_SANITY_DATASET=production and PUBLIC_SITE_URL=https://omoyorubasocal.org to Vercel production and preview whatever was typed; :308 tells the owner to push later by re-running stage 3. docs/runbook.md:62-65 keeps Vercel on development until D3, and :94-96 traces the public ACL to stage 1. Wayfinder T17 tells the owner to answer no at stage 3. README.md:19-25 sends new contributors to the wizard.

**What to build:** Push the dataset and site URL the owner typed (or keep Vercel's current values) instead of constants, ask for production as private, and drop the re-run hint until D2 and D3 settle. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

Already recorded as wayfinder T17 (a workaround, not a fix), open-work D16; this ticket adds the review's evidence.

## Comments
