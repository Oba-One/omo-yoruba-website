import { describe, expect, it } from 'vitest';
import { ENQUIRY_ACTIONS, formActionPath, NEWSLETTER_ACTION } from './action-paths';

describe('action paths', () => {
  it('posts a form to the page with the action query parameter', () => {
    expect(formActionPath('newsletter')).toBe('?_action=newsletter');
    expect(NEWSLETTER_ACTION).toBe('?_action=newsletter');
    expect(ENQUIRY_ACTIONS.vendor).toBe('?_action=enquiry.vendor');
    expect(Object.keys(ENQUIRY_ACTIONS)).toHaveLength(8);
  });
});
