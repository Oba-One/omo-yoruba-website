/**
 * An edition's date and hours in words, in Los Angeles time, as the event prototypes write them:
 * "Saturday 12 June 2027" in a header line, "Sat 12 June 2027" in a glance strip, "11am to 7pm" for
 * the hours. A missing or unreadable value answers undefined, and the component shows the
 * registry's Pending chip instead.
 */
const ZONE = 'America/Los_Angeles';

function dateOf(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function inWords(value: string | null | undefined, weekday: 'long' | 'short') {
  const date = dateOf(value);
  if (!date) return undefined;
  return new Intl.DateTimeFormat('en-GB', {
    weekday,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: ZONE,
  })
    .format(date)
    .replace(/,/g, '');
}

/** "Saturday 12 June 2027". */
export const longDate = (value: string | null | undefined) => inWords(value, 'long');

/** "Sat 12 June 2027". */
export const shortDate = (value: string | null | undefined) => inWords(value, 'short');

function clock(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: ZONE,
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  const minute = get('minute');
  return `${get('hour')}${minute === '00' ? '' : `:${minute}`}${get('dayPeriod').toLowerCase()}`;
}

/** "11am to 7pm", or "From 11am" without an end. */
export function editionHours(
  start: string | null | undefined,
  end: string | null | undefined,
): string | undefined {
  const from = dateOf(start);
  if (!from) return undefined;
  const to = dateOf(end);
  return to ? `${clock(from)} to ${clock(to)}` : `From ${clock(from)}`;
}
