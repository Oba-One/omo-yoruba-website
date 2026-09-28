# 44: After a client-side navigation every dialog trigger also navigates: focus return fails and Donate leaves the visitor on /donate

Labels: bug
Status: resolved
Blocked by: none

**Finding** (R44 in `docs/plans/review-alignment-and-quality.md`; EnquiryModal, GiveDialog; major; correctness): The review branch does not contain pull request 10, so the defect ADR 0041 describes is live here. Most visitors reach a form or a Donate button after a client-side navigation, so the common path breaks the contract that Escape returns focus to the trigger, re-fetches the page for every enquiry trigger, and swaps the page behind the Give Dialog to /donate. Reproduced with Playwright; the first-load path passes.

**Evidence:** scratchpad chrome/router2.mjs and router3.mjs on this branch at 1440: after /get-involved to /impact to /get-involved through nav links, the member door fetched /get-involved?enquiry=member, the address became /get-involved?enquiry=member#enquiry, focus landed on dialog#enquiry and Escape left focus on body; the nav Donate fetched /donate, the address became /donate#give with the Donate page behind the dialog, and Escape left focus on body (test-results/review/chrome/router-donate-after-client-nav-1440.png, router-donate-after-close-1440.png). On a first load the same clicks keep the address, focus the first field or Close, and Escape returns focus to the trigger. Cause: packages/ui/src/forms/EnquiryModal/EnquiryModal.astro:491-512 and packages/ui/src/forms/GiveDialog/GiveDialog.astro:306-327 add the document click listener per connection, so after the first swap it runs behind the ClientRouter's. Also: test-results/review/site/router-bug.jsonl and router-bug-give-open-375.png, router-bug-give-open-1440.png: fresh load of /get-involved, Donate and Become a member open their dialogs with no swap and focus returns to the trigger; after /impact to /get-involved through the nav, the same Donate click logs astro:before-swap to /donate#give, the page under the dialog becomes Give to Omo Yorùbá (h1), and after Escape the URL is /donate with focus on BODY; Become a member swaps to /get-involved?enquiry=member#enquiry and Escape leaves focus on BODY (same at 1440 and 375, repeated over three navigations in router.txt). Cause: packages/ui/src/forms/EnquiryModal/EnquiryModal.astro:491-513 and packages/ui/src/forms/GiveDialog/GiveDialog.astro:306-328 re-add their bubble-phase document click listener in connectedCallback, which runs again when the router moves the persisted dialogs (SiteLayout.astro:157 transition:persist); the router's own document click listener (node_modules astro 7.3.1 components/ClientRouter.astro:62-98) was registered earlier, runs first, sees defaultPrevented false and calls navigate(href).

**What to build:** Merge pull request 10 (fix/navigation-dialogs: the listeners register once at definition, ADR 0041) and rebase this branch on it, then re-run focus return after a client-side navigation. Size S.

- [x] The fix, with a test that fails before it where the behaviour can be tested
- [x] `bun check` green; Playwright in both data modes where a page changes

Already recorded as pull request 10 (fix/navigation-dialogs, ADR 0041, open-work E23 on that branch), open and not merged; this ticket adds the review's evidence.

## Comments

**Triage, 27 September 2026:** Fixed by pull request 10, merged on 27 September (ADR 0041): the dialogs register their document listeners once, so a trigger after a client-side arrival opens its dialog and nothing else. `packages/web/e2e/navigation.spec.ts` proves it on both persist paths.
