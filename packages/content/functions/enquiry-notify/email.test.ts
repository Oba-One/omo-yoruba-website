import { describe, expect, it } from 'vitest';
import { buildEmail, routeFor } from './email';

const contacts = [
  {
    role: 'partnerships',
    name: 'A. Lead',
    email: 'partners@example.org',
    responds: 'within one working day',
  },
  { role: 'general', email: 'hello@example.org' },
  { role: 'vendors' },
];

describe('routeFor', () => {
  it("picks the entry for the kind's role", () => {
    expect(routeFor('sponsor', contacts, 'fallback@example.org')).toEqual({
      to: 'partners@example.org',
      contact: contacts[0],
    });
  });

  it('falls back to the general entry, then to the general email, then to nothing', () => {
    expect(routeFor('vendor', contacts, 'fallback@example.org')).toEqual({
      to: 'hello@example.org',
      contact: contacts[1],
    });
    expect(routeFor('vendor', [contacts[2] as { role: string }], 'fallback@example.org')).toEqual({
      to: 'fallback@example.org',
    });
    expect(routeFor('vendor', [], undefined)).toBeUndefined();
    expect(routeFor('vendor', undefined, '')).toBeUndefined();
  });
});

describe('buildEmail', () => {
  const enquiry = {
    _id: 'abc',
    _type: 'enquiry',
    kind: 'sponsor' as const,
    submittedAt: '2026-09-11T10:00:00Z',
    source: '/odunde',
    sponsor: {
      org: 'Leimert Park Village',
      who: 'A. Person, director',
      mail: 'person@example.org',
      interest: 'Both events',
      extra: 'ignored',
    },
  };

  it('lists every field of the kind with its label, in spec order, and names the sender', () => {
    const email = buildEmail(enquiry, { to: 'partners@example.org' });
    expect(email.to).toBe('partners@example.org');
    expect(email.replyTo).toBe('person@example.org');
    expect(email.subject).toBe('Sponsor enquiry from Leimert Park Village');
    expect(email.text).toBe(
      [
        'A new sponsor enquiry arrived through omoyorubasocal.org.',
        '',
        'Organization: Leimert Park Village',
        'Your name and role: A. Person, director',
        'Email: person@example.org',
        'What are you interested in: Both events',
        '',
        'Sent from: /odunde',
        'Submitted: 2026-09-11T10:00:00Z',
        'Reply to this email to answer them. The enquiry is also in the Studio inbox (id abc).',
      ].join('\n'),
    );
  });

  it('writes "not given" for an empty field and copes with a missing details object', () => {
    const email = buildEmail(
      {
        _id: 'x',
        _type: 'enquiry',
        kind: 'contact',
        contact: { name: 'B', mail: 'b@example.org' },
      },
      { to: 't@example.org' },
    );
    expect(email.text).toContain('What is this about: not given');
    expect(email.text).toContain('Message: not given');
    const bare = buildEmail(
      { _id: 'y', _type: 'enquiry', kind: 'contact' },
      { to: 't@example.org' },
    );
    expect(bare.subject).toBe('Message enquiry');
    expect(bare.replyTo).toBeUndefined();
  });
});
