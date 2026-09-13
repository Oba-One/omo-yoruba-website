import { describe, expect, it } from 'vitest';
import { editionHours, longDate, shortDate } from './edition-dates';

// 12 June 2027, 11am to 7pm in Los Angeles (UTC-7 in June).
const start = '2027-06-12T18:00:00.000Z';
const end = '2027-06-13T02:00:00.000Z';

describe('edition dates', () => {
  it('writes the date in words in Los Angeles time, long and short', () => {
    expect(longDate(start)).toBe('Saturday 12 June 2027');
    expect(shortDate(start)).toBe('Sat 12 June 2027');
    // Late evening in Los Angeles is already the next day in UTC.
    expect(longDate('2026-12-06T04:30:00.000Z')).toBe('Saturday 5 December 2026');
  });

  it('writes the hours as the prototypes do, minutes only when they are not on the hour', () => {
    expect(editionHours(start, end)).toBe('11am to 7pm');
    expect(editionHours('2026-12-06T02:00:00.000Z', '2026-12-06T08:00:00.000Z')).toBe(
      '6pm to 12am',
    );
    expect(editionHours('2027-06-12T18:30:00.000Z', null)).toBe('From 11:30am');
  });

  it('answers undefined for a missing or unreadable value', () => {
    expect(longDate(null)).toBeUndefined();
    expect(shortDate('')).toBeUndefined();
    expect(longDate('not a date')).toBeUndefined();
    expect(editionHours(null, end)).toBeUndefined();
  });
});
