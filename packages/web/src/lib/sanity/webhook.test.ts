import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { SIGNATURE_HEADER, verifyWebhookSignature } from './webhook';

const secret = 'test-secret';
const body = JSON.stringify({ _type: 'zone', slug: null });

function sign(timestamp: number, text: string, key = secret): string {
  const digest = createHmac('sha256', key).update(`${timestamp}.${text}`).digest('base64url');
  return `t=${timestamp},v1=${digest}`;
}

describe('verifyWebhookSignature', () => {
  it('accepts a signature computed over timestamp.body with the shared secret', async () => {
    const now = Date.now();
    await expect(verifyWebhookSignature(body, sign(now, body), secret, now)).resolves.toBe(true);
  });

  it('rejects a missing header, a wrong secret, a changed body and a stale timestamp', async () => {
    const now = Date.now();
    await expect(verifyWebhookSignature(body, null, secret, now)).resolves.toBe(false);
    await expect(verifyWebhookSignature(body, sign(now, body, 'other'), secret, now)).resolves.toBe(
      false,
    );
    await expect(verifyWebhookSignature(`${body} `, sign(now, body), secret, now)).resolves.toBe(
      false,
    );
    const stale = now - 10 * 60 * 1000;
    await expect(verifyWebhookSignature(body, sign(stale, body), secret, now)).resolves.toBe(false);
  });

  it('names the header Sanity sends', () => {
    expect(SIGNATURE_HEADER).toBe('sanity-webhook-signature');
  });
});
