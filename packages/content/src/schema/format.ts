import { SITE_TIME_ZONE } from '../time-zone';

/** Date inputs read like the site: "Sep 26, 2026". */
export const US_DATE = { dateFormat: 'MMM D, YYYY' } as const;

/**
 * Times read in Los Angeles, the organization's zone, whoever opens the Studio. The date is numeric:
 * Sanity writes a month name in the browser's own zone even with `displayTimeZone` set.
 */
export const LA_DATETIME = {
  dateFormat: 'MM/DD/YYYY',
  timeFormat: 'h:mm A',
  displayTimeZone: SITE_TIME_ZONE,
  allowTimeZoneSwitch: false,
} as const;

const US_DAY = new Intl.DateTimeFormat('en-US', {
  timeZone: SITE_TIME_ZONE,
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const US_CALENDAR = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/** An instant (a datetime) as its Los Angeles day: "Jun 13, 2027". Empty for no value. */
export function instantDate(value: string | undefined | null): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : US_DAY.format(date);
}

/** A calendar date (`2026-09-26`) as written, never shifted by a time zone: "Sep 26, 2026". */
export function calendarDate(value: string | undefined | null): string {
  const match = value ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
  if (!match) return '';
  const [year, month, day] = match.slice(1).map(Number) as [number, number, number];
  const date = new Date(Date.UTC(year, month - 1, day));
  // Date.UTC rolls an impossible day over ("2026-02-30" into March); that is no date at all.
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return '';
  return US_CALENDAR.format(date);
}
