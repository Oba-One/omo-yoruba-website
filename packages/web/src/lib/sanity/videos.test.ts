import { createImageSet } from '@oy/content/images';
import { describe, expect, it } from 'vitest';
import { type VideoAlbumLike, type VideoLike, videoViews } from './videos';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const options = { imageSet, draft: false, studioUrl: '/admin' };

/** A photograph or a cover, as the shared image object stores it. */
const image = (name: string, alt = `A ${name}`) => ({
  _type: 'oyImage' as const,
  alt,
  caption: null,
  hotspot: null,
  crop: null,
  asset: { _ref: `image-${name}-1600x900-jpg`, _type: 'reference' as const },
});

/** A video's still: a plain image, with neither alt text nor caption. */
const still = (name: string) => ({
  _type: 'image' as const,
  hotspot: null,
  crop: null,
  asset: { _ref: `image-${name}-1600x900-jpg`, _type: 'reference' as const },
});

// Two ids made up for the fixtures, never real videos'.
const HIGHLIGHTS = 'AbC_dEf-123';
const TEASER = 'ZyX_wVu-987';

const video = (key: string, extra: Partial<VideoLike> = {}): VideoLike => ({
  _key: key,
  title: key === 'highlights' ? 'Odunde 2026 highlights' : 'Odunde 2026 teaser',
  url: `https://youtu.be/${key === 'highlights' ? HIGHLIGHTS : TEASER}`,
  still: null,
  credit: null,
  creditUrl: null,
  ...extra,
});

/** An album holding these videos, with no cover and no photograph unless it is given them. */
const album = (
  videos: (VideoLike | null)[],
  extra: Partial<VideoAlbumLike> = {},
): VideoAlbumLike => ({
  cover: null,
  photos: [],
  videos,
  ...extra,
});

const channel = 'https://www.youtube.com/@redcarpetfilmshollywood';
const noEdit = () => undefined;

describe('videoViews', () => {
  it('builds a view per video with its title and the addresses made from its id alone', () => {
    const views = videoViews(album([video('highlights'), video('teaser')]), options, noEdit);
    expect(views.map(({ key, title }) => ({ key, title }))).toEqual([
      { key: 'highlights', title: 'Odunde 2026 highlights' },
      { key: 'teaser', title: 'Odunde 2026 teaser' },
    ]);
    expect(views[0]?.watchHref).toBe(`https://www.youtube.com/watch?v=${HIGHLIGHTS}`);
    expect(views[0]?.embedSrc).toBe(
      `https://www.youtube-nocookie.com/embed/${HIGHLIGHTS}?autoplay=1&rel=0`,
    );
    expect(views[1]?.embedSrc).toBe(
      `https://www.youtube-nocookie.com/embed/${TEASER}?autoplay=1&rel=0`,
    );
  });

  it('keeps nothing of the stored address but the id: no parameter reaches the frame or the link', () => {
    const [view] = videoViews(
      album([
        video('highlights', {
          url: `https://www.youtube.com/watch?v=${HIGHLIGHTS}&list=PLabcdef&t=9s&autoplay=0&rel=1`,
        }),
      ]),
      options,
      noEdit,
    );
    expect(view?.embedSrc).toBe(
      `https://www.youtube-nocookie.com/embed/${HIGHLIGHTS}?autoplay=1&rel=0`,
    );
    expect(view?.watchHref).toBe(`https://www.youtube.com/watch?v=${HIGHLIGHTS}`);
  });

  it('leaves out a video with no title, no readable YouTube address or no key', () => {
    const views = videoViews(
      album([
        video('highlights', { title: null }),
        video('highlights', { title: '   ' }),
        video('highlights', { url: null }),
        video('highlights', { url: channel }),
        video('highlights', { url: `http://youtu.be/${HIGHLIGHTS}` }),
        video('highlights', { url: 'https://example.org/watch?v=AbC_dEf-123' }),
        video('highlights', { url: 'https://www.youtube.com/embed/videoseries?list=PLabcdef' }),
        video('highlights', { _key: null }),
        null,
        video('teaser'),
      ]),
      options,
      noEdit,
    );
    expect(views.map((view) => view.key)).toEqual(['teaser']);
  });

  it('has no video for no album, or for an album that holds none', () => {
    expect(videoViews(null, options, noEdit)).toEqual([]);
    expect(videoViews(undefined, options, noEdit)).toEqual([]);
    expect(videoViews(album([]), options, noEdit)).toEqual([]);
    expect(videoViews({ videos: null }, options, noEdit)).toEqual([]);
    expect(videoViews({}, options, noEdit)).toEqual([]);
  });

  it("takes the video's own still, else the album's cover, else its first photograph, framed 16:9 at 720 wide", () => {
    const withCover = album([video('highlights', { still: still('own') }), video('teaser')], {
      cover: image('cover'),
      photos: [image('first')],
    });
    const [own, covered] = videoViews(withCover, options, noEdit);
    expect(own?.still?.src).toContain('/own-1600x900.jpg');
    expect(own?.still).toMatchObject({ width: 720, height: 405 });
    expect(own?.still?.src).toContain('fit=crop');
    expect(covered?.still?.src).toContain('/cover-1600x900.jpg');
    expect(covered?.still).toMatchObject({ width: 720, height: 405 });
    const uncovered = album([video('teaser')], { photos: [image('first'), image('second')] });
    expect(videoViews(uncovered, options, noEdit)[0]?.still?.src).toContain('/first-1600x900.jpg');
  });

  it('passes over a still, a cover or a photograph that holds no picture, and shows none when the album holds no picture', () => {
    const hollow = (name: string) => ({ ...image(name), asset: null });
    // The video's own still, then the cover, then the first photograph each hold only their words: the next is tried.
    const [view] = videoViews(
      album([video('highlights', { still: { ...still('own'), asset: null } })], {
        cover: hollow('cover'),
        photos: [hollow('first'), image('second'), image('third')],
      }),
      options,
      noEdit,
    );
    expect(view?.still?.src).toContain('/second-1600x900.jpg');
    // A photograph slot with no picture is not a still, and neither is the absence of any.
    const bare = album([video('highlights')], {
      cover: hollow('cover'),
      photos: [hollow('first'), null],
    });
    expect(videoViews(bare, options, noEdit)[0]?.still).toBeUndefined();
    expect(videoViews(album([video('highlights')]), options, noEdit)[0]?.still).toBeUndefined();
  });

  it('names who made it, linked to their page, and reads no credit from a link alone', () => {
    const [credited, linkOnly, nameOnly] = videoViews(
      album([
        video('highlights', { credit: 'Red Carpet Films', creditUrl: channel }),
        video('teaser', { creditUrl: channel }),
        video('teaser', { _key: 'another', credit: 'Red Carpet Films' }),
      ]),
      options,
      noEdit,
    );
    expect(credited).toMatchObject({ credit: 'Red Carpet Films', creditHref: channel });
    expect(linkOnly?.credit).toBeUndefined();
    expect(nameOnly).toMatchObject({ credit: 'Red Carpet Films' });
    expect(nameOnly?.creditHref).toBeUndefined();
  });

  it('keeps stega out of keys, addresses and the names that become labels', () => {
    const tail = '\u200B\u200C\u200D\uFEFF';
    const asked: string[] = [];
    const [view] = videoViews(
      album([
        video(`highlights${tail}`, {
          title: `Odunde 2026 highlights${tail}`,
          url: `https://youtu.be/${HIGHLIGHTS}${tail}`,
          creditUrl: `${channel}${tail}`,
          credit: 'Red Carpet Films',
        }),
      ]),
      options,
      (path) => {
        asked.push(path);
        return undefined;
      },
    );
    expect(view).toMatchObject({
      key: 'highlights',
      title: 'Odunde 2026 highlights',
      watchHref: `https://www.youtube.com/watch?v=${HIGHLIGHTS}`,
      creditHref: channel,
    });
    expect(asked).toEqual(['videos[_key=="highlights"]']);
  });

  it("asks for each video's edit attribute on the document the caller binds, by its key", () => {
    const views = videoViews(
      album([video('highlights'), video('teaser')]),
      options,
      (path) => `edit:${path}`,
    );
    expect(views.map((view) => view.edit)).toEqual([
      'edit:videos[_key=="highlights"]',
      'edit:videos[_key=="teaser"]',
    ]);
  });
});
