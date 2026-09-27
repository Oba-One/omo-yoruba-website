import { describe, expect, it } from 'vitest';
import { visibleChoices } from './retired-choices';

const list = [
  { value: 'festival', title: 'Odunde Festival' },
  { value: 'gala', title: 'End-of-Year Gala' },
  { value: 'other', title: 'Other' },
];

describe('retired choices (ADR 0042)', () => {
  it('leave a new document without the retired values', () => {
    expect(visibleChoices(list, ['other'], undefined).map((c) => c.value)).toEqual([
      'festival',
      'gala',
    ]);
  });

  it('stay visible on a document that holds one, so opening it drops nothing', () => {
    expect(visibleChoices(list, ['other'], 'other').map((c) => c.value)).toEqual([
      'festival',
      'gala',
      'other',
    ]);
  });

  it('read an array value, as the partner scopes store', () => {
    const scopes = ['odunde', 'gala', 'org'];
    expect(visibleChoices(scopes, ['gala', 'org'], ['odunde', 'org'])).toEqual(['odunde', 'org']);
    expect(visibleChoices(scopes, ['gala', 'org'], [])).toEqual(['odunde']);
  });
});
