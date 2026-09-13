import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './ContactBlock.stories';

const {
  Default,
  PhoneMissing,
  EmailMissing,
  AddressMissing,
  Pending,
  OnTint,
  GetInvolved,
  OurStory,
  ContactPending,
  ActionsOnly,
  FactsOnly,
} = composeStories(stories);

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

  it('lists who answers and how soon, calls the phone and opens the form, as Get Involved sets it', async () => {
    const { block, rows, byLabel } = await facts(GetInvolved);
    expect(rows.map((row) => text(row.querySelector('dt')))).toEqual([
      'Email',
      'Phone',
      'Who answers',
      'Response time',
    ]);
    expect(text(byLabel('Who answers')?.querySelector('dd'))).toBe('[ Name ]');
    // The response line completes a sentence elsewhere, so it takes a capital as a fact.
    expect(text(byLabel('Response time')?.querySelector('dd'))).toBe(
      'Within [ how many ] working days',
    );
    const call = block?.querySelector('.oy-contact-actions a[href^="tel:"]');
    expect(text(call)).toBe('Call [ (000) 000-0000 ]');
    expect(call?.classList.contains('oy-btn--secondary')).toBe(true);
    expect(
      block?.querySelector('a[data-enquiry="contact"]')?.classList.contains('oy-btn--quiet'),
    ).toBe(true);
  });

  it('lists the address and who receives the message with no button, as Our Story sets it beside its form', async () => {
    const { block, rows, byLabel } = await facts(OurStory);
    expect(rows.map((row) => text(row.querySelector('dt')))).toEqual([
      'Email',
      'Phone',
      'Mailing address',
      'Who receives this',
    ]);
    expect(text(byLabel('Who receives this')?.querySelector('dd'))).toBe('[ Name ]');
    expect(block?.querySelector('.oy-contact-actions')).toBeNull();
  });

  it("asks for the routing contact's name and reply time, and draws no Call button without a phone", async () => {
    const { block, byLabel } = await facts(ContactPending);
    expect(text(byLabel('Who answers')?.querySelector('.oy-pend'))).toBe(
      'Pending: who answers the general inbox',
    );
    expect(text(byLabel('Response time')?.querySelector('.oy-pend'))).toBe(
      'Pending: how soon the general inbox replies',
    );
    expect(block?.querySelector('a[href^="tel:"]')).toBeNull();
    expect(block?.querySelector('a[data-enquiry="contact"]')).toBeInstanceOf(HTMLElement);
  });

  it('draws the actions or the facts alone', async () => {
    const actions = (await renderToBody(ActionsOnly)).querySelector('.oy-contact');
    expect(actions?.querySelector('.oy-facts')).toBeNull();
    expect(actions?.querySelectorAll('.oy-contact-actions .oy-btn')).toHaveLength(2);
    const only = (await renderToBody(FactsOnly)).querySelector('.oy-contact');
    expect(only?.querySelectorAll('.oy-fact')).toHaveLength(2);
    expect(only?.querySelector('.oy-contact-actions')).toBeNull();
  });
});
