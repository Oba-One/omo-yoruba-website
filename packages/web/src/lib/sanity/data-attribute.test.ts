import { describe, expect, it } from 'vitest';
import { dataAttribute } from './data-attribute';

describe('dataAttribute', () => {
  it('encodes a field path with the published id and the studio base', () => {
    expect(
      dataAttribute({ id: 'homepage', type: 'homepage', path: 'hero.image', baseUrl: '/admin' }),
    ).toBe('id=homepage;type=homepage;path=hero.image;base=%2Fadmin');
  });

  it('strips the drafts prefix and writes keyed and indexed segments the overlay way', () => {
    expect(
      dataAttribute({
        id: 'drafts.homepage',
        type: 'homepage',
        path: 'yearInLife[_key=="tile-1"]',
        baseUrl: '/admin',
      }),
    ).toBe('id=homepage;type=homepage;path=yearInLife:tile-1;base=%2Fadmin');
    expect(dataAttribute({ id: 'homepage', type: 'homepage', path: 'stats[0]' })).toBe(
      'id=homepage;type=homepage;path=stats:0;base=%2F',
    );
  });

  it('adds the workspace and tool only when given', () => {
    expect(
      dataAttribute({
        id: 'x',
        type: 'stat',
        path: 'value',
        baseUrl: '/admin',
        tool: 'presentation',
      }),
    ).toBe('id=x;type=stat;path=value;base=%2Fadmin;tool=presentation');
  });
});
