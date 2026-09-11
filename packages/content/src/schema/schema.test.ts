import { describe, expect, it } from 'vitest';
import { objectTypes, schemaTypes } from './index';

describe('schemaTypes', () => {
  it('registers every shared object from CONTENT-MODEL section 2 once', () => {
    const names = objectTypes.map((type) => type.name);
    for (const name of [
      'bilingual',
      'cta',
      'oyImage',
      'seo',
      'fact',
      'sourcedFigure',
      'scheduleItem',
      'faqItem',
      'contactRole',
      'blockContent',
    ]) {
      expect(names).toContain(name);
    }
  });

  it('has no duplicate type names', () => {
    const names = schemaTypes.map((type) => type.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
