/**
 * The fixture dataset that CI's fixture Playwright job and the verify-omo-yoruba skill read instead of
 * Sanity (`fixture-api.ts` serves it). It is the seed (`buildSeed`: the confirmed facts and the register's
 * photographs), with each photograph's asset id made from its file so nothing is uploaded, plus one video
 * on the Odunde 2026 album so the video flow has something to play. It is never a copy of a real dataset,
 * since those hold enquiries.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sha1 } from './assets';
import { PHOTOS_DIR, REGISTER_PATH, registerPhotos } from './register';
import { buildSeed, type SeedAssets, type SeedDocument } from './seed-data';

/**
 * The fixture's one video: a test value for CI and the verify skill, never shown on the site. The id is
 * YouTube's own sample video; nothing requests it, since the video flow answers YouTube's address itself.
 */
export const FIXTURE_VIDEO = {
  _key: 'fixture-video',
  _type: 'video',
  title: 'Fixture video',
  url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
} as const;

export const FIXTURE_VIDEO_ALBUM = 'album-odunde-2026';

/** A JPEG's pixel size, read from its first start-of-frame marker. */
export function jpegSize(bytes: Buffer): { width: number; height: number } {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error('not a JPEG');
  let at = 2;
  while (at + 9 < bytes.length) {
    if (bytes[at] !== 0xff) throw new Error(`no marker at byte ${at}`);
    const marker = bytes[at + 1] as number;
    const length = bytes.readUInt16BE(at + 2);
    // SOF0 to SOF15, except DHT (C4), JPG (C8) and DAC (CC), carry the frame's size.
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: bytes.readUInt16BE(at + 5), width: bytes.readUInt16BE(at + 7) };
    }
    at += 2 + length;
  }
  throw new Error('no start-of-frame marker');
}

export interface FixtureDataset {
  documents: SeedDocument[];
  /** Each photograph's file on disk by the asset id's hash, for the image route. */
  images: Map<string, string>;
}

export function buildFixtureDataset(): FixtureDataset {
  const assets: SeedAssets = new Map();
  const images = new Map<string, string>();
  for (const photo of registerPhotos(readFileSync(REGISTER_PATH, 'utf8'))) {
    const path = join(PHOTOS_DIR, photo.file);
    const bytes = readFileSync(path);
    const hash = sha1(bytes);
    const { width, height } = jpegSize(bytes);
    images.set(hash, path);
    assets.set(photo.file, {
      assetId: `image-${hash}-${width}x${height}-jpg`,
      caption: photo.caption,
      album: photo.album,
      photographer: photo.photographer,
    });
  }
  const documents = buildSeed(assets).map((doc) =>
    doc._id === FIXTURE_VIDEO_ALBUM ? { ...doc, videos: [FIXTURE_VIDEO] } : doc,
  );
  if (!documents.some((doc) => doc._id === FIXTURE_VIDEO_ALBUM)) {
    throw new Error(`the seed has no ${FIXTURE_VIDEO_ALBUM} to hold the fixture video`);
  }
  return { documents, images };
}
