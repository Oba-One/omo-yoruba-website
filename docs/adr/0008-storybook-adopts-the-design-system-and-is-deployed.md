# Storybook adopts the design system theme and is deployed for the owner

The Storybook manager is themed with the site's tokens (indigo bar, paper ground, gold
accent, Source Sans 3 and Source Serif 4; values at the bottom of
`docs/design/COMPONENT-MAP.md`), the preview loads `@oy/tokens`, and the build deploys to
its own Vercel project so the owner can review every variant and layout option without
touching content. Chromatic runs on pull requests at 375 and 1440.

Hosting as a separate project versus a path under the site is wayfinder ticket 11.
