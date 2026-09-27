import { describe, expect, it } from 'vitest';
import { calendarDate, instantDate, LA_DATETIME, US_DATE } from './format';

describe('dates in the Studio read like the site (ADR 0042)', () => {
  it('shows an instant as its Los Angeles day', () => {
    expect(instantDate('2027-06-13T19:00:00Z')).toBe('Jun 13, 2027');
    // 10pm on 13 June in Los Angeles is already 14 June in UTC.
    expect(instantDate('2027-06-14T05:00:00Z')).toBe('Jun 13, 2027');
  });

  it('shows a calendar date as written, never shifted', () => {
    expect(calendarDate('2026-09-26')).toBe('Sep 26, 2026');
    expect(calendarDate('2026-01-01')).toBe('Jan 1, 2026');
  });

  it('answers nothing for no value or a malformed one', () => {
    expect(instantDate(undefined)).toBe('');
    expect(instantDate('not a date')).toBe('');
    expect(calendarDate(null)).toBe('');
    expect(calendarDate('26/09/2026')).toBe('');
    expect(calendarDate('2026-02-30')).toBe('');
    expect(calendarDate('2026-13-01')).toBe('');
  });

  it('formats inputs the US way, times in Los Angeles', () => {
    expect(US_DATE.dateFormat).toBe('MMM D, YYYY');
    expect(LA_DATETIME).toMatchObject({
      timeFormat: 'h:mm A',
      displayTimeZone: 'America/Los_Angeles',
      allowTimeZoneSwitch: false,
    });
    // A month name would be written in the browser's zone, not Los Angeles.
    expect(LA_DATETIME.dateFormat).not.toMatch(/MMM/);
  });
});
