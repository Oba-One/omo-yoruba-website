import { evaluate, parse } from 'groq-js';
import { describe, expect, it } from 'vitest';
import { ENQUIRY_STATUS_FILTER, enquiryStatus } from './enquiry-workflow';

describe('enquiry status', () => {
  it.each([
    [{}, 'new'],
    [{ handled: false }, 'new'],
    [{ handled: true }, 'handled'],
    [{ status: 'in-progress', handled: true }, 'in-progress'],
    [{ status: 'new', handled: true }, 'new'],
    [{ status: 'handled' }, 'handled'],
  ] as const)('keeps old and new records in the same workflow: %j', async (document, expected) => {
    expect(enquiryStatus(document)).toBe(expected);
    const result = await evaluate(parse(ENQUIRY_STATUS_FILTER), { root: document });
    expect(await result.get()).toBe(expected);
  });
});
