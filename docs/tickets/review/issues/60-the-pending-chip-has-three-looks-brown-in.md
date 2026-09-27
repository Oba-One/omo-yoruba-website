# 60: The Pending chip has three looks: brown in most places, indigo in every glance strip, grey and larger under Impact's figures

Labels: design
Status: open
Blocked by: none

**Finding** (R60 in `docs/plans/review-alignment-and-quality.md`; Pending chip (tokens), glance strips and Impact's headline numbers; minor; drift): Each phase patched the chip where a container's span rule restyled it, so the same Pending chip now reads in three colours and two sizes across the event, program and trust pages. The chip is the visible to-do list the owner reads, and it should look the same wherever it asks for something. Measured with getComputedStyle on every visible chip.

**Evidence:** test-results/review/site/chips.txt at 1440 on 12 routes: 81 light chips 12px bold rgb(122, 68, 9); 27 chips in .oy-glance cells (Odunde, Gala, Lessons and others) 12px rgb(30, 42, 90) display block; 4 chips in Impact's .oy-source lines 13.5px, letter spacing 1.35px, rgb(107, 107, 118). Captures chip-glance-odunde-1440.png, chip-source-impact-1440.png, chip-fact-odunde-1440.png. Code: packages/tokens/src/oy-components.css:2546-2590 restores the chip's type in glance cells and its colour only for fact rows, the year strip and list rows; .oy-glance span (oy-components.css:1155) and .oy-stat span (components.css:267) restyle the rest. Also: getComputedStyle at 1440: .oy-glance .oy-pend color rgb(30,42,90) for the Lessons Ages cell, all eight initiative cells and the Odunde glance, against rgb(122,68,9) for every other chip on the pages. packages/tokens/src/oy-components.css:2546-2565 restores the chip's type for .oy-glance span.oy-pend, but the colour exemptions that follow (2566-2586: .oy-fact, .oy-year, .oy-lrow-date, .oy-lrow-tier) leave out the glance, so .oy-glance span { color: var(--indigo-700) } at 1155-1163 wins. Captures test-results/review/programs/s11-1440-main-nth-child-2.png, s12-1440-section-solar-hub.png.

**What to build:** Give the chip its own colour and inline-flex box in .oy-glance span.oy-pend, and add the stat strip's source span (.oy-stat span.oy-pend) to the same type block, so every light chip reads 12px in brown. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
