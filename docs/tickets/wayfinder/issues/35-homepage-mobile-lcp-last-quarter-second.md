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
