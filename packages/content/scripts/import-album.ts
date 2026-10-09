/**
 * Fills an album from a folder of photographs: the album recipe (`oy-content-ops`) for more photographs
 * than the Studio is pleasant for, or for swapping web copies for the photographer's originals. A dry
 * run by default; nothing is uploaded or written without `--apply`.
 *
 *   bun run import-album -- <manifest.json>            what it would upload and write
 *   bun run import-album -- <manifest.json> --apply    upload the files, then save the album as a draft
 *   ... --dataset name                                 another dataset
 *
 * The manifest (`album-import.ts` holds its rules):
 *
 *   {
 *     "album": "album-gala-2025",
 *     "source": "/path/to/the/photographs",
 *     "photos": [{ "key": "gala-2025-the-hall", "file": "0205-167.jpg", "alt": "...", "caption": "..." }],
 *     "remove": ["gala-2025-attendees-sitting"],
 *     "cover": "gala-2025-the-hall"
 *   }
 *
 * A key the album holds takes the manifest's file and keeps its place, its words and its framing; a new
 * key needs alt text and a caption and is added after the others. A new album adds
 * `"create": { "title", "slug" }` with its `date` or `event` and its `credit`. Manifests name folders on
 * one machine and carry draft captions, so they stay out of the repository.
 *
 * Files are matched by SHA-1 (as the seed matches them), so a second run uploads nothing, and an upload
 * that stops halfway is picked up where it stopped. The album is saved as a draft, from the draft it
 * already has or else from the published album as this run read it, for the owner to review and publish
 * in the Studio. Published content is never written here, and a credit is never confirmed: a new album
 * starts with its credit to confirm.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, extname, isAbsolute, join, resolve } from 'node:path';
import type { SanityClient } from '@sanity/client';
import {
  type AlbumManifest,
  type AlbumPlan,
  draftMutations,
  importArguments,
  parseManifest,
  planAlbum,
  type StoredAlbum,
} from './album-import';
import { imageAssetsBySha1, sha1 } from './assets';
import { datasetArgument, fail, writeClient } from './dataset';

const TOOL = 'import-album';

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

interface SourceFile {
  file: string;
  path: string;
  sha1: string;
  bytes: number;
}

const messageOf = (cause: unknown) => (cause instanceof Error ? cause.message : String(cause));

function readManifest(path: string): AlbumManifest {
  if (!existsSync(path)) fail(TOOL, `no manifest at ${path}.`);
  try {
    return parseManifest(JSON.parse(readFileSync(path, 'utf8')));
  } catch (cause) {
    return fail(TOOL, `${path}: ${messageOf(cause)}`);
  }
}

/** Every file the manifest names, hashed; all the missing ones are reported together. */
function sourceFiles(manifest: AlbumManifest, manifestPath: string): SourceFile[] {
  const folder = isAbsolute(manifest.source)
    ? manifest.source
    : resolve(dirname(manifestPath), manifest.source);
  const missing = manifest.photos
    .map(({ file }) => join(folder, file))
    .filter((path) => !existsSync(path));
  if (missing.length > 0) {
    fail(TOOL, `missing from ${folder}:\n  ${missing.join('\n  ')}\nNothing was written.`);
  }
  return manifest.photos.map(({ file }) => {
    const path = join(folder, file);
    return { file, path, sha1: sha1(readFileSync(path)), bytes: statSync(path).size };
  });
}

async function upload(client: SanityClient, file: SourceFile, album: string): Promise<string> {
  const asset = await client.assets.upload('image', readFileSync(file.path), {
    filename: basename(file.file),
    contentType: CONTENT_TYPES[extname(file.file).toLowerCase()],
    source: { id: `${album}/${file.file}`, name: TOOL },
  });
  return asset._id;
}

const megabytes = (bytes: number) => `${(bytes / 1_000_000).toFixed(1)} MB`;

function report(plan: AlbumPlan, pending: readonly SourceFile[], alreadyUploaded: number) {
  const { album } = plan;
  const title = typeof album.title === 'string' ? album.title : album._id;
  console.log(`${TOOL}: ${album._id}, "${title}"${plan.created ? ', a new album' : ''}`);
  const size = megabytes(pending.reduce((sum, file) => sum + file.bytes, 0));
  console.log(
    `  files: ${pending.length} to upload (${size}), ${alreadyUploaded} already in the dataset`,
  );
  const line = (label: string, keys: readonly string[]) => {
    if (keys.length > 0) console.log(`  ${label} (${keys.length}): ${keys.join(', ')}`);
  };
  line('takes a new file', plan.swapped);
  line('added', plan.added);
  line('removed', plan.removed);
  line('already out of the album', plan.absent);
  console.log(`  the album would hold ${album.photos?.length ?? 0} photographs`);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const { manifest: manifestPath, apply } = (() => {
    try {
      return importArguments(argv);
    } catch (cause) {
      return fail(TOOL, messageOf(cause));
    }
  })();
  const manifest = readManifest(resolve(manifestPath));
  const files = sourceFiles(manifest, resolve(manifestPath));

  const client = await writeClient(TOOL, datasetArgument(argv));
  const assets = await imageAssetsBySha1(
    client,
    files.map((file) => file.sha1),
  );
  const shaOf = new Map(files.map((file) => [file.file, file.sha1]));
  const draft = await client.getDocument<StoredAlbum>(`drafts.${manifest.album}`);
  const current = draft ?? (await client.getDocument<StoredAlbum>(manifest.album));

  // A file not uploaded yet answers a placeholder made from its bytes: enough to plan with, never written.
  const assetFor = (file: string) => {
    const sha1 = shaOf.get(file) as string;
    return assets.get(sha1) ?? `image-${sha1}-to-upload`;
  };
  const plan = (): AlbumPlan => {
    try {
      return planAlbum(manifest, current, assetFor);
    } catch (cause) {
      return fail(TOOL, `${messageOf(cause)} Nothing was written.`);
    }
  };

  const pending = files.filter((file) => !assets.has(file.sha1));
  const dry = plan();
  report(dry, pending, files.length - pending.length);
  if (dry.unchanged && pending.length === 0) {
    console.log(`${TOOL}: the album already matches the manifest; nothing to do.`);
    return;
  }
  if (!apply) {
    console.log(`${TOOL}: dry run. Add --apply to upload the files and save the album as a draft.`);
    return;
  }

  for (const [index, file] of pending.entries()) {
    try {
      assets.set(file.sha1, await upload(client, file, manifest.album));
    } catch (cause) {
      fail(
        TOOL,
        `${file.file} did not upload (${messageOf(cause)}). ${index} of ${pending.length} files are in the dataset and will be matched next time; no draft was written.`,
      );
    }
    console.log(`  uploaded ${index + 1} of ${pending.length}: ${file.file}`);
  }
  const final = plan();
  if (final.unchanged) {
    console.log(`${TOOL}: the files are uploaded and the album already matches; no draft written.`);
    return;
  }
  try {
    await client.mutate(draftMutations(final, draft) as never, { visibility: 'async' });
  } catch (cause) {
    // One transaction, as the migrations write: it failed whole, so no draft was written.
    fail(
      TOOL,
      `the files are uploaded but no draft was written (${messageOf(cause)}); the album's draft may have changed since it was read, so run it again.`,
    );
  }
  console.log(
    `${TOOL}: saved the draft of ${manifest.album} with ${final.album.photos?.length ?? 0} photographs. Review it in the Studio and publish it there.`,
  );
}

main().catch((cause: unknown) => {
  console.error(`${TOOL}: failed`, messageOf(cause));
  process.exit(1);
});
