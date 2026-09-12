import { beforeEach, describe, expect, it, vi } from 'vitest';
import { enquiryHandler, type FormClient, newsletterHandler, resetRoutingCache } from './handlers';
import { createBucket } from './limits';

const form = (entries: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.append(key, value);
  return data;
};

const vendor = {
  biz: 'Ọjà Balógun Textiles',
  who: 'A. Example',
  mail: 'stall@example.org',
  phone: '',
  cat: 'Cloth and clothing',
  size: 'Double booth',
  power: 'No',
  permit: '',
  social: '',
  source: '/odunde',
};

function fakeClient(
  overrides: Partial<FormClient> & { count?: number; existing?: string | null } = {},
) {
  const created: Record<string, unknown>[] = [];
  const client: FormClient = {
    fetch: vi.fn(async (query: string) => {
      if (query.startsWith('count(')) return (overrides.count ?? 0) as never;
      if (query.includes('_type == "subscriber"')) return (overrides.existing ?? null) as never;
      return {
        contacts: [
          { role: 'vendors', name: null, email: 'v@example.org', responds: 'within a week' },
        ],
        generalEmail: 'hello@example.org',
        phone: null,
      } as never;
    }),
    create: vi.fn(async (doc: Record<string, unknown>) => {
      created.push(doc);
      return doc;
    }),
    ...overrides,
  };
  return { client, created };
}

const now = () => new Date('2026-09-11T12:00:00Z');

beforeEach(() => resetRoutingCache());

describe('enquiryHandler', () => {
  it('writes { kind, [kind]: fields, submittedAt, source } and answers with the filled copy', async () => {
    const { client, created } = fakeClient();
    const result = await enquiryHandler('vendor', form(vendor), {}, { client, now });
    expect(result).toEqual({
      ok: true,
      title: 'Ẹ ṣé! ✓ Your application is in.',
      body: 'We review applications in the order they arrive and write to every applicant within a week. If you are accepted, the booth fee is invoiced and a place is held once it is paid.',
    });
    expect(created).toEqual([
      {
        _type: 'enquiry',
        kind: 'vendor',
        vendor: {
          biz: 'Ọjà Balógun Textiles',
          who: 'A. Example',
          mail: 'stall@example.org',
          cat: 'Cloth and clothing',
          size: 'Double booth',
          power: 'No',
        },
        submittedAt: '2026-09-11T12:00:00.000Z',
        source: '/odunde',
        handled: false,
      },
    ]);
  });

  it('answers the sentences for a missing field without writing', async () => {
    const { client, created } = fakeClient();
    const result = await enquiryHandler(
      'vendor',
      form({ ...vendor, biz: '', mail: '' }),
      {},
      { client, now },
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.summary).toBe(
      'We still need a business name, an email address. Nothing you typed has been cleared.',
    );
    expect(result.values?.who).toBe('A. Example');
    expect(created).toHaveLength(0);
  });

  it('answers success for a filled honeypot and writes nothing', async () => {
    const { client, created } = fakeClient();
    const result = await enquiryHandler(
      'vendor',
      form({ ...vendor, website: 'http://spam.example' }),
      {},
      { client, now },
    );
    expect(result.ok).toBe(true);
    expect(created).toHaveLength(0);
    expect(client.fetch).not.toHaveBeenCalled();
  });

  it('refuses an address past the cap and names the general inbox', async () => {
    const { client, created } = fakeClient({ count: 5 });
    const result = await enquiryHandler('vendor', form(vendor), {}, { client, now });
    expect(result).toMatchObject({
      ok: false,
      summary:
        'Too many messages from this address in the last hour. Write to hello@example.org instead.',
    });
    expect(created).toHaveLength(0);
  });

  it('refuses a burst from one origin before touching Sanity', async () => {
    const { client, created } = fakeClient();
    const bucket = createBucket(1, 60_000);
    const context = { clientAddress: '203.0.113.9' };
    expect(
      (
        await enquiryHandler(
          'contact',
          form({ name: 'A', mail: 'a@example.org', message: 'Hi' }),
          context,
          { client, bucket, now },
        )
      ).ok,
    ).toBe(true);
    const second = await enquiryHandler(
      'contact',
      form({ name: 'A', mail: 'a@example.org', message: 'Hi' }),
      context,
      { client, bucket, now },
    );
    expect(second.ok).toBe(false);
    expect(created).toHaveLength(1);
  });

  it('answers the fallback sentence when the write fails or the token is missing', async () => {
    const { client } = fakeClient({
      create: vi.fn(async () => {
        throw new Error('boom');
      }),
    });
    const failed = await enquiryHandler('vendor', form(vendor), {}, { client, now });
    expect(failed).toMatchObject({
      ok: false,
      summary: 'We could not send your message. Write to hello@example.org instead.',
    });
    resetRoutingCache();
    const noToken = await enquiryHandler('vendor', form(vendor), {}, { now });
    expect(noToken).toMatchObject({ ok: false, summary: 'We could not send your message.' });
  });
});

describe('newsletterHandler', () => {
  it('writes a subscriber once and reads a repeat address as success', async () => {
    const { client, created } = fakeClient();
    const first = await newsletterHandler(
      form({ email: 'Ade@Example.org', source: '/' }),
      {},
      { client, now },
    );
    expect(first).toEqual({
      ok: true,
      title: 'Ẹ ṣé! ✓',
      body: 'Ẹ ṣé. You are on the list. The next note goes out with the festival save-the-date.',
    });
    expect(created).toEqual([
      {
        _type: 'subscriber',
        email: 'ade@example.org',
        subscribedAt: '2026-09-11T12:00:00.000Z',
        source: '/',
      },
    ]);
    const repeat = fakeClient({ existing: 'subscriber-1' });
    const second = await newsletterHandler(
      form({ email: 'ade@example.org' }),
      {},
      { client: repeat.client, now },
    );
    expect(second.ok).toBe(true);
    expect(repeat.created).toHaveLength(0);
  });

  it('names the address problem in the email field', async () => {
    const { client } = fakeClient();
    const result = await newsletterHandler(form({ email: 'ade@example' }), {}, { client, now });
    expect(result).toMatchObject({
      ok: false,
      fields: { email: 'That email address does not look right. Check it and send again.' },
      values: { email: 'ade@example' },
    });
  });
});
