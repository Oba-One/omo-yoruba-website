import { describe, expect, it } from 'vitest';
import { ENQUIRY_KINDS } from '../enquiry-kinds';
import { enquiryFieldsType } from './documents';
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

describe('enquiry', () => {
  it('carries one object per kind, each generated from the spec', () => {
    const names = schemaTypes.map((type) => type.name);
    const enquiry = schemaTypes.find((type) => type.name === 'enquiry') as {
      fields: { name: string; type: string }[];
    };
    for (const kind of ENQUIRY_KINDS) {
      expect(names).toContain(enquiryFieldsType(kind));
      const field = enquiry.fields.find((f) => f.name === kind);
      expect(field?.type).toBe(enquiryFieldsType(kind));
    }
    expect(enquiry.fields.map((f) => f.name)).toEqual(
      expect.arrayContaining([
        'kind',
        'submittedAt',
        'source',
        'notifiedAt',
        'notifyError',
        'handled',
        'notes',
      ]),
    );
  });
});
