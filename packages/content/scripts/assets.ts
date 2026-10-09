/**
 * How the dataset scripts recognise a file they have already uploaded: Sanity records the SHA-1 of an
 * asset's bytes as `sha1hash`, so the seed and the album import upload a file once and match it after.
 */
import { createHash } from 'node:crypto';
import type { SanityClient } from '@sanity/client';

/** The SHA-1 of a file's bytes, as an asset's `sha1hash` holds it. */
export const sha1 = (bytes: Buffer): string => createHash('sha1').update(bytes).digest('hex');

/** The image assets the dataset already holds for these hashes: the asset's id by its hash. */
export async function imageAssetsBySha1(
  client: SanityClient,
  hashes: readonly string[],
): Promise<Map<string, string>> {
  const assets = await client.fetch<{ _id: string; sha1hash: string }[]>(
    '*[_type == "sanity.imageAsset" && sha1hash in $hashes]{_id, sha1hash}',
    { hashes },
  );
  return new Map(assets.map((asset) => [asset.sha1hash, asset._id]));
}
