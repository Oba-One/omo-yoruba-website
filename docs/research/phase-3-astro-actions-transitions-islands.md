# Astro 7: actions, ClientRouter, server islands, cache, dialog

Date: 11 September 2026. Sources: the shipped Astro 7.3.1 package at
`packages/web/node_modules/astro` (paths below are relative to it, line numbers from the
built files); https://docs.astro.build/en/guides/ `actions`, `view-transitions`,
`server-islands`, `caching`, `environment-variables`, and `/en/reference/api-reference/`,
`/en/reference/modules/astro-actions/`, `/en/reference/modules/astro-transitions/`; the
GitHub release notes for astro@7.0.0 to 7.3.1; `@astrojs/vercel` 11.0.10 as installed; MDN
and its browser-compat-data (`html/elements/dialog.json`, `api/HTMLDialogElement.json`);
the WHATWG HTML spec (dialog section); https://vercel.com/docs/caching/cdn-cache.

## A. Actions (`astro:actions`)

### defineAction, context, Zod

- `defineAction({ accept?: 'form' | 'json', input?, handler })`, `accept` defaults to
  `'json'` (reference). The generic is `TInputSchema extends z.$ZodType` with `z` from
  `zod/v4/core` (`dist/actions/runtime/server.d.ts` line 5); `accept: 'form'` without
  `input` hands the handler the raw `FormData` (`dist/actions/runtime/server.js` line 52).
- The handler's second argument is `ActionAPIContext`, a `Pick` of `APIContext`: `request`,
  `url`, `isPrerendered`, `locals`, `clientAddress`, `cookies`, `currentLocale`,
  `generator`, `routePattern`, `site`, `params`, `preferredLocale`, `preferredLocaleList`,
  `originPathname`, `session`, `cache`, `csp`, `logger` (`dist/actions/runtime/types.d.ts`
  line 52). No `redirect` or `rewrite` in the type; the runtime strips `props`,
  `getActionResult`, `callAction` and `redirect` (`server.js` line 118). Actions are public
  endpoints and need the same authorisation checks as API routes (guide, "Security").
- Astro 7.3.1 depends on `zod ^4.5.4` (`package.json` line 155), linked by Bun to the
  `zod@4.5.4` copy `@oy/content` pins. `astro/zod` re-exports `zod/v4` (`dist/zod.js`) and
  is the import the docs show; `astro:schema` still resolves but is deprecated and removed
  in Astro 8 (`client.d.ts` lines 156 to 172). `input` accepts any Zod 4 schema: the `zod`
  package's `ZodType` extends `core.$ZodType` and `ZodObject` extends `core.$ZodObject`
  (zod `v4/classic/schemas.d.ts` lines 7, 478 to 480), so a schema exported by
  `@oy/content` satisfies `TInputSchema`; the parser's `instanceof z.$ZodObject` checks
  (`server.js` lines 62, 219 to 256) use Zod 4's `Symbol.hasInstance` trait branding
  (`v4/core/core.js` lines 112 to 117), which holds across zod copies. `packages/web` has
  no `zod` of its own: import `astro/zod` there.

### ActionError, input errors, `fields`

- `new ActionError({ code, message?, stack? })`. `code` is a key of `codeToStatusMap`: 39
  IANA names from `BAD_REQUEST` 400 to `NETWORK_AUTHENTICATION_REQUIRED` 511, among them
  `UNAUTHORIZED` 401, `FORBIDDEN` 403, `NOT_FOUND` 404, `CONFLICT` 409, `CONTENT_TOO_LARGE`
  413 (no `PAYLOAD_TOO_LARGE`, whatever the reference's prose example says),
  `UNSUPPORTED_MEDIA_TYPE` 415, `UNPROCESSABLE_CONTENT` 422, `TOO_MANY_REQUESTS` 429,
  `INTERNAL_SERVER_ERROR` 500, `SERVICE_UNAVAILABLE` 503
  (`dist/actions/runtime/client.js` lines 4 to 45). `status` derives from the code (line
  56); any other thrown value becomes `INTERNAL_SERVER_ERROR` (`server.js` lines 298 to 314).
- Validation failure throws `ActionInputError`: `code: 'BAD_REQUEST'`, `type:
  'AstroActionInputError'`, `issues: $ZodIssue[]` and `fields`, a map from the first path
  segment of each issue to its messages (`client.js` lines 85 to 107; `client.d.ts` lines
  58 to 67). `isInputError(error)` narrows to it and types `fields` by the schema keys.
- Errors serialise as `{ type, issues, fields }` with their status; `data` uses devalue,
  `undefined` becomes a 204, a returned `Response` throws (`server.js` lines 315 to 369).

### `accept: 'form'` parsing, extra fields, honeypots

- Form actions accept `application/x-www-form-urlencoded` and `multipart/form-data`, JSON
  actions `application/json`; anything else is `UNSUPPORTED_MEDIA_TYPE`, a body over
  `security.actionBodySizeLimit` (1 MB) is `CONTENT_TOO_LARGE` (`server.js` lines 156 to 206).
- `formDataToObject` walks the schema's `shape`; a key the schema does not declare is never
  read unless the object has a `catchall` (`server.js` lines 213 to 216). Plain
  `z.object()` has none, so an undeclared honeypot is dropped before Zod runs.
  `z.strictObject()` or `.strict()` set `catchall: z.never()` (zod `v4/classic/schemas.js`
  lines 835, 874 to 878): then every posted key is collected and an unknown one fails under
  `fields.<key>`. A declared honeypot such as `website: z.string().max(0).optional()` works
  because an empty value becomes `undefined` for an optional field and `null` otherwise
  (lines 275 to 281; guide: "Empty values are converted to `null` except when validating
  arrays or booleans").

### Form POST without JavaScript

- Markup: `<form method="POST" action={actions.contact}>`. The action's `toString()` is
  `?_action=<name>` (`client.js` lines 154 to 157, 193 to 196), so the browser posts to the
  current page with that query string. Pages must be rendered on demand; add
  `enctype="multipart/form-data"` for file inputs (guide).
- Pipeline: `handleMiddleware` wraps `actionsAndPages`, which runs `handleAction` before the
  page renders (`dist/core/routing/handler.js` lines 23 to 31, 80, 86). For a form POST the
  result is stored in `locals._actionPayload` and rendering continues; only RPC calls
  return a Response directly (`dist/actions/handler.js` lines 21 to 39). No automatic
  redirect. The page's status becomes the error's status, so a validation failure
  re-renders with 400 (`dist/core/fetch/fetch-state.js` lines 277 to 281).
- `Astro.getActionResult(actions.contact)` returns `{ data, error }` when the stored
  `actionName` matches, else `undefined` (`dist/actions/utils.js` lines 7 to 14). Guide:
  the result "will be reset to `undefined` when a user closes and revisits the page" and a
  refresh shows the browser's "confirm form resubmission?" dialog.
- Kept values: guide, "Inputs will be cleared whenever a form is submitted. To persist
  input values, you can enable view transitions and apply the `transition:persist`
  directive to each input". Inference from code, not documented: the action reads
  `request.clone()` (`server.js` lines 171 to 188), so after a failed POST the page can
  still `await Astro.request.formData()` and echo the values into `value` attributes.
- PRG: "Redirect on action success" is `Astro.getActionResult` then `return
  Astro.redirect(...)` in the page. "Advanced: Persist action results with a session"
  (added 5.0.0) is middleware calling `getActionContext(context)`: when
  `action.calledFrom === 'form'`, run `action.handler()`, store
  `serializeActionResult(result)` under a cookie id, redirect to `context.originPathname`
  (the `Referer` on error), replay it on the next GET with `setActionResult`, which disables
  Astro's own handling (guide; `server.d.ts` lines 10 to 38). `Astro.callAction` runs a
  handler server side with the page's context (`utils.js` lines 15 to 21).
- CSRF: `security.checkOrigin` defaults to `true` (`config.d.ts` lines 609 to 616); a POST
  whose `Origin` differs from the URL origin gets a 403 before the handler runs
  (`dist/core/app/origin-check.js` lines 2 to 22; `handler.js` lines 16 to 18).

### With JavaScript

- `await actions.contact(formData)` POSTs to `/_actions/contact` with `Accept:
  application/json`, the `FormData` as is (JSON input gets `Content-Type:
  application/json`), and resolves to `{ data, error }`; `.orThrow()` throws instead
  (`dist/actions/runtime/entrypoints/client.js` lines 27 to 81). The RPC route exports
  `POST` only. `getActionPath(actions.contact)` returns `/_actions/contact` for a manual
  `fetch` with `keepalive` or `navigator.sendBeacon` (`client.js` lines 158 to 177;
  reference, added 5.1.0).
- Guide pattern (under "Validating form data"): a `submit` listener calls
  `event.preventDefault()`, builds `new FormData(form)`, awaits the action and calls
  `navigate('/confirmation')` when `!error`. Without the listener the browser's native POST
  is the fallback, so one markup serves both paths.

### Secrets, env and route caching inside actions

- Actions are server modules: `import.meta.env` works ("All environment variables are
  available in server-side code", env guide) and `getSecret('NAME')` from
  `astro:env/server` reads at runtime; `@astrojs/vercel` declares `envGetSecret: "stable"`
  and wires `setGetEnv((key) => process.env[key])` (`@astrojs/vercel/dist/index.js` line 67;
  `dist/serverless/entrypoint.js` line 12).
- `context.cache` is the per-request `AstroCache` the page uses, so `context.cache.set(false)`
  in a handler strips cache headers from that request's response, page render or RPC alike.
  Nothing caches `/_actions/*` on its own: the route is POST only, `routeRules` are
  pre-applied by matching `state.pathname` (`dist/core/cache/handler.js` lines 28 to 42),
  and the memory provider skips every non-GET request
  (`dist/core/cache/memory-provider.js` lines 229 to 231). Caveats: a broad rule such as
  `'/[...path]'` also matches `/_actions/x` and `/_server-islands/x`
  (`dist/core/cache/runtime/route-matching.js` lines 5 to 24), and `applyCacheHeaders`
  never checks the method (`dist/core/cache/runtime/cache.js` lines 70 to 81), so a form
  POST re-render of a page with a rule carries cache headers. Harmless on Vercel, whose CDN
  caches only `GET` or `HEAD` responses without `set-cookie` (Vercel docs).

## B. `<ClientRouter />` and view transitions

- `import { ClientRouter, fade, slide } from 'astro:transitions'`; `navigate`,
  `supportsViewTransitions`, `transitionEnabledOnThisPage`, `getFallback` and
  `swapFunctions` come from `astro:transitions/client` (`dist/transitions/router.d.ts`).
- `fallback` is `'animate' | 'swap' | 'none'`, default `'animate'`
  (`components/ClientRouter.astro` lines 2 to 8), written to a meta tag (line 26).
- `fade({ duration })` and `slide({ duration })` take `string | number`, numbers are
  milliseconds; fade defaults to 180 ms, `cubic-bezier(0.76, 0, 0.24, 1)`, `fillMode:
  'both'` (`dist/transitions/index.d.ts` lines 2 to 6; `index.js` lines 43 to 64;
  `dist/runtime/server/transition.js` lines 168 to 170). A custom value is a
  `TransitionDirectionalAnimations` object: `forwards` and `backwards`, each `old` and
  `new`, each `{ name, delay?, duration?, easing?, fillMode?, direction? }` or an array
  (`dist/types/public/view-transitions.d.ts` lines 2 to 18).
- Whole page: the guide sets the page default on `<html>` (`<html transition:animate="none">`
  with `<main transition:animate="slide">`); the generated fallback CSS has a root selector
  (`transition.js` lines 99 to 101, 111 to 112), so
  `<html transition:animate={fade({ duration: '380ms' })}>` is supported.
- Reduced motion: `components/viewtransitions.css` lines 56 to 66 (injected by
  `dist/core/compile/compile.js` line 38) set `animation: none !important` on
  `::view-transition-group`, `-old` and `-new(*)` and on `[data-astro-transition-scope]`
  under `@media (prefers-reduced-motion)`. `router.js` has no media-query check; the
  component only warns in dev (`ClientRouter.astro` lines 57 to 61). Guide: it "includes a
  CSS media query that disables _all_ view transition animations, including fallback
  animation, whenever the `prefers-reduced-motion` setting is detected", the DOM is swapped.
- Lifecycle, in order: `astro:before-preparation` (cancelable; `loader` writable;
  `formData`), `astro:after-preparation`, `astro:before-swap` (`swap` writable;
  `viewTransition`), `astro:after-swap`, `astro:page-load` (`view-transitions.d.ts` lines
  19 to 26; `dist/transitions/events.js` lines 52 to 56, 99 to 124). `astro:page-load` fires
  after the new page's scripts ran (`router.js` lines 350 to 354) and on first `load` (414).
- Loading indicator (guide, "astro:before-preparation"): replace `event.loader` with an
  async function that shows the indicator, awaits the original loader, then hides it; the
  "astro:after-preparation" example adds and removes a class on `#loading` instead.
- `transition:persist`: matched by `data-astro-transition-persist` id, moved with
  `Node.moveBefore` where available, else `appendChild` plus `replaceWith`
  (`dist/transitions/swap-functions.js` lines 93 to 124). MDN: `moveBefore` preserves
  "Modal state of `<dialog>` elements (modal dialogs will not be closed)" but is "Limited
  availability", so an open persisted dialog survives navigation only there. Focus survives
  only inside a persisted element (lines 152 to 173); animations restart, iframes reload.
- Scripts: every script is recorded by `src` or text and, after a swap, skipped unless it
  has `data-astro-rerun` (`router.js` lines 444 to 447; `swap-functions.js` lines 28 to 45).
  Guide: module scripts "are only ever executed once"; use `astro:page-load` to re-init.
- Links and forms: `data-astro-reload` on `<a>` or `<form>` hands navigation to the browser
  (`ClientRouter.astro` lines 45 to 47, 86 to 97, 112). `submit` is intercepted unless
  `event.defaultPrevented`, the form has `data-astro-reload`, its method is `dialog` or the
  action is cross origin (lines 105 to 148); POST bodies go as `multipart/form-data` unless
  `enctype` is `application/x-www-form-urlencoded` (`router.js` lines 260 to 264). A dialog
  form whose own handler calls `preventDefault()` is therefore never routed.
- CSP: unchanged in 7.3.1, `security.csp` still says "Astro's view transitions using the
  `<ClientRouter />` are not supported" (`config.d.ts` line 750); 7.1.0 only added the
  `kind` option and the 7.3.x notes are silent.

## C. Server islands

- `<Component server:defer>` with `<div slot="fallback">...</div>` as a child. The page
  streams the fallback, then a `<script type="module" data-astro-rerun data-island-id>`
  fetches the island (`dist/runtime/server/render/server-islands.js` lines 57 to 70): a
  GET to `/_server-islands/<name>?e=&p=&s=` (encrypted export, props, slots) with a
  `<link rel="preload" as="fetch">`, or a POST with a JSON body when the URL would reach
  2048 characters (lines 25 to 29, 131 to 176; guide). The route `/_server-islands/[name]`
  is `prerender: false` (`dist/core/server-islands/endpoint.js` lines 11 to 31).
- Props must be serialisable: plain object, number, string, Array, Map, Set, RegExp, Date,
  BigInt, URL, typed arrays, Infinity (guide); the `server:*` props are stripped first
  (lines 110 to 114). Props and slots are encrypted with the build key; set `ASTRO_KEY`
  from `astro create-key` on multi-instance hosts (guide). Island POST bodies are capped at
  1 MB by default (`endpoint.js` lines 42 to 88).
- Inside the island `Astro.cookies`, `Astro.request.headers`, `Astro.locals` and env behave
  as in any on-demand route; `Astro.url` is the island URL, the page URL sits in the
  `Referer` header (guide, "Accessing the page URL"). Islands need an adapter and on-demand
  rendering (guide), which `output: 'server'` on Vercel provides.
- Caching: the island request runs the whole pipeline again and gets its own `AstroCache`,
  pre-filled only by a `routeRules` pattern that matches `/_server-islands/<name>`, plus
  whatever the island component sets with `Astro.cache.set()`; the page's options do not
  apply to it. The memory provider caches only GET; the guide notes POST island requests
  "are not cached by browsers".
- Placement: the replacer needs only the placeholder comment and the island script, then
  inserts the fetched HTML with `createContextualFragment` (lines 184 to 200), so an island
  inside a `<dialog>` works and its HTML may contain an `<iframe>`; the docs say nothing
  either way. The script is `data-astro-rerun`, so the ClientRouter refetches it per page.

## D. `Astro.cache` on 7.3.1

- `CacheLike`: `enabled`, `set(options | false)`, `tags`, `options`, `invalidate({ tags }
  | { path })` (`dist/core/cache/runtime/cache.d.ts` lines 2 to 21). `set(false)` clears
  tags and options and opts the request out (`runtime/cache.js` lines 15 to 21); API routes
  call `context.cache.set(false)` (`context.d.ts` line 217), actions `context.cache`. Dev: no-op.
- `routeRules` is a top-level config key, `Record<string, { maxAge?, swr?, tags? }>`
  (`config.d.ts` lines 3173 to 3196; `dist/core/cache/types.d.ts` lines 54 to 68);
  patterns use `[param]` and `[...rest]`, sorted by route priority, first match wins.
- Vercel provider: `Vercel-CDN-Cache-Control` (`public` plus max-age and swr),
  `Vercel-Cache-Tag` (the tags plus a path tag), invalidation through `invalidateByTag`
  from `@vercel/functions` (`@astrojs/vercel/dist/cache/provider.js` lines 10 to 27).
  Vercel caches only `GET` or `HEAD`, statuses 200, 404, 410, 301, 302, 307, 308, no
  `set-cookie`, no `Authorization`, under 10 MB (Vercel docs).

## E. `<dialog>` facts (MDN, BCD, HTML spec)

- `showModal()` shows the dialog in the top layer with `::backdrop` and makes the rest of
  the document inert; it throws `InvalidStateError` if already open non-modally (MDN
  showModal). Support for `<dialog>`, `showModal`, `close`, the `cancel` and `close`
  events: Chrome 37, Firefox 98, Safari 15.4, iOS Safari 15.4 (BCD, `safari_ios` mirrors
  `safari`); Baseline since March 2022.
- Escape: "a dialog invoked by the `showModal()` method can be dismissed by pressing the
  Esc key"; non-modal dialogs are not. Esc is a close request: `cancel` fires first, is
  cancelable and does not bubble, and unless prevented the dialog closes and `close`
  fires (MDN cancel event). `close()` cannot be cancelled; `requestClose()` (Chrome 134,
  Firefox 139, Safari 18.4) goes through `cancel`.
- Focus: on open "focus is set on the first nested focusable element"; put `autofocus` on
  the element the user should act on first, the close button if nothing else, or the
  dialog itself; no `tabindex` on `<dialog>`; `showModal()` implies `aria-modal="true"`
  (MDN dialog element). `autofocus` inside a dialog applies when the dialog is shown, one
  per dialog, and MDN cautions it can disorient screen reader users. Spec: the dialog
  focusing steps pick the `autofocus` element, else the focus delegate, else the dialog;
  the "previously focused element" is recorded at `show()` or `showModal()`; on close, if
  focus is inside the dialog or it was modal, the focusing steps run for that element, so
  focus returns to the opener (HTML spec, "close the dialog"). MDN does not spell it out.
- `closedby="any" | "closerequest" | "none"`: `any` adds light dismiss (click outside);
  the default for `showModal()` is `closerequest`, otherwise `none` (MDN closedBy).
  Support: Chrome 134, Firefox 141, Safari "preview" only (BCD; standard track, not
  Baseline): progressive enhancement, with a backdrop click handler as the fallback. Do not
  toggle `open` by hand; `<form method="dialog">` closes and sets `returnValue` (MDN).
