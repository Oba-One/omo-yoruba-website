# Phase 4: Sanity Visual Editing with @sanity/astro 3.5.1, Astro 7 and the perspective cookie

Date: 12 September 2026. Method: the installed packages read in place under this repo (Bun's isolated
linker keeps every copy under `node_modules/.bun/<name>@<version>+<hash>/node_modules/...`; the paths
below are relative to the repo root): `@sanity/astro` 3.5.1 (`dist/visual-editing/*` and `src/visual-editing/*`
are byte identical, the package copies `src` into `dist`), `@sanity/visual-editing` 5.7.3 and
`@sanity/visual-editing-csm` 3.0.18 (both publish their TypeScript `src/`, quoted with line numbers),
`@sanity/visual-editing-types` 2.1.1, `@sanity/presentation-comlink` 2.2.3, `@sanity/comlink` 4.0.3,
`@sanity/client` 8.5.0 (`dist/*.d.ts` and the built chunks), `@sanity/preview-url-secret` 4.1.5 (`src/`),
`sanity` 6.12.0 (the built Presentation chunks `lib/PresentationToolGrantsCheck-Bx7E3Lne.js`,
`lib/PostMessageRefreshMutations-ClPJDKPe.js`, `lib/presentation.js`, `lib/resources-BQcJcDAy.js`),
`@xstate/react` 6.1.0, Astro 7.3.1, `@astrojs/react` 6.0.5 and styled-components 6.5.3. Module resolution
was tested with `Bun.resolveSync(specifier, '<repo>/packages/web')`; nothing was installed and no repo file
other than this note was changed. Docs fetched: https://www.sanity.io/docs/astro/astro-visual-editing (the
Astro guide; the URL the Phase 2 note cites, https://www.sanity.io/docs/visual-editing-with-astro, now
answers 404, as do https://www.sanity.io/docs/visual-editing/visual-editing-with-astro,
https://www.sanity.io/docs/visual-editing/creating-data-attributes and
https://www.sanity.io/docs/visual-editing/data-attributes; the changelog entry
https://www.sanity.io/docs/changelog/7bbd44fd-fc09-47f3-8431-354d6bdc1a0c dates the move to 30 April 2026),
https://www.sanity.io/docs/visual-editing/stega, https://www.sanity.io/docs/visual-editing/visual-editing-overlays
(the data attributes page), https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool,
https://www.sanity.io/docs/visual-editing/visual-editing-architecture,
https://www.sanity.io/docs/visual-editing/content-source-maps, https://www.sanity.io/docs/content-lake/perspectives,
https://www.sanity.io/docs/studio/system-requirements, https://www.sanity.io/docs/dashboard/dashboard-configure,
https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router (caching only),
https://reference.sanity.io/_sanity/visual-editing/index/createDataAttribute-1/ (signature only),
https://docs.astro.build/en/guides/view-transitions/, https://docs.astro.build/en/reference/modules/astro-transitions/,
https://docs.astro.build/en/reference/api-reference/, https://docs.astro.build/en/guides/caching/,
https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src and the
hydrogen-sanity README (https://raw.githubusercontent.com/sanity-io/hydrogen-sanity/main/packages/hydrogen-sanity/README.md).
This note extends `phase-2-sanity-studio-v6-and-astro.md` (the version table, the integration options, the
README steps, `validatePreviewUrl` and the cookie route shape) and `phase-2-sanity-client-and-image-url.md`
(the client's `StegaConfig`, perspectives and `stegaClean` under Bun); it does not repeat them.

## 1. The VisualEditing island

- Exports and props: `VisualEditing` from `@sanity/astro/visual-editing` is the `.astro` component
  `dist/visual-editing/visual-editing.astro` with `Props extends Pick<VisualEditingOptions, 'zIndex' | 'keepStegaOnCopy'> { enabled?: boolean }`;
  it renders `<VisualEditingComponent client:only="react" zIndex={zIndex} keepStegaOnCopy={keepStegaOnCopy} />`
  when `enabled` is truthy and `null` otherwise, so a page with `enabled={false}` carries no island, no
  script and no overlay markup at all. `VisualEditingComponent` from `@sanity/astro/visual-editing/component`
  (the package exports the `.tsx` source itself) takes
  `Pick<InternalVisualEditingOptions, 'zIndex' | 'refresh' | 'history' | 'keepStegaOnCopy' | 'onSuspiciousStega'>`
  and renders `<InternalVisualEditing portal history=... zIndex=... refresh=... keepStegaOnCopy=... onSuspiciousStega=... />`
  from `@sanity/visual-editing/react`; the inner options also have `plugins`, `components`,
  `onPerspectiveChange` and `onVariantChange`, which the wrapper never forwards. `refresh` cannot be a prop
  of the `.astro` component because "Astro can't serialize functions through to a client component".
  Source: `node_modules/.bun/@sanity+astro@3.5.1+e80a207eef7e2dc4/node_modules/@sanity/astro/dist/visual-editing/visual-editing.astro`
  lines 4 to 15, `.../dist/visual-editing/visual-editing-component.tsx` lines 12 to 15 and 159 to 167,
  `.../package.json` lines 42 to 52 (exports), `.../README.md` lines 276 to 293 and 332,
  `node_modules/.bun/@sanity+visual-editing@5.7.3+f6879f960a8dd91a/node_modules/@sanity/visual-editing/dist/_chunks-dts/types.d.ts`
  lines 362 to 412 (`VisualEditingOptions`) and 384 to 393 (`onPerspectiveChange`, `onVariantChange`),
  `.../dist/react/index.d.ts` lines 11 to 16 (`VisualEditing(props: VisualEditingOptions & {portal: boolean})`).
- It is a React island in every sense: `client:only="react"` on the `.astro` side, and inside
  `@sanity/visual-editing` the component creates a `<sanity-visual-editing>` element, appends it to
  `document.documentElement` (a sibling of `<body>`, not inside it), renders everything through
  `createPortal` into it and removes it in the effect cleanup; the overlay UI is `@sanity/ui` plus
  styled-components (`Root = styled.div` with `z-index: ${$zIndex ?? '9999999'}`, `position: absolute; inset: 0; pointer-events: none`).
  Source: `.../@sanity/visual-editing/src/ui/VisualEditing.tsx` lines 68 to 80 and 138 to 140,
  `.../src/ui/Overlays.tsx` lines 13 to 24 and 52 to 63.
- How it knows it is inside Presentation: `inFrame = isMaybePreviewIframe()` is `window.self !== window.top`
  and `inPopUp = isMaybePreviewWindow()` is `!!window.opener`; the comlink node (`name: 'visual-editing'`,
  `connectTo: 'presentation'`) only starts when one of them is true, and the environment becomes
  `'presentation-iframe'` or `'presentation-window'` once the handshake reports `connected`, else
  `'standalone'` after one second. `useIsPresentationTool()` from the `/react` subpath exposes that as
  `null | boolean`. While unconnected the overlay answers Presentation's `presentation/status` probe by
  posting `visual-editing/status` to `window.parent` only, using the probe's own origin as `targetOrigin`.
  Source: `node_modules/.bun/@sanity+presentation-comlink@2.2.3+eb9255f6c478cbc4/node_modules/@sanity/presentation-comlink/dist/index.js`
  lines 42 to 50, `.../@sanity/visual-editing/src/ui/VisualEditing.tsx` lines 45 to 52, 82 and 90 to 106,
  `.../src/ui/useComlink.tsx` lines 21 to 30 and 52 to 87, `.../dist/react/index.d.ts` lines 19 to 34.
- Refresh: the wrapper's `defaultRefresh` is `new Promise((resolve) => { window.location.reload(); resolve() })`.
  The overlay's `Refresh` component listens for `presentation/refresh`: for `source === 'manual'` it calls
  `refresh(data)`, posts `visual-editing/refreshing`, then `visual-editing/refreshed` when the promise
  settles or after 3000 ms; for `source === 'mutation'` it calls `refresh(data)`, posts `refreshing` and
  calls `refresh` a second time 1000 ms later "to account for Content Lake eventual consistency"; a
  `refresh` that returns `false` skips the cycle. Studio 6.12.0 still sends both: the toolbar button posts
  `{source: 'manual', livePreviewEnabled}` and falls back to its own iframe refresh after 300 ms when no
  overlay is connected, and `PostMessageRefreshMutations` posts `{source: 'mutation', livePreviewEnabled, document: {_id, _type, _rev, slug?}}`
  whenever the `_rev` of the draft, published or version document it watches changes (the comlink typing
  marks the mutation shape deprecated and says the next Studio major will stop sending it). With the default
  refresh every saved change therefore reloads the iframe twice, a second apart, and the manual button once.
  Source: `.../@sanity/astro/dist/visual-editing/visual-editing-component.tsx` lines 19 to 24,
  `.../@sanity/visual-editing/src/ui/Refresh.tsx` lines 20 to 55,
  `packages/content/node_modules/sanity/lib/PresentationToolGrantsCheck-Bx7E3Lne.js` lines 3584 to 3590,
  `packages/content/node_modules/sanity/lib/PostMessageRefreshMutations-ClPJDKPe.js` lines 25 to 33,
  `.../@sanity/presentation-comlink/dist/index.d.ts` lines 102 to 154.
- History adapter: the wrapper's default adapter publishes `{type: 'push', title, url}` to Presentation
  (`visual-editing/navigate`) on `popstate`, `hashchange` and by monkey patching `history.pushState` and
  `history.replaceState`; a capture phase `click` listener on same origin `<a href>` publishes the target
  URL optimistically (forced, with a 1500 ms window) so Presentation's URL bar moves before the navigation
  lands; `subscribe` records the current URL without publishing and keeps publishing alive 200 ms after
  edit mode is toggled off. Navigation coming from Presentation (`presentation/navigate` from its URL bar
  or a location link) is applied with `window.location.assign(url)`, `window.location.replace(url)` or
  `window.history.back()`, that is a full document load. A custom `history` prop switches all of that off.
  Source: `.../@sanity/astro/dist/visual-editing/visual-editing-component.tsx` lines 33 to 39, 40 to 65,
  69 to 104, 106 to 127 and 130 to 157, `.../dist/visual-editing/history.ts` lines 15 to 47,
  `.../@sanity/visual-editing/src/ui/History.tsx` lines 14 to 28,
  `.../@sanity/presentation-comlink/dist/index.d.ts` lines 95 to 99.
- `<ClientRouter />` and the island, verified from the sources rather than the docs:
  - The router intercepts `<a>` clicks, back and forward, and form submits (guide: "Clicks on `<a>` elements.
    Backwards and forwards navigation events."), never `window.location.reload()` or `assign()`; so the
    overlay's refresh and every Presentation driven navigation are full loads that re-run `loadQuery` with
    the cookie. A soft navigation calls `history.replaceState` or `history.pushState` (`router.js`), which
    the patched functions see, so the URL reaches Presentation either way.
    Source: https://docs.astro.build/en/guides/view-transitions/,
    `packages/web/node_modules/astro/dist/transitions/router.js` lines 110 to 125 and 142 to 145.
  - On a soft navigation the `<body>` is replaced ("The `<body>` is completely replaced with the new page's
    body"); the old `<astro-island>` element dispatches `astro:unmount` once it is disconnected after
    `astro:after-swap`, and `@astrojs/react` calls `root.unmount()` on that event for `client:only` roots.
    The overlay's effect cleanups then run: listeners and patches restored, the comlink node stopped, the
    controller destroyed, the `<sanity-visual-editing>` element removed. The new page's island hydrates
    fresh, handshakes again and its controller parses and observes the new `document.body`.
    Source: https://docs.astro.build/en/guides/view-transitions/,
    `packages/web/node_modules/astro/dist/runtime/server/astro-island.prebuilt.js` (`disconnectedCallback`
    re-arms `astro:after-swap` and `unmount` dispatches `astro:unmount` when `!this.isConnected`),
    `node_modules/.bun/@astrojs+react@6.0.5+2683cd9c8d117644/node_modules/@astrojs/react/dist/client.js`
    lines 97 to 106, `.../@sanity/visual-editing/src/ui/useComlink.tsx` lines 35 to 39,
    `.../src/ui/useController.tsx` lines 21 to 36, `.../src/controller.ts` lines 633 to 642 and 668 to 678.
  - `transition:persist` matters and must not be used on this island. A persisted island keeps its state
    ("the island from the old page with its current state will continue to be displayed"), but the overlay
    controller is created once per root element with `mo.observe(document.body, {...})` and
    `parseElements(document.body)`, and `useController` only re-creates it when `element`, `handler`,
    `inFrame`, `inPopUp` or `optimisticActorReady` change; after the body swap it would observe a detached
    body and draw nothing. Astro's `swapBodyElement` moves persisted elements into the new body and drops
    the rest; the overlay host under `<html>` is untouched by the swap (`swapRootAttributes`, `swapHeadElements`,
    `swapBodyElement`), which is harmless because the unmount cleanup removes it. So the island goes at the
    end of `<body>` outside the layout's `transition:persist="oy-dialogs"` wrapper.
    Source: https://docs.astro.build/en/guides/view-transitions/,
    https://docs.astro.build/en/reference/modules/astro-transitions/, `.../src/controller.ts` lines 668 to 678,
    `.../src/ui/useController.tsx` lines 21 to 36, `.../src/ui/VisualEditing.tsx` lines 71 to 79,
    `packages/web/src/layouts/SiteLayout.astro` lines 99 to 121,
    `docs/research/phase-3-astro-actions-transitions-islands.md` lines 169 to 174.
  - The vanilla `enableVisualEditing()` path (not what `@sanity/astro` uses) delays its cleanup by one second
    "to avoid overlays blinking as the parent app transition between URLs"; the React component has no such
    grace, so expect the overlay to disappear for the handshake time on each soft navigation.
    Source: `.../@sanity/visual-editing/src/ui/renderVisualEditing.tsx` lines 30 to 46.
- Copy hygiene and reporting: unless `keepStegaOnCopy` is set, a `copy` listener rewrites the clipboard's
  `text/plain` and `text/html` without stega; `onSuspiciousStega(reports)` (only through the component
  subpath) observes the DOM and reports stega found in an attribute other than `img[alt]`, `time[datetime]`
  or `svg[aria-label]`, anywhere in `<head>`, in `<script>` or `<style>` text, or in a form field value.
  Source: `.../src/ui/VisualEditing.tsx` lines 54 to 66, `.../src/util/stegaCleanOnCopy.ts` lines 36 to 80,
  `.../src/util/suspiciousStega.ts` lines 7 to 18, `.../src/types.ts` lines 527 to 540.

## 2. Stega

- Turning it on: the integration strips only `studioBasePath`, `studioRouterHistory` and `logClientRequests`
  from its options and hands the rest to `createClient(...)` inside the `sanity:client` virtual module, so
  the site client carries `stega: {studioUrl: '/admin'}` with `enabled` defaulting to `false`. A fetch with
  `stega: true` is merged by `_fetchRequest` as `{...client.config().stega, enabled: true}`, so the
  `studioUrl` comes from the config and the encoder, which throws "config.studioUrl must be defined"
  without one, gets it; query params are `stegaClean`ed whenever stega is enabled. `loadQuery` already
  does exactly this under the cookie.
  Source: `node_modules/.bun/@sanity+astro@3.5.1+e80a207eef7e2dc4/node_modules/@sanity/astro/dist/sanity-astro.mjs`
  line 1048 (`createClient(${Er(u)})`) and lines 1526 to 1528 (`fe`),
  `packages/web/node_modules/@sanity/client/dist/config-CgJ16jET.js` lines 77, 98 to 100 and 116 to 120,
  `packages/web/node_modules/@sanity/client/dist/index.js` lines 590 to 591,
  `packages/web/node_modules/@sanity/client/dist/stegaEncodeSourceMap-CO1HKnm2.js` lines 304 to 311,
  `packages/web/astro.config.ts` lines 42 to 49, `packages/web/src/lib/sanity/load-query.ts` lines 47 to 53.
- What gets encoded: `encodeIntoResult` walks the result and touches only string values whose Content
  Source Map mapping is `type: 'value'` with `source.type === 'documentValue'` (a `coalesce()`, a string
  built in GROQ or any `literal`/`unknown` source is left alone); inside Portable Text only the `children`
  of a `_type: 'block'` and the `text` of a `_type: 'span'` are visited. `filterDefault` then skips: values
  that look like a date (`^\d{4}-\d{2}-\d{2}` and `Date.parse` succeeds) or parse as a URL with an allowed
  protocol (`http:`, `https:`, `mailto:`, `tel:`, `data:`, `file:`, `ftp:`, `sms:`, `web+*` and a list of
  app schemes; a value starting with `/` is resolved against a dummy origin, so root relative paths count);
  `slug.current`; a last segment starting with `_` or ending with `Id`; any path containing `meta`,
  `metadata`, `openGraph` or `seo`; any source or result path with a segment matching `/type/i`; and a last
  segment in the 39 name denylist `color colour currency email format gid hex href hsl hsla icon id index key language layout link linkAction locale lqip page path ref rgb rgba route secret slug status tag template theme type textTheme unit url username variant website`.
  Everything else (a title, a quote, a kicker, `alt`, `role`, `kind`, `phone`, an email address, a radio value
  under `layout.*`) is encoded. The docs summarise the same rules.
  Source: `packages/web/node_modules/@sanity/client/dist/stegaEncodeSourceMap-CO1HKnm2.js` lines 198 to 217,
  221 to 236, 237 to 244, 245 to 279 and 280 to 282, https://www.sanity.io/docs/visual-editing/stega.
- The custom filter: `stega.filter({sourcePath, resultPath, sourceDocument, value, filterDefault}) => boolean`
  on the client config, or per request as a `StegaConfig` in place of `stega: true`; `sourcePath` is the
  path in the source document, `resultPath` the path in the result. The docs example returns `false` for a
  document type and for `cssClass`, then defers to `props.filterDefault(props)`.
  Source: `packages/web/node_modules/@sanity/client/dist/types-CfGzbXrl.d.ts` lines 6 to 33 and 49 to 74,
  `packages/web/node_modules/@sanity/client/dist/types-CtHEe8SF.d.ts` lines 9345 to 9364 (`stega?: boolean | StegaConfig`),
  https://www.sanity.io/docs/visual-editing/stega.
- `studioUrl` resolution and the payload: `studioUrl` is a string, a `{baseUrl, workspace?, tool?}` object
  or a function of the source document; a trailing slash is stripped. `createEditUrl` produces
  `<baseUrl>[/<workspace>]/intent/edit/mode=presentation;id=<published id>;type=<type>;path=<encoded path>[;tool=<tool>]?baseUrl=...&id=...&type=...&path=...[&workspace][&tool][&projectId&dataset]`
  and adds `perspective=published` for a published id or the release id for a `versions.<r>.<id>` source;
  `omitCrossDatasetReferenceData` drops `projectId` and `dataset`. The string is combined with
  `vercelStegaCombine(value, {origin: 'sanity.io', href}, false)` (the `false` switches off `@vercel/stega`'s
  own date and URL skipping, since the client already filtered). The encoder JSON stringifies that object,
  UTF-8 encodes it and writes every byte as four characters from U+200B, U+200C, U+200D and U+FEFF (two bits
  each) after a marker of four U+200B; the docs put it at "~200 bytes" of payload and "~800 invisible
  characters per encoded string".
  Source: `packages/web/node_modules/@sanity/client/dist/csm.d.ts` lines 42 to 52 and 62,
  `.../dist/stegaEncodeSourceMap-CO1HKnm2.js` lines 134 to 160, 183 to 189 and 338 to 355,
  `.../dist/stegaClean-YZRATV86.js` lines 18 to 41, https://www.sanity.io/docs/visual-editing/stega.
- `stegaClean(value)` from `@sanity/client/stega` JSON stringifies the value, strips every run of four or
  more characters from the sixteen character alphabet (U+200B to U+200D, U+2060 to U+2064, U+FEFF and
  U+1D173 to U+1D17A) and parses back, so it deep cleans objects and arrays as well as strings; the types
  brand encoded strings as `StegaString` (a template literal suffix plus a `' stegaBrand'` property), which
  makes `=== 'literal'`, `switch` cases and assignment to a literal union a TS2367 error until cleaned;
  `ClientReturnStega<typeof query>` brands a typed result and `stegaBrand(result)` an already fetched one.
  Keys starting with `_`, `slug.current`, string valued `slug` keys and Portable Text internals keep their
  plain type; every other string is assumed poisoned even if the runtime filter skipped it ("Being
  conservative is safe"). `vercelStegaCleanAll` is a deprecated alias.
  Source: `packages/web/node_modules/@sanity/client/dist/stegaClean-YZRATV86.js` lines 1 to 17 and 57 to 76,
  `.../dist/stega.d.ts` lines 23 to 56, 73, 85, 91 to 101 and 108.
- Where stega must not land: the docs list HTML attributes (`class`, `id`, `href`, `src`, `style`, `data-*`),
  page URLs, `<head>` (title, meta content, JSON-LD), `<script>` and `<style>` text and form field values;
  the overlay's own detector uses the same five kinds and treats only `img[alt]`, `time[datetime]` and
  `svg[aria-label]` as expected attribute placements. Dates and URLs are normally skipped by the filter, but
  only when the value itself is ISO shaped or parses as a URL: an email address (`new URL('a@b.org')`
  throws), a phone number and a spelled out date are encoded.
  Source: https://www.sanity.io/docs/visual-editing/stega, `.../@sanity/visual-editing/src/util/suspiciousStega.ts`
  lines 14 to 18, `.../src/types.ts` lines 527 to 540, `.../dist/stegaEncodeSourceMap-CO1HKnm2.js` lines 242 to 279.
- How this repo avoids it, field by field (the Phase 3 chrome already reads with stega whenever the cookie is
  present, so these seams are live today, not only in Phase 4):
  - `settings.theme` into `data-theme`: `theme` is denylisted, never encoded; still `stegaClean` it, the type
    is branded either way. Source: `packages/web/src/layouts/SiteLayout.astro` line 87, the denylist above.
  - `generalEmail` and `phone` into `mailto:` and `tel:` hrefs in the footer and the modal: both are encoded
    (not URL shaped, keys not denylisted), so the hrefs carry the payload under the cookie; clean them in the
    layout before passing `site` down, or filter the two keys. Source: `packages/ui/src/navigation/SiteFooter/SiteFooter.astro`
    lines 81 to 82, `packages/ui/src/forms/EnquiryModal/EnquiryModal.astro` lines 172 to 175,
    `packages/web/src/layouts/SiteLayout.astro` lines 48 to 51.
  - `contacts[].role` compared by `contactsByRole` (layout and action handlers) and `socials[].network`:
    encoded, so role lookups fail in preview; `cta.kind`, `cta.enquiryKind` and every `layout.*` radio
    (`layout.season`, `layout.highlight`, ...) are encoded too because only a last segment equal to
    `layout`, `page`, `variant`, `theme` or `status` is denylisted; `cta.href` is skipped (denylist and URL
    shape). Compare after `stegaClean`, or keep these keys out of stega with a `stega.filter` on the
    integration config (see the recommendation). Source: `packages/content/src/enquiry-kinds.ts` line 412,
    `packages/web/src/layouts/SiteLayout.astro` lines 49 to 51, `packages/web/src/lib/forms/handlers.ts` line 91,
    `packages/content/src/schema/objects/cta.ts` lines 20 to 63, `packages/content/src/schema/singletons/page.ts`
    lines 71 to 84, `packages/content/src/schema/objects/layoutOption.ts` lines 19 to 26.
  - Dates: `new Date(value)` is safe for ISO strings (skipped) and unsafe for any other date text; the
    `<time datetime>` attribute is an expected stega placement, so `datetime={iso}` is fine either way.
    Source: `.../dist/stegaEncodeSourceMap-CO1HKnm2.js` lines 242 to 244, `.../src/util/findSanityNodes.ts` lines 185 to 188.
  - Slugs into hrefs: `slug.current` is skipped by the filter and keeps a plain type, so
    `` `/gallery/${album.slug.current}` `` is safe; a projected `"slug": slug.current` is also skipped at
    runtime (the source path still ends in `slug.current`). Source: `.../dist/stegaEncodeSourceMap-CO1HKnm2.js`
    lines 237 to 241, `.../dist/stega.d.ts` lines 30 to 43.
  - `<head>`: the `seo` object is skipped wholesale (`seo` segment), but a `<title>` or `<meta>` built from
    `hero.title` or a header field is not; clean whatever the layout puts in `<head>` or in JSON-LD.
    Source: `.../dist/stegaEncodeSourceMap-CO1HKnm2.js` line 240, `packages/web/src/layouts/SiteLayout.astro` lines 79 to 86.
  - Attributes in general (`class`, `id`, `data-*`, `aria-*` other than the svg root): clean at the call
    site; and run `onSuspiciousStega` in development to catch what the review misses.
- `resultSourceMap: 'withKeyArraySelector'` adds a `resultSourceMap` to the API response whose array paths use
  `_key` selectors, so an overlay survives reorders; `filterResponse: false` returns `{result, resultSourceMap, ms, query}`
  instead of the bare result, which a page needs only if it wants to build data attributes from the map
  itself (section 3). The docs page on Content Source Maps documents `resultSourceMap=true` and the
  `documents`, `paths` and `mappings` shape; the `withKeyArraySelector` value is documented on the stega page
  and typed on the client.
  Source: `packages/web/node_modules/@sanity/client/dist/types-CtHEe8SF.d.ts` lines 7994 to 7996 and 9367 to 9397,
  https://www.sanity.io/docs/visual-editing/content-source-maps, https://www.sanity.io/docs/visual-editing/stega.

## 3. Click-to-edit for images and non-string fields

- What the overlay looks for, in order, while walking `document.body` (skipping `<script>` and its own host):
  an element with `data-sanity-edit-target` (one overlay for the container, its data being the common
  document and path of the stega or attributes inside it); a text node with stega; an element with
  `data-sanity` (preferred); the legacy `data-sanity-edit-info`; `<img alt>`, `<time datetime>` and
  `<svg aria-label>` carrying stega. `data-sanity-edit-group` groups siblings under one overlay;
  `data-sanity-drag-disable` and `data-sanity-drag-group` govern drag and drop for array items. A click
  posts `visual-editing/focus` with the decoded node and Presentation opens that document at that path.
  Source: `.../@sanity/visual-editing/src/util/findSanityNodes.ts` lines 129 to 197, 207 to 216, 236 to 239
  and 313 to 319, `.../src/ui/Overlays.tsx` lines 128 to 133, https://www.sanity.io/docs/visual-editing/visual-editing-overlays.
- Images through `alt`: the overlay decodes the stega in `img.alt` and strips the `.alt` suffix from the
  edit href, so the click focuses the image object itself, not the alt string; the docs recommend exactly
  this ("editable images via alt text") and reserve `createDataAttribute` for decorative images. Every
  `oyImage` has a required `alt`, so rendering `<img alt={image.alt}>` unfiltered gives click-to-edit for
  every site photo with nothing else to add; the stega detector treats `img[alt]` as expected.
  Source: `.../src/util/findSanityNodes.ts` lines 181 to 184, `.../src/util/stega.ts` lines 24 to 40,
  `.../src/util/suspiciousStega.ts` lines 14 to 18, https://www.sanity.io/docs/visual-editing/visual-editing-overlays,
  `packages/content/src/schema/objects/oyImage.ts` lines 14 to 20.
- The `data-sanity` value: `encodeSanityNodeData` writes `id=<published id>;type=<type>;path=<url path>;base=<encodeURIComponent(baseUrl)>[;workspace=<w>][;tool=<t>]`,
  dropping empty parts; the docs show `id=post-123;type=post;path=mainImage;base=https%3A%2F%2FYOUR_STUDIO_URL`.
  The path form joins field names with `.` and puts `:` before an array index or a `_key`
  (`yearInLife:abc123.alt` for `yearInLife[_key=="abc123"].alt`, `secondaryActions:0.label` for index 0).
  The decoder also accepts a JSON string: either `{id, type, path, baseUrl, workspace?, tool?, projectId?, dataset?, perspective?}`
  (`baseUrl`, `id` and `path` required, `perspective` falling back to `drafts`) or the stega shape
  `{origin: 'sanity.io', href: '<edit intent URL>'}`, which it parses back out of the intent segment. The id
  is normalised with `getPublishedId`, so a `drafts.` id is fine.
  Source: `node_modules/.bun/@sanity+visual-editing-csm@3.0.18+a030b42904506a87/node_modules/@sanity/visual-editing-csm/src/encodeSanityNodeData.ts`
  lines 13 to 33, `.../src/pathToUrlString.ts` lines 6 to 36, `.../src/urlStringToPath.ts` lines 7 to 9,
  `.../src/decodeSanityNodeData.ts` lines 22 to 66, 68 to 108, 114 to 143 and 150 to 163,
  `.../src/sanityNodeSchema.ts` lines 6 to 16, https://www.sanity.io/docs/visual-editing/visual-editing-overlays.
- `createDataAttribute(props)`: props `baseUrl?` (default `/`), `dataset?`, `id`, `path` (string or
  array), `projectId?`, `tool?`, `type`, `workspace?`, `perspective?`; returns a function
  `(subPath?) => string` with `.toString()`, `.scope(path)` (a new builder with the path appended) and
  `.combine(props)` (merged props); it throws "`id` is required", "`type` is required" or "`path` is
  required" when a string is requested without them. `perspective` is accepted but the encoder never
  serialises it (only the JSON form carries it). It lives in `@sanity/visual-editing-csm` (whose README
  says the package "is not meant to be used directly") and is re-exported unchanged by
  `@sanity/visual-editing`, `@sanity/visual-editing/create-data-attribute` and `@sanity/visual-editing/react`.
  `baseUrl` must be the Studio path (`/admin` here): it becomes `base=` in the attribute and the base of the
  intent link Presentation and the "open in Studio" action use.
  Source: `.../@sanity/visual-editing-csm/src/createDataAttribute.ts` lines 17 to 36, 41 to 78 and 85 to 142,
  `.../@sanity/visual-editing-csm/README.md` lines 3 to 4, `.../@sanity/visual-editing/src/create-data-attribute.ts`,
  `.../@sanity/visual-editing/src/react/index.ts` lines 52 to 58, `.../@sanity/visual-editing/dist/index.d.ts` lines 5 and 78,
  https://reference.sanity.io/_sanity/visual-editing/index/createDataAttribute-1/.
- Importability from `packages/web` under Bun's isolated linker: `Bun.resolveSync` from `packages/web` fails
  for `@sanity/visual-editing`, `@sanity/visual-editing/react`, `@sanity/visual-editing-csm` and
  `@sanity/presentation-comlink` ("Cannot find package"), and succeeds for `@sanity/client/csm`,
  `@sanity/client/stega` and `@sanity/astro/visual-editing/component`. The root `node_modules/@sanity`
  holds only `blueprints`; the overlay packages exist only under `node_modules/.bun/...` and are linked into
  their dependents (`@sanity/astro`'s own `node_modules/@sanity/visual-editing`). Vite resolves from the
  importing file the same way, so a site file cannot import `createDataAttribute` from
  `@sanity/visual-editing` until `packages/web/package.json` lists it. All three overlay packages link the
  same `@sanity/client` 8.5.0 build the site uses (Bun satisfied 5.7.3's optional `^7.24.0` peer with it),
  so adding the package would not duplicate the client; `@sanity/visual-editing` 5.7.3 is already in
  `bun.lock` as `@sanity/astro`'s dependency, and `bun add @sanity/visual-editing@5.7.3` would reuse that entry.
  Source: `Bun.resolveSync` runs from `packages/web`, `ls node_modules/@sanity`,
  `readlink node_modules/.bun/@sanity+{astro@3.5.1+e80a207eef7e2dc4,visual-editing@5.7.3+f6879f960a8dd91a,visual-editing-csm@3.0.18+a030b42904506a87}/node_modules/@sanity/client`,
  `bun.lock` lines 1014 to 1016, `.../@sanity/visual-editing/package.json` (`peerDependencies` and `peerDependenciesMeta`),
  `bunfig.toml` (`exact = true`).
- The equivalent in `@sanity/client/csm`: `createEditUrl(options)` (marked `@internal`) and
  `resolveEditUrl({studioUrl, resultSourceMap, resultPath})` (`@alpha`) build the same intent URL the stega
  payload carries, from a Content Source Map (`filterResponse: false` in the loader) and a result path; a
  `data-sanity` holding `JSON.stringify({origin: 'sanity.io', href})` decodes through the legacy branch.
  `studioPath.fromString`/`toString` and `getPublishedId` are exported too. So a site with only
  `@sanity/client` and `@sanity/astro` can produce click-to-edit for non strings in two ways: a ten line
  helper that writes the documented `id=;type=;path=;base=%2Fadmin` string (using `getPublishedId` from
  `@sanity/client/csm`), or `resolveEditUrl` against the source map. The `id=...` string is the format the
  docs publish and `decodeSanityString` reads, so it is the smaller dependency.
  Source: `packages/web/node_modules/@sanity/client/dist/csm.d.ts` lines 26 to 28, 60 to 83, 104, 135 and 163,
  `.../@sanity/visual-editing-csm/src/decodeSanityNodeData.ts` lines 22 to 66 and 114 to 143.
- What stega alone already covers on the homepage, from the schema: every string that renders as a text
  node and reaches the result through a plain projection (the hero `title`, the bilingual kicker's strings,
  `raiseYourHand.title`, testimonial quotes, stat labels, event and news titles, program names, CTA labels)
  and every `oyImage` through its `alt`. What is left: the image object itself when `alt` is not rendered
  (a decorative crop), the `leadEvent` reference (a reference is `_ref`, never encoded; clicking the event's
  own strings focuses the `event` document, and a `data-sanity` with `id: 'homepage', path: 'leadEvent'`
  on the band lets an editor change which event is referenced), numbers and booleans (`stat.value` if it
  is a number: either cast with `string(value)` in GROQ and `Number(stegaClean(...))` in the page, per the
  docs, or a `data-sanity` on the tile), the `layout.*` radios and `cta.kind`, which never render as text:
  put `data-sanity` with `path: 'layout.season'` (and so on) on the section they govern, so a click opens
  the option. `data-sanity-edit-target` on a card gives one overlay for a whole testimonial or stat.
  Source: `packages/content/src/schema/singletons/index.ts` lines 24 to 70 and 82 to 105,
  `.../dist/stegaEncodeSourceMap-CO1HKnm2.js` lines 237 to 241 (`_ref` skipped by the `_` rule),
  https://www.sanity.io/docs/visual-editing/stega (the `string(beds)` cast),
  https://www.sanity.io/docs/visual-editing/visual-editing-overlays.

## 4. The perspective cookie and draft mode

- What the Studio sends: the Presentation perspective is `"published"` or `"drafts"`, or the Studio's
  `perspectiveStack` array when a release (or a scheduled draft, prepended) is selected;
  `encodeStudioPerspective` joins an array with `,` and `definePreviewUrl` puts the result in the
  `sanity-preview-perspective` search param of the enable URL (next to `sanity-preview-secret`,
  `sanity-preview-variant` and `sanity-preview-pathname`); `parsePreviewUrl` reads it verbatim, forwards it
  into `redirectTo` when the pathname lacks it, and `validatePreviewUrl` returns it as
  `studioPreviewPerspective: string | null | undefined` with the warning "The value can be arbitrary and has
  to be validated to make sure it's a valid perspective". So the cookie holds `published`, `drafts` or a
  comma list of release ids (and possibly `drafts`; the exact stack contents are the Studio's, not verified
  here). The repo's `perspectiveFromCookie` splits on commas, which matches that encoding, but validates
  nothing; the docs' Astro guide stores a JSON array when its client side handler writes the cookie and its
  `parsePerspective` accepts both (`[` prefixed JSON or a bare string). The client's `ClientPerspective` is
  `'published' | 'drafts' | 'raw' | StackablePerspective[]` with `ReleaseId = r${string}`; `raw` cannot be
  stacked; a release stack has `published` appended by the API and layers left to right.
  Source: `packages/content/node_modules/sanity/lib/PresentationToolGrantsCheck-Bx7E3Lne.js` lines 1584 to 1586
  and 3374 to 3380, `node_modules/.bun/@sanity+preview-url-secret@4.1.5+3fbf69ac05427f72/node_modules/@sanity/preview-url-secret/src/definePreviewUrl.ts`
  lines 52 to 70, `.../src/parsePreviewUrl.ts` lines 20 to 33, `.../src/types.ts` lines 54 to 59,
  `.../src/constants.ts` lines 31 and 93, `packages/web/src/lib/sanity/preview.ts` lines 34 to 41,
  `packages/web/node_modules/@sanity/client/dist/types-CtHEe8SF.d.ts` lines 7819 to 7827,
  https://www.sanity.io/docs/astro/astro-visual-editing, https://www.sanity.io/docs/content-lake/perspectives,
  `docs/research/phase-2-sanity-client-and-image-url.md` lines 63 to 73.
- What the loader passes: the cookie's perspective as is (a string or the split array), `useCdn: false`
  (the docs: with drafts "you should always explicitly set `useCdn` to `false`"), the Viewer token
  (drafts are never returned unauthenticated), `stega: true` and `resultSourceMap: 'withKeyArraySelector'`;
  the current `loadQuery` does all of this and falls back to `published` without a token. Add validation:
  each part must match `published`, `drafts` or `r<id>`, else treat the cookie as absent.
  Source: `packages/web/src/lib/sanity/load-query.ts` lines 31 to 36 and 43 to 53,
  https://www.sanity.io/docs/content-lake/perspectives, `.../@sanity/preview-url-secret/src/types.ts` lines 54 to 59.
- The enable route runs once per Presentation session: the tool "automatically calls the enable endpoint
  when the preview opens"; the preview URL machine's actors are provided with the perspective of that
  moment, and `@xstate/react`'s `useIdleActorRef` replaces the running actor only when `logic.config`
  changes (a `provide()` keeps the config and only swaps implementations), so a later switch in the
  Presentation toolbar does not re-run `/api/preview/enable`. It reaches the page over comlink instead:
  the overlay asks `visual-editing/fetch-perspective` on connect and listens for
  `presentation/perspective {perspective, variant?}`, then calls `onPerspectiveChange(perspective)`.
  Source: https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool,
  `packages/content/node_modules/sanity/lib/PresentationToolGrantsCheck-Bx7E3Lne.js` lines 4359 to 4395,
  `node_modules/.bun/@xstate+react@6.1.0+3c1bf10c2bdda8fa/node_modules/@xstate/react/dist/xstate-react.cjs.js`
  lines 40 to 63, `.../@sanity/visual-editing/src/ui/usePerspectiveSync.tsx` lines 15 to 49,
  `.../@sanity/presentation-comlink/dist/index.d.ts` lines 176 to 185.
- Why `httpOnly: false`: the overlay itself never reads or writes `document.cookie` (no occurrence in
  `@sanity/visual-editing/src`); the reason is the docs' Astro pattern, whose `SanityVisualEditing.tsx`
  handles `onPerspectiveChange` by writing `document.cookie = "sanity-preview-perspective=<encoded>; path=/; SameSite=None; Secure[; Partitioned]"`
  (`Partitioned` when `window.self !== window.top`) and calling `window.location.reload()`, so that
  `loadQuery` on the next render uses the perspective the editor just picked; the guide states that
  `httpOnly: false` "allows client-side JavaScript to read and modify the cookie" and that the reload is
  needed because the page has no client side data layer. With `@sanity/astro`'s wrapper, which does not
  forward `onPerspectiveChange`, the flag is unused: the cookie keeps the perspective of the enable call
  until the editor reopens the preview or clears it. The repo's cookie is a session cookie (no `maxAge`),
  the generic guide's example uses `Max-Age=3600`; the Studio's own secret expires after an hour
  (`SECRET_TTL`) but the cookie does not follow it.
  Source: `grep -rn document.cookie` over `.../@sanity/visual-editing/src` (no match),
  https://www.sanity.io/docs/astro/astro-visual-editing, https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool,
  `packages/web/src/lib/sanity/preview.ts` lines 19 to 29, `.../@sanity/preview-url-secret/src/constants.ts` line 49,
  https://docs.astro.build/en/reference/api-reference/ (`cookies.set` options `httpOnly`, `maxAge`, `partitioned`, `sameSite`).
- Same origin here: `presentationOptions.previewUrl` has neither `origin` nor `initial`, so
  `definePreviewUrl` uses `location.origin` (the Studio's, that is the site's) and `/`; the enable request
  is same site, `sec-fetch-site` is not `cross-site` and the cookie is never partitioned in production;
  the `partitioned` branch fires only if a separately hosted Studio frames the site. `allowOrigins` defaults
  to the initial URL's origin and a wildcard hostname is refused.
  Source: `packages/content/src/studio/presentation.ts` lines 49 to 54, `.../@sanity/preview-url-secret/src/definePreviewUrl.ts`
  lines 19 to 29, `packages/web/src/lib/sanity/preview.ts` lines 20 to 27,
  `packages/content/node_modules/sanity/lib/PresentationToolGrantsCheck-Bx7E3Lne.js` lines 3837 to 3850.
- Turning draft mode off: Presentation "never calls the disable endpoint"; `/api/preview/disable` expires
  both the plain and the `Partitioned` cookie and redirects to `/`. The docs' Astro guide renders a
  `DisableDraftMode` link to that route only when `useIsPresentationTool() === false` (a preview opened
  outside the Studio, since the "Open preview" window still counts as Presentation); that hook needs the
  `/react` subpath, so it is another reason a direct dependency may be wanted.
  Source: https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool,
  https://www.sanity.io/docs/astro/astro-visual-editing, `packages/web/src/pages/api/preview/disable.ts`,
  `packages/web/src/lib/sanity/preview.ts` lines 44 to 47, `.../@sanity/visual-editing/src/react/useIsPresentationTool.ts`.
- Caching draft responses: neither the Astro guide, the Presentation page nor the architecture page says
  anything about `Cache-Control`; the Next.js guide turns caching off in draft mode (`revalidate: 0`, no
  tags). Astro's `Astro.cache.set(false)` opts a response out ("if (isPersonalized) Astro.cache.set(false)"),
  and the repo's page skill already rules that preview, Studio and API routes call it. So a render with
  `preview: true` must set `Astro.cache.set(false)`, send `Cache-Control: private, no-store` and carry no
  tags; whether the Vercel provider adds `Vary: Cookie` on its own is unverified (wayfinder ticket 21).
  Source: https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router,
  https://docs.astro.build/en/guides/caching/, https://docs.astro.build/en/reference/api-reference/,
  `.claude/skills/oy-page/SKILL.md` lines 29 to 31, `docs/plans/wayfinder.md` lines 100 to 102.

## 5. Presentation locations and main documents

- Main documents: on every preview URL change the tool takes the first `resolve.mainDocuments` entry whose
  `route` matches (a `URLPattern` on the pathname, case insensitive, trailing slash optional, `:param`
  groups), builds `*[_type == "<type>"][0]{_id, _type}` for the `type` shorthand or `*[<filter>][0]{_id, _type}`
  for `filter` (the route params become `$params`), and fetches it with the Studio's current `perspective`
  and `variant` (`tag: 'use-main-document'`); the hit is shown as "Main document" in the list pane; a
  resolver that matches the route but returns nothing sets `{document: undefined, path}` and the pane
  warns "Missing a main document for <path>"; no matching route means no main document. The docs add that
  routes are "evaluated in order" and `type` is the shorthand for `filter: '_type == "x"'`.
  Source: `packages/content/node_modules/sanity/lib/PresentationToolGrantsCheck-Bx7E3Lne.js` lines 2976 to 3000,
  3007 to 3014 and 3090 to 3130, `packages/content/node_modules/sanity/lib/resources-BQcJcDAy.js`
  (`main-document.label`, `main-document.missing.text`), https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool.
- For the homepage: `defineDocuments` gets `{route: '/', type: 'homepage'}` from `ROUTE_SINGLETONS`, so
  `/` resolves `*[_type == "homepage"][0]{_id, _type}` in the drafts perspective and returns the singleton
  whose id is fixed to `homepage` by the structure (`S.document().schemaType(type.name).documentId(type.name)`);
  `newDocumentOptions` keeps a second document of the type from being created and the actions drop delete
  and duplicate, so `[0]` is unambiguous. The docs' own singleton example is the same shape
  (`{route: '/products', type: 'productsListing'}`); the only tighter form is
  `{route: '/', filter: '_id == "homepage"'}`, worth switching to if a stray document of a singleton type
  ever appears. Until the seed has created the document, the pane shows the missing warning.
  Source: `packages/content/src/studio/presentation.ts` lines 55 to 60, `packages/content/src/routes.ts`
  lines 25 to 38, `packages/content/src/studio/structure.ts` lines 36 to 39,
  `packages/content/src/studio/document-options.ts` lines 5 to 10 and 30 to 37,
  https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool.
- The locations banner: `LocationsBanner` renders only for a type with a resolver (`if (!resolvers || status === "empty") return null`);
  its title is `message` when set, else "Used on one page", "Used on {{count}} pages" or "Not used on any
  pages", and "Resolving locations..." while a `select` resolver runs. When the state has no `locations`
  key the banner is a single line with the tone icon (positive, caution, critical); when it has one, the
  banner is a collapsible card (a button when the count is above zero) listing `{title, href}` links that
  navigate the preview. `select` resolvers re-run live as the editor types (docs: "location links update
  in real time").
  Source: `packages/content/node_modules/sanity/lib/presentation.js` line 137 (`LocationsBanner`),
  `packages/content/node_modules/sanity/lib/resources-BQcJcDAy.js` (`locations-banner.*` strings),
  https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool.
- What this repo's resolvers produce: `homepage` gets `{locations: [{title: 'Homepage', href: '/'}]}`
  from `locationsFor`, so the banner reads "Used on one page" with one link (the title comes from the
  singleton's `title`). A `stat` (`TYPE_ROUTES.stat = ['/', '/impact']`) reads "Used on 2 pages" with the
  two page links; the list is the static route map, not a check of where the document is actually used.
  A `testimonial` uses `defineLocations({select: {context}, resolve})` and reads "Used on 4 pages" with the
  context's page first. `siteSettings` sets both `message` and `locations`, so its banner title is
  "Site settings show on every page." over the twelve static routes, and the caution icon is not drawn in
  that branch. Clicking a stat's or a testimonial's string in the homepage overlay focuses that document
  (the source map points at it), whose own banner then shows; the homepage stays the main document.
  Source: `packages/content/src/studio/presentation.ts` lines 9 to 40, 61 to 71 and 110 to 122,
  `packages/content/src/routes.ts` lines 41 to 67, `packages/content/node_modules/sanity/lib/presentation.js` line 137.

## 6. CSP and headers

- Today: `default-src 'self'`; `script-src 'self'` plus PostHog; `style-src 'self'`; `img-src 'self' data: https://cdn.sanity.io`;
  `connect-src 'self'`, PostHog, `https://*.api.sanity.io`, `https://*.apicdn.sanity.io`; `frame-src https://www.zeffy.com`;
  `frame-ancestors 'self'`; report only from the middleware, `/admin` and the report endpoint exempt.
  Source: `packages/web/src/lib/csp.ts` lines 14 to 32 and 48 to 54, `packages/web/src/middleware.ts` lines 44 to 55, `docs/adr/0011-csp-report-only-header-until-phase-9.md`.
- `frame-ancestors`: the page must be frameable by the Studio's origin. With the Studio embedded at `/admin`
  on the same origin, `'self'` is enough (the runbook already says so); a separately hosted Studio or
  Sanity's Dashboard would need its origin added (the Dashboard page: "`'self'` alone is not enough" and
  recommends `https://*.sanity.io`; hydrogen-sanity uses `frameAncestors: [studioHostname]` for a separate
  Studio and `['self']` for an embedded one). The middleware sends no `X-Frame-Options`, which is right,
  `frame-ancestors` supersedes it. The "Open preview" window is not framed and needs nothing.
  Source: `docs/runbook.md` lines 211 to 215, https://www.sanity.io/docs/dashboard/dashboard-configure,
  https://raw.githubusercontent.com/sanity-io/hydrogen-sanity/main/packages/hydrogen-sanity/README.md.
- `script-src`: the island is a bundled module under `/_astro/`, covered by `'self'`; the overlay creates
  elements, never scripts, and injects no inline script. No change.
  Source: `.../@sanity/visual-editing/src/ui/VisualEditing.tsx` lines 68 to 80, `packages/web/src/lib/csp.ts` line 16.
- `connect-src`: the overlay talks to Presentation over `postMessage` only; every `fetch(` in its bundle is
  `comlink.fetch(...)`, a message request, and its documents, schema and preview snapshots arrive over the
  same channel, so no new origin is needed while the browser makes no Sanity calls of its own. The hydrogen
  README adds `https://<projectId>.api.sanity.io` and `wss://<projectId>.api.sanity.io` for live loaders;
  that applies only if Phase 4 ever runs `sanity:client` or a loader in the browser, and the https half is
  already covered by `https://*.api.sanity.io`.
  Source: `.../@sanity/visual-editing/dist/_chunks-es/VisualEditing.js` lines 1425, 1494, 1522, 1654, 1732,
  2226 and 2251 (all `comlink2.fetch(...)`), `.../src/ui/useComlink.tsx` lines 21 to 29,
  https://raw.githubusercontent.com/sanity-io/hydrogen-sanity/main/packages/hydrogen-sanity/README.md.
- `img-src`: preview snapshots exclude `media` ("as it's not serializable"), so the overlay draws no CDN
  images; `https://cdn.sanity.io` stays for the site's own photos. No change.
  Source: `node_modules/.bun/@sanity+visual-editing-types@2.1.1+4c768f8057fd22eb/node_modules/@sanity/visual-editing-types/src/index.ts` lines 232 to 237.
- `style-src` is the one directive the overlay touches. `@sanity/ui` and the overlay are styled-components 6:
  in a production bundle styled-components inserts rules through CSSOM (`insertRule`), which CSP does not
  block ("no browser currently blocks these methods"), but `DISABLE_SPEEDY` is on whenever
  `process.env.NODE_ENV !== 'production'`, so under `astro dev` it writes CSS text into `<style>` elements,
  which `style-src 'self'` blocks without `'unsafe-inline'`, a hash or a nonce (styled-components reads a
  nonce from `<meta property="csp-nonce">`, `<meta name="sc-nonce">` or `__webpack_nonce__`). The overlay's
  positioning uses `element.style.cursor`, `style.setProperty('--drag-preview-x', ...)` and React `style`
  props, which set properties on `element.style` and are allowed; `setAttribute('style')` and `cssText`
  would not be. Expect `style-src` reports from the overlay in development only, and none in production
  unless the report endpoint proves otherwise; the runbook's Phase 9 options (`'unsafe-inline'` for styles,
  hashes, or a nonce) should count the overlay in, with the `csp-nonce` meta as the styled-components hook.
  Source: `node_modules/.bun/styled-components@6.5.3+005eabf3d8b6ef06/node_modules/styled-components/dist/styled-components.browser.esm.js`
  (`DISABLE_SPEEDY`, `insertRule`, the `csp-nonce` and `sc-nonce` lookups),
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src,
  `.../@sanity/visual-editing/src/ui/Overlays.tsx` lines 157 to 159 and 266 to 267, `docs/runbook.md` lines 217 to 220.
- The Studio iframe's own needs are moot while `/admin` is exempt, but for Phase 9's record: the Studio
  reaches `*.sanity.io`, `*.api.sanity.io`, `*.apicdn.sanity.io`, `cdn.sanity.io`, `*.sanity-cdn.com`
  (Sanity: "allowlisting `*.sanity.io` and `*.sanity-cdn.com` covers all required domains") plus Google
  avatars (`https://lh3.googleusercontent.com` in the hydrogen list), all over HTTP/2 on 443; CORS with
  credentials for the site origin is a project setting the runbook already covers.
  Source: https://www.sanity.io/docs/studio/system-requirements, the hydrogen README above, `docs/runbook.md` lines 65 to 69.
- Cookies and caching headers are in section 4; nothing else in the middleware needs to change for the
  overlay.

## Repo fit

- `.claude/skills/oy-page/SKILL.md` step 6 says text "carries `data-sanity` automatically"; stega carries
  the edit link inside the text itself, and `data-sanity` is the attribute written by hand for non strings.
  Source: `.claude/skills/oy-page/SKILL.md` lines 27 to 28, sections 2 and 3 above.
- `docs/design/README.md` names `<SanityVisualEditing />`; the docs' Astro guide now ships a site file called
  `SanityVisualEditing.tsx` that wraps `VisualEditing` from `@sanity/visual-editing/react`, so the brief's
  name matches a file the site would write, not an export.
  Source: `docs/design/README.md` line 172, https://www.sanity.io/docs/astro/astro-visual-editing.
- The Phase 3 chrome already reads with stega under the cookie: the `mailto:`/`tel:` hrefs, `contactsByRole`
  and the `cta.kind` branches listed in section 2 are live seams the moment an editor opens Presentation.
  Source: section 2 above.
- `SANITY_PREVIEW_SECRET` stays unread: the Presentation tool writes its own `sanity.previewUrlSecret`
  documents and `validatePreviewUrl` checks those.
  Source: `docs/runbook.md` line 19, `docs/research/phase-2-sanity-studio-v6-and-astro.md` lines 165 to 173.

## Recommendation for Phase 4

Concrete wiring:

- The island: in `SiteLayout.astro`, `import { VisualEditing } from '@sanity/astro/visual-editing'` and
  render `<VisualEditing enabled={preview} />` as the last child of `<body>`, after the
  `transition:persist="oy-dialogs"` wrapper and never inside it, where `preview` is the `preview` flag the
  layout's `loadQuery(siteSettingsQuery)` call already returns. Keep the default refresh (a full reload, as
  the docs' Astro guide does) for the first cut. Optional second step through
  `@sanity/astro/visual-editing/component` in an own `.tsx` island: `onSuspiciousStega` logging when
  `import.meta.env.DEV`, and a `refresh` of `navigate(location.href, {history: 'replace'})` from
  `astro:transitions/client` that keeps the cross fade and the persisted dialogs (unverified in a browser;
  resolve the promise immediately, as the default does, and let the swap remount the island).
- The loader: validate the cookie (each comma separated part `published`, `drafts` or `r[A-Za-z0-9]+`,
  and accept the JSON array form the docs' handler writes), keep `stega: true`,
  `resultSourceMap: 'withKeyArraySelector'`, `useCdn: false` and the token, and when `preview` is true
  call `Astro.cache.set(false)`, set `Cache-Control: private, no-store` and attach no tags. Add a
  `stega.filter` to the integration config that returns `false` when `sourcePath[0] === 'layout'` or the
  last segment is one of `role`, `kind`, `enquiryKind`, `network`, `generalEmail`, `phone`, `group`,
  `context`, `scope`, and defers to `filterDefault` otherwise, so the strings the site compares or links
  never carry stega; `stegaClean` everything that goes into `<head>`, JSON-LD, an attribute, a `new Date()`
  of non ISO text or a `switch`. Consider returning `StegaBranded` results from `loadQuery` so the
  compiler flags every unclean comparison.
- Images and non strings: render `alt` from Sanity unfiltered (click-to-edit for every `oyImage` through
  the alt path); add `packages/web/src/lib/sanity/data-attribute.ts` with a helper that writes
  `id=<getPublishedId(id)>;type=<type>;path=<path>;base=%2Fadmin` (the documented format, `getPublishedId`
  from `@sanity/client/csm`, `STUDIO_BASE_PATH` for `base`), and use it for decorative images, the lead
  event band (`path: 'leadEvent'`), numeric stats and each layout governed section (`path: 'layout.<name>'`);
  `data-sanity-edit-target` on testimonial and stat cards. This needs no new dependency.
- Presentation: keep the `type` resolvers for the singletons; nothing to add to `previewUrl` or
  `allowOrigins` while Studio and site share an origin. Switch the homepage to `filter: '_id == "homepage"'`
  only if a duplicate ever appears.
- CSP: no allow list change for the overlay; note the expected development `style-src` reports and add the
  overlay (styled-components' `csp-nonce` meta) to the Phase 9 decision in the runbook.
- Checks: a Playwright spec that opens `/` with the cookie set (needs the Viewer token) and asserts a
  `<sanity-visual-editing>` host and a stega marker (four U+200B) inside a text node, and that neither
  appears without the cookie; a unit test for the data attribute helper against `decodeSanityNodeData`'s
  format; a grep that no `data-sanity` or stega lands in `<head>`.

Open questions:

- Add `@sanity/visual-editing` as a direct dependency of `packages/web`? Not needed for image click-to-edit
  (the alt path and the documented `id=;type=;path=;base=` string cover it), and 5.7.3 is already in the
  lockfile through `@sanity/astro`, so adding it costs no bytes. It becomes necessary only for the official
  `createDataAttribute` builder (`scope`, `combine`), for `onPerspectiveChange` (switching the perspective
  in the Presentation toolbar without reopening the preview) and for `useIsPresentationTool` (the docs'
  "Disable draft mode" link), all of which mean rendering `VisualEditing` from `@sanity/visual-editing/react`
  in an own island instead of `@sanity/astro/visual-editing`. If added, 5.7.3 (matches `@sanity/astro`'s
  copy) or 6.1.2 (peers `@sanity/client ^7.26.2 || ^8.0.0`, the Phase 2 note's option; `@sanity/astro` 3.5.2
  with visual-editing v6 is still unreleased) is the owner's call.
- Two full reloads per saved change (the mutation refresh plus its one second retry): acceptable, or should
  `refresh` return `false` for `source === 'mutation'` and leave refreshing to the toolbar button, or use
  the `navigate()` swap above?
- Whether `Astro.cache` or the Vercel provider varies on `Cookie` by itself, or whether `Cache-Control: private, no-store`
  under `preview` is the whole answer (wayfinder ticket 21).
- Cookie lifetime: session cookie (today) or an hour to match the Studio secret's `SECRET_TTL`.
- Whether to brand `loadQuery` results with `StegaBranded` (compile time safety at the cost of `stegaClean`
  calls in every component that compares a string).
- The `navigate()` based refresh and the overlay's remount timing across the cross fade are unverified in a
  browser; so is the exact content of the Studio's release perspective stack in the cookie.
