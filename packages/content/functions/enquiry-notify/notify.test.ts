import type { SanityClient } from '@sanity/client';
import { describe, expect, it, vi } from 'vitest';
import { type NotificationDocument, notifyEnquiry } from './notify';

function fixture(extra: Partial<NotificationDocument> = {}) {
  const document: NotificationDocument = {
    _id: 'enquiry-test',
    _type: 'enquiry',
    _rev: 'created',
    kind: 'contact',
    contact: { name: 'Test sender', mail: 'sender@example.org', message: 'A test message' },
    ...extra,
  };
  let conflict = false;
  const fetch = vi.fn().mockResolvedValue({ generalEmail: 'team@example.org' });
  const send = vi.fn().mockResolvedValue({ data: { id: 'email-receipt' }, error: null });
  const client = {
    fetch,
    getDocument: vi.fn(async () => ({ ...document })),
    patch: vi.fn(() => {
      let expected: string | undefined;
      const set: Record<string, unknown> = {};
      const unset: string[] = [];
      const patch = {
        ifRevisionId: (revision: string) => {
          expected = revision;
          return patch;
        },
        set: (fields: Record<string, unknown>) => {
          Object.assign(set, fields);
          return patch;
        },
        setIfMissing: (fields: Record<string, unknown>) => {
          for (const [key, value] of Object.entries(fields))
            if (document[key] === undefined) set[key] = value;
          return patch;
        },
        unset: (fields: string[]) => {
          unset.push(...fields);
          return patch;
        },
        inc: (fields: Record<string, number>) => {
          for (const [key, value] of Object.entries(fields))
            set[key] = Number(set[key] ?? document[key] ?? 0) + value;
          return patch;
        },
        commit: async () => {
          if (expected && conflict && set.notificationId) {
            conflict = false;
            document.notes = 'A staff note saved during delivery';
            document._rev = 'edited';
            throw Object.assign(new Error('Conflict'), { statusCode: 409 });
          }
          if (expected && expected !== document._rev)
            throw Object.assign(new Error('Conflict'), { statusCode: 409 });
          Object.assign(document, set);
          for (const field of unset) delete document[field];
          document._rev = `${document._rev}-updated`;
          return { ...document };
        },
      };
      return patch;
    }),
  } as unknown as SanityClient;
  const event = { ...document };
  return {
    dependencies: {
      client,
      from: 'Website <forms@example.org>',
      send,
      now: () => new Date('2026-10-11T10:00:00Z'),
    },
    fetch,
    send,
    event,
    current: () => document,
    conflict: () => {
      conflict = true;
    },
  };
}

describe('enquiry notifications', () => {
  it('routes the email with Reply-To, records acceptance and clears a previous problem', async () => {
    const f = fixture({ notifyError: 'Previous failure' });
    await notifyEnquiry(f.event, f.dependencies);
    expect(f.send).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'team@example.org', replyTo: 'sender@example.org' }),
      'enquiry-notify/enquiry-test',
    );
    expect(f.current()).toMatchObject({
      notifiedAt: '2026-10-11T10:00:00.000Z',
      notificationId: 'email-receipt',
    });
    expect(f.current().notifyError).toBeUndefined();
    await notifyEnquiry(f.event, f.dependencies);
    expect(f.send).toHaveBeenCalledTimes(1);
  });

  it('keeps a concurrent staff note and still records the send receipt', async () => {
    const f = fixture();
    f.conflict();
    await notifyEnquiry(f.event, f.dependencies);
    expect(f.current()).toMatchObject({
      notes: 'A staff note saved during delivery',
      notificationId: 'email-receipt',
    });
    expect(f.send).toHaveBeenCalledTimes(1);
  });

  it('uses a private recipient override without reading or changing public contacts', async () => {
    const f = fixture();
    f.fetch.mockRejectedValue(new Error('Settings unavailable'));
    await notifyEnquiry(f.event, {
      ...f.dependencies,
      recipientOverride: ' temporary@example.org ',
    });
    expect(f.fetch).not.toHaveBeenCalled();
    expect(f.send).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'temporary@example.org', replyTo: 'sender@example.org' }),
      'enquiry-notify/enquiry-test',
    );
    expect(f.current().notificationId).toBe('email-receipt');
    expect(f.dependencies.client.patch).toHaveBeenCalledWith('enquiry-test');
    expect(f.dependencies.client.patch).not.toHaveBeenCalledWith('siteSettings');
  });

  it('returns to normal contact routing when the override is blank', async () => {
    const f = fixture();
    await notifyEnquiry(f.event, { ...f.dependencies, recipientOverride: ' ' });
    expect(f.send).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'team@example.org' }),
      'enquiry-notify/enquiry-test',
    );
  });

  it.each(['invalid', 'one@example.org, two@example.org', 'Name <one@example.org>'])(
    'records a configuration error for an invalid override: %s',
    async (recipientOverride) => {
      const f = fixture();
      await notifyEnquiry(f.event, { ...f.dependencies, recipientOverride });
      expect(f.send).not.toHaveBeenCalled();
      expect(f.current().notifyError).toContain('ENQUIRY_TO must contain one email address');
      expect(f.current().notifyAttemptAt).toBeUndefined();
    },
  );

  it.each(['route', 'sender', 'key'] as const)(
    'does not attempt sending without a configured %s',
    async (missing) => {
      const f = fixture();
      if (missing === 'route') f.fetch.mockResolvedValue(null);
      await notifyEnquiry(f.event, {
        ...f.dependencies,
        from: missing === 'sender' ? undefined : f.dependencies.from,
        configurationError: missing === 'key' ? 'Missing API key' : undefined,
      });
      expect(f.send).not.toHaveBeenCalled();
      expect(f.current().notifyError).toBeTruthy();
      expect(f.current().notifyAttemptAt).toBeUndefined();
    },
  );

  it('records a rejected request and allows a corrected retry the next day', async () => {
    const f = fixture();
    f.send.mockResolvedValue({
      data: null,
      error: {
        name: 'validation_error',
        message: 'Sender domain is not verified',
        statusCode: 403,
      },
    });
    await notifyEnquiry(f.event, f.dependencies);
    expect(f.current().notifyError).toContain('Sender domain is not verified');
    expect(f.current().notifiedAt).toBeUndefined();
    expect(f.current().notifyAttemptAt).toBeUndefined();
    f.send.mockResolvedValue({ data: { id: 'email-receipt' }, error: null });
    await notifyEnquiry(f.event, {
      ...f.dependencies,
      now: () => new Date('2026-10-12T10:00:00Z'),
    });
    expect(f.send).toHaveBeenCalledTimes(2);
    expect(f.current().notificationId).toBe('email-receipt');
  });

  it('records an uncertain timeout and does not blindly resend after idempotency expires', async () => {
    const f = fixture();
    f.send.mockRejectedValue(new Error('Timed out'));
    await notifyEnquiry(f.event, f.dependencies);
    expect(f.current().notifyError).toBe('Timed out');
    await notifyEnquiry(f.event, {
      ...f.dependencies,
      now: () => new Date('2026-10-12T10:00:00Z'),
    });
    expect(f.current().notifyError).toContain('Check Resend');
    expect(f.send).toHaveBeenCalledTimes(1);
  });

  it('keeps uncertainty when another worker overlaps a rejected first request', async () => {
    const f = fixture();
    let rejectFirst!: () => void;
    f.send.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          rejectFirst = () =>
            resolve({
              data: null,
              error: {
                name: 'rate_limit_exceeded',
                message: 'Too many requests',
                statusCode: 429,
              },
            });
        }),
    );
    const first = notifyEnquiry(f.event, f.dependencies);
    await vi.waitFor(() => expect(f.send).toHaveBeenCalledTimes(1));
    f.send.mockRejectedValueOnce(new Error('Timed out'));
    await notifyEnquiry(f.event, f.dependencies);
    rejectFirst();
    await first;
    expect(f.current().notifyAttemptAt).toBeDefined();
    await notifyEnquiry(f.event, {
      ...f.dependencies,
      now: () => new Date('2026-10-12T10:00:00Z'),
    });
    expect(f.send).toHaveBeenCalledTimes(2);
    expect(f.current().notifyError).toContain('Check Resend');
  });

  it('ignores an event superseded by a newer retry request', async () => {
    const f = fixture({ notifyRequestedAt: 'new-request' });
    await notifyEnquiry({ ...f.event, notifyRequestedAt: 'old-request' }, f.dependencies);
    expect(f.send).not.toHaveBeenCalled();
  });
});
