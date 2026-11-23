# The CSP allows inline scripts by hash, and is enforced once it reports clean

Accepted 22 November 2026. The owner chose the security headers and the CSP as the next launch item (open-work
D13, E9). Amends ADR 0011 and ADR 0020.

## Decision

- **The policy stays a header from the middleware, with hashes, so the cross-fade stays.** Astro's own CSP is a
  `<meta>` tag with no report-only mode and does not support `<ClientRouter />` (ADR 0011).
- **`script-src` names every inline script by its SHA-256 hash.** Every inline script the site ships is a
  component's `<script is:inline>` (ADR 0018), and Astro ships its body exactly as the source writes it: the eight
  hashes from the source matched the eight the live site reported on 22 November. `bun run csp:hashes` writes them
  into `packages/web/src/lib/csp-hashes.ts`, and a unit test fails while that file differs from the source. Every
  page carries all of them, because the ClientRouter runs the next page's scripts under the policy of the page it
  swapped from. An inline script with any attribute but `is:inline` (`define:vars`, `set:html`) fails the
  generator, since its body changes per render.
- **Nothing else ships inline.** Astro inlines a bundled script under 4 KB, which gave each page a small module of
  its own; `vite.build.assetsInlineLimit` keeps scripts as files under `/_astro`, which `'self'` allows. The Give
  Dialog's Zeffy frame rides the page, as the Join Dialog's does (ADR 0050), in place of a server island: an island
  ships an inline script carrying props encrypted per render, which no hash can allow. A publish of Organization
  details purges the pages, so a new form address still shows at once.
- **`style-src` allows inline styles.** The view transitions write a `<style>` per animated element with a name
  made per render, and components set `style` attributes; neither can be hashed ahead. Injected style cannot run
  code.
- **Three headers on every answer the function gives:** `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and a `Permissions-Policy` that switches off the camera,
  microphone, location and ad topics. Payment and full screen stay as browsers set them, for Zeffy's form and
  YouTube's player. HSTS is Vercel's own (`max-age=63072000`); `preload` is not asked for, since it cannot be
  taken back quickly.
- **Enforcement comes in two steps.** This change ships the new policy still report-only, because nothing but
  production can prove it: Vercel previews are off, and Playwright runs `astro dev`. Once the live site reports no
  violation across every page and dialog, setting `CSP_ENFORCED` in `csp.ts` sends it as
  `Content-Security-Policy`. Draft requests and the preview host keep it report-only (`cspHeaderName`): the Visual
  Editing overlay hydrates through Astro's own inline island script, and the Studio frames the preview host from
  another origin, which `frame-ancestors 'self'` would refuse.

## Consequences

- Changing a component's inline script means running `bun run csp:hashes`; `bun run check` fails until then.
- The Studio at `/admin` and the report endpoint stay exempt from the policy (ADR 0011).
- Static files Vercel serves straight from the CDN (`/_astro`, `public/`) carry Vercel's headers only.
- Once enforced, a tab opened before a deploy keeps the old policy, and the router runs the next page's scripts
  under it: a script whose body changed in that deploy is refused there until a reload. The enforcing change
  settles how the page recovers (keeping the previous release's hashes for a deploy, or reloading on a refused
  script).
