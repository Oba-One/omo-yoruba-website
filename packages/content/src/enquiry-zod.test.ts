import { describe, expect, it } from 'vitest';
import { ENQUIRY_KINDS, ENQUIRY_SPECS } from './enquiry-kinds';
import { enquirySchemas, parseEnquiry } from './enquiry-zod';

describe('enquirySchemas', () => {
  it.each(ENQUIRY_KINDS)('%s schema has one key per spec field', (kind) => {
    expect(Object.keys(enquirySchemas[kind].shape).sort()).toEqual(
      ENQUIRY_SPECS[kind].fields.map((f) => f.id).sort(),
    );
  });

  it('accepts a valid sponsor payload and trims it', () => {
    const result = parseEnquiry('sponsor', {
      org: '  Leimert Park Village ',
      who: 'A. Person, director',
      mail: 'person@example.org',
      interest: 'Both events',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.org).toBe('Leimert Park Village');
  });

  it('names a missing required field with the spec phrase', () => {
    const result = parseEnquiry('sponsor', { who: 'A. Person', mail: 'person@example.org' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((i) => i.message)).toContain('We still need an organization.');
    }
  });

  it('rejects an address that does not look like an email', () => {
    const result = parseEnquiry('contact', { name: 'A', mail: 'not-an-email', message: 'Hello' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((i) => i.message)).toContain(
        'That email address does not look right. Check it and send again.',
      );
    }
  });

  it('rejects a select value outside the options and accepts an empty optional field', () => {
    const bad = parseEnquiry('volunteer', { name: 'A', mail: 'a@example.org', age: 'Ancient' });
    expect(bad.success).toBe(false);
    const good = parseEnquiry('volunteer', { name: 'A', mail: 'a@example.org', phone: '' });
    expect(good.success).toBe(true);
  });
});
