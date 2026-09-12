import { describe, expect, it } from 'vitest';
import { ENQUIRY_KINDS } from './enquiry-kinds';
import { parseSubscriber } from './enquiry-zod';
import { enquiryCountByEmailQuery, siteSettingsQuery, subscriberByEmailQuery } from './queries';

describe('queries', () => {
  it('reads the site settings the chrome needs in one query', () => {
    for (const field of ['ein', 'address', 'contacts[]', 'socials[]', 'zeffyEmbedUrl', 'theme']) {
      expect(siteSettingsQuery).toContain(field);
    }
  });

  it('counts an address across every kind through the reply-to field of each', () => {
    for (const kind of ENQUIRY_KINDS)
      expect(enquiryCountByEmailQuery).toContain(`${kind}.mail == $email`);
    expect(enquiryCountByEmailQuery).toContain('submittedAt > $since');
    expect(enquiryCountByEmailQuery.startsWith('count(')).toBe(true);
  });

  it('looks a subscriber up by address and validates one with the shared sentences', () => {
    expect(subscriberByEmailQuery).toContain('_type == "subscriber" && email == $email');
    expect(parseSubscriber({ email: 'ade@example.org' }).success).toBe(true);
    expect(parseSubscriber({ email: '' }).error?.issues[0]?.message).toBe(
      'We still need an email address.',
    );
    expect(parseSubscriber({ email: 'ade@example' }).error?.issues[0]?.message).toBe(
      'That email address does not look right. Check it and send again.',
    );
  });
});
