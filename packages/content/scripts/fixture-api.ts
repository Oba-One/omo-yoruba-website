/**
 * A local stand-in for Sanity's query API, serving the fixture dataset (`fixture-dataset.ts`). The site
 * reads it when `SANITY_API_HOST` names it (packages/web/astro.config.ts takes a loopback address only),
 * so CI's fixture Playwright job and the verify-omo-yoruba skill can run the photo, video and carousel
 * flows with no Sanity project, no token and no network.
 *
 *   bun packages/content/scripts/fixture-api.ts        listens on 127.0.0.1:4400 (FIXTURE_API_PORT)
 *
 * Routes: the query endpoint as @sanity/client calls it with `useProjectHostname: false`
 * (GET or POST /v<version>/data/query/<dataset>), answered with groq-js over the published documents;
 * /images/<project>/<dataset>/<hash>-<w>x<h>.<ext>, the photograph behind a fixture asset id, for a
 * browser that routes Sanity's image CDN here; /health for the runner. Anything else answers 404. The site's loader turns a failed read into null,
 * so a query the fixture cannot answer renders Pending: `fixture-api.test.ts` runs every query the site
 * exports against it to catch that here.
 */
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluate, parse } from 'groq-js';
import { buildFixtureDataset } from './fixture-dataset';

const QUERY = /^\/v[\d-]+\/data\/query\/[\w-]+$/;
const IMAGE = /^\/images\/[\w-]+\/[\w-]+\/([0-9a-f]{40})-\d+x\d+\.(jpg|png|webp)$/;

/** The query and its parameters, from the GET search string or the POST body the client sends. */
async function readQuery(
  request: Request,
  url: URL,
): Promise<{ query: string; params: Record<string, unknown> }> {
  if (request.method === 'POST') {
    const body = (await request.json()) as { query?: string; params?: Record<string, unknown> };
    return { query: body.query ?? '', params: body.params ?? {} };
  }
  const params: Record<string, unknown> = {};
  for (const [key, value] of url.searchParams) {
    if (key.startsWith('$')) params[key.slice(1)] = JSON.parse(value);
  }
  return { query: url.searchParams.get('query') ?? '', params };
}

export function fixtureHandler(dataset = buildFixtureDataset()) {
  const published = dataset.documents.filter((doc) => !doc._id.startsWith('drafts.'));
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    if (url.pathname === '/health') return new Response('ok');
    if (QUERY.test(url.pathname)) {
      const started = performance.now();
      try {
        const { query, params } = await readQuery(request, url);
        const tree = parse(query, { params });
        const result = await (await evaluate(tree, { dataset: published, params })).get();
        return Response.json({ query, result, ms: Math.round(performance.now() - started) });
      } catch (error) {
        const description = error instanceof Error ? error.message : String(error);
        return Response.json({ error: { description, type: 'queryParseError' } }, { status: 400 });
      }
    }
    const image = IMAGE.exec(url.pathname);
    const file = image ? dataset.images.get(image[1] as string) : undefined;
    if (file) {
      return new Response(readFileSync(file), {
        headers: { 'content-type': 'image/jpeg', 'cache-control': 'max-age=3600' },
      });
    }
    return Response.json({ error: { description: 'not in the fixture' } }, { status: 404 });
  };
}

/** Serves the handler on 127.0.0.1 through node:http, so Bun and Node both run it. */
export function serveFixture(port: number) {
  const handle = fixtureHandler();
  const server = createServer(async (incoming, outgoing) => {
    const chunks: Buffer[] = [];
    for await (const chunk of incoming) chunks.push(chunk as Buffer);
    const request = new Request(`http://127.0.0.1:${port}${incoming.url ?? '/'}`, {
      method: incoming.method,
      ...(chunks.length ? { body: Buffer.concat(chunks) } : {}),
    });
    const response = await handle(request);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  });
  return new Promise<typeof server>((done) => server.listen(port, '127.0.0.1', () => done(server)));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.FIXTURE_API_PORT ?? 4400);
  await serveFixture(port);
  console.log(`fixture-api: the fixture dataset on http://127.0.0.1:${port}`);
}
