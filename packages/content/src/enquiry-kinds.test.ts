import { describe, expect, it } from 'vitest';
import {
  CONTACT_ROLES,
  ENQUIRY_KINDS,
  ENQUIRY_SPECS,
  footCopy,
  KIND_TO_ROLE,
  replyToField,
  requiredPhrases,
  successCopy,
} from './enquiry-kinds';

const YORUBA_THANKS = 'Ẹ ṣé! ✓';

describe('ENQUIRY_SPECS', () => {
  it('describes all eight kinds and nothing else', () => {
    expect(Object.keys(ENQUIRY_SPECS).sort()).toEqual([...ENQUIRY_KINDS].sort());
    expect(ENQUIRY_KINDS).toHaveLength(8);
  });

  it.each(ENQUIRY_KINDS)('%s has the copy the modal needs', (kind) => {
    const spec = ENQUIRY_SPECS[kind];
    expect(spec.kind).toBe(kind);
    expect(spec.title.length).toBeGreaterThan(3);
    expect(spec.blurb.length).toBeGreaterThan(10);
    expect(spec.submit.length).toBeGreaterThan(3);
    expect(spec.ok.startsWith(YORUBA_THANKS)).toBe(true);
    expect(spec.okBody.length).toBeGreaterThan(10);
    expect(CONTACT_ROLES).toContain(spec.role);
    expect(spec.contactNamed).toContain('{name}');
    expect(spec.contactUnnamed).toMatch(/^\p{Lu}/u);
  });

  it.each(ENQUIRY_KINDS)(
    '%s has unique field ids, one reply-to email and a required field with its phrase',
    (kind) => {
      const { fields } = ENQUIRY_SPECS[kind];
      const ids = fields.map((f) => f.id);
      expect(new Set(ids).size).toBe(ids.length);
      const emails = fields.filter((f) => f.email);
      expect(emails).toHaveLength(1);
      expect(emails[0]?.required).toBe(true);
      expect(replyToField(kind).id).toBe(emails[0]?.id);
      const required = fields.filter((f) => f.required);
      expect(required.length).toBeGreaterThan(0);
      for (const field of required) expect(field.req).toBeTruthy();
      expect(requiredPhrases(kind)).toEqual(required.map((f) => f.req));
      for (const field of fields) {
        if (field.kind === 'select') expect(field.options?.length).toBeGreaterThan(1);
        else expect(field.options).toBeUndefined();
      }
    },
  );

  it('keeps every fact out of the spec: no prices, dates, names or phone numbers', () => {
    const text = JSON.stringify(ENQUIRY_SPECS);
    expect(text).not.toMatch(/\$\d/);
    expect(text).not.toMatch(/\(\d{3}\)/);
    expect(text).not.toMatch(
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/,
    );
    expect(text).not.toMatch(/\b\d{1,2} (April|March)\b/);
    expect(text).not.toMatch(/Adeyemi|Bakare|Ogunlesi|Ojo\b/);
  });

  it('maps every kind to a routing role', () => {
    for (const kind of ENQUIRY_KINDS) expect(CONTACT_ROLES).toContain(KIND_TO_ROLE[kind]);
    expect(KIND_TO_ROLE.enrol).toBe('teacher');
    expect(KIND_TO_ROLE.contact).toBe('general');
  });
});

describe('successCopy', () => {
  it('names the contact and the response time when the routing entry is full', () => {
    const copy = successCopy('sponsor', {
      name: 'Adebayo Ogunlesi',
      responds: 'within one working day',
    });
    expect(copy.title).toBe('Ẹ ṣé! ✓ The deck is on its way.');
    expect(copy.body).toBe(
      'Adebayo Ogunlesi, our partnerships lead, sends the deck and the impact numbers within one working day and follows up to talk through levels and recognition.',
    );
  });

  it('names the role and drops the time clause when the entry is empty', () => {
    expect(successCopy('sponsor').body).toBe(
      'Our partnerships lead sends the deck and the impact numbers and follows up to talk through levels and recognition.',
    );
    expect(successCopy('member', {}).body).toBe(
      'Dues are not paid here. Our membership lead will call or write to arrange payment, and you are on the members list from today.',
    );
  });

  it('drops an optional segment whose slot is empty and keeps it when filled', () => {
    expect(
      successCopy(
        'contact',
        { name: 'A. Person', responds: 'within three working days' },
        { phone: '(323) 000-0000' },
      ).body,
    ).toBe(
      'A. Person, from our team, replies within three working days. If it is urgent, calling (323) 000-0000 reaches a person faster than email does.',
    );
    expect(successCopy('contact').body).toBe(
      'Our team replies. If it is urgent, calling reaches a person faster than email does.',
    );
  });
});

describe('footCopy', () => {
  it('includes the routing email only when there is one', () => {
    expect(footCopy('vendor', { email: 'vendors@example.org' })).toBe(
      'Photographs of your setup help us place you well. Email them to vendors@example.org once you have sent this.',
    );
    expect(footCopy('vendor')).toBe('Photographs of your setup help us place you well.');
    expect(footCopy('sponsor')).toBeUndefined();
  });
});
