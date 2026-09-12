import { describe, expect, it } from 'vitest';
import { homepageQuery } from './homepage';

describe('homepageQuery', () => {
  it('reads the singleton and every list the homepage shows in one query', () => {
    expect(homepageQuery.startsWith('*[_id == "homepage"][0]{')).toBe(true);
    for (const list of ['"events"', '"stats"', '"programs"', '"voices"', '"news"', '"doors"']) {
      expect(homepageQuery).toContain(list);
    }
    expect(homepageQuery).toContain('kind in ["festival", "gala"]');
    expect(homepageQuery).toContain('order(date desc)[0...3]');
  });

  it('projects the asset reference and never a URL, so stega cannot reach a src', () => {
    expect(homepageQuery).not.toContain('url');
    expect(homepageQuery).toContain('hotspot, crop, asset');
  });

  it('reads the seven layout options by their tweak names', () => {
    expect(homepageQuery).toContain(
      'layout{season, highlight, gallery, involved, newsletter, pattern, motion}',
    );
  });
});
