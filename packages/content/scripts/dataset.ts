/**
 * The write access the dataset scripts share (the seed, the export, the migrations): the project and
 * the Editor token from packages/web/.env, which each package script loads with --env-file, and a
 * check that both answer before anything is written. Never prints a token.
 */
import {
  ClientError,
  type ClientPerspective,
  createClient,
  type SanityClient,
} from '@sanity/client';
import { STUDIO_API_VERSION } from '../src/api-version';

/** Roles that may create published documents; a Contributor token writes drafts only. */
const WRITE_ROLES = new Set(['administrator', 'editor', 'developer']);

export function fail(tool: string, message: string): never {
  console.error(`${tool}: ${message}`);
  process.exit(1);
}

function access(tool: string): { projectId: string; token: string } {
  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  let token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token && process.env.SANITY_WRITE_TOKEN) {
    token = process.env.SANITY_WRITE_TOKEN;
    console.warn(
      `${tool}: using SANITY_WRITE_TOKEN; the wizard, the runbook and the site expect SANITY_API_WRITE_TOKEN, so rename it in packages/web/.env.`,
    );
  }
  if (!projectId)
    fail(
      tool,
      'PUBLIC_SANITY_PROJECT_ID is missing. Run `bash scripts/setup-wizard.sh` (wayfinder ticket 17); nothing was written.',
    );
  if (!token)
    fail(
      tool,
      'SANITY_API_WRITE_TOKEN is missing. Run stage 2 of `bash scripts/setup-wizard.sh`; nothing was written.',
    );
  return { projectId, token };
}

async function preflight(tool: string, client: SanityClient, dataset: string): Promise<void> {
  try {
    const me = (await client.users.getById('me')) as { roles?: { name: string }[] } | null;
    const roles = (me?.roles ?? []).map((role) => role.name);
    if (!roles.some((role) => WRITE_ROLES.has(role))) {
      fail(
        tool,
        `the token's role is "${roles.join(', ') || 'unknown'}", which cannot write published documents. Create an Editor token (wizard stage 2) and put it in SANITY_API_WRITE_TOKEN; nothing was written.`,
      );
    }
    await client.fetch<number>('count(*[_type == "siteSettings"])');
  } catch (cause) {
    if (cause instanceof ClientError) {
      if (cause.statusCode === 401)
        fail(
          tool,
          'the write token was refused (401). Check SANITY_API_WRITE_TOKEN; nothing was written.',
        );
      if (cause.statusCode === 403)
        fail(tool, 'the token has no access to this dataset (403); nothing was written.');
      if (cause.statusCode === 404)
        fail(
          tool,
          `dataset "${dataset}" does not exist on this project; create it at sanity.io/manage (wizard stage 1); nothing was written.`,
        );
    }
    throw cause;
  }
}

/** A client that may write the dataset, checked before anything is written. */
export async function writeClient(
  tool: string,
  dataset: string,
  perspective: ClientPerspective = 'published',
): Promise<SanityClient> {
  const { projectId, token } = access(tool);
  const client = createClient({
    projectId,
    dataset,
    apiVersion: STUDIO_API_VERSION,
    useCdn: false,
    token,
    perspective,
    maxRetries: 2,
  });
  console.log(`${tool}: project ${projectId}, dataset ${dataset}`);
  await preflight(tool, client, dataset);
  return client;
}

/** `--dataset name` or `--dataset=name`, else `development`. */
export function datasetArgument(argv: readonly string[]): string {
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dataset') return argv[index + 1] ?? 'development';
    if (arg?.startsWith('--dataset=')) return arg.slice('--dataset='.length);
  }
  return 'development';
}
