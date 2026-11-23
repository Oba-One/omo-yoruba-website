# The CSP allows inline scripts by hash, and is enforced once it reports clean

Accepted 22 November 2026. The owner chose the security headers and the CSP as the next launch item (open-work
D13, E9). Amends ADR 0011 and ADR 0020.

## Decision

- **The policy stays a header from the middleware, with hashes, so the cross-fade stays.** Astro's own CSP is a
  `<meta>` tag with no report-only mode and does not support `<ClientRouter />` (ADR 0011).
- **`script-src` names every inline script by its SHA-256 hash.** Every inline script the site ships is a
  component's `<script is:inline>` (ADR 0018), and Astro ships its body exactly as the source writes it: the
  eight hashes from the source matched the eight the live site reported on 22 November. `bun run csp:hashes`
  writes them into `packages/web/src/lib/csp-hashes.ts`, and a unit test fails while that file differs from the
  source. Every page carries all of them, because the ClientRouter runs the next page's scripts under the policy
  of the page it swapped from. An inline script with any attribute but `is:inline` (`define:vars`, `set:html`)
  fails the generator, since its body changes per render.
- **Nothing else ships inline.** Astro inlines a bundled script under 4 KB, which gave each page a small module
  of its own; `vite.build.assetsInlineLimit` keeps scripts as files under `/_astro`, which `'self'` allows. The
  Give Dialog's Zeffy frame rides the page, as the Join Dialog's does (ADR 0050), in place of a server island:
  an island ships an inline script carrying props encrypted per render, which no hash can allow. A publish of
  Organization details purges the pages, so a new form address still shows at once.
- **`style-src` allows inline styles.** The view transitions write a `<style>` per animated element with a name
  made per render, and components set `style` attributes; neither can be hashed ahead. Injected style cannot run
  code.
- **Three headers on every answer the function gives:** `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and a `Permissions-Policy` that switches off the camera,
  microphone, location and ad topics. Payment and full screen stay as browsers set them, for Zeffy's form and
  YouTube's player. HSTS is Vercel's own (`max-age=63072000`); `preload` is not asked for, since it cannot be
  taken back quickly.
- **Enforcement came in two steps.** Pull request 72 shipped the new policy still report-only, because nothing
  but production can prove it: Vercel previews are off, and Playwright runs `astro dev`. On 22 November the live
  site reported no violation of it on any of the 24 pages in the sitemap, the 404 page, the Give and Join
  Dialogs, an enquiry form, the mobile menu, an album's Lightbox reached by a router swap and an album video,
  while a script planted as a control was reported. `CSP_ENFORCED` in `csp.ts` then sent it as
  `Content-Security-Policy`, in a production build only, so `astro dev` and its toolbar stay report-only. Draft
  requests and the preview host keep it report-only (`cspHeaderName`): the Visual Editing overlay hydrates
  through Astro's own inline island script, and the Studio frames the preview host from another origin, which
  `frame-ancestors 'self'` would refuse.

## Consequences

- Changing a component's inline script means running `bun run csp:hashes`; `bun run check` fails until then.
- The Studio at `/admin` and the report endpoint stay exempt from the policy (ADR 0011).
- Static files Vercel serves straight from the CDN (`/_astro`, `public/`) carry Vercel's headers only.
- A tab opened before a deploy keeps the old policy, and the router would run the next page's scripts under it,
  refusing any whose body changed. Every page names its policy in `<meta name="oy-csp">` (an FNV-1a fingerprint,
  `cspFingerprint`), and a swap to a page under another policy becomes a full load, which brings the new policy
  (`src/lib/csp-swap.ts`, in the layout's bundled script). The layout prevents the router's preparation once the
  page has loaded, which the router answers by setting the address, with no history entry or swap of its own. The
  fingerprint covers whether the policy is enforced too, so switching enforcement off reaches open tabs the same
  way. A form's answer still swaps, so what was typed survives; across such a deploy its page may need a reload.
  A deploy that changes no policy keeps the cross-fade.
