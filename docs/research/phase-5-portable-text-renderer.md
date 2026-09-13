# Phase 5: the Portable Text renderer, re-checked and run through every render path

Date: 12 September 2026. Method: `npm view` and `gh api` for both candidates, run from a scratch directory
outside the repo (`pt-research/` in the session scratchpad); three scratch projects on Bun 1.4.2 with
`exact = true`, `linker = "isolated"` and root `overrides` holding `vite` 8.2.2 and `rolldown` 1.2.7 as the
repo's `bun.lock` does, every command with Node 22.22.1 first on `PATH`:

- `site-a`: one Astro 7.3.1 package with both renderers, static output, Vitest 4.1.11 on Astro's `getViteConfig`.
- `ws`: a two-package workspace shaped like the repo. `@oy/ui` exports `./src/*`, lists the renderers under
  `dependencies` and `astro` 7.3.1, `@storybook-astro/framework` 1.11.0, `storybook` and
  `@storybook/builder-vite` 10.6.0, `happy-dom` 20.14.0 and `@astrojs/check` 0.9.10 under `devDependencies`,
  with the repo's `vitest.config.ts`, `src/test/setup.ts`, `.storybook/main.ts` framework options and
  `tsconfig.json`; `@oy/web` has `astro` 7.3.1 and `@astrojs/vercel` 11.0.10, `output: 'server'`, no `vite` key.
- `repo-graph`: the repo's five `package.json` files, `bunfig.toml` and `bun.lock` at 0132bd9 (no sources)
  with `astro-portabletext` 1.0.0 added to `@oy/ui`, installed with `bun install --ignore-scripts`.

The scratch parts are four overrides (`Heading`, `Quote`, `Link`, `PullQuote`) and one `Prose` per renderer
whose `onMissingComponent` throws; the fixtures hold every node `blockContent` allows plus drift and
hostile-link cases (`site-a/src/components/prose/`, copied to `ws/packages/ui/src/prose/`). Paths under
`node_modules/...` refer to those installs. Sanity's `uri` rule and stega walker were read and run from the
repo's own install, read only. Sanity and Astro pages were fetched directly (the Sanity MCP needs OAuth).
Nothing was installed into the repo and no repo file changed except this note.

| Package | Pin | Latest on registry today | Why |
| --- | --- | --- | --- |
| `astro-portabletext` | 1.0.0 in `@oy/ui` `dependencies` | 1.0.0 (2026-08-25), unchanged | Same HTML in all six render paths below; resolves through the workspace with no Vite config and no second Astro runtime; `astro check` clean under both strict tsconfigs; every Sanity and Portable Text page checked that names an Astro renderer names this one; npm provenance. |
| `@portabletext/astro` | not added | 0.2.0 (2026-09-10), unchanged | Identical output and failure behaviour in the same paths; its one runtime change (slots first, `Component` resolved lazily) never applies to a slotless `Prose`; still 0.x; only the Exchange listing mentions it. Switching later is an import rename. |
| `@portabletext/toolkit`, `@portabletext/types` | not pinned | 6.0.0, 4.0.2 | Already in `bun.lock`; adding the renderer adds no entry for them. |
| `@portabletext/to-html` | not added | 6.0.0 | Unchanged from Phase 3: only for a non-Astro surface. |

## What changed since 11 September

- Nothing on either candidate. `astro-portabletext`: `latest` 1.0.0 (published 2026-08-25T02:37Z), peer
  `astro >=4.6.0`, engines `node >=22.12.0`, dependencies toolkit `^6.0.0` and types `^4.0.2`; repo last pushed
  2026-08-25 (`becde18`, post-1.0.0 cleanup), 0 open issues, 0 open pull requests, latest release
  `astro-portabletext@1.0.0`. `@portabletext/astro`: `latest` 0.2.0 (2026-09-10T16:45Z), same peer, engines and
  dependencies; repo last pushed 2026-09-10 (`d0b7756`, Version Packages), one open pull request (#2, a Cursor
  dev environment). Sources: `npm view <pkg> version dist-tags peerDependencies engines dependencies time --json`;
  `gh api repos/theisel/astro-portabletext` and `repos/portabletext/astro-portabletext`, each with
  `/issues?state=open`, `/commits` and `/releases`.
- Both tarballs carry an SLSA provenance attestation, and the 1.0.0 integrity (`sha512-7oj+cvbf...`) is the
  one the mirrored lockfile records. Sources: `npm view <pkg>@<version> dist.integrity dist.attestations --json`;
  `repo-graph/bun.lock`.
- On the registry but not used here: `astro` 7.3.2 (2026-09-08), `@storybook-astro/framework` 1.12.0
  (2026-09-10), `vite` 8.3.0 (2026-09-10). Every run used the repo's pins. Sources: `npm view astro time --json`,
  `npm view @storybook-astro/framework version`, `npm view vite version`.

## The schema's nodes render identically in every path

The fixture (`fixtures.ts`, `schemaValue`) is a `normal` block with `strong`, `em`, a `link` annotation to
`https://example.org/path?a=1&b=2` and literal `<escaped> &` text; an `h3` with Yoruba marks; a `blockquote`
with `strong` and `em` on one span; a `pullQuote`; a block with no `style` and a root-relative link. Every
path produced this inside the `Prose` wrapper, byte for byte, for both renderers:

```html
<p>Plain, <strong>strong</strong>, <em>em</em><a class="oy-prose-link" href="https://example.org/path?a=1&amp;b=2">, a link</a> and &lt;escaped&gt; &amp; text.</p><h3 class="oy-prose-h3">Ẹ káàbọ̀ sí Ọjà Balógun</h3><blockquote class="oy-prose-quote"><strong><em>Odún dé!</em></strong></blockquote><figure class="oy-prose-pullquote" data-inline="false"><blockquote>Quote text</blockquote><figcaption>Name, Relation</figcaption></figure><p>Relative <a class="oy-prose-link" href="/odunde">link</a></p>
```

| Path | What ran | Result |
| --- | --- | --- |
| `astro build`, static output | `node node_modules/astro/bin/astro.mjs build` in `site-a` | exit 0; `dist/index.html` holds the markup |
| `astro build`, server output on the Vercel adapter (the repo's mode) | the same in `ws/packages/web`, then `serve-fetch.mjs`, which imports `.vercel/output/functions/_render.func/entry.mjs` and calls its `fetch` for `/` | exit 0; status 200, same markup |
| `astro dev` | `dev-fetch.mjs`: Astro's programmatic `dev()` on 127.0.0.1:4390, one request per route, then `stop()` | status 200, same markup |
| Container API under Vitest | `site-a/test/container.test.ts`: `experimental_AstroContainer.create()`, then `renderToString(Prose, { props: { value } })` | string equals wrapper plus markup; 16 tests pass |
| Portable stories into happy-dom (how `@oy/ui` tests run) | `ws/packages/ui/src/prose/Prose.test.ts`: `composeStories` and `renderStory`, via `vitest run --project @oy/ui` from `ws` | `innerHTML` equals the markup; 4 tests pass |
| Storybook static prerender | `storybook build -o storybook-static` in `ws/packages/ui` (`renderMode: 'static'`, base36 hashes) | exit 0; `storybook-static/astro-prerendered-stories.json` holds the markup for both stories |

- Overlapping decorators nest as `<strong><em>`; a block without `style` renders `<p>` because the renderer
  sets `style ??= "normal"`; a top-level `pullQuote` gets `isInline: false`; text and the href's `&` are
  escaped; nothing is emitted between nodes, so exact-string assertions hold across paths; a `value` of
  `undefined` becomes an empty array and renders nothing. Sources: the outputs above;
  `node_modules/astro-portabletext/components/PortableText.astro` lines 217, 257 and 333.
- `astro check` reports 0 errors, warnings and hints with the repo's `packages/ui/tsconfig.json`
  (`astro/tsconfigs/strict` plus `noUncheckedIndexedAccess`; 17 files, 19 with the TypeGen probe) and `packages/web/tsconfig.json`
  (9 files, including a page passing a TypeGen-typed value to `Prose`). A probe assigning `node.markDef.href`
  from `MarkProps<{ href?: string }>` to a `number` fails with ts(2322) for both packages, so the shipped types
  are enforced, not `any`. The generated `BlockContent` (copied from `packages/content/src/sanity.types.ts`
  lines 346 to 365 and 1060 to 1065) is assignable to both packages' `PortableTextProps['value']` without a
  cast. Sources: `node node_modules/astro/bin/astro.mjs check` in `ws/packages/ui` and `ws/packages/web`;
  the probe files `TypeProbe.astro`, `TypegenProbe.astro` and `typed.astro`.

## Workspace resolution needs no Vite config

- Astro puts a dependency in `ssr.noExternal` only when vitefu's crawl reaches it. A package counts as an Astro
  package if it has an `astro` peer or dependency, an `astro` or `astro-component` keyword, or an `astro-` name,
  and the crawl descends only into packages that count. `@oy/ui` does not count (Astro is a devDependency
  there, no keywords, a scoped name), so the site's crawl never lists the renderer. Sources:
  `node_modules/astro/dist/core/create-vite.js` lines 80 to 103; `node_modules/vitefu/src/index.js` (1.1.3)
  lines 103 to 122 and 158 to 182; `packages/ui/package.json`.
- It does not need to. When a build decides whether to externalize a bare import, Vite resolves it from the
  project root, and only a `.js`, `.mjs` or `.cjs` file can be external. The renderer is unreachable from
  `packages/web` and its entry is `lib/index.ts`, so `astro build` bundled `astro-portabletext`,
  `@portabletext/astro` and `@portabletext/toolkit` into the function chunks; the only bare imports left in
  `_render.func` are `node:` builtins. In dev, Vite resolves from the importer, the `.ts` entry is still not
  externalizable and gets transformed, and the page rendered. Sources:
  `node_modules/vite/dist/node/chunks/node.js` (8.2.2) lines 27435 to 27447 and 27468 to 27471;
  `grep -rhoE '(from|import)\s*"[^./"][^"]*"'` over `ws/packages/web/.vercel/output/functions/_render.func`;
  the `astro dev` row above.
- The repo's own local production build shows the same split: the bare imports left under
  `packages/web/.vercel/output/functions/_render.func/packages/web/dist/server` are packages `@oy/web` declares
  (`@sanity/client`, `@sanity/preview-url-secret`, `react`, `react-dom/server`), while `@sanity/image-url`,
  declared only in `@oy/content`, is bundled. Source: the same grep over that directory (a build made earlier
  today, not committed).
- In the repo's real graph the change is two lines of `bun.lock` (the `@oy/ui` dependency and the package
  entry). The `astro` peer links to `astro@7.3.1+f8146a01fb4fe3af`, the store entry `packages/ui` and
  `packages/web` already share, so one Astro runtime; toolkit 6.0.0 and types 4.0.2 are reused. Sources: `diff`
  of `repo-graph/bun.lock` against the repo's; `readlink` on
  `repo-graph/node_modules/.bun/astro-portabletext@1.0.0+eb7f41982bbc15cf/node_modules/astro` and on both
  packages' `node_modules/astro`.

## Where a throwing `onMissingComponent` lands

The scratch `Prose` passes `(message, { nodeType, type }) => { throw new Error(...) }`; the drift fixture is a
`normal` block followed by an unmapped `callout` object.

| Path | Result | Source |
| --- | --- | --- |
| `astro build`, prerendered route (static output, or `export const prerender = true` under server output) | build fails, exit 1 (`site-a` printed `Caught error rendering /drift: Error: Prose: PortableText [components.type] is missing "callout"`) | builds in `site-a` and `ws/packages/web` |
| `astro build`, on-demand route (every repo page today) | build passes, exit 0; the function answers status 200 and the body stream errors after 0 bytes, also with 400 paragraphs ahead of the prose in a layout | `serve-fetch.mjs` on `/drift` and `/drift-late` |
| `astro dev` | `[ERROR]` with the message in the terminal; status 200 with a 51-byte body, the Vite client script only | `dev-fetch.mjs` on `/drift` |
| Container `renderToString` | the promise rejects with the message | `site-a/test/container.test.ts` |
| Portable stories `renderStory` | rejects with the message: the framework's render daemon answers 500, its in-worker fallback fails, the last container fallback throws | `ws/packages/ui/src/prose/Prose.test.ts`; `node_modules/@storybook-astro/framework/src/testing/astro-runtime.ts` lines 194 to 275 |
| `storybook build` | fails, exit 1, `[plugin storybook-astro:build-prerender] Error: Prose: PortableText [components.type] is missing "callout"` | `storybook build` in `ws/packages/ui` with `ProseDrift.stories.ts` present |

- Why an on-demand route answers 200: the lookup that calls the handler runs inside `PortableText`'s template
  expression, while the page streams. Astro wraps an async iterable in the `Response`, and the iterator
  rethrows a render error before draining its buffer; `@astrojs/vercel` calls `createApp()` without a
  streaming flag and `BaseApp` defaults `streaming = true`. A throw in a page's frontmatter, before the
  `Response` exists, gave status 500 instead. Sources: `PortableText.astro` lines 119 to 138 and 370 to 391;
  `node_modules/astro/dist/runtime/server/render/astro/render.js` lines 81 to 104 and 234 to 243;
  `node_modules/astro/dist/core/app/entrypoints/virtual/prod.js` lines 4 to 5 and `dist/core/app/base.js` line 73;
  `node_modules/@astrojs/vercel/dist/serverless/entrypoint.js` lines 10 to 13;
  `ws/packages/web/src/pages/frontmatter-throw.astro`.
- What reaches the handler: never a style `h1` to `h6`, `blockquote` or `normal`, a `bullet`, `number` or `menu`
  list, or a `code`, `em`, `link`, `strike-through`, `strong` or `underline` mark, since the defaults cover them
  (an `h2` and a bullet with `code` rendered `<h2>` and `<ul><li><code>` with no call). It is called for any other
  style (`h7`), any other decorator (`highlight`), any custom `_type`, and an orphaned mark key, because a key
  with no `markDefs` entry becomes its own mark type. Sources: `PortableText.astro` lines 56 to 96;
  `node_modules/@portabletext/toolkit/dist/index.js` line 177; the two handler tests in `container.test.ts`.
- With the default handler (`console.warn`), an unmapped type renders
  `<div style="display:none" data-portabletext-unknown="type">` holding the warning text, an unknown style
  `<p data-portabletext-unknown="block">` and an unknown mark `<span data-portabletext-unknown="mark">`, both
  keeping their text. Sources: the same tests; `components/UnknownType.astro`, `UnknownBlock.astro`, `UnknownMark.astro`.
- `import.meta.env.DEV`, read by a probe component in each path: `false` in the site's production function
  (`MODE` `production`), `true` under `astro dev`, `"1"` under Vitest through the framework's config (`PROD` is
  `""`, `MODE` `test`), `false` in the Storybook static build. Sources: `EnvProbe.astro` through
  `serve-fetch.mjs`, `dev-fetch.mjs`, `Prose.test.ts` and `astro-prerendered-stories.json`.
- So Phase 3's plan (throw so drift fails the build) holds for prerendered routes, tests and the Storybook
  build. On the site's on-demand routes, a throw turns drift, or one orphaned mark key written through the API,
  into a blank page with status 200. Whether Vercel's CDN caches such a response is untested; `cachePage` sets
  its headers in frontmatter, before the render.

## The renderer rewrites the value it is given

- Both renderers assign `node.style ??= "normal"` and `node.children = buildMarksTree(node)` on the caller's
  objects. After one render the first child of the fixture's first block has `_type` `@text`, and `toPlainText`
  on the same array returns only newlines; a second render of the rewritten array still gives the same HTML.
  Sources: `PortableText.astro` lines 217 to 218 (the fork's lines 272 to 273); the mutation test in `container.test.ts`.
- Story args reach the render daemon serialized, so a shared story fixture stayed intact. Site code reading
  the same value after `Prose` renders, such as a plain-text excerpt in a later component, would see the
  rewritten tree; `structuredClone(value)` inside `Prose` left the caller's value unchanged. Sources:
  `Prose.test.ts` (asserts `toPlainText` on the shared fixture); `astro-runtime.ts` lines 206 to 222;
  `site-a/test/clone.test.ts`.
- 20 concurrent renders mixing the wrapped and bare component kept their components apart, although the
  defaults read a context the latest instance sets on `globalThis`, because nodes are looked up in a
  module-level WeakMap first. Sources: the concurrency test in `container.test.ts`; `PortableText.astro`
  lines 263 to 269; `lib/internal.ts` line 84.

## Links: the schema's guard stops at the Studio

- Both renderers' default link puts `markDef.href` into `<a href>` unchecked: `javascript:alert(1)`,
  ` JaVaScRiPt:alert(2)` and `data:text/html,<script>alert(3)</script>` came out verbatim. Astro escaped the
  quote-breaking `"><script>alert(4)</script>` to `&quot;`, so there is no attribute injection, but no scheme
  check either. The scratch `Link` override (an anchor only for `http:`, `https:`, `mailto:`, `tel:` or a
  value starting with a single `/`, `#` or `?`, the text alone otherwise) dropped all four. Sources:
  `components/Mark.astro` line 22 in both packages; `site-a/dist/index.html`; `site-a/src/components/prose/Link.astro`.
- Sanity's validation docs say schema rules run only in the Studio and that mutations through the API or
  client libraries are not checked against them. In this repo that covers `bun seed`, Sanity MCP writes and
  any script. Source: https://www.sanity.io/docs/studio/validation ("Basics").
- In the Studio, `rule.uri` turns each scheme string into an anchored regex, parses a value against
  `http://sanity` when `allowRelative` is set, and treats anything starting with optional dots and a slash as
  relative. Run with the schema's options it rejected `javascript:alert(1)`, ` JaVaScRiPt:alert(2)`,
  `java\tscript:alert(5)`, the `data:` URL, `vbscript:msgbox(1)` and `https://user:pass@example.org`. It
  accepted `https://example.org/a?b=1`, `mailto:`, `tel:`, `/odunde`, `../odunde` and `#tickets`, but also
  `//evil.example` (an off-site link), the bare words `odunde` and `www.example.org` (they resolve as paths)
  and `"><script>alert(4)</script>`. Node 22's WHATWG `URL` reads the tab and leading-space forms as
  `javascript:`. Sources: `@sanity/schema` 6.12.0 `lib/Schema-ClAx8eCc.js` lines 226 to 241;
  `@sanity/validation` 6.12.0 `lib/validateDocument-Cq33kUmN.js` line 630 and lines 662 to 692;
  `node sanity-uri-rule.mjs` (runs `new Rule().type('String').uri(...)` from the repo's
  `@sanity/validation/lib/_internal.js`); `new URL(href, 'https://omoyorubasocal.org/odunde')` in `node -e`.
- Visual Editing does not disturb the lookups (read from source, not rendered): `loadQuery` encodes stega on
  preview reads, but `@sanity/client` 8.5.0 walks only a block's `children` and a span's `text`, so `style`,
  `listItem`, `marks` and `markDefs` (hrefs included) arrive clean; `pullQuote` strings are encoded like any
  text. Sources: `packages/web/node_modules/@sanity/client/dist/stegaEncodeSourceMap-CO1HKnm2.js` lines 198 to
  218 and 237 to 241; `packages/web/src/lib/sanity/load-query.ts` lines 38 and 55; `packages/content/src/stega.ts`.

## Styling reaches only what `Prose` renders itself

- A `<style>` in `Prose.astro` compiled to `.oy-prose[data-astro-cid-gagveh6p] p[data-astro-cid-gagveh6p]`,
  and only the wrapper `div` carried the attribute, so it matched neither the library's `<p>`, `<strong>` and
  `<em>` nor the `<h3>` from the `Heading` override. Source: a `site-a` build with that style added (`dist/index.html`).
- `@oy/tokens` already has global `.oy-prose` (66ch, a 16px column gap) and `.oy-prose p` rules, loaded by the
  site layout and the Storybook preview, and the Odunde prototype wraps the section's paragraphs in
  `div.oy-prose`. Sources: `packages/tokens/src/oy-components.css` lines 2306 to 2316 (from
  `docs/design/design/oy-components.css` lines 530 to 531); `packages/tokens/src/index.css` line 13;
  `packages/web/src/layouts/SiteLayout.astro` line 14; `docs/design/design/08 Odunde Festival.dc.html` line 91.

## Which renderer Sanity and Astro point to today

- Every page checked that names an Astro renderer names `astro-portabletext`: the `sanity-io/sanity-astro`
  README on `main` (section "Rendering rich text and block content with Portable Text", lines 174 to 206;
  repo last pushed 2026-09-11; `@sanity/astro` is still 3.5.1, the README Phase 3 read), whose example app
  still pins `astro-portabletext ^0.11.3`; https://www.sanity.io/plugins/sanity-astro;
  https://www.sanity.io/docs/astro/images-and-portable-text-astro (new to these notes; calls it the
  community-maintained library); https://www.sanity.io/docs/developer-guides/presenting-block-text (the Astro
  row links to theisel's repo); https://www.sanity.io/guides/sanity-astro-blog (installs it);
  https://www.portabletext.org/rendering/astro/ (a community package by theisel that Sanity recommends) and the
  `portabletext/portabletext` README line 202; and `sanity-io/agent-toolkit`
  `skills/portable-text-serialization/rules/astro.md` (last changed 2026-02-12). Sources: those URLs;
  `gh api repos/sanity-io/sanity-astro/readme` and `.../contents/apps/example/package.json`;
  `gh api repos/portabletext/portabletext/readme`; `gh api "repos/sanity-io/agent-toolkit/commits?path=skills/portable-text-serialization/rules/astro.md"`.
- The fork appears in one place: the Exchange listing https://www.sanity.io/plugins/astro-portabletext
  (community, contributor Tom Theisel) says Sanity forked the package as `@portabletext/astro` under the
  `@portabletext` organization and offers staying or migrating with a guide the fetched page does not link.
  https://docs.astro.build/en/guides/cms/sanity/ has no Portable Text guidance.
- The agent-toolkit rule's examples do not match 1.0.0. A string such as `h1: 'h1'` is not a component (a
  component must be a function), so it reaches the missing handler and renders `<p data-portabletext-unknown="block">`;
  its link reads `node.href`, which is undefined in a mark (the value sits at `node.markDef.href`), and rendered
  `<a href rel="noreferrer noopener">`. Sources: `lib/internal.ts` lines 19 to 21; `site-a/test/toolkit-example.test.ts`.

## Verdict

- Add `astro-portabletext` 1.0.0 (exact) to `packages/ui/package.json` `dependencies`, nowhere else: `@oy/web`
  gets it bundled through `@oy/ui`, and `bun.lock` changes by two lines. Not `@portabletext/astro` 0.2.0 yet;
  moving later means renaming the imports (root and `/types`) and dropping `TypedObjectProps`, which only
  theisel exports.
- No Vite config: nothing in `astro.config.ts`, `vitest.config.ts` or `.storybook/main.ts` (no `ssr.noExternal`,
  no `resolve.dedupe`).
- Component: `Prose.astro` in `@oy/ui`, with a story and a test, taking `value` (the TypeGen `BlockContent`, no
  cast) and rendering `PortableText` over `structuredClone(value)` inside `<div class="oy-prose">`, with four
  `.astro` overrides, never strings: `block.h3`, `block.blockquote`, `mark.link` (`MarkProps<{ href?: string }>`,
  an anchor only for `http:`, `https:`, `mailto:`, `tel:` or a single `/`, `#` or `?` start) and `type.pullQuote`
  (`Props<PullQuote>`). Style the library's `p`, `strong` and `em` through the global `.oy-prose` rules in
  `@oy/tokens`, not a scoped `<style>`. An empty field is the page's Pending: the renderer prints nothing.
- `onMissingComponent`: throw when `import.meta.env.DEV` (the dev server and Vitest), otherwise `console.error`
  the message and let the fallback render, so an on-demand page never goes blank. Back it with a test that
  renders one node of each style, decorator, annotation and object type `blockContent` declares, so CI fails
  when the map lags the schema.
- Unverified: Vercel's CDN on a 200 whose body errors; `astro` 7.3.2, `@storybook-astro/framework` 1.12.0 and
  `vite` 8.3.0; `storybook dev` and Chromatic (only the static build ran); stega-encoded text through the
  renderer (read from source); `bun lint` and Biome on real `Prose` files; the fork's migration guide (no link found).
