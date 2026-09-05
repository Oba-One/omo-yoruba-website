# All components are .astro, and Storybook runs them through @storybook-astro/framework

Every visual component lives in `@oy/ui` as a `.astro` file with a colocated story and
test, and Storybook renders them with `@storybook-astro/framework` on
`@storybook/builder-vite`. No React or other framework components ship to the site.

## Consequences

- `astro:assets` and `astro:fonts` are stubbed in stories; image props accept a plain URL
  so stories can render, and `@oy/tokens` ships a plain `fonts.css`.
- If the framework blocks a component after a reasonable attempt, the session stops and
  asks the owner. A pivot to islands or another format is the owner's call, never silent.
