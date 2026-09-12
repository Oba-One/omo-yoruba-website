/**
 * enquiry-notify (ADR 0004): on `create` of an enquiry without `notifiedAt`, read the routing
 * contacts from siteSettings, send the email through Resend with an idempotency key, then patch
 * notifiedAt (or notifyError) locked to the revision the event carried. The sender (ENQUIRY_FROM) and
 * the key (RESEND_API_KEY) are function environment variables; neither lives in code (ADR 0016). Locally
 * (`sanity functions test`) nothing is sent or written; the email is printed instead.
 */
import { createClient } from '@sanity/client';
import { documentEventHandler } from '@sanity/functions';
import { Resend } from 'resend';
import { buildEmail, type Contact, type EnquiryDocument, routeFor } from './email';

const API_VERSION = '2026-09-11';

interface Settings {
  contacts?: Contact[];
  generalEmail?: string;
}

export const handler = documentEventHandler<EnquiryDocument>(async ({ context, event }) => {
  const enquiry = event.data;
  // A local run (`sanity functions test`) has a project and dataset only when the flags add them;
  // production always has both plus a token.
  const client = context.clientOptions.projectId
    ? createClient({ ...context.clientOptions, apiVersion: API_VERSION, useCdn: false })
    : undefined;
  let settings: Settings | null = null;
  if (client) {
    try {
      settings = await client.fetch<Settings | null>(
        '*[_id == "siteSettings"][0]{contacts, generalEmail}',
      );
    } catch (cause) {
      if (!context.local) throw cause;
      console.warn('enquiry-notify (local): could not read siteSettings, routing with no contacts');
    }
  }
  let route = routeFor(enquiry.kind, settings?.contacts, settings?.generalEmail);
  if (!route && context.local && process.env.ENQUIRY_TEST_TO)
    route = { to: process.env.ENQUIRY_TEST_TO };
  const stamp = new Date().toISOString();

  if (!route) {
    const message = `No routing contact for ${enquiry.kind}: fill siteSettings.contacts or generalEmail.`;
    console.warn(`enquiry-notify: ${message}`);
    if (!context.local && client)
      await client.patch(enquiry._id).set({ notifyError: message }).commit();
    return;
  }

  const email = buildEmail(enquiry, route);
  if (context.local) {
    console.log('enquiry-notify (local, not sent):', JSON.stringify(email, null, 2));
    return;
  }

  if (!client) return;
  const from = process.env.ENQUIRY_FROM;
  if (!from) {
    await client
      .patch(enquiry._id)
      .set({
        notifyError:
          'ENQUIRY_FROM is not set on the function (a sender on the verified Resend domain).',
      })
      .commit();
    console.error('enquiry-notify: ENQUIRY_FROM is not set');
    return;
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    await client
      .patch(enquiry._id)
      .set({ notifyError: 'RESEND_API_KEY is not set on the function.' })
      .commit();
    console.error('enquiry-notify: RESEND_API_KEY is not set');
    return;
  }

  const resend = new Resend(key);
  const { data, error } = await resend.emails.send(
    { from, to: email.to, replyTo: email.replyTo, subject: email.subject, text: email.text },
    { idempotencyKey: `enquiry-notify/${enquiry._id}` },
  );
  let patch = client.patch(enquiry._id);
  if (enquiry._rev) patch = patch.ifRevisionId(enquiry._rev);
  if (error) {
    console.error('enquiry-notify: send failed', error.message);
    await patch.set({ notifyError: `${stamp}: ${error.name}: ${error.message}` }).commit();
    return;
  }
  await patch.set({ notifiedAt: stamp }).unset(['notifyError']).commit();
  console.log(`enquiry-notify: sent ${data?.id ?? ''} to ${email.to}`);
});
