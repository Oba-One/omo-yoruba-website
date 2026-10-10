import { describe, expect, it } from 'vitest';
import {
  type AlbumManifest,
  draftMutations,
  importArguments,
  parseManifest,
  planAlbum,
  type StoredAlbum,
} from './album-import';

// The import's plan on plain data: what a manifest does to an album, what it refuses, and what it writes.

const image = (asset: string, caption: string, extra: Record<string, unknown> = {}) => ({
  _type: 'oyImage',
  asset: { _type: 'reference', _ref: asset },
  alt: caption,
  caption,
  ...extra,
});

const FRAMING = {
  hotspot: { _type: 'sanity.imageHotspot', x: 0.4, y: 0.3, height: 0.4, width: 0.4 },
  crop: { _type: 'sanity.imageCrop', top: 0.1, bottom: 0, left: 0, right: 0 },
};

const stored = (): StoredAlbum => ({
  _id: 'album-gala-2025',
  _type: 'album',
  _rev: 'rev-1',
  _updatedAt: '2026-09-29T03:20:29Z',
  title: 'End-of-Year Gala 2025',
  slug: { _type: 'slug', current: 'gala-2025' },
  creditConfirmed: true,
  cover: image('image-web-a', 'Guests arrive', { hotspot: FRAMING.hotspot }),
  photos: [
    { _key: 'arrivals', ...image('image-web-a', 'Guests arrive', FRAMING) },
    { _key: 'toast', ...image('image-web-b', 'A toast at the head table') },
  ],
});

const manifest = (changes: Partial<AlbumManifest> = {}): AlbumManifest => ({
  album: 'album-gala-2025',
  source: '/photos/gala',
  photos: [],
  remove: [],
  ...changes,
});

const DANCING = {
  key: 'dancing',
  file: 'RCF-114.jpg',
  alt: 'Two guests dance',
  caption: 'On the floor',
};

/** Each file's asset, as an upload would name it. */
const assetFor = (file: string) => `image-${file.replace(/\W/g, '-')}`;

describe('the command line', () => {
  it('is a dry run unless --apply is given, wherever the manifest sits', () => {
    expect(importArguments(['gala.json'])).toEqual({ manifest: 'gala.json', apply: false });
    expect(importArguments(['--apply', 'gala.json'])).toEqual({
      manifest: 'gala.json',
      apply: true,
    });
  });

  it("does not take the dataset's name for the manifest", () => {
    expect(importArguments(['--dataset', 'production', 'gala.json']).manifest).toBe('gala.json');
    expect(importArguments(['gala.json', '--dataset=production']).manifest).toBe('gala.json');
  });

  it('refuses what it cannot read rather than running without it', () => {
    expect(() => importArguments(['gala.json', '--aply'])).toThrow('--aply');
    expect(() => importArguments(['gala.json', '--dataset', '--apply'])).toThrow('dataset name');
    expect(() => importArguments(['gala.json', '--dataset'])).toThrow('dataset name');
    expect(() => importArguments(['--apply'])).toThrow('manifest');
    expect(() => importArguments(['gala.json', 'fair.json'])).toThrow('one manifest');
  });
});

describe('reading a manifest', () => {
  const valid = {
    album: 'album-gala-2025',
    source: '/photos/gala',
    photos: [{ key: 'arrivals', file: 'RCF-001.jpg' }],
  };

  it('reads the album, the source folder and the photographs, with nothing to remove by default', () => {
    expect(parseManifest(valid)).toEqual({ ...valid, remove: [] });
  });

  it('refuses a manifest without an album, a source folder or a list of photographs', () => {
    expect(() => parseManifest({ ...valid, album: undefined })).toThrow('album');
    expect(() => parseManifest({ ...valid, source: '' })).toThrow('source');
    expect(() => parseManifest({ ...valid, photos: 'RCF-001.jpg' })).toThrow('photos');
    expect(() => parseManifest('album-gala-2025')).toThrow('object');
  });

  it('refuses an album id or a photograph key that could not be an address', () => {
    expect(() => parseManifest({ ...valid, album: 'gala.2025' })).toThrow('album-');
    expect(() =>
      parseManifest({ ...valid, photos: [{ key: 'Arrivals 1', file: 'RCF-001.jpg' }] }),
    ).toThrow('Arrivals 1');
  });

  it('refuses the same key twice, and the same file under two keys', () => {
    const twice = [
      { key: 'arrivals', file: 'RCF-001.jpg' },
      { key: 'arrivals', file: 'RCF-002.jpg' },
    ];
    expect(() => parseManifest({ ...valid, photos: twice })).toThrow('arrivals');
    const sameFile = [
      { key: 'arrivals', file: 'RCF-001.jpg' },
      { key: 'doorway', file: 'RCF-001.jpg' },
    ];
    expect(() => parseManifest({ ...valid, photos: sameFile })).toThrow('RCF-001.jpg');
  });

  it('refuses a key it is asked both to hold and to remove, and a key removed twice', () => {
    expect(() => parseManifest({ ...valid, remove: ['arrivals'] })).toThrow('arrivals');
    expect(() => parseManifest({ ...valid, remove: ['toast', 'toast'] })).toThrow('twice');
  });

  it('reads `order` as a list of keys, and refuses a key listed twice or one it also removes', () => {
    const ordered = parseManifest({ ...valid, order: ['toast', 'arrivals'] });
    expect(ordered.order).toEqual(['toast', 'arrivals']);
    expect(parseManifest(valid)).not.toHaveProperty('order');
    expect(() => parseManifest({ ...valid, order: 'arrivals' })).toThrow('order must be a list');
    expect(() => parseManifest({ ...valid, order: ['toast', 'toast'] })).toThrow(
      'order lists toast twice',
    );
    expect(() =>
      parseManifest({ ...valid, remove: ['toast', 'cake'], order: ['cake', 'arrivals', 'toast'] }),
    ).toThrow('both orders and removes cake, toast');
  });

  it('refuses a file outside the source folder', () => {
    for (const file of ['../elsewhere/RCF-001.jpg', '/photos/RCF-001.jpg', 'a/../../RCF-001.jpg']) {
      expect(() => parseManifest({ ...valid, photos: [{ key: 'arrivals', file }] })).toThrow(
        'inside the source folder',
      );
    }
    expect(
      parseManifest({ ...valid, photos: [{ key: 'arrivals', file: 'picks/RCF-001.jpg' }] }),
    ).toBeTruthy();
  });

  it('holds new words to the voice rules, since no lint reads a manifest', () => {
    const worded = (caption: string) => ({
      ...valid,
      photos: [{ key: 'arrivals', file: 'RCF-001.jpg', alt: 'Guests arrive', caption }],
    });
    expect(() => parseManifest(worded('Guests arrive \u2014 the hall fills'))).toThrow('em dash');
    expect(() => parseManifest(worded('A man in a brown agbada'))).toThrow('agb\u00e1d\u00e1');
    expect(parseManifest(worded('A man in a brown agb\u00e1d\u00e1')).photos[0]?.caption).toBe(
      'A man in a brown agb\u00e1d\u00e1',
    );
  });

  it('reads `create` with a title and a slug, a date as YYYY-MM-DD, and no credit to confirm', () => {
    const created = (create: Record<string, unknown>) => parseManifest({ ...valid, create });
    expect(created({ title: 'Gala 2024', slug: 'gala-2024', date: '2024-11-30' }).create).toEqual({
      title: 'Gala 2024',
      slug: 'gala-2024',
      date: '2024-11-30',
    });
    expect(() => created({ title: 'Gala 2024' })).toThrow('title and a slug');
    expect(() => created({ title: 'Gala 2024', slug: 'Gala 2024' })).toThrow('lower case');
    expect(() => created({ title: 'Gala 2024', slug: 'gala-2024', date: '30 Nov 2024' })).toThrow(
      'YYYY-MM-DD',
    );
  });

  it('refuses a field it does not read, so a misspelled `remove` or `cover` is never dropped', () => {
    expect(() => parseManifest({ ...valid, removes: ['toast'] })).toThrow('removes');
    expect(() =>
      parseManifest({ ...valid, photos: [{ key: 'arrivals', file: 'a.jpg', captoin: 'x' }] }),
    ).toThrow('captoin');
    expect(() =>
      parseManifest({ ...valid, create: { title: 'Gala', slug: 'gala', creditConfirmed: true } }),
    ).toThrow('creditConfirmed');
  });
});

describe('an album that exists', () => {
  it('swaps the file behind a key and keeps its place, its words, its crop and its hotspot', () => {
    const plan = planAlbum(
      manifest({ photos: [{ key: 'arrivals', file: 'RCF-001.jpg' }] }),
      stored(),
      assetFor,
    );
    expect(plan.swapped).toEqual(['arrivals']);
    expect(plan.album.photos?.[0]).toEqual({
      _key: 'arrivals',
      ...image('image-RCF-001-jpg', 'Guests arrive', FRAMING),
    });
    expect(plan.album.photos?.[1]?._key).toBe('toast');
    expect(plan.created).toBe(false);
  });

  it('never rewrites the words of a photograph it holds: those are edited in the Studio', () => {
    const plan = planAlbum(
      manifest({
        photos: [{ key: 'toast', file: 'RCF-200.jpg', alt: 'Glasses raised', caption: 'Cheers' }],
      }),
      stored(),
      assetFor,
    );
    expect(plan.album.photos?.[1]).toMatchObject({
      asset: { _ref: 'image-RCF-200-jpg' },
      alt: 'A toast at the head table',
      caption: 'A toast at the head table',
    });
  });

  it('moves the cover with the photograph it shows, framing kept', () => {
    const plan = planAlbum(
      manifest({ photos: [{ key: 'arrivals', file: 'RCF-001.jpg' }] }),
      stored(),
      assetFor,
    );
    expect(plan.album.cover).toEqual(
      image('image-RCF-001-jpg', 'Guests arrive', { hotspot: FRAMING.hotspot }),
    );
  });

  it('adds new photographs after the ones it holds, in the manifest order, each with its words', () => {
    const plan = planAlbum(
      manifest({
        photos: [
          DANCING,
          { key: 'buffet', file: 'RCF-148.jpg', alt: 'Trays of rice', caption: 'The buffet' },
        ],
      }),
      stored(),
      assetFor,
    );
    expect(plan.added).toEqual(['dancing', 'buffet']);
    expect(plan).toMatchObject({ reordered: false, heldReordered: false });
    expect(plan).not.toHaveProperty('opensWith');
    expect(plan.album.photos?.map((photo) => photo._key)).toEqual([
      'arrivals',
      'toast',
      'dancing',
      'buffet',
    ]);
    expect(plan.album.photos?.[2]).toEqual({
      _key: 'dancing',
      _type: 'oyImage',
      asset: { _type: 'reference', _ref: 'image-RCF-114-jpg' },
      alt: 'Two guests dance',
      caption: 'On the floor',
    });
  });

  it("puts the photographs in the manifest's order when it gives one, new ones among those it holds", () => {
    const plan = planAlbum(
      manifest({ photos: [DANCING], order: ['arrivals', 'dancing', 'toast'] }),
      stored(),
      assetFor,
    );
    expect(plan.album.photos?.map((photo) => photo._key)).toEqual(['arrivals', 'dancing', 'toast']);
    // A new photograph among the held ones, which follow one another as before.
    expect(plan).toMatchObject({ reordered: true, heldReordered: false, unchanged: false });
    expect(plan).not.toHaveProperty('opensWith');
  });

  it('moves the photographs it holds on an order alone, words and framing kept, and finds nothing to do the second time', () => {
    const turned = manifest({ order: ['toast', 'arrivals'] });
    const first = planAlbum(turned, stored(), assetFor);
    expect(first.album.photos).toEqual([...(stored().photos ?? [])].reverse());
    // The plan says the Studio's order changes, and which photograph now opens the album.
    expect(first).toMatchObject({ reordered: true, heldReordered: true, opensWith: 'toast' });
    const second = planAlbum(turned, { ...first.album, _rev: 'rev-2' }, assetFor);
    expect(second).toMatchObject({ reordered: false, heldReordered: false, unchanged: true });
    expect(second).not.toHaveProperty('opensWith');
  });

  it('orders what the album will hold: without a photograph it removes, with a swapped one as it was framed', () => {
    const plan = planAlbum(
      manifest({
        photos: [{ key: 'arrivals', file: 'RCF-001.jpg' }, DANCING],
        remove: ['toast'],
        order: ['dancing', 'arrivals'],
      }),
      stored(),
      assetFor,
    );
    expect(plan.album.photos?.map((photo) => photo._key)).toEqual(['dancing', 'arrivals']);
    expect(plan.album.photos?.[1]).toEqual({
      _key: 'arrivals',
      ...image('image-RCF-001-jpg', 'Guests arrive', FRAMING),
    });
    expect(plan.swapped).toEqual(['arrivals']);
    expect(plan.removed).toEqual(['toast']);
    expect(plan.reordered).toBe(true);
  });

  it('refuses an order that leaves a photograph out, or names one the album would not hold', () => {
    expect(() =>
      planAlbum(manifest({ photos: [DANCING], order: ['arrivals', 'toast'] }), stored(), assetFor),
    ).toThrow('order leaves out dancing');
    expect(() =>
      planAlbum(manifest({ order: ['arrivals', 'toast', 'speeches'] }), stored(), assetFor),
    ).toThrow('order names speeches');
    // A photograph added in the Studio after the manifest was written, and an order that names nothing.
    expect(() => planAlbum(manifest({ order: ['arrivals'] }), stored(), assetFor)).toThrow(
      'order leaves out toast',
    );
    expect(() => planAlbum(manifest({ order: [] }), stored(), assetFor)).toThrow(
      'order leaves out arrivals, toast',
    );
  });

  it('refuses to order an album that holds a photograph without a key, or one key twice', () => {
    const [arrivals, toast] = stored().photos ?? [];
    const { _key: _dropped, ...keyless } = toast ?? {};
    const order = manifest({ order: ['arrivals', 'toast'] });
    expect(() =>
      planAlbum(order, { ...stored(), photos: [arrivals ?? {}, keyless] }, assetFor),
    ).toThrow('has no key');
    const twice = [arrivals ?? {}, toast ?? {}, { ...toast, asset: { _ref: 'image-web-c' } }];
    expect(() => planAlbum(order, { ...stored(), photos: twice }, assetFor)).toThrow(
      'holds the key toast twice',
    );
    // Without an order the import leaves such an album as it found it.
    expect(planAlbum(manifest(), { ...stored(), photos: twice }, assetFor).unchanged).toBe(true);
  });

  it('refuses a new photograph without alt text, and one without a caption', () => {
    const { alt: _alt, ...noAlt } = DANCING;
    const { caption: _caption, ...noCaption } = DANCING;
    for (const photo of [noAlt, noCaption]) {
      expect(() => planAlbum(manifest({ photos: [photo] }), stored(), assetFor)).toThrow(
        'dancing is new: give it alt text and a caption',
      );
    }
  });

  it('refuses to show one photograph under two keys', () => {
    // The same bytes under two file names answer one asset.
    const oneAsset = () => 'image-same';
    const twoNames = manifest({
      photos: [DANCING, { ...DANCING, key: 'dancing-again', file: 'RCF-114 copy.jpg' }],
    });
    expect(() => planAlbum(twoNames, stored(), oneAsset)).toThrow(
      'dancing-again would show the same photograph as dancing',
    );
    // A new key on the file a held key already shows.
    const held = manifest({ photos: [{ ...DANCING, key: 'arrivals-again' }] });
    expect(() => planAlbum(held, stored(), () => 'image-web-a')).toThrow(
      'arrivals-again would show the same photograph as arrivals',
    );
  });

  it('removes the keys it is told to, and says which were already gone', () => {
    const plan = planAlbum(manifest({ remove: ['toast', 'speeches'] }), stored(), assetFor);
    expect(plan.removed).toEqual(['toast']);
    expect(plan.absent).toEqual(['speeches']);
    expect(plan.album.photos?.map((photo) => photo._key)).toEqual(['arrivals']);
  });

  it('refuses to leave the cover on a photograph it removes', () => {
    expect(() => planAlbum(manifest({ remove: ['arrivals'] }), stored(), assetFor)).toThrow(
      'cover',
    );
  });

  it('takes the cover from the key the manifest names', () => {
    const plan = planAlbum(
      manifest({ photos: [DANCING], remove: ['arrivals'], cover: 'dancing' }),
      stored(),
      assetFor,
    );
    expect(plan.album.cover).toEqual({
      _type: 'oyImage',
      asset: { _type: 'reference', _ref: 'image-RCF-114-jpg' },
      alt: 'Two guests dance',
      caption: 'On the floor',
    });
    expect(() => planAlbum(manifest({ cover: 'speeches' }), stored(), assetFor)).toThrow(
      'speeches',
    );
  });

  it('keeps a cover the owner framed when the manifest names the photograph it already shows', () => {
    const plan = planAlbum(manifest({ cover: 'arrivals' }), stored(), assetFor);
    expect(plan.album.cover?.hotspot).toEqual(FRAMING.hotspot);
    expect(plan.unchanged).toBe(true);
  });

  it('leaves every other field alone, system fields aside, and never confirms a credit', () => {
    const plan = planAlbum(
      manifest({ photos: [{ key: 'arrivals', file: 'RCF-001.jpg' }] }),
      stored(),
      assetFor,
    );
    expect(plan.album).toMatchObject({
      _id: 'album-gala-2025',
      _type: 'album',
      title: 'End-of-Year Gala 2025',
      creditConfirmed: true,
    });
    expect(plan.album).not.toHaveProperty('_rev');
    expect(plan.album).not.toHaveProperty('_updatedAt');
  });

  it('plans from the draft the Studio holds, still under the published id', () => {
    const draft = { ...stored(), _id: 'drafts.album-gala-2025', title: 'Gala 2025, edited' };
    const plan = planAlbum(manifest({ photos: [DANCING] }), draft, assetFor);
    expect(plan.album._id).toBe('album-gala-2025');
    expect(plan.album.title).toBe('Gala 2025, edited');
  });

  it('finds nothing to do the second time, the cover named or not', () => {
    const changes = manifest({
      photos: [{ key: 'arrivals', file: 'RCF-001.jpg' }, DANCING],
      remove: ['toast'],
      cover: 'dancing',
    });
    const first = planAlbum(changes, stored(), assetFor);
    expect(first.unchanged).toBe(false);
    const second = planAlbum(changes, { ...first.album, _rev: 'rev-2' }, assetFor);
    expect(second.unchanged).toBe(true);
    expect(second.swapped).toEqual([]);
    expect(second.added).toEqual([]);
    expect(second.removed).toEqual([]);
  });

  it('leaves a photograph untouched when it already shows the file, whatever its reference carries', () => {
    const weak: StoredAlbum = {
      ...stored(),
      photos: [
        {
          _key: 'toast',
          ...image('image-web-b', 'A toast at the head table'),
          asset: { _type: 'reference', _ref: 'image-web-b', _weak: true },
        },
      ],
      cover: undefined,
    };
    const plan = planAlbum(
      manifest({ photos: [{ key: 'toast', file: 'web-b' }] }),
      weak,
      () => 'image-web-b',
    );
    expect(plan.unchanged).toBe(true);
  });

  it('adds no empty list of photographs to an album stored without one', () => {
    const { photos: _photos, cover: _cover, ...bare } = stored();
    const plan = planAlbum(manifest({ remove: ['toast'] }), bare, assetFor);
    expect(plan.album).not.toHaveProperty('photos');
    expect(plan.unchanged).toBe(true);
    expect(plan.absent).toEqual(['toast']);
  });

  it('reads `create` only when the album does not exist yet', () => {
    const plan = planAlbum(
      manifest({ create: { title: 'Another title', slug: 'another' } }),
      stored(),
      assetFor,
    );
    expect(plan.album.title).toBe('End-of-Year Gala 2025');
    expect(plan.unchanged).toBe(true);
  });
});

describe('an album that does not exist yet', () => {
  const fresh = manifest({
    album: 'album-cultural-fair-2025',
    create: {
      title: 'Yoruba Cultural Fair 2025',
      slug: 'cultural-fair-2025',
      date: '2025-08-23',
      credit: 'photographer-red-carpet-media',
    },
    photos: [
      { key: 'drummers', file: 'Fair-181.jpg', alt: 'Drummers play', caption: 'The drummers' },
    ],
    cover: 'drummers',
  });

  it('is created from `create`, with its credit to confirm and its photographs', () => {
    const plan = planAlbum(fresh, undefined, assetFor);
    expect(plan.created).toBe(true);
    expect(plan.album).toEqual({
      _id: 'album-cultural-fair-2025',
      _type: 'album',
      title: 'Yoruba Cultural Fair 2025',
      slug: { _type: 'slug', current: 'cultural-fair-2025' },
      date: '2025-08-23',
      credit: { _type: 'reference', _ref: 'photographer-red-carpet-media' },
      creditConfirmed: false,
      photos: [
        {
          _key: 'drummers',
          _type: 'oyImage',
          asset: { _type: 'reference', _ref: 'image-Fair-181-jpg' },
          alt: 'Drummers play',
          caption: 'The drummers',
        },
      ],
      cover: {
        _type: 'oyImage',
        asset: { _type: 'reference', _ref: 'image-Fair-181-jpg' },
        alt: 'Drummers play',
        caption: 'The drummers',
      },
    });
  });

  it('names its edition when the manifest gives one', () => {
    const plan = planAlbum(
      {
        ...fresh,
        create: { title: 'Odunde 2027', slug: 'odunde-2027', event: 'event-odunde-2027' },
      },
      undefined,
      assetFor,
    );
    expect(plan.album.event).toEqual({ _type: 'reference', _ref: 'event-odunde-2027' });
    expect(plan.album).not.toHaveProperty('date');
  });

  it('takes its order from the manifest too, and finds nothing to do the second time', () => {
    const ordered = manifest({
      create: { title: 'Gala 2024', slug: 'gala-2024' },
      photos: [
        DANCING,
        { key: 'buffet', file: 'RCF-148.jpg', alt: 'Trays of rice', caption: 'The buffet' },
      ],
      order: ['buffet', 'dancing'],
    });
    const first = planAlbum(ordered, undefined, assetFor);
    expect(first.album.photos?.map((photo) => photo._key)).toEqual(['buffet', 'dancing']);
    // A new album has no order to change and no opening photograph to replace.
    expect(first).toMatchObject({ created: true, reordered: true, heldReordered: false });
    expect(first).not.toHaveProperty('opensWith');
    expect(planAlbum(ordered, { ...first.album, _rev: 'rev-1' }, assetFor).unchanged).toBe(true);
  });

  it('is refused without `create`, and without a photograph', () => {
    expect(() => planAlbum({ ...fresh, create: undefined }, undefined, assetFor)).toThrow(
      'album-cultural-fair-2025 does not exist',
    );
    expect(() =>
      planAlbum({ ...fresh, photos: [], cover: undefined }, undefined, assetFor),
    ).toThrow('no photographs');
  });
});

describe('saving a plan', () => {
  const plan = () => planAlbum(manifest({ photos: [DANCING] }), stored(), assetFor);

  it('creates the draft when the album has none, and writes nothing else', () => {
    const mutations = draftMutations(plan(), undefined);
    expect(mutations).toEqual([{ create: { ...plan().album, _id: 'drafts.album-gala-2025' } }]);
  });

  it('replaces the draft it read, guarded by that revision', () => {
    const draft = { ...stored(), _id: 'drafts.album-gala-2025', _rev: 'draft-rev-7' };
    const fromDraft = planAlbum(manifest({ photos: [DANCING] }), draft, assetFor);
    const mutations = draftMutations(fromDraft, draft);
    expect(mutations).toEqual([
      {
        patch: {
          id: 'drafts.album-gala-2025',
          ifRevisionID: 'draft-rev-7',
          unset: ['revisionGuard'],
        },
      },
      { createOrReplace: { ...fromDraft.album, _id: 'drafts.album-gala-2025' } },
    ]);
  });

  it('never names the published album', () => {
    const draft = { ...stored(), _id: 'drafts.album-gala-2025', _rev: 'draft-rev-7' };
    for (const mutations of [draftMutations(plan(), undefined), draftMutations(plan(), draft)]) {
      expect(JSON.stringify(mutations)).not.toContain('"album-gala-2025"');
    }
  });
});
