import { cacheTagsFor } from '@oy/content/routes';
import { describe, expect, it } from 'vitest';
import { purgePlan } from './purge';

describe('purgePlan', () => {
  it('purges the type tag as a tag and every route tag as a path', () => {
    expect(purgePlan(cacheTagsFor('event'))).toEqual({
      tags: ['type:event'],
      // The year strip names the festival and the Gala by kind, so an edition no longer reaches /programs;
      // Impact's civic cells read the festival's editions (ADR 0035); an album takes its edition's year
      // (ADR 0039), and the album pages go by the type tag, since an edition knows no album's slug.
      paths: [
        '/',
        '/odunde',
        '/gala',
        '/programs/cultural-collective',
        '/impact',
        '/gallery',
        '/news',
      ],
    });
    expect(purgePlan(cacheTagsFor('album', 'gala-2025'))).toEqual({
      tags: ['type:album'],
      paths: ['/gallery/gala-2025', '/gallery', '/odunde', '/gala', '/impact'],
    });
    expect(purgePlan([])).toEqual({ tags: [], paths: [] });
  });
});
