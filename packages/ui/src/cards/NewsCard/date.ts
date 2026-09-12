/** "2026-07-01" reads "July 2026"; anything else reads as no date. */
export function monthYear(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})/.exec(value);
  if (!match) return undefined;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
