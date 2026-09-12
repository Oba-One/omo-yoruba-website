import { describe, expect, it } from 'vitest';
import { cacheOptions, cachePage, PAGE_MAX_AGE, PAGE_SWR } from './cache';

const record = () => {
  const calls: unknown[] = [];
  return { calls, cache: { set: (input: unknown) => calls.push(input) } };
};

describe('cachePage', () => {
  it('tags a public page with every type that reaches it, one day fresh and seven days stale', () => {
    const { calls, cache } = record();
    cachePage({ cache }, '/', { preview: false });
    expect(calls).toEqual([
      {
        maxAge: PAGE_MAX_AGE,
        swr: PAGE_SWR,
        tags: [
          'type:siteSettings',
          'type:homepage',
          'type:event',
          'type:program',
          'type:testimonial',
          'type:newsPost',
          'type:stat',
          'type:door',
        ],
      },
    ]);
    expect(PAGE_MAX_AGE).toBe(86400);
    expect(PAGE_SWR).toBe(604800);
    expect(cacheOptions('/odunde').tags).toContain('type:zone');
  });

  it('opts a draft-mode request and an error re-render out', () => {
    const draft = record();
    cachePage(draft, '/', { preview: true });
    expect(draft.calls).toEqual([false]);
    const error = record();
    cachePage(error, '/', { preview: false, uncacheable: true });
    expect(error.calls).toEqual([false]);
  });
});
