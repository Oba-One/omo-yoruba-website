# 137: FormBridge ships the whole enquiry spec (2.9 KB gzipped, a chunk shared with the Studio) to check a kind name

Labels: bug, later
Status: open
Blocked by: none

**Finding** (R137 in `docs/plans/review-alignment-and-quality.md`; Client JavaScript on every page; polish; a11y-perf): The chunk is shared with the Studio, so tree shaking keeps the full spec for every page, about a fifth of the site's own script on a content page, to validate one of eight strings. Well under the 60 KB budget, so polish. Measured from the build output.

**Evidence:** packages/web/src/components/FormBridge.astro:11-15 imports ENQUIRY_KINDS from @oy/content/enquiry-kinds; the build's .vercel/output/static/_astro/enquiry-kinds.DUJfeC7o.js is 8,004 bytes raw and 2,920 gzipped, imported by FormBridge.astro_astro_type_script_index_0_lang.DPBfGz61.js and studio-component.Ccm2Nx4m.js, and holds every form's copy and options; for scale, ClientRouter is 5,680 and FormBridge 3,990 bytes gzipped

**What to build:** Check the name against a local list or name.startsWith('enquiry.') and let the actions proxy answer an unknown kind, or move ENQUIRY_KINDS into a module the Studio's chunk does not share. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
