# 10: Proof: the prototypes, Playwright, axe and Lighthouse

Labels: design, infra
Status: open
Blocked by: 01, 08, 09

**What to build:** both pages compared side by side with `08 Odunde Festival.dc.html` and `09
End-of-Year Gala.dc.html` at 375 and 1440 (prototypes served over HTTP, captures with the Chrome
DevTools MCP into `test-results/`), what differs fixed, and an ADR recording where a repo rule
outranks a prototype. Playwright and axe on both routes at both widths, passing with the seeded
dataset and the way CI runs them (placeholder project), with the Phase 3 and 4 suites green.
`/odunde` and `/gala` appended to `lighthouserc.cjs`, lhci on the local production build, numbers
reported against QUALITY section 3.

- [ ] Captures of both pages and prototypes at 375 and 1440, the differences listed and fixed or recorded
- [ ] ADR: the event pages follow their prototypes except where a repo rule outranks them
- [ ] `bun e2e` green twice (seeded, placeholder), `bun check` green
- [ ] lhci numbers for `/`, `/odunde`, `/gala` on both presets

## Comments
