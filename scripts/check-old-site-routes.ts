// After `astro build`: the old site's addresses must be the first routes of Vercel's Build Output, ahead of
// the adapter's 404 catch-all (ADR 0061). Without them production answers every old address with an empty
// 404, and nothing else fails: CI's Playwright jobs run Astro's own server, where the middleware answers.
// Run from the web package's build scripts, so neither CI's build nor Vercel's can ship without them.
import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { oldSiteRoutes, type VercelRoute } from '../packages/web/src/lib/redirects.ts';

const file = new URL('../packages/web/.vercel/output/config.json', import.meta.url);
const routes: VercelRoute[] = JSON.parse(readFileSync(file, 'utf8')).routes ?? [];
const expected = oldSiteRoutes();
const catchAll = routes.findIndex((route) => route.src === '^/.*$' && route.status === 404);

if (!isDeepStrictEqual(routes.slice(0, expected.length), expected) || catchAll < expected.length) {
  console.error(
    `check-old-site-routes: ${file.pathname} does not open with the ${expected.length} old-site routes ahead of the 404 catch-all. Is oy:old-site-addresses still in astro.config.ts? (ADR 0061)`,
  );
  process.exit(1);
}
console.log(`check-old-site-routes: ${expected.length} old-site routes ahead of the 404 catch-all`);
