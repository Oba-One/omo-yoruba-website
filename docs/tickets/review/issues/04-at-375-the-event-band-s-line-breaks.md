# 04: At 375 the event band's line breaks between flex pieces, leaving the dot at the end of a line

Labels: design
Status: open
Blocked by: none

**Finding** (R04 in `docs/plans/review-alignment-and-quality.md`; / (EventBand); minor; drift): The prototype's line is one sentence that wraps as text; the component sets it as flex items, so on a phone the wrap falls between items and the separator can end a line. ADR 0028 fixed exactly this in the page header's facts but the band kept it. With today's chips it shows in the second screen of the homepage at 375, and a long venue and date will repeat it once filled; measured with getBoundingClientRect.

**Evidence:** Live / at 375: venue chip x 24 to 188 and the dot x 196 to 201 on the first line (y 1074), the date chip alone on the next (y 1111); capture test-results/review/home-events/pairs/home-375-div_lead-event_oy-dark_oy-even.png. Story bands-eventband--filled at 375: 'Leimert Park • Saturday 12 June 2027.' then the summary dropped whole to the next line (test-results/review/home-events/stories/eventband-pair-375.png), where the prototype's sentence wraps as text. packages/ui/src/bands/EventBand/EventBand.astro:74-86 (venue, dot, date and summary as flex items) and :137-144 (flex-wrap).

**What to build:** Give each fact its own dot and hide a dot that starts a line, as PageHeader's facts line does since ADR 0028, and let the summary run on as text rather than as its own flex item. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
