/**
 * Reads the photograph rows of docs/design/design/19 Mock Content Register.dc.html: the file,
 * its caption (the register's description) and the assumed credit. The register stays the one
 * source of captions; the seed never restates them.
 */
import { fileURLToPath } from 'node:url';
import { loadTerms } from '@oy/lint';
import { findBareTerms } from '@oy/lint/yoruba';

const TERMS = loadTerms();

export const REGISTER_PATH = fileURLToPath(
  new URL('../../../docs/design/design/19 Mock Content Register.dc.html', import.meta.url),
);
export const PHOTOS_DIR = fileURLToPath(
  new URL('../../../docs/design/design/images/w2/', import.meta.url),
);

export interface RegisterRow {
  set: string;
  file: string;
  caption: string;
  credit: string;
}

export type AlbumId = 'odunde-2026' | 'gala-2025' | 'summer-camp';
export type PhotographerId = 'red-carpet-media' | 'members-and-volunteers' | 'omo-yoruba-archive';

/** The register's four sets become the three albums of CONTENT-MODEL section 6 (the earlier set is the same event). */
export const SET_ALBUMS: Record<string, AlbumId> = {
  'Odunde 2026': 'odunde-2026',
  'Gala 2025': 'gala-2025',
  'Summer camp': 'summer-camp',
  'Summer camp (earlier set)': 'summer-camp',
};

export interface RegisterPhoto extends RegisterRow {
  album: AlbumId;
  photographer: PhotographerId;
}

const ROW =
  /<div class="cr-row"><span class="cr-where">(.*?)<\/span><span class="cr-what"><code[^>]*>([^<]+)<\/code><br>(.*?)<\/span><span class="cr-mock">(.*?)<\/span><\/div>/g;

function decode(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export function parseRegister(html: string): RegisterRow[] {
  return [...html.matchAll(ROW)].map((match) => ({
    set: decode(match[1] as string),
    file: (match[2] as string).trim(),
    caption: decode(match[3] as string),
    credit: decode(match[4] as string),
  }));
}

export function photographerFor(credit: string): PhotographerId {
  if (credit.startsWith('Red Carpet Media')) return 'red-carpet-media';
  if (credit.startsWith('Members and volunteers')) return 'members-and-volunteers';
  return 'omo-yoruba-archive';
}

/** Writes the marks a register caption left off (the register is exempt from the lint; the seed is not). */
export function markCaption(caption: string): string {
  const findings = findBareTerms(caption, TERMS, { markdown: false });
  let marked = caption;
  for (const finding of [...findings].sort((a, b) => b.column - a.column)) {
    const start = finding.column - 1;
    marked = `${marked.slice(0, start)}${finding.correct}${marked.slice(start + finding.bare.length)}`;
  }
  return marked;
}

/** Every photograph of the web-sized set with its album and photographer. */
export function registerPhotos(html: string): RegisterPhoto[] {
  return parseRegister(html)
    .filter((row) => SET_ALBUMS[row.set] !== undefined)
    .map((row) => ({
      ...row,
      caption: markCaption(row.caption),
      file: row.file.replace(/\.png$/, '.jpg'),
      album: SET_ALBUMS[row.set] as AlbumId,
      photographer: photographerFor(row.credit),
    }));
}
