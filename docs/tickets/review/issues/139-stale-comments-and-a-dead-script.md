# 139: Stale comments and a dead script

Labels: infra, later
Status: open
Blocked by: none

**Finding** (R139 in `docs/plans/review-alignment-and-quality.md`; packages/web comments and scripts; polish; consistency): Each is small, but the comments tell a reader something the build does not do. Verified by grepping each name and reading the wizard.

**Evidence:** packages/web/src/lib/sanity/programs-page.ts:31 is a doc comment for a constant that moved to @oy/content/routes; packages/web/src/components/ZeffyEmbed.astro:7 asks for a slot=fallback child that SiteLayout.astro:177 never passes; packages/web/astro.config.ts:33-34 says Vercel injects PUBLIC_SITE_URL so previews get their own value, while scripts/setup-wizard.sh:301 writes one URL for production and preview; packages/web/package.json:11 keeps astro preview, which playwright.config.ts:3 and docs/runbook.md:198 and 323 say the Vercel adapter lacks; packages/web/src/lib/sanity/homepage.ts:21 re-exports BuildOptions (no importer) and :80 aliases cleanText

**What to build:** Delete the orphan comment, the fallback sentence, the preview script, the re-export and the alias; say in astro.config.ts that the wizard sets PUBLIC_SITE_URL per environment. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
