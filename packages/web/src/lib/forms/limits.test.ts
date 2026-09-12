import { describe, expect, it } from 'vitest';
import { createBucket } from './limits';

describe('the origin bucket', () => {
  it('allows the limit inside the window, refuses the next, and forgets after it', () => {
    const bucket = createBucket(3, 1000);
    expect(bucket.take('a', 0)).toBe(true);
    expect(bucket.take('a', 10)).toBe(true);
    expect(bucket.take('a', 20)).toBe(true);
    expect(bucket.take('a', 30)).toBe(false);
    expect(bucket.take('b', 30)).toBe(true);
    expect(bucket.take('a', 1500)).toBe(true);
  });
});
