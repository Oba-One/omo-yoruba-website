import { createClient } from '@sanity/client';
import { documentEventHandler } from '@sanity/functions';
import { Resend } from 'resend';
import { buildEmail, routeFor } from './email';
import { type NotificationDocument, notifyEnquiry } from './notify';

export const handler = documentEventHandler<NotificationDocument>(async ({ context, event }) => {
  const client = context.clientOptions.projectId
    ? createClient({ ...context.clientOptions, apiVersion: '2026-09-11', useCdn: false })
    : undefined;
  // Local CLI tests only print a preview. They never send email or change documents.
  if (context.local) {
    const route = routeFor(event.data.kind, [], process.env.ENQUIRY_TEST_TO);
    console.log(
      'enquiry-notify (local, not sent):',
      route ? buildEmail(event.data, route) : 'Set ENQUIRY_TEST_TO to preview the email.',
    );
    return;
  }
  if (!client) throw new Error('The notification function has no Sanity client.');
  await notifyEnquiry(event.data, {
    client,
    from: process.env.ENQUIRY_FROM,
    configurationError: process.env.RESEND_API_KEY
      ? undefined
      : 'RESEND_API_KEY is missing from the notification function settings.',
    send: (email, idempotencyKey) =>
      new Resend(process.env.RESEND_API_KEY).emails.send(email, { idempotencyKey }),
  });
});
