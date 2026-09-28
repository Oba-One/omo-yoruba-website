# 103: The enquiry email names a domain that does not answer yet, a code for the kind, and the time in UTC

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R103 in `docs/plans/review-alignment-and-quality.md`; packages/content (enquiry-notify); polish; judgement): The email is what the routing contact reads first: "enrol" and "contact" read as codes, the domain does not serve until D2, and a UTC stamp is seven or eight hours off for Los Angeles readers.

**Evidence:** packages/content/functions/enquiry-notify/email.ts:88 writes "A new enrol enquiry arrived through omoyorubasocal.org." with the raw kind, where the subject uses KIND_TITLES (:99-101); :93 prints submittedAt as stored (2026-09-11T10:00:00Z), while the Studio shows Los Angeles time (schema/format.ts:10-15).

**What to build:** Use KIND_TITLES in the first line, drop or configure the host name, and format the time in SITE_TIME_ZONE as the Studio does. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
