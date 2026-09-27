# 104: A few To do rows count what the page does not show, and one presence row guesses the site's rule

Labels: bug, later
Status: open
Blocked by: none

**Finding** (R104 in `docs/plans/review-alignment-and-quality.md`; packages/content (Pending registry, To do); polish; correctness): ADR 0042's To do lists only what is owed; these rows can ask for things no chip shows (an inactive zone, an old filing, a slim header) or miscount the Collective's events on an event day. All latent today: both zones are active and development holds no governance filings. Also: once the awards show, an honoree tied to a later Gala satisfies the To do while the page shows the Pending line (packages/content/src/pending.ts:872-878 against packages/web/src/lib/sanity/gala-page.ts:77-79).

**Evidence:** packages/content/src/pending.ts:231 (zone line) has no active != false, while the page and the zone presence row read active zones only (queries/event-pages.ts:52, pending.ts:848-853); pending.ts:731-736 lists every governance filing with neither file nor note, while Impact shows only the newest of each kind (queries/trust-pages.ts:83-91); pending.ts:306-311 asks for Odunde's header photograph even under phead slim, which draws none (layout-options.ts:76-80); pending.ts:932-941 approximates still to come in GROQ and notes that the site can differ, though studio/todo.ts:246-251 already applies the site's own rule to rows bound to an edition.

**What to build:** Add active != false to the zone row, narrow the governance row to the newest filing of each kind, condition the festival header photograph on layout.phead != "slim", and give the Collective events presence row edition: 'next' so it counts collectiveEvents. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
