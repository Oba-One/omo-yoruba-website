import type { FilterDefault } from '@sanity/client/stega';

/**
 * Keys the site branches on: a stega-encoded value here would break a `===` or a `switch`, so the
 * loader keeps them clean at the source and the page compares them safely. The client's own
 * default already skips ids, keys, slugs, dates, URLs and a denylist (`type`, `href`, `layout`,
 * `theme`, `variant` and more); this list adds the repo's discriminators and the layout option
 * values, which sit under `layout` but end in their own names.
 */
export const STEGA_LOGIC_KEYS: ReadonlySet<string> = new Set([
  'kind',
  'enquiryKind',
  'key',
  'context',
  'network',
  'role',
  'page',
  'group',
  'scope',
  'frequency',
  'status',
  'season',
  'highlight',
  'gallery',
  'involved',
  'newsletter',
  'pattern',
  'motion',
]);

/** The stega filter `loadQuery` passes with `stega: true`. */
export const stegaFilter: FilterDefault = (props) => {
  const end = props.sourcePath.at(-1);
  if (typeof end === 'string' && STEGA_LOGIC_KEYS.has(end)) return false;
  return props.filterDefault(props);
};
