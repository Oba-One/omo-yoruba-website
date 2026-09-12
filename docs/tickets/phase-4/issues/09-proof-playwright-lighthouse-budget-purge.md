# 09: Proof: Playwright, Lighthouse, the JS budget and publish-to-purge

Labels: infra
Status: open
Blocked by: 08

**What to build:** the homepage specs (blocks present, one h1, the doors open the modal, nothing open
on load, axe clean at 375 and 1440); Lighthouse against the Vercel preview with the budgets in
QUALITY section 3 or, if the preview is protected, the reason and a local measurement; the gzipped
client JavaScript of `/` measured against the 60 KB budget (wayfinder ticket 15); a publish in the
development dataset followed by a signed `/api/revalidate` call and the page updated.

- [ ] Results recorded in the ticket comments and the handoff with the numbers
- [ ] Wayfinder tickets 15, 20 and 21 resolved with the findings
