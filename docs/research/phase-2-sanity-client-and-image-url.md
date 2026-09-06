# Phase 2: @sanity/client 8.5.0, @sanity/image-url 2.1.1 and groq 6.12.0 verified before pinning

Date: 5 September 2026. Method: `npm view <pkg> version|peerDependencies|engines|dependencies|time` against
the npm registry; the packages installed into a scratch directory with Bun 1.4.2 so the shipped `dist/*.d.ts`,
`lib/*.d.ts`, `src/*.ts`, `dist/*.js` and READMEs could be read (`node_modules/...` paths refer to that install;
`bun add` lands the same files in the repo); throwaway scripts under Bun 1.4.2 and Node 22.22.1 that import the
packages, build URLs and send uploads to a closed local port (`apiHost: 'http://127.0.0.1:9'`, never the Sanity
API); the primary docs named per bullet; the sanity-io GitHub CHANGELOG, migration guide and release list
(`gh api`). Every pin is exact (`bunfig.toml` sets `exact = true`).

| Package | Pinned | Latest on registry | Why this pin |
| --- | --- | --- | --- |
| `@sanity/client` | 8.5.0 (recommended) | 8.5.0 (2026-09-03) | ESM only, `engines.node >=22.12.0`, a `bun` export condition; 8.5.0 adds the global `SanityQueries` registry that TypeGen writes into; `sanity` 6.12.0 and `@sanity/types` 6.12.0 depend on `^8.4.0`, so one copy resolves. |
| `@sanity/image-url` | 2.1.1 (recommended) | 2.1.1 (2026-03-30) | ESM only, named `createImageUrlBuilder`, `engines.node >=20.19.0`; `sanity` 6.12.0 depends on `^2.1.1`. |
| `groq` | 6.12.0 (recommended) | 6.12.0 (2026-09-01) | `defineQuery` and the `groq` tag; versioned in lockstep with `sanity`; `@sanity/codegen` 8.1.0 accepts `^6.0.0`. |
| `@sanity/types` | not pinned separately | 6.12.0 (2026-09-01) | Arrives with `sanity`; peer `@types/react *`; depends on `@sanity/client ^8.4.0`. Add only if `@oy/content` imports its types directly. |
| `sanity` | out of scope for this note | 6.12.0 | Recorded for the range check: depends on `@sanity/client ^8.4.0`, `@sanity/image-url ^2.1.1`, `@sanity/types 6.12.0`; `engines.node >=22.12`. |

## @sanity/client 8.5.0

### Package facts

- Registry: 8.5.0 published 2026-09-03, `engines.node >=22.12.0`, dependencies `get-it ^9.5.2`, `rxjs ^7.8.2`,
  `eventsource ^5.1.1`, `obug ^2.1.4`, no peers; 8.0.0 shipped 2026-08-12 and the 7.x line still gets releases
  (7.27.0 on 2026-09-03). Source: `npm view @sanity/client version engines dependencies time`, `gh api repos/sanity-io/client/releases`.
- 8.0.0 breaking changes: "require node 22.12 or higher, use fetch"; "ESM-only and no longer ships CommonJS
  runtime or declaration files"; UMD bundle, `main`, `module`, `typesVersions`, the `requester` option and the
  per request `proxy` option removed; "Observable asset uploads emit progress events only in browsers. Node and
  edge runtimes emit only the terminal response event"; error messages now include the HTTP status text. 8.5.0:
  result types are read "from a global `SanityQueries` interface". Source: https://raw.githubusercontent.com/sanity-io/client/main/CHANGELOG.md.
- `exports`: `.` maps `bun`, `deno`, `workerd`, `worker`, `react-server`, `sanity-function` and `default` to
  `./dist/index.js` and `node` to `./dist/index.node.js`; subpaths `./csm`, `./stega`, `./media-library`;
  `"type": "module"`. Under Bun 1.4.2 `import.meta.resolve('@sanity/client')` gives `dist/index.js`, under Node
  22.22.1 `dist/index.node.js`; that split decides upload bodies, proxies and env reads (below). The README has
  a Bun section (`bun add @sanity/client`). Source: `node_modules/@sanity/client/package.json`, README (Bun), scratch `which-build.mjs`.

### createClient options

- "Required options are `projectId`, `dataset`, and `apiVersion`. We encourage setting `useCdn` to either `true`
  or `false`. The default is `true`." Docs: `useCdn` "Set to false when you need the freshest data or are
  performing mutations"; `token` is "An authentication token for accessing private datasets or performing
  mutations". `requestTagPrefix` is "Added to every request" and a per call `tag` is joined to it with a dot.
  Source: README (Creating a client instance, Request tags), https://www.sanity.io/docs/apis-and-sdks/js-client-getting-started, `dist/index.js`.
- `ClientConfig` members relevant here (Source: `node_modules/@sanity/client/dist/types-CtHEe8SF.d.ts` lines 7855 to 8042):

  ```ts
  interface ClientConfig {
    projectId?: string; dataset?: string; token?: string; apiHost?: string; apiVersion?: string;
    /** @defaultValue true */ useCdn?: boolean;  /** @defaultValue 'published' */ perspective?: ClientPerspective;
    proxy?: string /* "Node.js only" */; requestTagPrefix?: string; headers?: Record<string, string>;
    ignoreBrowserTokenWarning?: boolean; ignoreWarnings?: string | RegExp | Array<string | RegExp>;
    withCredentials?: boolean; timeout?: number; maxRetries?: number /* "Defaults to 5." */; resultSourceMap?: boolean | 'withKeyArraySelector'; stega?: StegaConfig | boolean;
    /** @deprecated set `cache` and `next` options on `client.fetch` instead */ fetch?: {...} | boolean;
  }
  ```

- `apiVersion`: "statically set it to today's UTC date when starting a new project"; "Do not be tempted to use a
  dynamic value"; the docs: "Use today's date when you start something new, written as a static string", `v1`
  is the outdated fallback, `vX` is experimental. The validator accepts `1`, `X` or `YYYY-MM-DD` with or without
  a leading `v` (`'v2026-09-05'` is stored as `'2026-09-05'`); anything else throws "Invalid API version string,
  expected `1` or date in format `YYYY-MM-DD`"; omitting it warns and uses `1`. Pin `apiVersion: '2026-09-05'`.
  Source: README (Specifying API version), https://www.sanity.io/docs/api-versioning, `dist/config-CgJ16jET.js`, scratch `version-test.mjs`.
- `perspective`: `ClientPerspective = 'previewDrafts' | 'published' | 'drafts' | 'raw' | StackablePerspective[]`,
  `StackablePerspective = 'published' | 'drafts' | (string & {})`; `previewDrafts` is `@deprecated use 'drafts'
  instead`; JSDoc: "As of API version `v2025-02-19`, the default perspective has changed from `raw` to
  `published`". Runtime: mixing `raw` into an array throws "The raw-perspective can not be combined with other
  perspectives"; `['rABC123', 'published']` is accepted; the first `fetch` with `previewDrafts` prints "has been
  renamed to `drafts` and will be removed in a future API version".
  Source: `dist/types-CtHEe8SF.d.ts` lines 7819 to 7827, scratch `version-test.mjs`.
- Docs values: `published` "Excludes all unpublished changes and draft documents"; `drafts` "Treats all drafts as
  published, deduplicating in favor of draft versions" and adds `_originalId`; `raw` with a token "will cause
  both drafts and versions to appear"; release id arrays "automatically appends the `published` perspective" but
  not `drafts`; unauthenticated queries never see drafts. Source: https://www.sanity.io/docs/perspectives, README (Using perspectives).
- `useCdn` rule: `useCdn = (options.useCdn ?? config.useCdn) && canUseCdn`, and `canUseCdn` holds only for
  `GET`/`HEAD` data requests, so mutations and uploads always use the Live API. With `drafts`, `previewDrafts` or
  a release array the client forces `useCdn = false` per request and warns "The Live API will be used instead.
  Set `useCdn: false` in your configuration to hide this warning."; a token with `useCdn: true` is not
  overridden; `withCredentials: true` plus a token prints "only token will be used". Docs: "the client will
  bypass the CDN and log a warning if `useCdn` is not set to `false`". Use `useCdn: false` for the seed and
  every token bearing client. Source: `dist/index.js`, `dist/config-CgJ16jET.js`, https://www.sanity.io/docs/perspectives, scratch `import-test.mjs`.

### fetch options and typed results

- `fetch(query, params?, options?)` resolves to `ClientReturn<G, R>`; with `{filterResponse: false}` it resolves
  to `RawQueryResponse = {query, ms, result, resultSourceMap?, syncTags?}` (`returnQuery: false` drops `query`).
  `ResponseQueryOptions` extends `RequestOptions` (`timeout`, `token`, `tag`, `headers`, `signal`) with
  `perspective`, `resultSourceMap`, `returnQuery`, `useCdn`, `stega: boolean | StegaConfig`, `cache`, `next`,
  `lastLiveEventId`, `cacheMode: 'noStale'`; `cache` and `next` are typed `never` unless the ambient `RequestInit`
  carries Next.js's `next` key, so they do not exist in Astro. `QueryParams` types every option name as `never`
  ("you're using a fetch option as a GROQ parameter, this is likely a mistake").
  Source: `dist/types-CtHEe8SF.d.ts` lines 8447 to 8494 and 9345 to 9402.
- Typed results: "`client.fetch` looks the query string up in the global `SanityQueries` interface and returns
  the registered result type when it finds one. `sanity typegen generate` writes these registrations for you";
  `interface SanityQueries extends globalThis.SanityQueries {}` and `ClientReturn<G, Fallback> = G extends keyof
  SanityQueries ? SanityQueries[G] : Fallback`. The overload is `fetch<..., const G extends string>(query: G)`,
  so the query must stay a literal type: `defineQuery<const Q extends string>(query: Q): Q` keeps it, the `groq`
  tag returns `string`. Source: README (Typed query results), `dist/types-CtHEe8SF.d.ts` line 9753, `node_modules/groq/groq.d.ts`.
- TypeGen is configured in `sanity.cli.ts` under `typegen: { path, schema, generates, overloadClientMethods,
  enabled }` (`sanity-typegen.json` "has been deprecated"); `overloadClientMethods` "set to false to disable
  automatic overloading the sanity client"; "By using `defineQuery` when writing your GROQ queries the Sanity
  Client will automatically return types when the query is used with `fetch`, after running `sanity typegen
  generate`"; queries must use `groq` or `defineQuery` from the `groq` package. Commands: `sanity schema extract`
  (`--enforce-required-fields`, `--workspace`, `--path`), then `sanity typegen generate` (`--watch`).
  Source: https://www.sanity.io/docs/sanity-typegen (canonical https://www.sanity.io/docs/typing-content-from-schemas-and-queries),
  https://www.sanity.io/docs/apis-and-sdks/sanity-typegen.
- `getDocument(id, {signal?, tag?, releaseId?, includeAllVersions?})` resolves to the document or `undefined`;
  `getDocuments(ids, {signal?, tag?})` keeps input order with `null` for misses; `documentsExists(ids)` resolves
  to a `Set<string>`; the Doc endpoint "should be used sparingly". Source: `dist/types-CtHEe8SF.d.ts` (class body), README.

### Stega

- `StegaConfig = { enabled?: boolean (default false), studioUrl?: StudioUrl | ResolveStudioUrl, filter?, logger?,
  omitCrossDatasetReferenceData? }` or `stega: boolean`; `createClient` throws "stega.studioUrl must be defined
  when stega.enabled is true". "The code that handles stega is lazy loaded on demand when `client.fetch` is
  called, if `client.config().stega.enabled` is `true`"; per call `{stega: false}` or a `StegaConfig`;
  `client.withConfig({stega: {...}})` derives a client. `@sanity/client/stega` re-exports the client and adds
  `stegaClean` (runs under Bun), `stegaBrand`, `ClientReturnStega` and `stegaEncodeSourceMap`.
  Source: `dist/types-CfGzbXrl.d.ts`, `dist/stega.d.ts`, README (Using Visual editing with steganography), scratch `import-test.mjs`.
- Docs: stega "Encodes source metadata into every string value in the query result as invisible zero-width
  Unicode characters"; enable it only for preview through the documented `getClient(perspective)` pattern
  (`useCdn: !isPreview, stega: {enabled: isPreview}`); "stega in HTML attributes, `<head>`, `<script>`/`<style>`
  tags, `textarea` values, or URLs always causes bugs"; call `stegaClean()` before "string comparisons, URL
  construction, date parsing, and length checks". Source: https://www.sanity.io/docs/stega (canonical
  https://www.sanity.io/docs/client-setup-and-stega-for-visual-editing).

### Assets

- Signature: `upload(assetType: 'image', body: UploadBody, options?: UploadClientConfig): Promise<SanityImageAssetDocument>`
  (`'file'` returns `SanityAssetDocument`), `UploadBody = File | Blob | Buffer | NodeJS.ReadableStream`.
  `UploadClientConfig`: `tag?`, `preserveFilename?` ("default: true"), `filename?`, `timeout?` ("uploads have NO
  timeout unless one is explicitly set here"), `contentType?`, `extract?: AssetMetadataType[]` (`'location' |
  'exif' | 'image' | 'palette' | 'lqip' | 'blurhash' | 'thumbhash' | 'none'`), `label?`, `title?`, `description?`,
  `creditLine?`, `source?: { id: string; name: string; url?: string }`.
  Source: `dist/types-CtHEe8SF.d.ts` lines 1075 to 1117, 7784 and 8080 to 8144.
- Wire mapping seen in the built request: `filename=tiny.jpg&meta=blurhash&sourceId=x&sourceName=seed` (`extract`
  becomes `meta`; `source` becomes `sourceId`, `sourceName`, `sourceUrl`); the HTTP reference lists `filename`,
  `title`, `description`, `label`, `creditLine`, `sourceName`, `sourceId`, `sourceUrl`, `meta`, `tag` on
  `POST /assets/images/{dataset}` with an `image/*` body; `preserveFilename: false` only drops the name taken
  from a `File`. Source: scratch `upload-test.mjs`, https://www.sanity.io/docs/http-reference/assets, `dist/index.js` (`optionsFromFile`).
- Body types by runtime (a request that reached the closed socket proves the body was accepted): under Bun
  (`dist/index.js`, global `fetch`) `Buffer`, `Uint8Array`, `Blob`, `File`, `Bun.file()` and a web
  `ReadableStream` all reach the network; a Node `fs.createReadStream` fails first with "Unsupported body type:
  object". Under Node (`dist/index.node.js`) Node streams also work (a `beforeRequest` middleware applies
  `Readable.toWeb`). Read each JPEG with `Bun.file(path)` or `readFileSync`, never `createReadStream`. Progress
  events need `XMLHttpRequest`. Source: scratch `upload-test.mjs`, `dist/index.node.js` (`isNodeReadableStream`, `XMLHttpRequest`).
- Response: `SanityImageAssetDocument = {_id, _type, _rev, _createdAt, _updatedAt, url, path, size, assetId,
  mimeType, sha1hash, extension, uploadId?, originalFilename?, metadata: {_type: 'sanity.imageMetadata', hasAlpha,
  isOpaque, lqip?, blurHash?, thumbHash?, dimensions: {aspectRatio, height, width}, palette?, image?, exif?}}`.
  Without `extract` the defaults are `lqip`, `blurHash`, `thumbHash` and `palette`; `image`, `exif` and
  `location` are "Excluded by default". Source: `dist/types-CtHEe8SF.d.ts` lines 8161 to 8213, https://www.sanity.io/docs/apis-and-sdks/image-metadata.
- Deduplication: "If the same asset is uploaded multiple times, but with different filenames, only one asset
  will be created", so a re-run over the same 68 JPEGs returns the existing asset documents with the same `_id`.
  Cheaper: hash locally and skip the upload when `*[_type == "sanity.imageAsset" && sha1hash == $sha][0]._id`
  resolves. Source: https://www.sanity.io/docs/content-lake/manage-assets (canonical
  https://www.sanity.io/docs/upload-query-and-delete-assets), `dist/types-CtHEe8SF.d.ts` (`sha1hash`).
- `_id` format: `image-<hash>-<width>x<height>-<ext>`, for example
  `image-a75b03fdd5b5fa36947bf2b776a542e0c940f682-1000x1500-jpg` (client README) and
  `image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg` (image-url's parser, which splits on `-` into id, `WxH` and
  format); the CDN URL is `https://cdn.sanity.io/images/<projectId>/<dataset>/<assetId>-<w>x<h>.<format>`. That
  the hash segment equals `sha1hash` fits the 40 hex character example but no docs sentence states it: unverified.
  Source: README (Creating Studio edit intent links), `node_modules/@sanity/image-url/src/parseAssetId.ts`, https://www.sanity.io/docs/image-urls.
- Reference shape: `{ _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } }` plus `hotspot: { x,
  y, height, width }` and `crop: { top, bottom, left, right }` as fractions of the image (`x`, `y` is the hotspot
  centre; crop values are the fraction cut from each edge, the docs example being `top: 0.028, bottom: 0.150,
  left: 0.019, right: 0.009`). Source: https://www.sanity.io/docs/content-lake/manage-assets,
  https://www.sanity.io/docs/image-type (canonical https://www.sanity.io/docs/image), `node_modules/@sanity/image-url/lib/index.d.ts`.
- `client.delete(assetDocumentId)` "will also trigger deletion of the actual asset" ("the CDN might have your
  asset cached so it may not disappear immediately"). Limits: "Maximum image size: 256 megapixels"; dataset
  uploads are capped at 5 minutes. Source: README (Deleting an asset), https://www.sanity.io/docs/technical-limits.

### Mutations and transactions

- Docs: `createOrReplace` "Creates a new document or replaces an existing one" (a `_type` change acts as delete
  then create and is blocked while hard references point at the document); `createIfNotExists` "will silently
  fail if the document already exists"; `patch` "will fail if the document does not exist" and runs `set`,
  `setIfMissing`, `unset`, `inc`, `dec`, `insert` in that order; a given `_id` "is used as-is", a trailing `.` is
  "a prefix for a new random unique ID". "The mutation API is transactional"; "Transactions are atomic: either
  all of the mutations succeed or they all fail." Source: https://www.sanity.io/docs/http-mutations, https://www.sanity.io/docs/transactions.
- Client surface: `createOrReplace(doc, options?)`, `createIfNotExists(doc, options?)`, `create`, `delete(id |
  {query, params})`, `mutate(Mutation[] | Patch | Transaction, options?)`, `patch(id | ids | selection, ops?)`
  returning a `Patch` (`set`, `setIfMissing`, `unset`, `inc`, `dec`, `insert`, `append`, `prepend`, `splice`,
  `diffMatchPatch`, `ifRevisionId`, `commit`); `transaction(ops?)` returning a `Transaction` (`create`,
  `createIfNotExists`, `createOrReplace`, `delete`, `patch(id, builder | ops | Patch)`, `transactionId(id)`,
  `commit(options?)`); documents need `_type`, and `_id` for the three `Identified...` stubs.
  Source: `dist/types-CtHEe8SF.d.ts` (class body, `BasePatch` from line 5052, `BaseTransaction` from line 5152).
- `BaseMutationOptions`: `visibility?: 'sync' | 'async' | 'deferred'` (default `sync`; `async` returns once
  committed; `deferred` "bypasses real-time indexing completely" for bulk imports), `returnDocuments?`,
  `returnFirst?`, `dryRun?` ("no documents will be affected"), `autoGenerateArrayKeys?` ("automatically add
  `_key` attributes to objects in arrays that are missing them"), `skipCrossDatasetReferenceValidation?`,
  `transactionId?`, plus `tag`, `token`, `timeout`, `headers`, `signal`. Single document methods resolve to the
  document; `transaction().commit()` and `mutate()` resolve to `MultipleMutationResult = {transactionId,
  documentIds, results: [{id, operation: 'create' | 'delete' | 'update' | 'none'}]}`.
  Source: `dist/types-CtHEe8SF.d.ts` lines 9404 to 9447, README (Mutation options).
- Limits: "Maximum mutation request body size: 4 MB", "Maximum mutation execution time: 3 minutes", "Maximum
  mutation rate: 25 req/s", "Maximum concurrent mutations to API: 100", "Maximum JSON document size: 32 MB"; no
  documented cap on mutations per transaction; delete by query stops at 10,000 documents.
  Source: https://www.sanity.io/docs/technical-limits, https://www.sanity.io/docs/http-mutations.

### Errors, environment and warnings

- `ClientError` (4xx) and `ServerError` (5xx) extend `Error` with `response`, `statusCode: number`, `responseBody`,
  `traceId?`, `details`; both are named exports. A 401 (bad token) or 403 (missing permission) is a `ClientError`
  with that `statusCode`; connection failures are the runtime's own `TypeError` ("Unable to connect" under Bun,
  "fetch failed" under Node). `maxRetries` "Defaults to 5" with back-off `100 * 2^attemptNumber` plus jitter, so
  set it low in the seed. Source: `dist/index.d.ts` lines 134 to 150, `dist/types-CtHEe8SF.d.ts` (`ErrorProps`,
  `ClientConfig`), scratch `upload-test.mjs`.
- The Bun build reads no `process.env` at all. The Node build reads `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY` at
  startup and `X_SANITY_LINEAGE` per request. Neither reads a project id, dataset or token; the seed reads its
  own env and passes values explicitly. Once per process warnings cover a missing `useCdn`, a missing
  `apiVersion`, drafts on the CDN, the `previewDrafts` rename and "You have configured Sanity client to use a
  token in the browser" (localhost only, silenced by `ignoreBrowserTokenWarning`); `ignoreWarnings` (substring or
  RegExp) silences chosen ones. Source: `grep process.env node_modules/@sanity/client/dist/*.js`, `dist/index.node.js` line 4546, `dist/config-CgJ16jET.js`.

## Document ids and publishing

- "an arbitrary string of maximum 128 characters made up of the characters `a-zA-Z0-9._-`"; "An ID cannot start
  with a `-` (dash) character, and must not have more than one consecutive `.` character." "IDs are also
  considered paths, separated by periods." "We advise against using our APIs to create document IDs prefixed
  with `drafts.` or `versions.`" Source: https://www.sanity.io/docs/content-lake/ids.
- "All documents that contain a `.` in their _id can only be accessed when a user is logged in or a valid
  authentication token is provided for client and HTTP API calls (minimum `read` permission required)." "The
  root path (also known as the published ID) is accessible without authentication, while all subpaths are
  private". So `siteSettings` is a public id, while `event.odunde-2027` is valid but private: the site client and
  the CDN will never return it. Seed ids must avoid periods: `event-odunde-2027`, `album-odunde-2026`.
  Source: https://www.sanity.io/docs/content-lake/ids.
- "Drafts are saved in a document with an id beginning with the path `drafts.`"; "When you publish a document it
  is copied from the draft into a document without the `drafts.`-prefix"; "When you publish a document it
  becomes available on the public APIs". A `createOrReplace` with a plain `_id` writes that root document
  directly, so it is published as soon as the transaction commits, with no draft step (the README: "To create a
  draft document, prefix the document ID with `drafts.`"). Source: https://www.sanity.io/docs/drafts, README (Creating documents).

## @sanity/image-url 2.1.1

- Registry: 2.1.1 (2026-03-30), `engines.node >=20.19.0`, dependency `@sanity/signed-urls ^2.0.2`, no peers;
  `"type": "module"`, `exports` `.` and `./signed` with `import` and `default` only, `types: ./lib/index.d.ts`,
  `src/` in the tarball. 2.0.0 (2025-11-27) breaking changes: "Replaced the default export with a named export.
  Use `createImageUrlBuilder` instead of the default export"; "Dropped CommonJS support. The package is now ESM
  only"; types come from the main entry instead of `/lib` paths; Node minimum 10.0.0 to 20.19.0; "all builder
  API methods remain the same, and URLs generated will be identical given the same inputs". A default export
  still exists in 2.1.1, typed `@deprecated Use the named export`. Source: `npm view @sanity/image-url`,
  `node_modules/@sanity/image-url/package.json`, `lib/index.d.ts`, https://raw.githubusercontent.com/sanity-io/image-url/main/CHANGELOG.md,
  https://raw.githubusercontent.com/sanity-io/image-url/main/MIGRATE-v1-to-v2.md.
- Import and chain: `import {createImageUrlBuilder} from '@sanity/image-url'`; `createImageUrlBuilder(options?:
  SanityClientLike | SanityProjectDetails | SanityModernClientLike)` where `SanityModernClientLike = { config():
  SanityClientConfig }` (an 8.x client) and `SanityProjectDetails = { projectId, dataset, baseUrl? }`. Methods:
  `image(source)`, `width`, `height`, `size`, `fit('clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' |
  'min')`, `crop('top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint' | 'entropy')`, `auto('format')`,
  `quality(0 to 100)`, `dpr`, `format('jpg' | 'pjpg' | 'png' | 'webp')`, `rect`, `focalPoint`, `blur`, `sharpen`,
  `orientation`, `ignoreImageParams`, `withClient`, `url()`, `toString()`. `image()` accepts "a Sanity `image`
  record, an `asset` record, or just the asset id as a string". Source: `node_modules/@sanity/image-url/README.md`, `lib/index.d.ts`.
- Hotspot and crop: "In order for hotspot/crop processing to be applied, the `image` record must be supplied, as
  well as both width and height." The crop fractions become a pixel `rect` from the dimensions parsed out of the
  asset id; with `width` and `height` the rect is narrowed around the hotspot centre; `rect`, `focalPoint`,
  `crop()` or `ignoreImageParams()` override it. Verified under Bun and Node with an 8.5.0 client and with
  `{projectId, dataset}`: `{asset, hotspot, crop}` with `.width(800).height(600).fit('crop').auto('format').quality(80).url()`
  gives `...jpg?rect=0,300,2000,1500&w=800&h=600&q=80&fit=crop&auto=format`; with no dimensions only the crop
  rect is emitted. Source: README, `src/urlForImage.ts`, scratch `import-test.mjs`.

## groq 6.12.0

- Registry: 6.12.0 (2026-09-01), `engines.node >=22.12`, no dependencies or peers, dual `exports` (`groq.js` for
  `import`, `groq.cjs` for `require`), versioned in the `sanity` monorepo. `export declare function
  defineQuery<const Q extends string>(query: Q): Q` ("This is a no-op ... we cannot infer types from [the tag]
  until microsoft/TypeScript#33304 is resolved") and default `groq(strings, ...keys): string`; both return the
  input unchanged at runtime (verified under Bun). Source: `npm view groq`, `node_modules/groq/package.json`, `node_modules/groq/groq.d.ts`, scratch `import-test.mjs`.

## Tokens and permissions

- Tokens travel as `Authorization: Bearer <token>`; robot tokens are for applications; "By default,
  unauthenticated users have read access to published documents (with some exceptions like private datasets)".
  API tokens on every plan come as "Editor Token (read+write)" or "Viewer Token (read-only)"; Editor has "Read
  and write access to all datasets", Viewer "Read-only access to all datasets", Contributor "Can write but not
  publish documents". "Manipulating documents requires read+write access permission for the affected document
  type." So uploads and `createOrReplace` of published ids need an Editor token; a Viewer token covers draft
  reads. A "Deploy Studio" token permission is not in the roles or auth pages fetched: unverified.
  Source: https://www.sanity.io/docs/http-auth (canonical https://www.sanity.io/docs/authentication-and-tokens),
  https://www.sanity.io/docs/content-lake/roles-concepts (canonical https://www.sanity.io/docs/roles-and-permissions),
  https://www.sanity.io/docs/user-guides/roles (canonical https://www.sanity.io/docs/roles), https://www.sanity.io/docs/http-mutations.

## Repo fit

- `docs/research/phase-0-stack-versions.md` already lists `@sanity/client` 8.5.0 and `@sanity/image-url` 2.1.1;
  both are still the latest. `packages/content` has `typegen` and `seed` placeholders and no dependencies yet.
  `sanity` 6.12.0 depends on `@sanity/client ^8.4.0`, `@sanity/image-url ^2.1.1` and `@sanity/types 6.12.0`,
  `@sanity/codegen` 8.1.0 on `groq ^6.0.0`, so the pins keep one copy of each under Bun's isolated linker; Node
  22.22.1 and Bun 1.4.2 satisfy every `engines` field. Source: repo files, `npm view sanity dependencies`, `npm view @sanity/codegen dependencies`.
- Seed shape that follows: one client with `useCdn: false`, `token` from the environment, `apiVersion:
  '2026-09-05'`, `perspective: 'published'`, a low `maxRetries`; read each JPEG with `Bun.file`; hash locally,
  look up `sha1hash`, upload only missing files with `filename`, `contentType: 'image/jpeg'`, `creditLine` and
  `source: {name, id}`; then transactions of `createOrReplace` documents with period free ids and `{_type:
  'image', asset: {_type: 'reference', _ref}, hotspot, crop}` fields, committed with `{autoGenerateArrayKeys:
  true}` (`dryRun: true` for a check run), each body under 4 MB. Source: the sections above.

## Open questions for the session

- Published only, or also `drafts.<id>` copies; how the Studio shows a never drafted published document is unverified. Source: https://www.sanity.io/docs/drafts.
- Local SHA-1 skip versus server dedupe for all 68 files (dedupe still transfers the bytes); and whether the asset id hash is that SHA-1 (unverified). Source: https://www.sanity.io/docs/content-lake/manage-assets.
- Stega for the `/admin` Presentation routes in Phase 2, or wait for Visual Editing (per request client, `useCdn: !isPreview`). Source: https://www.sanity.io/docs/stega.
- Transaction batching: measure the serialised body before commit; 4 MB is the limit. Source: https://www.sanity.io/docs/technical-limits.
