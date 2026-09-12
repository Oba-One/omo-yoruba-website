import { ENQUIRY_KINDS, ENQUIRY_SPECS, footCopy, successCopy } from '@oy/content/enquiry-kinds';
import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './EnquiryModal.stories';

const { Default, Filled, Submitting, Success, WithErrors, WithSiteContact, Closed } =
  composeStories(stories);

describe('EnquiryModal', () => {
  it('carries all eight forms from the spec with unique ids and shows only the open kind', async () => {
    const body = await renderToBody(Default);
    const forms = Array.from(body.querySelectorAll('form[data-form="enquiry"]'));
    expect(forms.map((f) => f.getAttribute('data-kind'))).toEqual([...ENQUIRY_KINDS]);
    for (const form of forms) {
      const kind = form.getAttribute('data-kind') as (typeof ENQUIRY_KINDS)[number];
      const names = Array.from(form.querySelectorAll('.oy-form-grid [name]')).map((el) =>
        el.getAttribute('name'),
      );
      expect(names).toEqual(ENQUIRY_SPECS[kind].fields.map((f) => f.id));
      expect(form.getAttribute('method')).toBe('POST');
      expect(form.hasAttribute('novalidate')).toBe(true);
      expect(form.querySelector('input[name="website"]')?.getAttribute('tabindex')).toBe('-1');
      expect(form.querySelector('input[name="source"]')?.getAttribute('value')).toBe(
        '/get-involved',
      );
    }
    const ids = Array.from(body.querySelectorAll('[id]')).map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    const visible = Array.from(body.querySelectorAll('section.oy-enquiry:not([hidden])'));
    expect(visible.map((s) => s.getAttribute('data-kind'))).toEqual(['sponsor']);
    expect(text(body.querySelector('#enquiry-title'))).toBe('Sponsor Omo Yorùbá');
    expect(body.querySelector('dialog#enquiry')?.hasAttribute('open')).toBe(true);
    expect(body.querySelector('dialog')?.getAttribute('aria-labelledby')).toBe('enquiry-title');
  });

  it('fills the success block and the foot note from the spec copy for every kind', async () => {
    const body = await renderToBody(Default);
    for (const kind of ENQUIRY_KINDS) {
      const section = body.querySelector(`section[data-kind="${kind}"]`);
      const ok = section?.querySelector('[data-success]');
      expect(text(ok?.querySelector('b'))).toBe(successCopy(kind).title);
      expect(text(ok?.querySelector('p'))).toBe(successCopy(kind).body);
      expect(ok?.hasAttribute('hidden')).toBe(true);
      const foot = footCopy(kind);
      if (foot) expect(text(section?.querySelector('.oy-form-foot'))).toBe(foot);
      else expect(section?.querySelector('.oy-form-foot')).toBeNull();
      expect(text(section?.querySelector('button[type="submit"]'))).toBe(
        ENQUIRY_SPECS[kind].submit,
      );
    }
  });

  it('keeps the filled values in the open form', async () => {
    const body = await renderToBody(Filled);
    const form = body.querySelector('section[data-kind="vendor"] form');
    expect(form?.querySelector<HTMLInputElement>('[name="biz"]')?.getAttribute('value')).toBe(
      'Ọjà Balógun Textiles',
    );
    expect(form?.querySelector('option[value="Double booth"]')?.hasAttribute('selected')).toBe(
      true,
    );
  });

  it('reads Sending... while submitting', async () => {
    const button = (await renderToBody(Submitting)).querySelector(
      'section[data-kind="contact"] button[type="submit"]',
    );
    expect(text(button)).toBe('Sending...');
    expect(button?.getAttribute('aria-busy')).toBe('true');
  });

  it('replaces the fields with the success block that names the role', async () => {
    const body = await renderToBody(Success);
    const section = body.querySelector('section[data-kind="member"]');
    expect(section?.querySelector('[data-success]')?.hasAttribute('hidden')).toBe(false);
    expect(section?.querySelector('form')?.hasAttribute('hidden')).toBe(true);
    expect(text(section?.querySelector('[data-success] b'))).toBe('Ẹ ṣé! ✓ Welcome.');
    expect(text(section?.querySelector('[data-success] p'))).toContain('Our membership lead');
    expect(text(section?.querySelector('[data-success] [data-close]'))).toBe('Close');
  });

  it('shows the summary as an alert, names each field and clears nothing', async () => {
    const body = await renderToBody(WithErrors);
    const form = body.querySelector('section[data-kind="member"] form');
    const summary = form?.querySelector('[role="alert"]');
    expect(summary?.hasAttribute('hidden')).toBe(false);
    expect(text(summary)).toContain('Nothing you typed has been cleared.');
    expect(summary?.getAttribute('tabindex')).toBe('-1');
    expect(form?.querySelector('[name="mail"]')?.getAttribute('aria-invalid')).toBe('true');
    expect(form?.querySelector('[name="mail"]')?.getAttribute('value')).toBe('ade@example');
    expect(form?.querySelector('[name="city"]')?.getAttribute('value')).toBe('Inglewood');
    expect(text(form?.querySelector('#eq-member-name-error'))).toBe(
      'We still need your full name.',
    );
  });

  it('names the general inbox in the human fallback and the vendor foot once the settings hold it', async () => {
    const body = await renderToBody(WithSiteContact);
    const help = body.querySelector('section[data-kind="vendor"] .oy-form-help');
    expect(text(help)).toBe('Rather speak to a person? hello@example.org or call (000) 000-0000');
    expect(help?.querySelector('a[href="tel:0000000000"]')).not.toBeNull();
    expect(text(body.querySelector('section[data-kind="vendor"] .oy-form-foot'))).toContain(
      'Email them to hello@example.org',
    );
    const pending = (await renderToBody(Default)).querySelector('.oy-form-help .oy-pend');
    expect(text(pending)).toBe('Pending: the general inbox');
  });

  it('mounts closed by default with every section hidden', async () => {
    const body = await renderToBody(Closed);
    expect(body.querySelector('dialog#enquiry')?.hasAttribute('open')).toBe(false);
    expect(body.querySelectorAll('section.oy-enquiry:not([hidden])')).toHaveLength(0);
  });
});
