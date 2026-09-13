import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './EnquiryCard.stories';

const { Default, Secondary, WithNext, WithEmail, EmailPending } = composeStories(stories);

describe('EnquiryCard', () => {
  it('explains the vendor form from the spec and opens it through a link trigger', async () => {
    const body = await renderToBody(Default);
    expect(text(body.querySelector('h3'))).toBe('Apply for a booth at Ọjà Balógun');
    expect(text(body.querySelector('.oy-card-body > p'))).toContain('The market at Odunde.');
    expect(text(body.querySelector('.oy-enquiry-card-meta'))).toBe('9 questions');
    const trigger = body.querySelector('a.oy-btn');
    expect(trigger?.getAttribute('href')).toBe('?enquiry=vendor#enquiry');
    expect(trigger?.getAttribute('data-enquiry')).toBe('vendor');
    expect(text(trigger)).toContain('Send application');
    expect(trigger?.querySelector('.oy-btn-arrow')).not.toBeNull();
    expect(trigger?.className.split(' ')).toContain('oy-btn--primary');
  });

  it('takes the outline variant for the cards after the one gold action', async () => {
    const trigger = (await renderToBody(Secondary)).querySelector('a.oy-btn');
    expect(trigger?.className.split(' ')).toContain('oy-btn--secondary');
    expect(text(trigger)).toContain('Raise your hand');
  });

  it('adds what happens next only when the page supplies it', async () => {
    const body = await renderToBody(WithNext);
    expect(text(body.querySelector('.oy-enquiry-card-meta'))).toBe(
      '8 questions • Dues are agreed with our membership lead',
    );
  });

  it("offers the page's own address beside the trigger, or the registry's chip while it is owed", async () => {
    const body = await renderToBody(WithEmail);
    expect(text(body.querySelector('a.oy-btn'))).toContain('Write to the teacher');
    const line = body.querySelector('.oy-enquiry-card-action p.oy-enquiry-card-email');
    expect(text(line)).toBe('Or email [ teacher@example.org ]');
    expect(line?.querySelector('a')?.getAttribute('href')).toBe('mailto:[ teacher@example.org ]');
    const pending = (await renderToBody(EmailPending)).querySelector('.oy-enquiry-card-email');
    expect(text(pending)).toBe("Or email Pending: the teacher's email");
    expect(pending?.querySelector('a')).toBeNull();
    expect((await renderToBody(Default)).querySelector('.oy-enquiry-card-email')).toBeNull();
  });
});
