/**
 * An album as the gallery shows it (ADR 0039): its year from its own date, else from its edition; the
 * line under its title ("2026 • 43 photographs", the year left out when the title already carries it, and
 * owed when the album has no year at all); and the gallery's order, newest year first. Pure and free of
 * Sanity imports, so the site's builders and the tests share it. Titles arrive cleaned of stega: a
 * comparison on an encoded title would never match.
 */

export interface AlbumYearSource {
  /** The album's own date, `YYYY-MM-DD` as the Studio stores it. */
  date?: string | null;
  /** The year of the edition the album belongs to. */
  edition?: number | null;
}

const YEAR = /^(\d{4})-/;

/** The album's year: its own date's, else its edition's, else none. */
export function albumYear({ date, edition }: AlbumYearSource): number | undefined {
  const own = date ? YEAR.exec(date)?.[1] : undefined;
  if (own) return Number(own);
  return typeof edition === 'number' && Number.isInteger(edition) ? edition : undefined;
}

/** The count in numerals, as the prototype's tiles set it: "1 photograph", "43 photographs". */
export const photographCount = (count: number): string =>
  `${count} ${count === 1 ? 'photograph' : 'photographs'}`;

export interface AlbumLine {
  /** The year, when the line shows it. */
  year?: string;
  count: string;
  /** No date and no edition: the line shows the registry's chip where the year would be. */
  yearOwed: boolean;
}

/**
 * The line under an album's title: the year, then the count. A title that already names the year ("Odunde
 * 2026") reads the count alone; an album with no year owes it.
 */
export function albumLine({
  title,
  year,
  count,
}: {
  title: string;
  year: number | undefined;
  count: number;
}): AlbumLine {
  const counted = photographCount(count);
  if (year === undefined) return { count: counted, yearOwed: true };
  if (new RegExp(`(^|\\D)${year}(\\D|$)`).test(title)) return { count: counted, yearOwed: false };
  return { year: String(year), count: counted, yearOwed: false };
}

/** The gallery's order: newest year first, albums with no year after the dated ones, ties by title. */
export function byNewestAlbum(
  a: { title: string; year?: number },
  b: { title: string; year?: number },
): number {
  if (a.year !== b.year) {
    if (a.year === undefined) return 1;
    if (b.year === undefined) return -1;
    return b.year - a.year;
  }
  return a.title.localeCompare(b.title, 'en');
}
