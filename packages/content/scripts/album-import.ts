/**
 * The album import's pure half: a manifest names an album, the photographs it should hold and the files
 * they come from, and the plan says what the album's draft becomes. Nothing here reads a file or talks to
 * a dataset, so the plan is tested on plain data before `import-album.ts` uploads anything.
 *
 * A key the album already holds keeps its place, its words, its crop and its hotspot, and takes the
 * manifest's file: the same photograph from a better file. Its words are edited in the Studio, never from
 * a manifest, so a second run cannot undo the owner's review. A different photograph gets a new key, and
 * the old one is removed by name. A key is the photograph's address (`/gallery/<slug>?photo=<key>`,
 * ADR 0037).
 */
import { emDashMessage, marksMessage } from '../src/validation/checks';
import { type Mutation, revisionGuard } from './migrations/core';

export interface ManifestPhoto {
  /** The photograph's key in the album, lower case with hyphens. */
  key: string;
  /** The file, by its path inside the manifest's source folder. */
  file: string;
  /** Alt text and a caption: required for a photograph the album does not hold yet, unread for one it does. */
  alt?: string;
  caption?: string;
}

/** What a new album starts with. The owner confirms the credit in the Studio, never the import. */
export interface NewAlbum {
  title: string;
  slug: string;
  /** `YYYY-MM-DD`, when no edition dates the album or the day matters. */
  date?: string;
  /** The id of the edition (`event`) the photographs belong to. */
  event?: string;
  /** The id of the `photographer` the album credits. */
  credit?: string;
}

export interface AlbumManifest {
  /** The album's id: `album-gala-2025`. */
  album: string;
  /** Read only when the album does not exist yet. */
  create?: NewAlbum;
  /** The folder the files are in. */
  source: string;
  photos: ManifestPhoto[];
  /** Keys to take out of the album. */
  remove: string[];
  /** The key whose photograph becomes the cover. */
  cover?: string;
}

export interface StoredImage {
  _type?: string;
  _key?: string;
  /** A stored reference may carry more than its target, `_weak` for one. */
  asset?: { _type?: string; _ref?: string; [field: string]: unknown };
  alt?: string;
  caption?: string;
  [field: string]: unknown;
}

export interface StoredAlbum {
  _id: string;
  _type: string;
  _rev?: string;
  photos?: StoredImage[];
  cover?: StoredImage;
  [field: string]: unknown;
}

export interface AlbumPlan {
  /** The album as its draft will hold it, under its published id and without system fields. */
  album: StoredAlbum;
  created: boolean;
  /** Keys whose file changed. */
  swapped: string[];
  added: string[];
  removed: string[];
  /** Keys the manifest removes that the album does not hold. */
  absent: string[];
  /** The album already matches the manifest: nothing to write. */
  unchanged: boolean;
}

export interface ImportArguments {
  /** The manifest's path as typed. */
  manifest: string;
  /** False is a dry run: nothing is uploaded or written. */
  apply: boolean;
}

const ALBUM_ID = /^album-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KEY = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const filled = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';

const optionalText = (value: unknown, name: string): string | undefined => {
  if (value === undefined) return undefined;
  if (!filled(value)) throw new Error(`${name} must be text, or left out.`);
  return value;
};

/** A misspelled field would be dropped in silence, and a dropped `remove` or `cover` changes the album. */
function onlyFields(value: Record<string, unknown>, known: readonly string[], where: string) {
  const unknown = Object.keys(value).filter((field) => !known.includes(field));
  if (unknown.length > 0) {
    throw new Error(`${where} has ${unknown.join(', ')}, which the import does not read.`);
  }
}

/**
 * The voice rules the Studio and the repo lint hold copy to (no em dash, the marks on Yoruba words): a
 * manifest lives outside the repository, so its words meet neither before they are written.
 */
function checkWords(value: string | undefined, where: string) {
  for (const check of [emDashMessage, marksMessage]) {
    const message = check(value);
    if (message !== true) throw new Error(`${where}: ${message}`);
  }
}

/**
 * The command line: one manifest, `--apply`, and `--dataset name`, which `datasetArgument` reads. Anything
 * else is refused, so a mistyped `--apply` is an error rather than a quiet dry run.
 */
export function importArguments(argv: readonly string[]): ImportArguments {
  const manifests: string[] = [];
  let apply = false;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index] as string;
    if (arg === '--apply') apply = true;
    else if (arg === '--dataset') {
      const name = argv[index + 1];
      if (!name || name.startsWith('--')) throw new Error('--dataset needs a dataset name.');
      index += 1;
    } else if (arg.startsWith('--dataset=')) {
      if (arg === '--dataset=') throw new Error('--dataset needs a dataset name.');
    } else if (arg.startsWith('--')) throw new Error(`${arg} is not an option of import-album.`);
    else manifests.push(arg);
  }
  const [manifest, ...others] = manifests;
  if (!manifest) throw new Error('pass the manifest: bun run import-album -- <manifest.json>');
  if (others.length > 0) throw new Error('pass one manifest at a time.');
  return { manifest, apply };
}

/** A path that stays inside the source folder: not absolute, and never climbing out with `..`. */
const insideSource = (file: string) =>
  !/^([\\/]|[A-Za-z]:)/.test(file) && !file.split(/[\\/]/).includes('..');

function parsePhoto(value: unknown, index: number): ManifestPhoto {
  if (!isRecord(value))
    throw new Error(`photos[${index}] must be an object with a key and a file.`);
  const { key, file } = value;
  if (!filled(key) || !KEY.test(key)) {
    throw new Error(
      `photos[${index}]: the key ${JSON.stringify(key)} must be lower case letters and digits joined by hyphens.`,
    );
  }
  onlyFields(value, ['key', 'file', 'alt', 'caption'], key);
  if (!filled(file)) throw new Error(`${key}: name the file it comes from.`);
  if (!insideSource(file))
    throw new Error(`${key}: ${file} must be a path inside the source folder.`);
  const alt = optionalText(value.alt, `${key}: alt`);
  const caption = optionalText(value.caption, `${key}: caption`);
  checkWords(alt, `${key}: alt`);
  checkWords(caption, `${key}: caption`);
  return { key, file, ...(alt ? { alt } : {}), ...(caption ? { caption } : {}) };
}

function parseCreate(value: unknown): NewAlbum | undefined {
  if (value === undefined) return undefined;
  if (!isRecord(value) || !filled(value.title) || !filled(value.slug)) {
    throw new Error('create must give the new album a title and a slug.');
  }
  onlyFields(value, ['title', 'slug', 'date', 'event', 'credit'], 'create');
  checkWords(value.title, 'create: title');
  if (!KEY.test(value.slug)) {
    throw new Error(
      `create: the slug ${JSON.stringify(value.slug)} must be lower case with hyphens.`,
    );
  }
  const date = optionalText(value.date, 'create: date');
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`create: the date ${JSON.stringify(date)} must read YYYY-MM-DD.`);
  }
  const event = optionalText(value.event, 'create: event');
  const credit = optionalText(value.credit, 'create: credit');
  return {
    title: value.title,
    slug: value.slug,
    ...(date ? { date } : {}),
    ...(event ? { event } : {}),
    ...(credit ? { credit } : {}),
  };
}

/** A manifest as the import reads it, or an error that names what to fix. */
export function parseManifest(value: unknown): AlbumManifest {
  if (!isRecord(value)) throw new Error('A manifest is a JSON object.');
  onlyFields(value, ['album', 'create', 'source', 'photos', 'remove', 'cover'], 'The manifest');
  const { album, source } = value;
  if (!filled(album) || !ALBUM_ID.test(album)) {
    throw new Error(
      `album must be the album's id, "album-" then lower case with hyphens; got ${JSON.stringify(album)}.`,
    );
  }
  if (!filled(source)) throw new Error('source must name the folder the files are in.');
  if (!Array.isArray(value.photos)) {
    throw new Error('photos must be a list, empty when only removing.');
  }
  const photos = value.photos.map(parsePhoto);

  const remove = value.remove ?? [];
  if (!Array.isArray(remove) || !remove.every(filled)) {
    throw new Error('remove must be a list of keys.');
  }
  if (new Set(remove).size !== remove.length) throw new Error('remove lists a key twice.');

  const keys = new Set<string>();
  const files = new Set<string>();
  for (const { key, file } of photos) {
    if (keys.has(key)) throw new Error(`The key ${key} is listed twice.`);
    if (files.has(file)) throw new Error(`The file ${file} is listed under two keys.`);
    keys.add(key);
    files.add(file);
  }
  for (const key of remove) {
    if (keys.has(key)) throw new Error(`The manifest both lists and removes ${key}.`);
  }

  const cover = optionalText(value.cover, 'cover');
  const create = parseCreate(value.create);
  return {
    album,
    ...(create ? { create } : {}),
    source,
    photos,
    remove,
    ...(cover ? { cover } : {}),
  };
}

const reference = (id: string) => ({ _type: 'reference', _ref: id });

/** The album without what the dataset writes for itself, under its published id: a draft is saved from the rest. */
function albumContent(document: StoredAlbum, id: string): StoredAlbum {
  const kept = Object.entries(document).filter(
    ([field]) => !field.startsWith('_') || field === '_type',
  );
  return { ...Object.fromEntries(kept), _id: id } as StoredAlbum;
}

function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => sameValue(item, b[index]));
  }
  if (isRecord(a) && isRecord(b)) {
    const fields = Object.keys(a);
    return (
      fields.length === Object.keys(b).length &&
      fields.every((field) => field in b && sameValue(a[field], b[field]))
    );
  }
  return false;
}

function newAlbum(id: string, create: NewAlbum): StoredAlbum {
  return {
    _id: id,
    _type: 'album',
    title: create.title,
    slug: { _type: 'slug', current: create.slug },
    ...(create.date ? { date: create.date } : {}),
    ...(create.event ? { event: reference(create.event) } : {}),
    ...(create.credit ? { credit: reference(create.credit) } : {}),
    creditConfirmed: false,
    photos: [],
  };
}

/** The cover a key's photograph makes: the same picture and words, without its key or its framing. */
const coverOf = ({ asset, alt, caption }: StoredImage): StoredImage => ({
  _type: 'oyImage',
  asset,
  ...(alt ? { alt } : {}),
  ...(caption ? { caption } : {}),
});

/** Two keys on one file would show a photograph twice, as the summer camp album once did. */
function refuseRepeats(photos: readonly StoredImage[]) {
  const shown = new Map<string, string>();
  for (const photo of photos) {
    const asset = photo.asset?._ref;
    if (!asset || !photo._key) continue;
    const first = shown.get(asset);
    if (first) {
      throw new Error(
        `${photo._key} would show the same photograph as ${first}: keep one of them.`,
      );
    }
    shown.set(asset, photo._key);
  }
}

/**
 * The album's cover after the changes. It follows a photograph whose file was swapped; the manifest may
 * name another; and it is never left on a photograph the manifest takes out.
 */
function coverAfter(
  cover: StoredImage | undefined,
  named: string | undefined,
  before: readonly StoredImage[],
  after: readonly StoredImage[],
  swappedTo: ReadonlyMap<string, string>,
): StoredImage | undefined {
  const shown = cover?.asset?._ref;
  const follows = shown ? swappedTo.get(shown) : undefined;
  const followed = cover && follows ? { ...cover, asset: reference(follows) } : cover;
  if (named) {
    const chosen = after.find((photo) => photo._key === named);
    if (!chosen) throw new Error(`The cover names ${named}, which the album would not hold.`);
    // A cover that already shows the photograph keeps the framing the owner gave it.
    return followed?.asset?._ref === chosen.asset?._ref ? followed : coverOf(chosen);
  }
  const showsIt = (photo: StoredImage) => photo.asset?._ref === shown;
  if (shown && !follows && before.some(showsIt) && !after.some(showsIt)) {
    throw new Error(
      'The cover shows a photograph the manifest removes: name the new cover with "cover".',
    );
  }
  return followed;
}

/**
 * What the manifest makes of the album. `current` is the album as the Studio shows it (its draft when
 * it has one, else the published document), or undefined when it does not exist; `assetFor` answers a
 * file's asset id, the same id for the same bytes.
 */
export function planAlbum(
  manifest: AlbumManifest,
  current: StoredAlbum | undefined,
  assetFor: (file: string) => string,
): AlbumPlan {
  if (!current && !manifest.create) {
    throw new Error(
      `${manifest.album} does not exist: add "create" with its title and slug, or check the id.`,
    );
  }
  const base = current
    ? albumContent(current, manifest.album)
    : newAlbum(manifest.album, manifest.create as NewAlbum);
  const held = base.photos ?? [];
  const heldKeys = new Set(held.map((photo) => photo._key));
  const listed = new Map(manifest.photos.map((photo) => [photo.key, photo]));
  const leaving = new Set(manifest.remove);

  const kept: StoredImage[] = [];
  const swapped: string[] = [];
  /** A swapped photograph's old asset and its new one, for the cover to follow. */
  const swappedTo = new Map<string, string>();
  for (const photo of held) {
    const key = photo._key ?? '';
    if (leaving.has(key)) continue;
    const change = listed.get(key);
    const asset = change ? assetFor(change.file) : photo.asset?._ref;
    if (!asset || asset === photo.asset?._ref) {
      kept.push(photo);
      continue;
    }
    swapped.push(key);
    if (photo.asset?._ref) swappedTo.set(photo.asset._ref, asset);
    kept.push({ ...photo, asset: reference(asset) });
  }

  const added = manifest.photos
    .filter((photo) => !heldKeys.has(photo.key))
    .map((photo): StoredImage => {
      if (!photo.alt || !photo.caption) {
        throw new Error(`${photo.key} is new: give it alt text and a caption.`);
      }
      return {
        _key: photo.key,
        _type: 'oyImage',
        asset: reference(assetFor(photo.file)),
        alt: photo.alt,
        caption: photo.caption,
      };
    });

  const photos = [...kept, ...added];
  refuseRepeats(photos);
  if (!current && photos.length === 0) {
    throw new Error(`${manifest.album} would be created with no photographs: list at least one.`);
  }
  const cover = coverAfter(base.cover, manifest.cover, held, photos, swappedTo);

  const album: StoredAlbum = {
    ...base,
    // An album stored without a list of photographs is not given an empty one.
    ...(photos.length > 0 || base.photos ? { photos } : {}),
    ...(cover ? { cover } : {}),
  };
  return {
    album,
    created: !current,
    swapped,
    added: added.map((photo) => photo._key as string),
    removed: manifest.remove.filter((key) => heldKeys.has(key)),
    absent: manifest.remove.filter((key) => !heldKeys.has(key)),
    unchanged: Boolean(current) && sameValue(album, base),
  };
}

/**
 * The mutations that save a plan: only ever the album's draft. With no draft yet it is created, which
 * fails if one appeared meanwhile; a draft the run read is replaced, guarded by the revision it read.
 */
export function draftMutations(plan: AlbumPlan, draft: StoredAlbum | undefined): Mutation[] {
  const document = { ...plan.album, _id: `drafts.${plan.album._id}` };
  if (!draft) return [{ create: document }];
  return [revisionGuard({ _id: document._id, _rev: draft._rev }), { createOrReplace: document }];
}
