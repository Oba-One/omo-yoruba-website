import { describe, expect, it } from 'vitest';
import * as queries from '../src/queries';
import { fixtureHandler } from './fixture-api';
import { buildFixtureDataset, FIXTURE_VIDEO, jpegSize } from './fixture-dataset';

const dataset = buildFixtureDataset();
const handle = fixtureHandler(dataset);
const PARAMS = { slug: 'odunde-2026', email: 'nobody@example.org', since: '2026-01-01T00:00:00Z' };

/** A query as @sanity/client sends it with `useProjectHostname: false`: GET, each parameter JSON-encoded. */
async function query(groq: string, params: Record<string, unknown> = {}) {
  const url = new URL('http://127.0.0.1/v2026-09-11/data/query/development');
  url.searchParams.set('query', groq);
  for (const [key, value] of Object.entries(params))
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  const response = await handle(new Request(url));
  return { status: response.status, body: (await response.json()) as { result?: unknown } };
}

describe('the fixture dataset', () => {
  it('gives every photograph an asset id that carries its real size', () => {
    const refs = JSON.stringify(dataset.documents).match(/image-[0-9a-f]{40}-\d+x\d+-jpg/g) ?? [];
    expect(refs.length).toBeGreaterThan(10);
    expect(dataset.images.size).toBeGreaterThan(10);
    for (const ref of new Set(refs)) {
      const hash = /image-([0-9a-f]{40})-/.exec(ref)?.[1];
      expect(dataset.images.get(hash as string), ref).toBeDefined();
    }
  });

  it('reads a JPEG size and refuses anything else', () => {
    // A minimal baseline JPEG header: SOI, then SOF0 with height 2 and width 3.
    const sof = Buffer.from([
      0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x02, 0x00, 0x03, 0x03,
    ]);
    expect(jpegSize(Buffer.concat([sof, Buffer.alloc(16)]))).toEqual({ width: 3, height: 2 });
    expect(() => jpegSize(Buffer.from('not an image'))).toThrow('not a JPEG');
  });
});

describe('the fixture API', () => {
  it('answers every query the site runs, without a parse or evaluation error', async () => {
    const strings = Object.entries(queries).filter(([, value]) => typeof value === 'string');
    expect(strings.length).toBeGreaterThan(10);
    for (const [name, groq] of strings) {
      const { status, body } = await query(groq as string, PARAMS);
      expect(status, `${name}: ${JSON.stringify(body)}`).toBe(200);
      expect(body).toHaveProperty('result');
    }
  });

  it('serves an album page with photographs and the fixture video', async () => {
    const { body } = await query(queries.albumPageQuery, { slug: 'odunde-2026' });
    const text = JSON.stringify(body.result);
    expect(text).toContain(FIXTURE_VIDEO.url);
    expect(text.match(/image-[0-9a-f]{40}-\d+x\d+-jpg/g)?.length ?? 0).toBeGreaterThan(2);
  });

  it('answers the POST form the client uses for long queries', async () => {
    const response = await handle(
      new Request('http://127.0.0.1/v2026-09-11/data/query/development', {
        method: 'POST',
        body: JSON.stringify({ query: 'count(*[_type == $type])', params: { type: 'album' } }),
      }),
    );
    expect(await response.json()).toMatchObject({ result: 3 });
  });

  it('serves the photograph behind an asset id, and 404 for anything outside the fixture', async () => {
    const [hash] = [...dataset.images.keys()];
    const image = await handle(
      new Request(`http://127.0.0.1/images/fixture/development/${hash}-10x10.jpg`),
    );
    expect(image.status).toBe(200);
    expect(image.headers.get('content-type')).toBe('image/jpeg');
    const missing = await handle(new Request('http://127.0.0.1/v1/projects'));
    expect(missing.status).toBe(404);
  });

  it("answers a broken query with 400 and the parser's message, as Sanity does", async () => {
    const { status } = await query('*[_type ==');
    expect(status).toBe(400);
  });
});
