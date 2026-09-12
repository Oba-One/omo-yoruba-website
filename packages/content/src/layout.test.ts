import { describe, expect, it } from 'vitest';
import { layoutDefaults, withLayoutDefaults } from './layout';

describe('layoutDefaults', () => {
  it('reads the first option of every homepage tweak from the schema', () => {
    expect(layoutDefaults('homepage')).toEqual({
      season: 'auto',
      highlight: 'festival',
      gallery: '7',
      involved: 'doors',
      newsletter: 'footer',
      pattern: 'rich',
      motion: 'on',
    });
  });

  it('answers undefined for a type without layout options', () => {
    expect(layoutDefaults('siteSettings')).toBeUndefined();
    expect(layoutDefaults('stat')).toBeUndefined();
  });
});

describe('withLayoutDefaults', () => {
  it('keeps a stored value the option knows and fills the rest', () => {
    expect(withLayoutDefaults('homepage', { season: 'odunde', gallery: '3' })).toMatchObject({
      season: 'odunde',
      gallery: '3',
      involved: 'doors',
      newsletter: 'footer',
    });
  });

  it('drops an empty, null or unknown value back to the default', () => {
    expect(
      withLayoutDefaults('homepage', { season: null, gallery: '9', motion: '' }),
    ).toMatchObject({ season: 'auto', gallery: '7', motion: 'on' });
    expect(withLayoutDefaults('homepage', null).pattern).toBe('rich');
  });
});
