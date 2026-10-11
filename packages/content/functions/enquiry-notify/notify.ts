import type { SanityClient } from '@sanity/client';
import { buildEmail, type Contact, type EnquiryDocument, routeFor } from './email';

export interface NotificationDocument extends EnquiryDocument {
  notifiedAt?: string;
  notifyRequestedAt?: string;
  notifyAttemptAt?: string;
  notifyAttemptCount?: number;
}

interface SendResult {
  data: { id: string } | null;
  error: { name: string; message: string; statusCode?: number | null } | null;
}

interface Dependencies {
  client: SanityClient;
  from?: string;
  configurationError?: string;
  send: (
    email: ReturnType<typeof buildEmail> & { from: string },
    key: string,
  ) => Promise<SendResult>;
  now?: () => Date;
}

/** Machine fields merge with the latest document so a staff note cannot lose the send receipt. */
async function recordResult(
  client: SanityClient,
  id: string,
  fields: Record<string, unknown>,
  unset: string[] = [],
  attemptCount?: number,
) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const current = await client.getDocument<NotificationDocument>(id);
    if (!current || current.notifiedAt) return;
    let patch = client.patch(id).ifRevisionId(current._rev).set(fields);
    const safeUnset = unset.filter(
      (field) => field !== 'notifyAttemptAt' || current.notifyAttemptCount === attemptCount,
    );
    if (safeUnset.length) patch = patch.unset(safeUnset);
    try {
      await patch.commit();
      return;
    } catch (cause) {
      if ((cause as { statusCode?: number }).statusCode !== 409 || attempt === 2) throw cause;
    }
  }
}

/** Send once after creation or an explicit retry. Editing notes or status never sends email. */
export async function notifyEnquiry(event: NotificationDocument, dependencies: Dependencies) {
  const { client, from, send, configurationError, now = () => new Date() } = dependencies;
  const current = await client.getDocument<NotificationDocument>(event._id);
  if (!current || current.notifiedAt || current.notifyRequestedAt !== event.notifyRequestedAt)
    return;
  const fail = (message: string) => recordResult(client, current._id, { notifyError: message });
  try {
    const settings = await client.fetch<{ contacts?: Contact[]; generalEmail?: string } | null>(
      '*[_id == "siteSettings"][0]{contacts, generalEmail}',
    );
    const route = routeFor(current.kind, settings?.contacts, settings?.generalEmail);
    if (!route)
      return await fail(
        'No email contact is configured. Add the general email in Organization details.',
      );
    if (!from)
      return await fail('ENQUIRY_FROM is missing from the notification function settings.');
    if (configurationError) return await fail(configurationError);
    // Resend remembers an idempotency key for 24 hours. An old uncertain attempt needs a human
    // check in Resend before another email, rather than risking a duplicate after that window.
    const stamp = now().toISOString();
    if (
      current.notifyAttemptAt &&
      now().getTime() - Date.parse(current.notifyAttemptAt) >= 86_400_000
    ) {
      return await fail(
        'An earlier send has no confirmed result. Check Resend before sending this enquiry manually.',
      );
    }
    const attempt = await client
      .patch(current._id)
      .ifRevisionId(current._rev as string)
      .setIfMissing({ notifyAttemptAt: stamp, notifyAttemptCount: 0 })
      .inc({ notifyAttemptCount: 1 })
      .commit<NotificationDocument>();
    const { data, error } = await send(
      { ...buildEmail(current, route), from },
      `enquiry-notify/${current._id}`,
    );
    if (error || !data?.id) {
      // A rejected first request was never accepted. It can be retried after configuration is
      // corrected, even tomorrow. Preserve the guard if any previous attempt was uncertain.
      const rejected =
        !current.notifyAttemptAt &&
        error?.statusCode != null &&
        error.statusCode >= 400 &&
        error.statusCode < 500 &&
        ![408, 409].includes(error.statusCode);
      return await recordResult(
        client,
        current._id,
        {
          notifyError: error
            ? `${error.name}: ${error.message}`
            : 'The email service returned no receipt. Retry the notification.',
        },
        rejected ? ['notifyAttemptAt'] : [],
        attempt.notifyAttemptCount,
      );
    }
    await recordResult(client, current._id, { notifiedAt: stamp, notificationId: data.id }, [
      'notifyError',
    ]);
    console.log(`enquiry-notify: accepted ${data.id}`);
  } catch (cause) {
    await fail(
      cause instanceof Error ? cause.message : 'The notification failed. Retry it from the Inbox.',
    );
  }
}
