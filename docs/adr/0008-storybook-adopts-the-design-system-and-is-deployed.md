# Storybook adopts the design system theme and is deployed for the owner

The Storybook manager is themed with the site's tokens (indigo bar, paper ground, gold
accent, Source Sans 3 and Source Serif 4; values at the bottom of
`docs/design/COMPONENT-MAP.md`), the preview loads `@oy/tokens`, and the build deploys to
its own Vercel project so the owner can review every variant and layout option without
touching content. Chromatic runs on pull requests at 375 and 1440.

Hosting as a separate project versus a path under the site is wayfinder ticket 11.

5 September 2026: the Storybook config lives in `packages/ui/.storybook/` rather than a
workspace of its own, so the components, their stories and the build that renders them share
one package. The Vercel project's Root Directory is `packages/ui`.

Phase 1 (5 September 2026) stood it up: `packages/ui/.storybook/` holds `main.ts`, `preview.ts`,
`preview.css`, `manager.ts` and `theme.ts` with the component map's values; the preview imports
`@oy/tokens`, offers white, paper and indigo-900 backgrounds (the indigo one wraps stories in
`.oy-dark`), themes the docs pages and declares Chromatic modes at 375 and 1440. CI job
`Storybook build and Chromatic` builds `storybook-static` on every pull request and publishes to
Chromatic when the `CHROMATIC_PROJECT_TOKEN` secret exists, skipping with a notice otherwise.
`packages/ui/vercel.json` pins the deploy; the hosting call stays with wayfinder ticket 11.
