/**
 * The `data-sanity` attribute the Visual Editing overlay reads for click-to-edit on images and
 * on the containers of non-text fields (the layout options), where stega has no string to ride
 * on. The encoding mirrors `createDataAttribute` in @sanity/visual-editing-csm 3.0.18
 * (`docs/research/phase-4-sanity-visual-editing.md`): `id=<published id>;type=<type>;path=<studio
 * path>;base=<encoded studio url>`, with the path written as the overlay expects (`hero.image`,
 * `yearInLife:tile-1`, `stats:0`). Written here because that package is a dependency of
 * @sanity/astro, not of the site, and Bun's isolated linker keeps it out of reach; the test pins
 * the format so a change in the csm package is caught.
 */
import { getPublishedId, studioPath } from '@sanity/client/csm';

export interface DataAttributeInput {
  /** The document id, draft or published; the attribute always carries the published id. */
  id: string;
  type: string;
  /** A studio path: `hero.image`, `yearInLife[_key=="tile-1"]`, `layout.season`. */
  path: string;
  /** The Studio's base path, `/admin`. */
  baseUrl?: string;
  tool?: string;
  workspace?: string;
}

function pathToUrlString(path: studioPath.Path): string {
  let out = '';
  for (const segment of path) {
    if (typeof segment === 'string') {
      out += out ? `.${segment}` : segment;
    } else if (typeof segment === 'number') {
      out += out ? `:${segment}` : `${segment}`;
    } else if (Array.isArray(segment)) {
      out += `${out ? ':' : ''}${segment.join(',')}}`;
    } else if (segment._key) {
      out += `${out ? ':' : ''}${segment._key}`;
    }
  }
  return out;
}

export function dataAttribute({
  id,
  type,
  path,
  baseUrl = '/',
  tool,
  workspace,
}: DataAttributeInput): string {
  return [
    ['id', getPublishedId(id)],
    ['type', type],
    ['path', pathToUrlString(studioPath.fromString(path))],
    ['base', encodeURIComponent(baseUrl)],
    ['workspace', workspace],
    ['tool', tool],
  ]
    .filter(([, value]) => Boolean(value))
    .map((part) => part.join('='))
    .join(';');
}
