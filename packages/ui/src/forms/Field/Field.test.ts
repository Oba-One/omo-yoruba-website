import { composeStories } from '@storybook-astro/framework/testing';
import { describe, expect, it } from 'vitest';
import { renderToBody, text } from '../../test/stories';
import * as stories from './Field.stories';

const { Default, Email, Select, Area, WithHint, WithError, Filled } = composeStories(stories);

describe('Field', () => {
  it('ties the visible label to the control and marks a required field in words', async () => {
    const body = await renderToBody(Default);
    const label = body.querySelector('label');
    const input = body.querySelector('input');
    expect(label?.getAttribute('for')).toBe('field-name');
    expect(input?.id).toBe('field-name');
    expect(input?.getAttribute('name')).toBe('name');
    expect(input?.getAttribute('aria-required')).toBe('true');
    expect(input?.hasAttribute('required')).toBe(false);
    expect(input?.getAttribute('data-req')).toBe('your full name');
    expect(text(label)).toBe('Full name');
  });

  it('renders an email input the script can recognise', async () => {
    const input = (await renderToBody(Email)).querySelector('input');
    expect(input?.getAttribute('type')).toBe('email');
    expect(input?.getAttribute('data-email')).toBe('true');
  });

  it('renders every option of a select with the first one selected', async () => {
    const body = await renderToBody(Select);
    const options = Array.from(body.querySelectorAll('option'));
    expect(options.map((o) => o.value)).toEqual([
      'Odunde Festival',
      'End-of-Year Gala',
      'Both events',
      'Yoruba Cultural Collective',
      'Programs',
      'General, tell me more',
    ]);
    expect(options[0]?.hasAttribute('selected')).toBe(true);
    expect(body.querySelector('.oy-field--wide')).not.toBeNull();
  });

  it('renders an area as a wide textarea', async () => {
    const body = await renderToBody(Area);
    expect(body.querySelector('textarea.oy-input')).not.toBeNull();
    expect(body.querySelector('.oy-field--wide')).not.toBeNull();
  });

  it('reads the hint out with the control', async () => {
    const body = await renderToBody(WithHint);
    const control = body.querySelector('textarea');
    const hint = body.querySelector('.oy-field-hint');
    expect(hint?.id).toBe('field-notes-hint');
    expect(control?.getAttribute('aria-describedby')).toBe('field-notes-hint');
  });

  it('keeps the typed value and names the error sentence beside the control', async () => {
    const body = await renderToBody(WithError);
    const input = body.querySelector('input');
    const error = body.querySelector('.oy-field-error');
    expect(input?.getAttribute('value')).toBe('ade@example');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-describedby')).toBe('field-mail-error-error');
    expect(error?.hasAttribute('hidden')).toBe(false);
    expect(text(error)).toBe('That email address does not look right. Check it and send again.');
    expect(body.querySelector('.oy-field--error')).not.toBeNull();
  });

  it('hides the empty error paragraph and leaves aria-invalid off', async () => {
    const body = await renderToBody(Filled);
    expect(body.querySelector('.oy-field-error')?.hasAttribute('hidden')).toBe(true);
    expect(body.querySelector('input')?.hasAttribute('aria-invalid')).toBe(false);
    expect(body.querySelector('input')?.getAttribute('value')).toBe('Ọjà Balógun Textiles');
  });
});
