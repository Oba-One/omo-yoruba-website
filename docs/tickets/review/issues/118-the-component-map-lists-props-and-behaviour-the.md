# 118: The component map lists props and behaviour the components no longer have

Labels: infra
Status: open
Blocked by: none

**Finding** (R118 in `docs/plans/review-alignment-and-quality.md`; docs/design/COMPONENT-MAP.md; minor; docs): Pull request 14 changed the take-part band, the ticket tiers and the hero after ADR 0042 without updating the map, and EventBand's href went earlier. The map is the inventory agents and the owner read first.

**Evidence:** COMPONENT-MAP.md:50 EventBand `href` (removed in ef5db25; EventBand.astro:34-42); :57 TakePartBand `lead` and `edit` and 'the lead way in moved up in the markup' (removed in c090cf9; TakePartBand.astro:34-49 renders the rows' own order, ADR 0042); :74 TicketTiers `emphasis` and 'the table tier first when tables lead' (removed in c090cf9; TicketTiers.astro:11-23); :45 Hero 'the page swaps the primary for the highlighted program's action' (retired by ADR 0042; pages/homepage/sections.ts:37) Also: COMPONENT-MAP.md:16-17 and oy-component/SKILL.md:26-27 ('ImageMetadata | string | SanityImageSource', render <Image>) vs ADR 0022 and packages/ui/src/media/image.ts:21 (ImageInput = string | ImageMetadata | ResolvedImage, plain <img>); oy-component/SKILL.md:17-18 puts TakePartBand in bands (it lives in page/) and omits NewsletterBand; :48 says tests cover 'the behaviour the play function exercises' though Vitest runs no scripts (ADR 0018); oy-design-system/SKILL.md:37 (a 14px --radius-card token overridden; spacing.css sets 6px), :56 (SVGs in docs/design; they live in packages/tokens/src/patterns), :20 (--accent-sustain, which nothing reads)

**What to build:** Update the four rows to the props and behaviour as built, as the oy-component skill's 'Done means' asks. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
