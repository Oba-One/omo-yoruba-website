# The last quarter second of the homepage's mobile LCP

Type: task
Status: open
Owner: no
Labels: infra, design
Phase: 9
Blocked by: none

## Question

After wayfinder ticket 33 the homepage scores 0.94 to 0.96 on the mobile preset with a simulated LCP
of 2.7 to 2.9 s against the 2.5 s budget (desktop 0.99, LCP 0.7 s). The LCP element is the hero
photograph on the Sanity CDN; the remaining time is the stylesheet request before first paint and the
fonts competing with the photograph on the simulated 4G link.

Measured and not taken in Phase 5: inlining the stylesheets (`build.inlineStylesheets: 'always'`)
reached LCP 2.49 s on mobile, but with the stylesheet in the HTML the font swap lands after first paint
and desktop CLS rose to 0.23. Try metric-matched fallback faces first (`size-adjust`,
`ascent-override`, `descent-override` over Georgia and system-ui for Source Serif 4 and Source Sans 3,
the way Astro's Fonts API generates optimised fallbacks), then inlining again, and check the Phase 9
CSP (inline `<style>` needs a hash or a nonce under `style-src 'self'`). Measure both presets on the
local production build as ticket 33 did, with the event pages in `lighthouserc.cjs` too.

## Comments

12 September 2026 (Phase 5, ticket 10). The event pages share the problem, more visibly. On the mobile
preset some runs shift the glance band when Source Sans 3 and Source Serif 4 swap in after first paint
(Lighthouse names the font files as the causes): `/odunde` 0.06 and 0.071 in two runs of three, `/gala`
0.063 in one, `/` 0.033 and 0.036 on the hero; lhci's aggregate passes the 0.05 budget, but single runs
do not. The photo header is 37px taller with the fallback faces than with the real ones (572px against
609px on `/odunde` at the preset's 412px width), the same before and after ticket 10's facts line, so
the shift is the font swap, not the layout. Metric-matched fallback faces would remove this shift and
the risk inlining showed. The event pages' mobile LCP sits at 2.49 to 2.56 s (the header photograph).

