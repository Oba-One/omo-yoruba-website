import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './ContactBlock.stories';

const { Default, PhoneMissing, EmailMissing, AddressMissing, Pending, OnTint } =
  composeStories(stories);

const facts = async (story: Parameters<typeof renderToBody>[0]) => {
  const block = (await renderToBody(story)).querySelector('.oy-contact');
  const rows = [...(block?.querySelectorAll('.oy-fact') ?? [])];
  return {
    block,
    rows,
    byLabel: (label: string) => rows.find((row) => text(row.querySelector('dt')) === label),
  };
};

describe('ContactBlock', () => {
  it('links the email and the phone, sets the address on one line, and opens the contact form', async () => {
    const { block, rows, byLabel } = await facts(Default);
    expect(rows.map((row) => text(row.querySelector('dt')))).toEqual([
      'Email',
      'Phone',
      'Mailing address',
    ]);
    expect(byLabel('Email')?.querySelector('a')?.getAttribute('href')).toBe(
      'mailto:[ inbox@example.org ]',
    );
    expect(byLabel('Phone')?.querySelector('a')?.getAttribute('href')).toBe('tel:0000000000');
    expect(text(byLabel('Mailing address')?.querySelector('dd'))).toBe(
      '[ Street and suite ], [ City, state and ZIP ]',
    );
    const trigger = block?.querySelector('a[data-enquiry="contact"]');
    expect(text(trigger)).toContain('Send a message');
    expect(trigger?.classList.contains('oy-btn--secondary')).toBe(true);
  });

  it('names each value the settings owe with the registry wording', async () => {
    expect(text((await facts(PhoneMissing)).byLabel('Phone')?.querySelector('.oy-pend'))).toBe(
      'Pending: phone number',
    );
    expect(text((await facts(EmailMissing)).byLabel('Email')?.querySelector('.oy-pend'))).toBe(
      'Pending: the general inbox',
    );
    expect(
      text((await facts(AddressMissing)).byLabel('Mailing address')?.querySelector('.oy-pend')),
    ).toBe('Pending: mailing address');
  });

  it('keeps all three facts as chips with nothing in the settings, and the button still opens the form', async () => {
    const { block, rows } = await facts(Pending);
    expect(rows.map((row) => text(row.querySelector('.oy-pend')))).toEqual([
      'Pending: the general inbox',
      'Pending: phone number',
      'Pending: mailing address',
    ]);
    expect(block?.querySelectorAll('.oy-fact a')).toHaveLength(0);
    expect(block?.querySelector('a[data-enquiry="contact"]')).toBeInstanceOf(HTMLElement);
  });

  it('takes the quiet button on a tinted ground', async () => {
    const body = await renderToBody(OnTint);
    expect(body.querySelector('.oy-section--alt .oy-contact')).toBeInstanceOf(HTMLElement);
    expect(
      body.querySelector('a[data-enquiry="contact"]')?.classList.contains('oy-btn--quiet'),
    ).toBe(true);
  });
});
