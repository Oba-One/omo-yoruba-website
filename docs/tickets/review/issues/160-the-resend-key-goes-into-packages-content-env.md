# 160: The Resend key goes into packages/content/.env, which no local test reads

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R160 in `docs/plans/review-alignment-and-quality.md`; scripts/setup-wizard.sh (stage 4), docs/runbook.md; polish; docs): A production sending key would sit in a file nothing uses, and the runbook suggests local tests need it when they only print the email. Verified from the function's local branch and the wrapper.

**Evidence:** setup-wizard.sh:322-326 writes RESEND_API_KEY to packages/content/.env; docs/runbook.md:21 says the file is for local function tests. A local run returns before the key is read (packages/content/functions/enquiry-notify/index.ts:52-55; the key is read at :70), and the runbook's local test (docs/runbook.md:300-302) calls sanity.sh, which loads only packages/web/.env (sanity.sh:9-19).

**What to build:** Have stage 4 print the 'sanity functions env add enquiry-notify RESEND_API_KEY' step for after the deploy instead of storing the key, and correct the runbook row. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
