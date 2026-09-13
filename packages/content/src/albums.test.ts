import { describe, expect, it } from 'vitest';
import { albumLine, albumYear, byNewestAlbum, photographCount } from './albums';

describe('albumYear', () => {
  it("reads the album's own date first, then its edition's year", () => {
    expect(albumYear({ date: '2019-07-28', edition: 2026 })).toBe(2019);
    expect(albumYear({ date: null, edition: 2026 })).toBe(2026);
    expect(albumYear({ edition: 2025 })).toBe(2025);
  });

  it('has no year without a date or an edition, and ignores a value that is not one', () => {
    expect(albumYear({})).toBeUndefined();
    expect(albumYear({ date: null, edition: null })).toBeUndefined();
    expect(albumYear({ date: 'soon' })).toBeUndefined();
    expect(albumYear({ edition: Number.NaN })).toBeUndefined();
  });
});

describe('photographCount', () => {
  it('counts in numerals, one photograph and many', () => {
    expect(photographCount(43)).toBe('43 photographs');
    expect(photographCount(1)).toBe('1 photograph');
    expect(photographCount(0)).toBe('0 photographs');
  });
});

describe('albumLine', () => {
  it("reads the year and the count, as the prototype's tiles do", () => {
    expect(albumLine({ title: 'Summer camp', year: 2018, count: 19 })).toEqual({
      year: '2018',
      count: '19 photographs',
      yearOwed: false,
    });
  });

  it('leaves the year out when the title already carries it', () => {
    expect(albumLine({ title: 'Odunde 2026', year: 2026, count: 43 })).toEqual({
      count: '43 photographs',
      yearOwed: false,
    });
    expect(albumLine({ title: 'End-of-Year Gala 2025', year: 2025, count: 6 })).toEqual({
      count: '6 photographs',
      yearOwed: false,
    });
  });

  it('keeps a year the title does not carry, even beside another number', () => {
    expect(albumLine({ title: 'Gala 2025 rehearsal', year: 2026, count: 2 })).toEqual({
      year: '2026',
      count: '2 photographs',
      yearOwed: false,
    });
    expect(albumLine({ title: 'Room 20260', year: 2026, count: 2 }).year).toBe('2026');
  });

  it('owes the year of an album with neither a date nor an edition', () => {
    expect(albumLine({ title: 'Summer camp', year: undefined, count: 19 })).toEqual({
      count: '19 photographs',
      yearOwed: true,
    });
  });
});

describe('byNewestAlbum', () => {
  it('orders newest year first, albums with no year after the dated ones, ties by title', () => {
    const albums = [
      { title: 'Summer camp' },
      { title: 'End-of-Year Gala 2025', year: 2025 },
      { title: 'Àgbàlá Ọmọde', year: 2026 },
      { title: 'Archive' },
      { title: 'Odunde 2026', year: 2026 },
    ];
    expect([...albums].sort(byNewestAlbum).map((album) => album.title)).toEqual([
      'Àgbàlá Ọmọde',
      'Odunde 2026',
      'End-of-Year Gala 2025',
      'Archive',
      'Summer camp',
    ]);
  });
});
