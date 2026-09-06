# Phase 2: Sanity Functions, Blueprints and Resend verified before writing the two functions

Date: 5 September 2026. Method: `npm view <pkg> version|engines|peerDependencies|time` against the
npm registry; the packages installed into a scratch directory with Bun 1.4.2 (paths of the form
`node_modules/...` refer to that install, which also holds `sanity` 6.12.0 so the CLI's own `--help`
and the `@sanity/runtime-cli` 17.12.0 code behind every `blueprints` and `functions` command could
be read); the primary docs named per bullet; the two GitHub changelogs. Every pin is exact
(`bunfig.toml` sets `exact = true`). `@sanity/runtime` does not exist on the registry (E404).

| Package | Pinned | Latest on registry | Why this pin |
| --- | --- | --- | --- |
| `@sanity/functions` | recommended 1.7.1 | 1.7.1 (2026-08-27) | Types and `documentEventHandler` only. `engines.node >=22`. Peers on five `@aws-lite/*` packages (durables); Bun installed them among the 21 packages. 1.7.x added the alpha durable retry API, nothing document related. |
| `@sanity/blueprints` | recommended 0.24.0 | 0.24.0 (2026-08-25) | README: "currently in beta and may change". `engines.node >=22`, optional peer `vite >= 8` (Astro 7 brings Vite 8). 0.24.0: "make robot token membership scope optional"; the event model dates from 0.2.0 (2025-08-20). |
| `resend` | recommended 6.26.0 | 6.26.0 (2026-09-03) | `engines.node >=20`, ESM (`index.mjs`) and CJS builds, optional peer `@react-email/render`, deps `postal-mime`, `standardwebhooks`; the SDK sets Resend's mandatory `User-Agent` itself. |
| `@sanity/client` | recommended 8.5.0 | 8.5.0 (2026-09-03) | `engines.node >=22.12.0`; `createClient(context.clientOptions)`; `Patch.ifRevisionId`; alpha `collaboration.comments` (8.2.0). Same pin as `phase-0-stack-versions.md`. |
| `sanity` | recommended 6.12.0 | 6.12.0 (2026-09-05) | Its `bin/sanity` (`#!/usr/bin/env node`) runs `@sanity/cli` 8.9.1, which depends on `@sanity/runtime-cli ^17.12.0` (17.12.0, 2026-09-02, `engines.node >=22.12`); no separate pin. |

## Events: what `on` accepts and what fires for an API-created published document

- Type at 0.24.0: `BlueprintFunctionResourceEventName = 'publish' | 'create' | 'delete' | 'update'`;
  `on` is a non-empty array and defaults to `['publish']` when omitted. `functions add --type` still
  offers `document-publish`; `functions test --event` accepts only `create|update|delete`. Sources:
  `node_modules/@sanity/blueprints/dist/types/functions/event.d.ts`,
  `node_modules/@sanity/blueprints/src/definers/functions/document.ts`, `sanity functions add
  --help`, `sanity functions test --help` (@sanity/cli 8.9.1).
- Reference page: `create` "Activates when a document is created", `update` "Activates when a
  document is updated", `delete` "Activates when a document is deleted", `publish` "(deprecated):
  Activates when a document is published. Essentially a shorthand for: create + update with
  includeAllVersions: true"; "you cannot combine publish with other events". `includeDrafts`
  "Determines whether events on draft documents (drafts.**) trigger the function. Defaults to
  false"; `includeAllVersions` covers version documents (versions.**), default false. Source:
  https://www.sanity.io/docs/blueprints/blueprint-config.
- The changelog of 20 August 2025 that introduced `create`, `update`, `delete` and the two toggles
  says `publish` "functionally equals `on: ['create', 'update']`" and faces deprecation, and warns
  that `update` with either toggle fires on every draft or version edit. The pages disagree on
  `includeAllVersions`; treat `publish` as legacy. Source:
  https://www.sanity.io/docs/changelog/15c41ae1-ac85-45c1-a5fe-81ff8da878ad.
- So for `enquiry-notify`: the Astro Action writes a document with a plain (non `drafts.`) id, which
  is a `create` on a published document; `includeDrafts` does not matter. The function's own
  `notifiedAt` patch is an `update`, so `on: ['create']` alone never re-fires it. Derived from the
  sources above.
- For `content-lint`: `on: ['create', 'update']` with both toggles at their defaults fires only when
  a published document is written, which is what a Studio publish does (first publish `create`,
  later publishes `update`). It also fires for every API write to a published document (seed script,
  enquiry create, the `notifiedAt` patch, the lint report itself), so the filter must name the
  content types it checks. Derived from the same sources.
- `filter`: "A valid GROQ filter", "Only include the contents of the filter, not any other
  surrounding syntax", example `_type == "article"`; `projection`: "A valid GROQ projection.
  Example: {title, _id, slug}", typed as a `{...}` template string. Cheatsheet examples: `filter:
  "_type == 'post' && !defined(firstPublished)"`, `projection: "{_id}"`, dataset scoping through
  `resource: {type: 'dataset', id: 'myProjectId.production'}`. Sources:
  https://www.sanity.io/docs/blueprints/blueprint-config,
  https://www.sanity.io/docs/functions/functions-cheatsheet, `event.d.ts` above.

## Handler, event and context (@sanity/functions 1.7.1)

- `documentEventHandler<IData = any>(handler)` "Returns the handler function as-is, only providing
  the types"; `DocumentEventHandler<IData> = (envelope: {context: FunctionContext; event:
  DocumentEvent<IData>}) => void | Promise<void>`; `DocumentEvent` has one field, `data`: "the
  result of applying any configured GROQ-projection to the changed document. If no projection is
  configured, this is the document itself". No `event.id` or `event.type` exists in the types.
  Sources: `node_modules/@sanity/functions/dist/definers.d.ts`,
  `node_modules/@sanity/functions/dist/types/functions.d.ts`.
- `FunctionContext`: `clientOptions: {apiHost?, dataset, projectId, token}`, `local?: boolean` ("set
  to true when testing your function locally ... Otherwise, the property is not set"),
  `eventResourceType`, `eventResourceId`, `functionResourceType`, `functionResourceId`, `lineage?`,
  `invoke?`, `resources`; "you should always specify an explicit apiVersion in YYYY-MM-DD format".
  README pattern: `createClient({apiVersion: '2025-05-01', ...context.clientOptions})`, typed data
  with `documentEventHandler<NotificationData>(...)`. Sources:
  `node_modules/@sanity/functions/dist/types/context.d.ts`,
  `node_modules/@sanity/functions/README.md`.
- Handler reference: the module must export `handler`; `token` is "A token with access to your
  Sanity project" (obfuscated in logs); `apiHost` defaults to `https://api.sanity.io`; `local` is
  `undefined` in production. Deploy fails unless the built entry exports `handler`; the entry is
  `package.json#main`, then `index.ts`, then `index.js` inside `src`. Sources:
  https://www.sanity.io/docs/specifications/function-wrapper,
  `node_modules/@sanity/runtime-cli/dist/utils/functions/transpile/verify-handler.js`,
  `node_modules/@sanity/runtime-cli/dist/utils/functions/find-entry-point.js`.

## The runtime token

- A custom robot token (`robotToken: '$.resources.editor-robot.token'`, `defineRobotToken`) lets
  "the function use the custom-scoped robot token instead of the default token with broad read/write
  permissions". So the default token can read `siteSettings` and patch `enquiry`; whether it reads
  drafts is unverified (not needed). Locally `clientOptions` "only provides projectId and apiHost
  unless you pass additional flags": `--dataset` adds the dataset, `--with-user-token` "Prime access
  token from CLI config". Sources: https://www.sanity.io/docs/blueprints/blueprints-robot-tokens,
  https://www.sanity.io/docs/functions/functions-js-client, `sanity functions test --help`.
- Loop guards: wrap writes in `if (!context.local)`; "The client limits recursive chains to 16
  invocations" (`MAX_RECURSION_COUNT = 16`); platform rate limits 200 invocations per document and
  4000 per project per 30 seconds. Sources:
  https://www.sanity.io/docs/functions/functions-js-client,
  `node_modules/@sanity/functions/dist/invoke.d.ts`,
  https://www.sanity.io/docs/functions/functions-introduction.

## Double sends and retries

- Delivery semantics are undocumented: the introduction page contains none of the words retry,
  at-least-once, duplicate or idempotent, and no page read says what happens when a handler throws
  or times out. Unverified either way; the documented retry policy belongs to webhooks. Sources:
  https://www.sanity.io/docs/functions/functions-introduction,
  https://www.sanity.io/docs/content-lake/webhooks.
- Guard anyway: `on: ['create']`, `filter: '_type == "enquiry" && !defined(notifiedAt)'` (the
  cheatsheet's `!defined(firstPublished)` idiom), send with a Resend idempotency key
  `enquiry-notify/<_id>` (kept 24 hours, a repeat with the same payload returns the original id),
  then `client.patch(_id).set({notifiedAt}).ifRevisionId(event.data._rev).commit()`;
  `ifRevisionId(rev: string): this` is "Revision to lock the patch to", so keep `_rev` in any
  projection. Sources: https://www.sanity.io/docs/functions/functions-cheatsheet,
  https://resend.com/docs/dashboard/emails/idempotency-keys,
  `node_modules/@sanity/client/dist/types-CtHEe8SF.d.ts` line 4996.

## Runtime, limits, plans, logs

- "Functions run on Node.js v24.x"; timeout default 10 s, 1 to 900 s; memory default 1 GB, up to 10
  GB; "Max function size: 200MB"; billed by invocations and GB-seconds; Content Lake requests from a
  function count against the project API quota. Region and cold start are not documented there or on
  any other page read (unverified). Source:
  https://www.sanity.io/docs/functions/functions-introduction.
- `runtime?: 'node' | 'nodejs22.x' | 'nodejs24.x'`, default `nodejs24.x`, exists in the types but
  not on the reference page as read; whether the platform honours `nodejs22.x` is unverified. The
  CLI transpiles with Vite target `node20`. Sources:
  `node_modules/@sanity/blueprints/dist/types/functions/index.d.ts`,
  `node_modules/@sanity/runtime-cli/dist/utils/functions/transpile/function.js`.
- Plans: Free, Growth and Enterprise all include 500K invocations and 20K GB-seconds a month; Free
  has no overage; Growth and Enterprise pay $1.00 per extra 1M invocations and $1.00 per extra 20K
  GB-seconds; scheduled functions 5 daily (Free), 10 hourly (Growth), custom per minute
  (Enterprise); no beta label. Source: https://www.sanity.io/pricing.
- Logs: `console.log` output is read with `sanity functions logs <name>` (`-l` default 50, `-w`
  watch, `-u` UTC, `-d` delete, `--json`, `--stack`); the quickstart verifies a deploy this way.
  Sources: `sanity functions logs --help`, https://www.sanity.io/docs/functions/function-quickstart.

## Environment variables and where the Resend key lives

- `sanity functions env add NAME KEY VALUE`: "If the variable already exists, its value is updated
  ... Changes take effect on the next function invocation"; `env list` shows keys only; `env
  remove`. It "writes to the Sanity's Functions service, not to your local blueprint", so deploy
  first; "Adding a variable doesn't redeploy the stack". Read with `process.env.KEY`. Locally,
  prefix the command: `SANITY_SECRET_SAUCE="value" npx sanity@latest functions test envExample`.
  Production Resend key: `sanity functions env add enquiry-notify RESEND_API_KEY <value>` after the
  first deploy; `new Resend()` without a key falls back to `process.env.RESEND_API_KEY`. Sources:
  `sanity functions env add --help`, https://www.sanity.io/docs/functions/function-env-vars,
  `node_modules/resend/dist/index.mjs` line 1273, https://resend.com/docs/send-with-nodejs.
- Manifest `env?: Record<string, string>` ("Set environment variables for the function", "only
  additive"; every value must be a string). It is committed: not for secrets. Sources:
  https://www.sanity.io/docs/blueprints/blueprint-config,
  `node_modules/@sanity/blueprints/src/validation/functions.ts`.
- The CLI reads no `.env` file (no dotenv anywhere in `@sanity/runtime-cli/dist`); a local test
  spawns `node` with `{...process.env, ...resource.env}`; `blueprints init` adds `.env` and
  `functions/**/.env*` to `.gitignore`. Bun itself loads `.env`, `.env.local` and the `NODE_ENV`
  variants for `bun run` scripts, so a `packages/content` script that calls `sanity functions test`
  inherits `RESEND_API_KEY` from `packages/content/.env` (the runbook's location); `bunx` is not
  covered by that page (unverified). Sources:
  `node_modules/@sanity/runtime-cli/dist/utils/functions/invoke/local.js`,
  `node_modules/@sanity/runtime-cli/dist/actions/git.js`, `sanity blueprints init --help`,
  https://bun.com/docs/runtime/env.

## Local testing, deploy, layout and Bun

- `functions test [NAME]`: `-d/--data` inline JSON, `-f/--file`, `--document-id` with `--dataset`
  and `--project-id`, `-e/--event create|update|delete` (docs: default `create`),
  `--data-before/--data-after`, `--document-id-before/-after`, `--file-before/-after` for update
  deltas, `-t/--timeout`, `-a/--api`, `--with-user-token`, `--no-wait`, `--json`. `functions dev` is
  a browser emulator on `localhost:8080` (`--port`, `--host`, `--timeout`; 8974 reserved for live
  reload). Both set `context.local`. `functions add --installer` offers `skip|npm|pnpm|yarn` only:
  use `--installer skip` and `bun add`. Sources: `sanity functions test|dev|add --help`,
  https://www.sanity.io/docs/functions/functions-local-testing,
  https://www.sanity.io/docs/functions/function-quickstart.
- `blueprints init` writes the manifest plus `.sanity/blueprint.config.json` (scope and stack ids,
  "not ignored") and a `.gitignore`; `plan` is read-only; `deploy` exits 0, 2 or 75 (`--no-wait`,
  `-m`); `doctor` checks config. CI: `blueprints mint-deploy-token --print`, then
  `SANITY_AUTH_TOKEN`, `SANITY_PROJECT_ID` (or `SANITY_ORGANIZATION_ID`) and
  `SANITY_BLUEPRINT_STACK_ID`; ids resolve flags > env > module > config. Sources: `sanity
  blueprints init|plan|deploy --help`,
  https://www.sanity.io/docs/blueprints/deploy-blueprints-from-ci,
  `node_modules/@sanity/runtime-cli/dist/actions/blueprints/resolve.js`.
- Manifest discovery: names `blueprint.{json,js,mjs,ts}` and `sanity.blueprint.{json,js,mjs,ts}`,
  searched from the cwd upwards with `empathic/find` ("walking up parent directories");
  `.sanity/blueprint.config.json` is read from the manifest's directory; a `.ts` manifest is loaded
  with jiti and must default-export a function; `src` resolves relative to the manifest, defaulting
  to `functions/<name>`. `sanity.cli.ts` is never read; its presence only triggers "Blueprint should
  not be co-located with a Sanity Studio". Sources:
  `node_modules/@sanity/runtime-cli/dist/actions/blueprints/blueprint.js`,
  `.../actions/blueprints/config.js`, `.../utils/workspace-checks.js`, `.../utils/warnings.js`,
  `node_modules/empathic/readme.md`, https://www.sanity.io/docs/blueprints/blueprint-config.
- Recommended layout: "Your package manager's lockfile and sanity.blueprint.ts ... should sit in the
  same folder"; the multi-application pattern puts the manifest at the repo root next to the
  lockfile with `src` pointing into an app; "The CLI uses the lockfile in the current working
  directory to detect which package manager you use. If the lockfile isn't there, the CLI defaults
  to npm". Source: https://www.sanity.io/docs/blueprints/project-layout-and-monorepos.
- Bun: `bin/sanity` starts with `#!/usr/bin/env node`; `bunx` "respects this shebang" and "spins up
  a node process" (`--bun` would override it; do not). A local test then spawns `node` from PATH, so
  it runs on Node 22.22.1 here while production is Node 24; the docs recommend matching (unverified
  risk). Sources: `node_modules/sanity/bin/sanity`, https://bun.com/docs/cli/bunx,
  `.../utils/functions/invoke/local.js`, https://www.sanity.io/docs/functions/function-quickstart.

## Bundling and importing `@oy/lint`

- Dependencies live in a `package.json` next to the manifest (project level) or inside the function
  directory (function level); "Functions will not use or mix both sources"; "To use a project-level
  package at the function level, declare it in both places"; "The CLI hydrates each Function's
  dependencies from that root install and packages them into an asset before uploading"; TypeScript
  in pnpm workspaces "bundles inline using Vite"; otherwise "the CLI externalizes dependencies and
  ships them as a node_modules folder alongside the source"; assets cap at 200 MB; native modules
  are rejected. Sources: https://www.sanity.io/docs/functions/function-dependencies,
  https://www.sanity.io/docs/blueprints/project-layout-and-monorepos.
- The code path (`prepareAsset`): a `.ts` entry (or `transpile: true`) runs `vite.build` (Rolldown,
  `ssr: true`, `target: 'node20'`, ESM, source maps, `resolve.tsconfigPaths: true`). `bundle` is
  true only when a `pnpm-workspace.yaml` is found or the hidden `deploy --fn-installer pnpm` flag is
  passed; otherwise `preserveModules: true` with `preserveModulesRoot` at the directory holding the
  nearest `node_modules` above the function and `external: [/node_modules/]`. Output lands in
  `<function>/.build/function-<name>/` with a copied `package.json` (`main`, `type: module`); then,
  unless bundled, `@architect/hydrate` installs dependencies (npm unless `pnpm-lock.yaml` or
  `yarn.lock` sits next to the manifest; `bun.lock` means npm; `autoResolveDeps: false` skips it);
  native modules and folders over 200 MB fail; the folder is zipped and uploaded. Sources:
  `node_modules/@sanity/runtime-cli/dist/utils/functions/prepare-asset.js`,
  `.../utils/functions/transpile/function.js`, `.../utils/functions/resolve-dependencies.js`,
  `.../commands/blueprints/deploy.js`, `.../actions/blueprints/assets.js`.
- Workspace imports: nothing documents a Bun workspace. A bare `import '@oy/lint'` resolves through
  the symlink Bun places in `node_modules`; whether Rolldown externalises it (the unresolved id
  never contains `node_modules`, the symlink path does) or emits it is unverified. A relative import
  or a tsconfig `paths` alias into `packages/lint/src` (and its JSON) goes through the same
  transpile, but emission of files above `preserveModulesRoot` is unverified. npm cannot install a
  `workspace:*` specifier, so never list `@oy/lint` in a function `package.json`. `sanity functions
  test` runs the identical `transpileFunction` and leaves `.build/function-<name>` on disk, so the
  prototype can inspect the output before the first deploy. Sources:
  `.../utils/functions/invoke/prepare.js`, `.../utils/functions/transpile/function.js`.

## Warning editors on publish

- "Schema validation rules only run in Sanity Studio. Mutations submitted through the API or client
  libraries are not checked against your validation rules"; `.warning()` makes a rule non-blocking.
  A function therefore cannot raise a Studio validation warning; that path stays the schema rule
  from ADR 0010. Source: https://www.sanity.io/docs/studio/validation.
- Option 1, patch the document (cheatsheet `setIfMissing`): the patch is an `update` on the same
  document, so the filter must exclude the marker or the function loops, and editors only see a raw
  field. Source: https://www.sanity.io/docs/functions/functions-cheatsheet.
- Option 2, write a separate report document: the recycling bin guide's function does
  `createIfNotExists({_id: 'deletedDocs.bin', _type: 'deletedDocs.bin', title: ...})` from a
  projection built with `now()` and `identity()`; a Structure list shows such documents with
  `S.documentList().title('...').filter('_type == "lintReport" && count(findings) > 0')` (the
  `filter` "does not support joins"). Sources:
  https://www.sanity.io/docs/developer-guides/bin-for-restoring-deleted-documents,
  https://www.sanity.io/docs/studio/structure-builder-reference.
- Option 3, `console.warn`: visible only through `sanity functions logs`. Source: logs help above.
- Option 4, a Studio comment: `client.collaboration.comments.create({message, target: {documentId,
  documentType, path}})` is `@alpha` (client 8.2.0), needs `collaboration.organizationId` in the
  client config and has no docs page; comments are a paid plan feature stored in an add-on dataset
  ("available in the Growth plan"). Whether the default function token may write them is unverified.
  Sources: `node_modules/@sanity/client/dist/types-CtHEe8SF.d.ts` lines 1234, 1383, 1549, 8028,
  https://raw.githubusercontent.com/sanity-io/client/main/CHANGELOG.md,
  https://www.sanity.io/docs/studio/configuring-comments,
  https://www.sanity.io/docs/studio/comments.
- Option 5, Studio notifications from outside: nothing documented; the request to create comments or
  tasks from outside the Studio is still open. Source:
  https://github.com/sanity-io/sanity/issues/7610.
- Recommendation: option 2. One `lintReport` per published document (`_id: 'lint.<id>'`, weak
  reference, `checkedRev`, `checkedAt`, `findings[]` of `{path, kind, excerpt, bare, correct}`),
  written with `createOrReplace` on every run so a clean publish empties it; the `content-lint`
  filter names the content types and therefore never sees `lintReport` or `enquiry`; the Pending
  view lists reports with findings. Derived from the sources above and
  `docs/design/CONTENT-MODEL.md` section 5.

## Resend 6.26.0

- `new Resend(key?, {baseUrl?, userAgent?})`; `resend.emails.send(payload, {idempotencyKey})`
  resolves to `({data: {id}, error: null} | {data: null, error: {message, statusCode, name}}) &
  {headers}`. Payload: `from` (required, `"Name <sender@domain.com>"`), `to` (string or array, "Max
  50"), `subject`, `replyTo` (string or array), `headers: Record<string, string>`, `tags: {name,
  value}[]`, `cc`, `bcc`, `attachments`, `scheduledAt`, `topicId`, and at least one of `react`,
  `html`, `text` (`RequireAtLeastOne`), or `template` instead of those three. Either `html` or
  `text` is needed; with only `html` the plain text is generated unless `text` is the empty string;
  tag names and values are limited to 256 characters. Sources:
  `node_modules/resend/dist/index.d.mts` lines 122 to 135, 508 to 620 and 1977 to 2731;
  https://resend.com/docs/api-reference/emails/send-email.
- Idempotency: `Idempotency-Key` header, 1 to 256 characters, kept 24 hours, format
  `<event-type>/<entity-id>`; same payload returns the original id; different payload 409
  `invalid_idempotent_request`; in flight 409 `concurrent_idempotent_requests`; bad key 400
  `invalid_idempotency_key`. Sources: https://resend.com/docs/dashboard/emails/idempotency-keys,
  https://resend.com/docs/api-reference/errors.
- Rate limit: "The default maximum rate limit is 10 requests per second per team"; 429
  `rate_limit_exceeded` with `ratelimit-limit`, `ratelimit-remaining`, `ratelimit-reset` and
  `retry-after` headers; `daily_quota_exceeded` and `monthly_quota_exceeded` are also 429. Free
  plan: 100 emails a day, 3,000 a month, 3 domains, 30 day retention. Sources:
  https://resend.com/docs/api-reference/rate-limit, https://resend.com/docs/api-reference/errors,
  https://resend.com/pricing.
- `from`: "must add and verify at least one domain", send from a subdomain such as
  `updates.example.com`; "onboarding@resend.dev is for testing only"; test recipients `delivered@`,
  `bounced@` and `complained@resend.dev`. Sources:
  https://resend.com/docs/dashboard/domains/introduction, https://resend.com/docs/send-with-nodejs,
  https://resend.com/docs/dashboard/emails/send-test-emails.

## Repo fit and open questions

- `enquiry-notify`: `defineDocumentFunction({name: 'enquiry-notify', event: {on: ['create'], filter:
  '_type == "enquiry" && !defined(notifiedAt)'}})`, no projection (the handler needs `_rev`, `kind`,
  `payload`, `submittedAt`, `source`), `RESEND_API_KEY` through `functions env add`. Routing: fetch
  `*[_id == "siteSettings"][0].contacts` and pick the entry for `kind`; the fallback address is the
  owner's open decision (wayfinder ticket 02). Retry semantics stay undocumented, so the idempotency
  key, the filter and the `ifRevisionId` patch are the defence.
- `content-lint`: `on: ['create', 'update']`, filter listing the content types, reads
  `packages/lint/yoruba-terms.json` plus the `findDashes` and `findBareTerms` exports through a
  relative import or path alias, writes `lintReport`. Run `sanity functions test content-lint` and
  read `.build` before the first deploy to settle whether the workspace code is emitted.
- `sanity.blueprint.ts` location: the docs' lockfile rule points at the repo root (next to
  `bun.lock`) with `src: 'packages/content/functions/<name>'`; AGENTS.md puts functions in
  `packages/content`, which the `src` paths keep. A manifest inside `packages/content` next to a
  future `sanity.cli.ts` for TypeGen draws the co-location warning. Owner decision.
- Still open: Node 22 locally against Node 24 in production and whether `runtime: 'nodejs22.x'` is
  accepted; whether `bunx sanity` sees Bun's `.env` loading (use a `bun run` script if not); the
  Sanity plan (wayfinder ticket 22), which decides whether Studio comments are even available.
