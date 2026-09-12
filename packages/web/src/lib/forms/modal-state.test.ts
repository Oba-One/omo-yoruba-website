import { successCopy } from '@oy/content/enquiry-kinds';
import { describe, expect, it } from 'vitest';
import {
  enquiryKindFrom,
  modalStateFromResult,
  modalStateFromUrl,
  newsletterStateFrom,
  redirectAfterEnquiry,
  redirectAfterNewsletter,
} from './modal-state';

const copy = (kind: Parameters<typeof successCopy>[0]) => successCopy(kind);

describe('the modal state without JavaScript', () => {
  it('opens the kind named in the query and shows the success block after the redirect', () => {
    expect(modalStateFromUrl(new URL('https://x.test/odunde'), copy)).toEqual({
      open: false,
      state: 'empty',
    });
    expect(modalStateFromUrl(new URL('https://x.test/odunde?enquiry=vendor'), copy)).toEqual({
      kind: 'vendor',
      open: true,
      state: 'empty',
    });
    expect(modalStateFromUrl(new URL('https://x.test/odunde?enquiry=vendor&sent=1'), copy)).toEqual(
      {
        kind: 'vendor',
        open: true,
        state: 'success',
        success: successCopy('vendor'),
      },
    );
    expect(modalStateFromUrl(new URL('https://x.test/?enquiry=nope'), copy).open).toBe(false);
    expect(enquiryKindFrom('contact')).toBe('contact');
    expect(enquiryKindFrom('drop table')).toBeUndefined();
  });

  it('re-renders a posted error with its values and a stray success in place', () => {
    const failed = modalStateFromResult(
      'member',
      {
        data: {
          ok: false,
          summary: 'We still need your full name.',
          fields: { name: 'We still need your full name.' },
          values: { city: 'Inglewood' },
        },
      },
      {},
    );
    expect(failed).toEqual({
      kind: 'member',
      open: true,
      state: 'error',
      summary: 'We still need your full name.',
      errors: { name: 'We still need your full name.' },
      values: { city: 'Inglewood' },
    });
    expect(
      modalStateFromResult('member', { data: { ok: true, title: 'x', body: 'y' } }, {}),
    ).toEqual({ kind: 'member', open: true, state: 'success', success: { title: 'x', body: 'y' } });
    expect(
      modalStateFromResult('member', { error: { message: 'Server exploded' } }, {}).summary,
    ).toBe('Server exploded');
    expect(modalStateFromResult('member', {}, { email: 'hello@example.org' }).summary).toBe(
      'We could not send your message. Write to hello@example.org instead.',
    );
    expect(redirectAfterEnquiry(new URL('https://x.test/odunde?enquiry=vendor'), 'vendor')).toBe(
      '/odunde?enquiry=vendor&sent=1#enquiry',
    );
  });

  it('reads the newsletter state from the query and a posted result', () => {
    expect(newsletterStateFrom(new URL('https://x.test/'))).toEqual({ state: 'idle' });
    expect(newsletterStateFrom(new URL('https://x.test/?subscribed=1'))).toEqual({
      state: 'success',
    });
    expect(
      newsletterStateFrom(new URL('https://x.test/'), {
        data: {
          ok: false,
          summary: 'no',
          fields: { email: 'That email address does not look right. Check it and send again.' },
          values: { email: 'ade@example' },
        },
      }),
    ).toEqual({
      state: 'error',
      error: 'That email address does not look right. Check it and send again.',
      value: 'ade@example',
    });
    expect(redirectAfterNewsletter(new URL('https://x.test/impact'))).toBe(
      '/impact?subscribed=1#oy-newsletter',
    );
  });
});
