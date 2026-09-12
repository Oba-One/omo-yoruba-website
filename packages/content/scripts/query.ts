/**
 * Runs one GROQ query against the site's dataset with packages/web/.env loaded (the package
 * script passes --env-file), for sessions without the Sanity MCP or a CLI login:
 * `bun run --filter @oy/content query -- '*[_type == "zone"]{name}'`. Reads the project id, the
 * dataset (`--dataset <name>` overrides) and the Viewer token (the Editor token as a fallback);
 * prints the result as JSON and never prints an environment value. `--perspective drafts` reads
 * drafts too.
 */
import { createClient } from '@sanity/client';

const API_VERSION = '2026-09-11';

function flag(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

const query = process.argv.slice(2).find((arg, index, all) => {
  if (arg.startsWith('--')) return false;
  const previous = all[index - 1];
  return !(previous?.startsWith('--') && ['dataset', 'perspective'].includes(previous.slice(2)));
});
if (!query) {
  console.error('query: pass a GROQ query as the first argument.');
  process.exit(2);
}

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = flag('dataset') ?? process.env.PUBLIC_SANITY_DATASET;
const token =
  process.env.SANITY_API_READ_TOKEN ??
  process.env.SANITY_API_WRITE_TOKEN ??
  process.env.SANITY_WRITE_TOKEN;
if (!projectId || !dataset) {
  console.error(
    'query: PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET are missing from packages/web/.env.',
  );
  process.exit(2);
}

const perspective = flag('perspective') === 'drafts' ? 'drafts' : 'published';
const client = createClient({
  projectId,
  dataset,
  apiVersion: API_VERSION,
  useCdn: false,
  token,
  perspective,
});
const result = await client.fetch(query);
console.log(JSON.stringify(result, null, 2));
