# Phase 3: astro-portabletext verified before pinning, and whether Phase 3 needs it

Date: 11 September 2026. Method: `npm view <pkg> version|peerDependencies|engines|dependencies|time`;
the three packages installed into a scratch directory with Bun 1.4.2 (`exact = true`) so the shipped
`lib/*.ts`, `components/*.astro`, READMEs and CHANGELOGs could be read (`node_modules/...` paths refer to
that install); `gh api` for both GitHub repos; the Sanity and Astro pages named per bullet (the Sanity
MCP needs OAuth in a non-interactive session, so sanity.io was fetched directly). Nothing entered the repo.

| Package | Pin | Latest on registry | Why |
| --- | --- | --- | --- |
| `astro-portabletext` | 1.0.0, added in Phase 5 (not Phase 3) | 1.0.0 (2026-08-25) | Peer `astro >=4.6.0`, engines `node >=22.12.0`; upstream checks and builds its fixtures against Astro 7.2.2 on Node 22, 24 and 26; zero open issues; the `@sanity/astro` 3.5.1 README recommends it by name. |
| `@portabletext/astro` | not added | 0.2.0 (2026-09-10) | Sanity's own fork of the same code (an import rename to migrate); still 0.x with two releases. Revisit when it reaches 1.0 or the `@sanity/astro` README switches to it. |
| `@portabletext/to-html` | not added | 6.0.0 (2026-08-12) | String output for `set:html`; in `bun.lock` through `sanity` but not reachable from `packages/web` under Bun's isolated linker. Only for a non-Astro surface (email, RSS). |
| `@portabletext/toolkit`, `@portabletext/types` | not pinned | 6.0.0, 4.0.2 | Already in `bun.lock` through `sanity` 6.12.0 and `@portabletext/react` 8.0.1; `astro-portabletext` 1.0.0 resolves to the same two versions. `@sanity/client` 8.5.0 depends on neither. |

## `astro-portabletext` 1.0.0: registry, engines, repo, Astro 7

- Latest 1.0.0, published 2026-08-25T02:37Z (0.13.0 was 2026-01-05). Peer `astro: >=4.6.0`, an open floor
  that 7.3.1 satisfies; engines `node >=22.12.0` (mise gives 22.22.1); dependencies `@portabletext/toolkit
  ^6.0.0`, `@portabletext/types ^4.0.2`. It ships source, not a build: the exports resolve to `lib/*.ts`
  importing `components/*.astro`, so the hosting package needs `astro` (`packages/ui` has 7.3.1).
  Sources: `npm view astro-portabletext@1.0.0 ...`, its `package.json`.
- 1.0.0 breaking changes: Node `>=22.12.0`, the deprecated `astro-portabletext/utils` export removed
  (import from the root), toolkit 6 changed the list AST; `TypedObjectProps` added. Repo
  `theisel/astro-portabletext`: last push 2026-08-25 ("post-v1.0.0 release cleanup (#232)"), 0 open
  issues, 0 open PRs. Sources: `CHANGELOG.md`, release `astro-portabletext@1.0.0` (PR #229),
  `gh api repos/theisel/astro-portabletext`, `.../issues?state=open`, `.../pulls?state=open`.
- No release note, README line or issue names Astro 6 or 7 (the README says "Astro (`>=4.6.0`)"); a search
  of every issue and PR for "astro 7", "astro 6", "astro@7" and "astro@6" finds only old release PRs and
  unrelated closed issues (#155, #21, #13). The evidence is the harness: root and `demo` `package.json`
  depend on `astro ^7.2.2`, `pnpm-lock.yaml` resolves `astro@7.2.2`, and `lab` runs `astro check` and
  `astro build` on its fixtures plus cheerio assertions on the HTML, on Node 22, 24 and 26 for every push
  and PR. 7.3.1 itself is untested upstream; the component touches only `Astro.props`, `Astro.slots.has`,
  `Astro.slots.render` and a `globalThis` symbol. Sources: README, `gh api search/issues?q=repo:theisel/...`,
  upstream `package.json`, `demo/package.json`, `pnpm-lock.yaml`, `lab/README.md`, `.github/workflows/test.yml`.

## Usage, custom components, unknown nodes

- `import { PortableText } from "astro-portabletext"` then `<PortableText value={payload} {components} />`.
  Props: `value` (array or object), `components`, `onMissingComponent` (function or boolean, "Defaults to
  console warnings"), `listNestingMode` (`html`). `components` keys, each a component or a record keyed by
  the node's discriminator: `type` by `_type`, `block` by `style`, `list` and `listItem` by `listItem`,
  `mark` by mark type, plus `unknown*`, `text` and `hardBreak`. Overrides merge over the defaults (`normal`
  gives `<p>`, `h3` `<h3>`, `blockquote` `<blockquote>`, `strong`, `em`, `link` gives `<a href={markDef.href}>`),
  so this schema needs `{ block: { h3, blockquote }, mark: { link }, type: { pullQuote } }`. Sources: README
  "Usage", `docs/portabletext-component.md` "Custom components" and "View the default structure and output"
  at `main`, `lib/types.ts`, `components/PortableText.astro`.
- A custom `.astro` component receives `Astro.props.node`, `Astro.props.index` and `Astro.props.isInline`
  and renders children through `<slot />`. Types from `astro-portabletext/types`: `BlockProps`,
  `MarkProps<{ href?: string }>` (then `node.markDef.href`), `TypedObjectProps` or `Props<PullQuote>` with
  the generated `PullQuote`. A `pullQuote` at the top level of the array gets `isInline: false`
  (`isInline ?? false /* default to block */`); marks and text are always inline. Slots (`slot="mark"` and
  so on, unscoped in 1.0.0) wrap the resolved component instead of replacing it. Sources: `lib/types.ts`,
  `components/PortableText.astro`, `docs/portabletext-component.md` "Slots", `@portabletext/astro` README
  "Custom components" ("Each custom component receives `node`, `index` and `isInline` props").
- Unknown nodes warn and hide, never throw: `provideComponent` looks up `components[nodeType][type]`; on a
  miss it calls the handler with `PortableText [components.type] is missing "pullQuote"` and
  `{ nodeType, type }`, then renders a fallback. The default handler is `console.warn`;
  `onMissingComponent={false}` silences it; a function replaces it and may throw to fail `astro build`.
  `UnknownType.astro` prints the warning inside `<div style="display:none" data-portabletext-unknown="type">`
  (a `<span>` inline), so an unmapped object vanishes from the page; `UnknownBlock` and `UnknownMark` keep
  the text in a `<p>` or `<span>`. `Mark.astro` spreads `node.markDef.href` into `<a>` unchecked; the
  schema's `rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true })` is the only guard.
  Sources: `components/PortableText.astro`, `lib/warnings.ts`, `components/Unknown*.astro`,
  `components/Mark.astro`, `packages/content/src/schema/objects/blockContent.ts`.

## Alternatives

- `@portabletext/astro` 0.2.0 (registry entry 2026-08-12, 0.2.0 on 2026-09-10; author "Sanity.io"): "a fork
  of astro-portabletext by Tom Theisel, maintained under the @portabletext organization"; same peer
  `astro >=4.6.0`, `node >=22.12`, toolkit `^6.0.0`; devDependency `astro ^7.2.1`. It forked the 0.13 line
  (no `TypedObjectProps`, still ships the `./utils` shim 1.0.0 removed) and adds type-scoped slots
  (`block:h3`, `mark:link`, `type:pullQuote`). "The component API, props and utility functions are
  unchanged." Repo: 0 open issues, one open PR (#2). Sources: `npm view @portabletext/astro@0.2.0`, its
  `README.md` ("Migrating from `astro-portabletext`", "Slots") and `CHANGELOG.md`, `gh api repos/portabletext/astro-portabletext`.
- `@portabletext/to-html` 6.0.0 (2026-08-12, `node >=22.12`, Sanity maintained): `toHTML(blocks, { components,
  onMissingComponent })` returns an HTML string for `set:html`; components are functions returning strings
  (`types`, `marks`, `block`, `list`, `listItem`, `unknownType`, `unknownMark`, more); `onMissingComponent?:
  MissingComponentHandler | false`. Its README warns "Make sure you sanitize/escape the returned HTML" and that
  `value.href` is not safe by default. Sources: `npm view @portabletext/to-html@6.0.0`, its `README.md`, `dist/index.d.ts` line 22.
- What Sanity and Astro say: the `@sanity/astro` 3.5.1 README section "Rendering rich text and block content
  with Portable Text" says "We recommend using astro-portabletext to render your PortableText fields in
  Astro" with `import {PortableText as PortableTextInternal} from "astro-portabletext"` and `type` and
  `mark` maps; sanity.io/plugins/sanity-astro carries the same text, the sanity-astro-blog guide installs
  `astro-portabletext`, and the Exchange listing calls it community maintained and names the fork.
  `docs.astro.build/en/guides/cms/sanity/` is a stub ("Sanity & Astro", "Official Resources") with no
  Portable Text guidance. Sources: `node_modules/.bun/@sanity+astro@3.5.1*/.../README.md` lines 174 to 206,
  https://www.sanity.io/plugins/sanity-astro, https://www.sanity.io/guides/sanity-astro-blog,
  https://www.sanity.io/plugins/astro-portabletext, https://docs.astro.build/en/guides/cms/sanity/.

## Repo fit

- `blockContent` allows exactly: styles `normal`, `h3`, `blockquote`; no lists (`lists: []`); decorators
  `strong`, `em`; one annotation `link` (`href` as `url`, schemes http, https, mailto, tel, relative allowed);
  one object `pullQuote` (`quote` required, `name`, `relation`). TypeGen: `style?: "normal" | "h3" |
  "blockquote"`, `listItem?: never`, `markDefs` of `{ href?; _type: "link" }`, in a union with `PullQuote`.
  Sources: `packages/content/src/schema/objects/blockContent.ts`, `packages/content/src/sanity.types.ts`.
- Nothing in Phase 3 renders Portable Text. `siteSettings` has no `blockContent` field: `footerBlurb` and
  `newsletterBlurb` are `text` (rows 2), `address` is `text`, the rest are `string`, `url`, `boolean`,
  `oyImage`, object arrays and a layout option; TypeGen gives `footerBlurb?: string`, `newsletterBlurb?:
  string`. EnquiryCard copy is `blurb: string` in `enquiry-kinds.ts`; the Phase 3 prompt lists nav, footer,
  forms, dialogs, layout, actions and Playwright only. Sources: `singletons/siteSettings.ts`,
  `sanity.types.ts`, `enquiry-kinds.ts` (under `packages/content/src`), `docs/design/PROMPTS.md` "Phase 3",
  `docs/design/ROUTES-AND-INTERACTIONS.md` section 2.
- Nor does Phase 4: the `homepage` singleton and the `event` document have no `blockContent` field (the
  Phase 4 `PullQuote` is a standalone `@oy/ui` part). The first fields to render are `festivalPage.whatItIs`
  (Phase 5), then `lessonsPage.faq[].answer` and `collectivePage.argument` (Phase 6),
  `getInvolvedPage.hometownAssociations[].prose`, `impactPage.howWeWork`, `impactPage.civicInfra`,
  `storyPage.founding`, `person.bioFull` (Phase 7), `galleryPage.creditsAndConsent` (Phase 8),
  `newsPost.body` (News, not built). The `phase-0-stack-versions.md` row ("Phase 4") is one phase early;
  CONTENT-MODEL principle 7 ("Rendered with `astro-portabletext`") stands. Sources: `schema/singletons/index.ts`,
  `schema/documents/content.ts`, `schema/objects/faqItem.ts` (under `packages/content/src`),
  `docs/design/PROMPTS.md` Phases 4 to 8, `docs/research/phase-0-stack-versions.md`, `docs/design/CONTENT-MODEL.md`.
- Verdict: Phase 3 does not need the package. In Phase 5 add 1.0.0 to `@oy/ui` behind a `Prose` component
  with a story, map `block.h3`, `block.blockquote`, `mark.link`, `type.pullQuote`, and pass an
  `onMissingComponent` that throws so schema drift fails the build instead of hiding content. Open for the
  session: theisel 1.0.0 (stable, the one Sanity's README names today) versus the Sanity org fork (0.x,
  scoped slots, the likely long-term home; switching is an import rename), and whether `PortableText` renders
  in the Storybook static prerender and the Vitest harness (plain SSR, so expected to, unverified until the first story).
