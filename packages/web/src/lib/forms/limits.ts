/**
 * The best-effort burst limit per address of origin (ADR 0019): a token bucket in module memory,
 * so it holds on a warm function and resets on a cold start. The address cap in Sanity is the
 * one that holds everywhere.
 */
export interface Bucket {
  /** Takes one token for the key; false when the key is out of tokens. */
  take(key: string, now?: number): boolean;
}

export const ORIGIN_LIMIT = 10;
export const ORIGIN_WINDOW_MS = 10 * 60 * 1000;

export function createBucket(limit = ORIGIN_LIMIT, windowMs = ORIGIN_WINDOW_MS): Bucket {
  const hits = new Map<string, number[]>();
  return {
    take(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((at) => now - at < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > 5000) {
        for (const [other, stamps] of hits) {
          if (stamps.every((at) => now - at >= windowMs)) hits.delete(other);
        }
      }
      return true;
    },
  };
}
