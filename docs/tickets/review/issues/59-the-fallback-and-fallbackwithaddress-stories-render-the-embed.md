# 59: The Fallback and FallbackWithAddress stories render the embed, not the fallback

Labels: infra
Status: open
Blocked by: none

**Finding** (R59 in `docs/plans/review-alignment-and-quality.md`; GiveDialog (stories); minor; tests): Storybook and the Chromatic baselines never show the fallback the owner has to approve, including the check line with an address. The site is not affected because the layout passes only embed or pending.

**Evidence:** scratchpad chrome/give.mjs: forms-givedialog--fallback and --fallback-with-address at 1440 and 375 show 'Amount, one time or monthly, and card details, all here.' and the stand-in (test-results/review/chrome/story-give-fallback-1440.png). A dialog served open calls api.open (GiveDialog.astro:294-297), whose arm() (238-249) unhides the embed and mounts the slot's template whatever mode the server rendered; only the FallsBackWithoutEmbed play reaches the fallback, through its timer. GiveDialog.test.ts checks the server markup only.

**What to build:** Leave a server-rendered fallback alone in the script (arm only in embed mode; Try again re-arms), or build the fallback stories without the embed slot and with a failed state. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
