/**
 * The nine form handlers behind the Astro Actions (ADR 0004, ADR 0015, ADR 0019). Pure of Astro's
 * virtual modules so Vitest can drive them with a fake client: validate with `parseEnquiry`,
 * drop a honeypot with a success answer and no write, refuse a burst from one origin and an
 * address past the cap, write the document with the Editor token, and answer with the success
 * copy filled from the routing contacts. Every failure is a sentence that names the human
 * fallback; nothing thrown reaches the visitor.
 */
import {
  type ContactRole,
  cappedSentence,
  contactsByRole,
  ENQUIRY_SPECS,
  type EnquiryKind,
  fallbackSentence,
  NEWSLETTER_COPY,
  type RoutingContact,
  replyToField,
  type SiteContact,
  successCopy,
} from '@oy/content/enquiry-kinds';
import { parseEnquiry, parseSubscriber } from '@oy/content/enquiry-zod';
import {
  enquiryCountByEmailQuery,
  routingQuery,
  subscriberByEmailQuery,
} from '@oy/content/queries';
import type { Bucket } from './limits';
import {
  type FormResult,
  isHoneypotFilled,
  resultFromIssues,
  sourceFrom,
  valuesFrom,
} from './result';

export const ADDRESS_CAP = 5;
export const ADDRESS_WINDOW_MS = 60 * 60 * 1000;
const ROUTING_TTL_MS = 60 * 1000;

/** The slice of the Sanity client the handlers use, so tests pass a fake. */
export interface FormClient {
  fetch<T>(query: string, params?: Record<string, unknown>): Promise<T>;
  create(document: Record<string, unknown>): Promise<unknown>;
}

export interface FormDeps {
  /** Undefined when the write token is missing: the form answers with the fallback sentence. */
  client?: FormClient;
  bucket?: Bucket;
  now?: () => Date;
}

export interface FormContext {
  /** The address of origin, when the runtime knows it. */
  clientAddress?: string;
}

interface Routing {
  contacts: Partial<Record<ContactRole, RoutingContact>>;
  site: SiteContact;
}

interface RoutingDocument {
  contacts?: Array<{
    role?: string | null;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    responds?: string | null;
  }> | null;
  generalEmail?: string | null;
  phone?: string | null;
}

let routingCache: { at: number; value: Routing } | undefined;

/** For tests: forget the cached routing contacts. */
export function resetRoutingCache(): void {
  routingCache = undefined;
}

async function readRouting(client: FormClient | undefined, now: number): Promise<Routing> {
  if (routingCache && now - routingCache.at < ROUTING_TTL_MS) return routingCache.value;
  const empty: Routing = { contacts: {}, site: {} };
  if (!client) return empty;
  try {
    const doc = await client.fetch<RoutingDocument | null>(routingQuery);
    const value: Routing = {
      contacts: contactsByRole(doc?.contacts),
      site: { email: doc?.generalEmail ?? undefined, phone: doc?.phone ?? undefined },
    };
    routingCache = { at: now, value };
    return value;
  } catch (error) {
    console.error('[forms] routing read failed', error instanceof Error ? error.message : error);
    return empty;
  }
}

function addressOf(context: FormContext): string {
  try {
    return context.clientAddress || 'unknown';
  } catch {
    return 'unknown';
  }
}

function withoutEmpty(values: Record<string, string | undefined>): Record<string, string> {
  const kept: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === 'string' && value !== '') kept[key] = value;
  }
  return kept;
}

/** One enquiry kind: validate, guard, write `{ kind, [kind]: fields }`, answer with the copy. */
export async function enquiryHandler(
  kind: EnquiryKind,
  formData: FormData,
  context: FormContext,
  deps: FormDeps,
): Promise<FormResult> {
  const spec = ENQUIRY_SPECS[kind];
  const now = (deps.now ?? (() => new Date()))();
  const values = valuesFrom(
    formData,
    spec.fields.map((field) => field.id),
  );
  if (isHoneypotFilled(formData)) return { ok: true, ...successCopy(kind) };
  const parsed = parseEnquiry(kind, values);
  if (!parsed.success) return resultFromIssues(parsed.error.issues, values);

  const routing = await readRouting(deps.client, now.getTime());
  const capped = (): FormResult => ({ ok: false, summary: cappedSentence(routing.site), values });
  if (deps.bucket && !deps.bucket.take(addressOf(context), now.getTime())) return capped();
  if (!deps.client) {
    console.error('[forms] no write token: SANITY_API_WRITE_TOKEN is missing (docs/runbook.md)');
    return { ok: false, summary: fallbackSentence(routing.site), values };
  }

  const fields = withoutEmpty(parsed.data as Record<string, string | undefined>);
  const email = fields[replyToField(kind).id];
  try {
    const since = new Date(now.getTime() - ADDRESS_WINDOW_MS).toISOString();
    const count = await deps.client.fetch<number>(enquiryCountByEmailQuery, { email, since });
    if (count >= ADDRESS_CAP) return capped();
  } catch (error) {
    console.error(
      '[forms] address cap read failed',
      error instanceof Error ? error.message : error,
    );
  }
  try {
    await deps.client.create({
      _type: 'enquiry',
      kind,
      [kind]: fields,
      submittedAt: now.toISOString(),
      source: sourceFrom(formData),
      handled: false,
    });
  } catch (error) {
    console.error('[forms] enquiry write failed', error instanceof Error ? error.message : error);
    return { ok: false, summary: fallbackSentence(routing.site), values };
  }
  return { ok: true, ...successCopy(kind, routing.contacts[spec.role], routing.site) };
}

/** The newsletter: validate, drop a honeypot, treat a repeat address as done, write a subscriber. */
export async function newsletterHandler(
  formData: FormData,
  context: FormContext,
  deps: FormDeps,
): Promise<FormResult> {
  const now = (deps.now ?? (() => new Date()))();
  const values = valuesFrom(formData, ['email']);
  if (isHoneypotFilled(formData)) return { ok: true, ...NEWSLETTER_COPY };
  const parsed = parseSubscriber(values);
  if (!parsed.success) return resultFromIssues(parsed.error.issues, values);

  const routing = await readRouting(deps.client, now.getTime());
  if (deps.bucket && !deps.bucket.take(addressOf(context), now.getTime())) {
    return { ok: false, summary: cappedSentence(routing.site), values };
  }
  if (!deps.client) {
    console.error('[forms] no write token: SANITY_API_WRITE_TOKEN is missing (docs/runbook.md)');
    return { ok: false, summary: fallbackSentence(routing.site), values };
  }
  const email = parsed.data.email.toLowerCase();
  try {
    const existing = await deps.client.fetch<string | null>(subscriberByEmailQuery, { email });
    if (existing) return { ok: true, ...NEWSLETTER_COPY };
    await deps.client.create({
      _type: 'subscriber',
      email,
      subscribedAt: now.toISOString(),
      source: sourceFrom(formData),
    });
  } catch (error) {
    console.error(
      '[forms] subscriber write failed',
      error instanceof Error ? error.message : error,
    );
    return { ok: false, summary: fallbackSentence(routing.site), values };
  }
  return { ok: true, ...NEWSLETTER_COPY };
}
