/**
 * Seeds a dataset with the confirmed facts and the photographs (CONTENT-MODEL section 6).
 *
 *   bun seed                      from the repo root, against the development dataset
 *   bun seed -- --dry-run         print what would be written, touch nothing
 *   bun seed -- --replace         overwrite documents instead of filling missing fields
 *   bun seed -- --dataset name    another dataset (refused unless named explicitly)
 *
 * Reads PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN from packages/web/.env (the package
 * script passes --env-file). Stops before writing anything when either is missing or the
 * dataset does not answer. Idempotent: documents are created if missing and their fields set
 * only where missing, so an owner's edit survives a re-run; assets are matched by SHA-1.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ClientError, createClient, type SanityClient } from '@sanity/client';
import { STUDIO_API_VERSION } from '../src/studio/config';
import { PHOTOS_DIR, REGISTER_PATH, type RegisterPhoto, registerPhotos } from './register';
import { buildSeed, type SeedAssets, type SeedDocument } from './seed-data';

interface Options {
  dataset: string;
  dryRun: boolean;
  replace: boolean;
}

function parseArgs(argv: string[]): Options {
  const options: Options = { dataset: 'development', dryRun: false, replace: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--replace') options.replace = true;
    else if (arg === '--dataset') options.dataset = argv[++i] ?? options.dataset;
    else if (arg?.startsWith('--dataset=')) options.dataset = arg.slice('--dataset='.length);
  }
  return options;
}

function fail(message: string): never {
  console.error(`seed: ${message}`);
  process.exit(1);
}

function env(): { projectId: string; token: string } {
  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  let token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token && process.env.SANITY_WRITE_TOKEN) {
    token = process.env.SANITY_WRITE_TOKEN;
    console.warn(
      'seed: using SANITY_WRITE_TOKEN; the wizard, the runbook and the site expect SANITY_API_WRITE_TOKEN, so rename it in packages/web/.env.',
    );
  }
  if (!projectId)
    fail(
      'PUBLIC_SANITY_PROJECT_ID is missing. Run `bash scripts/setup-wizard.sh` (wayfinder ticket 17); nothing was created.',
    );
  if (!token)
    fail(
      'SANITY_API_WRITE_TOKEN is missing. Run stage 2 of `bash scripts/setup-wizard.sh`; nothing was created.',
    );
  return { projectId, token };
}

/** Roles that may create published documents; a Contributor token writes drafts only. */
const WRITE_ROLES = new Set(['administrator', 'editor', 'developer']);

async function preflight(client: SanityClient, dataset: string): Promise<void> {
  try {
    const me = (await client.users.getById('me')) as { roles?: { name: string }[] } | null;
    const roles = (me?.roles ?? []).map((role) => role.name);
    if (!roles.some((role) => WRITE_ROLES.has(role))) {
      fail(
        `the token's role is "${roles.join(', ') || 'unknown'}", which cannot create published documents. Create an Editor token (wizard stage 2) and put it in SANITY_API_WRITE_TOKEN; nothing was created.`,
      );
    }
    await client.fetch<number>('count(*[_type == "siteSettings"])');
  } catch (cause) {
    if (cause instanceof ClientError) {
      if (cause.statusCode === 401)
        fail(
          'the write token was refused (401). Check SANITY_API_WRITE_TOKEN; nothing was created.',
        );
      if (cause.statusCode === 403)
        fail('the token has no access to this dataset (403); nothing was created.');
      if (cause.statusCode === 404)
        fail(
          `dataset "${dataset}" does not exist on this project; create it at sanity.io/manage (wizard stage 1); nothing was created.`,
        );
    }
    throw cause;
  }
}

function sha1(bytes: Buffer): string {
  return createHash('sha1').update(bytes).digest('hex');
}

async function ensureAssets(
  client: SanityClient,
  photos: RegisterPhoto[],
  dryRun: boolean,
): Promise<SeedAssets> {
  const files = photos.map((photo) => ({
    photo,
    bytes: readFileSync(join(PHOTOS_DIR, photo.file)),
  }));
  const hashes = files.map((file) => sha1(file.bytes));
  const existing = await client.fetch<{ _id: string; sha1hash: string }[]>(
    '*[_type == "sanity.imageAsset" && sha1hash in $hashes]{_id, sha1hash}',
    { hashes },
  );
  const byHash = new Map(existing.map((asset) => [asset.sha1hash, asset._id]));
  const assets: SeedAssets = new Map();
  let uploaded = 0;
  for (const [index, { photo, bytes }] of files.entries()) {
    const hash = hashes[index] as string;
    let assetId = byHash.get(hash);
    if (!assetId) {
      if (dryRun) {
        assetId = `image-${hash}-dry-run`;
      } else {
        const asset = await client.assets.upload('image', bytes, {
          filename: photo.file,
          contentType: 'image/jpeg',
          creditLine: photo.credit,
          source: { id: photo.file, name: 'seed' },
        });
        assetId = asset._id;
        uploaded += 1;
      }
    }
    assets.set(photo.file, {
      assetId,
      caption: photo.caption,
      album: photo.album,
      photographer: photo.photographer,
    });
  }
  console.log(
    `seed: ${files.length} photographs, ${byHash.size} already uploaded, ${uploaded} uploaded now`,
  );
  return assets;
}

const BATCH = 20;

async function writeDocuments(
  client: SanityClient,
  docs: SeedDocument[],
  replace: boolean,
): Promise<void> {
  let created = 0;
  let updated = 0;
  let unchanged = 0;
  for (let start = 0; start < docs.length; start += BATCH) {
    const transaction = client.transaction();
    for (const doc of docs.slice(start, start + BATCH)) {
      if (replace) {
        transaction.createOrReplace(doc);
      } else {
        const { _id, _type, ...fields } = doc;
        transaction.createIfNotExists({ _id, _type });
        transaction.patch(_id, (patch) => patch.setIfMissing(fields));
      }
    }
    let result: Awaited<ReturnType<typeof transaction.commit>>;
    try {
      result = await transaction.commit({ autoGenerateArrayKeys: true, visibility: 'async' });
    } catch (cause) {
      if (cause instanceof ClientError && cause.statusCode === 403) {
        fail(
          `the token may not write published documents (${cause.message}). Use an Editor token (wizard stage 2). Documents written so far: ${created} created, ${updated} updated.`,
        );
      }
      throw cause;
    }
    for (const item of result.results) {
      if (item.operation === 'create') created += 1;
      else if (item.operation === 'update') updated += 1;
      else unchanged += 1;
    }
  }
  console.log(
    `seed: ${docs.length} documents, ${created} created, ${updated} updated, ${unchanged} unchanged`,
  );
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const { projectId, token } = env();
  const client = createClient({
    projectId,
    dataset: options.dataset,
    apiVersion: STUDIO_API_VERSION,
    useCdn: false,
    token,
    perspective: 'published',
    maxRetries: 2,
  });
  console.log(
    `seed: project ${projectId}, dataset ${options.dataset}${options.dryRun ? ', dry run' : ''}${options.replace ? ', replacing' : ''}`,
  );
  await preflight(client, options.dataset);

  const photos = registerPhotos(readFileSync(REGISTER_PATH, 'utf8'));
  const assets = await ensureAssets(client, photos, options.dryRun);
  const docs = buildSeed(assets);

  if (options.dryRun) {
    const counts: Record<string, number> = {};
    for (const doc of docs) counts[doc._type] = (counts[doc._type] ?? 0) + 1;
    console.log('seed: would write', counts);
    return;
  }
  await writeDocuments(client, docs, options.replace);
}

main().catch((cause: unknown) => {
  console.error('seed: failed', cause instanceof Error ? cause.message : cause);
  process.exit(1);
});
