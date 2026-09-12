import { parseEnquiry } from '@oy/content/enquiry-zod';
import { describe, expect, it } from 'vitest';
import { isHoneypotFilled, resultFromIssues, sourceFrom, valuesFrom } from './result';

const form = (entries: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.append(key, value);
  return data;
};

describe('the action result', () => {
  it('lists every missing item in the summary and names each field, values kept', () => {
    const values = { org: '', who: 'A. Example', mail: '', interest: 'Programs' };
    const parsed = parseEnquiry('sponsor', values);
    expect(parsed.success).toBe(false);
    const result = resultFromIssues(parsed.error?.issues ?? [], values);
    expect(result).toEqual({
      ok: false,
      summary:
        'We still need an organization, an email address. Nothing you typed has been cleared.',
      fields: {
        org: 'We still need an organization.',
        mail: 'We still need an email address.',
      },
      values,
    });
  });

  it('uses the field sentence as the summary when nothing is missing', () => {
    const values = { name: 'A. Example', mail: 'ade@example', message: 'Hello' };
    const parsed = parseEnquiry('contact', values);
    const result = resultFromIssues(parsed.error?.issues ?? [], values);
    expect(result.summary).toBe('That email address does not look right. Check it and send again.');
    expect(result.fields).toEqual({ mail: result.summary });
  });

  it('reads the named values as typed and spots a filled honeypot', () => {
    const data = form({ name: ' Ade ', mail: 'a@b.co', website: 'http://spam.example' });
    expect(valuesFrom(data, ['name', 'mail', 'missing'])).toEqual({
      name: ' Ade ',
      mail: 'a@b.co',
    });
    expect(isHoneypotFilled(data)).toBe(true);
    expect(isHoneypotFilled(form({ website: '  ' }))).toBe(false);
  });

  it('keeps a source only when it is a path of ours', () => {
    expect(sourceFrom(form({ source: '/odunde' }))).toBe('/odunde');
    expect(sourceFrom(form({ source: 'https://evil.example/' }), '/')).toBe('/');
    expect(sourceFrom(form({ source: '//evil.example' }))).toBe('');
    expect(sourceFrom(form({ source: `/${'a'.repeat(300)}` }))).toBe('');
  });
});
