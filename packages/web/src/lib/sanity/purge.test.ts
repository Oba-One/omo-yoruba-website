import { cacheTagsFor } from '@oy/content/routes';
import { describe, expect, it } from 'vitest';
import { purgePlan } from './purge';

describe('purgePlan', () => {
  it('purges the type tag as a tag and every route tag as a path', () => {
    expect(purgePlan(cacheTagsFor('event'))).toEqual({
      tags: ['type:event'],
      paths: ['/', '/odunde', '/gala', '/programs/cultural-collective', '/programs', '/news'],
    });
    expect(purgePlan(cacheTagsFor('album', 'gala-2025'))).toEqual({
      tags: ['type:album'],
      paths: ['/gallery/gala-2025', '/gallery', '/odunde', '/gala'],
    });
    expect(purgePlan([])).toEqual({ tags: [], paths: [] });
  });
});
