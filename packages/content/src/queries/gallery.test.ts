import { describe, expect, it } from 'vitest';
import { festivalPageQuery, galaPageQuery } from './event-pages';
import { albumPageQuery } from './gallery';

// The consent hold (ADR 0043) is decided from the gallery's `state`, so every query behind a page that shows
// photographs through an album must read it; a builder given no `state` shows the albums.
describe('the queries the consent hold reads', () => {
  it("reads the gallery's state on an album page", () => {
    const page = albumPageQuery.slice(albumPageQuery.indexOf('"page": *[_type == "galleryPage"'));
    expect(page).toContain('layout{captions, state}');
  });

  it("reads the gallery's state on both event pages, whose past years show an album", () => {
    for (const query of [festivalPageQuery, galaPageQuery]) {
      expect(query).toContain(
        '"galleryLayout": *[_type == "galleryPage" && _id == "galleryPage"][0].layout{state}',
      );
    }
  });
});
