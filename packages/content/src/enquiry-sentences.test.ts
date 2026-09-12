import { describe, expect, it } from 'vitest';
import {
  cappedSentence,
  contactsByRole,
  fallbackSentence,
  requiredSentence,
  successCopy,
  summarySentence,
} from './enquiry-kinds';
import { parseEnquiry } from './enquiry-zod';

describe('form sentences', () => {
  it('speaks the same missing-field sentence on the site and in the action', () => {
    expect(requiredSentence('an email address')).toBe('We still need an email address.');
    const result = parseEnquiry('contact', { name: '', mail: 'a@b.co', message: 'Hello' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('We still need your name.');
  });

  it('lists every missing item in the summary and promises nothing was cleared', () => {
    expect(summarySentence(['a business name', 'an email address'])).toBe(
      'We still need a business name, an email address. Nothing you typed has been cleared.',
    );
  });

  it('names the general inbox in the fallbacks only when there is one', () => {
    expect(fallbackSentence({ email: 'hello@example.org' })).toBe(
      'We could not send your message. Write to hello@example.org instead.',
    );
    expect(fallbackSentence()).toBe('We could not send your message.');
    expect(cappedSentence({ email: 'hello@example.org' })).toBe(
      'Too many messages from this address in the last hour. Write to hello@example.org instead.',
    );
    expect(cappedSentence({})).toBe('Too many messages from this address in the last hour.');
  });

  it('keys the routing contacts by role and drops what it does not know', () => {
    const byRole = contactsByRole([
      { role: 'membership', name: null, email: 'm@example.org', responds: 'within a week' },
      { role: 'unknown', email: 'x@example.org' },
      { role: null },
    ]);
    expect(Object.keys(byRole)).toEqual(['membership']);
    expect(byRole.membership).toEqual({
      name: undefined,
      email: 'm@example.org',
      phone: undefined,
      responds: 'within a week',
    });
    expect(successCopy('member', byRole.membership).body).toBe(
      'Dues are not paid here. Our membership lead will call or write within a week to arrange payment, and you are on the members list from today.',
    );
  });
});
