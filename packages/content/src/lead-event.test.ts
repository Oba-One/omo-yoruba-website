import { describe, expect, it } from 'vitest';
import { calendarKind, leadEvent } from './lead-event';

const odunde2026 = { _id: 'odunde-2026', kind: 'festival', edition: 2026 };
const odunde2027 = { _id: 'odunde-2027', kind: 'festival', edition: 2027 };
const gala2025 = { _id: 'gala-2025', kind: 'gala', edition: 2025 };
const gala2026 = { _id: 'gala-2026', kind: 'gala', edition: 2026 };
const seeded = [odunde2027, gala2026, odunde2026, gala2025];
const september = new Date('2026-09-12T12:00:00Z');
const february = new Date('2027-02-01T12:00:00Z');

describe('leadEvent', () => {
  it('lets an explicit reference win over everything', () => {
    expect(leadEvent(seeded, { season: 'odunde', explicit: gala2025, now: september })).toBe(
      gala2025,
    );
  });

  it('follows the calendar when nothing is dated: the Gala after June, the festival before', () => {
    expect(leadEvent(seeded, { season: 'auto', now: september })).toBe(gala2026);
    expect(leadEvent(seeded, { season: 'auto', now: february })).toBe(odunde2027);
    expect(calendarKind(september)).toBe('gala');
    expect(calendarKind(february)).toBe('festival');
  });

  it('never lets a past edition lead, dated or undated', () => {
    const datedPast = { ...gala2026, start: '2026-08-01T02:00:00Z' };
    expect(leadEvent([datedPast, odunde2027], { season: 'gala', now: september })).toBe(odunde2027);
    expect(leadEvent([odunde2026, gala2025], { season: 'auto', now: september })).toBeUndefined();
  });

  it('picks the kind the season names, by its nearest date or its newest edition', () => {
    expect(leadEvent(seeded, { season: 'odunde', now: september })).toBe(odunde2027);
    const dated = [
      { ...odunde2027, start: '2027-06-12T17:00:00Z' },
      { ...odunde2027, _id: 'odunde-2028', edition: 2028, start: '2028-06-10T17:00:00Z' },
    ];
    expect(leadEvent(dated, { season: 'odunde', now: september })?._id).toBe('odunde-2027');
  });

  it('picks the nearest dated edition of either kind for auto', () => {
    const dated = [
      { ...gala2026, start: '2026-12-05T02:00:00Z' },
      { ...odunde2027, start: '2027-06-12T17:00:00Z' },
    ];
    expect(leadEvent(dated, { season: 'auto', now: september })?._id).toBe('gala-2026');
    expect(leadEvent(dated, { season: 'auto', now: new Date('2026-12-20T00:00:00Z') })?._id).toBe(
      'odunde-2027',
    );
  });

  it('treats an empty or unknown season as auto and ignores other kinds', () => {
    const collective = { _id: 'c', kind: 'collective', edition: 2027, start: '2026-10-01' };
    expect(leadEvent([collective, ...seeded], { season: null, now: september })).toBe(gala2026);
    expect(leadEvent([], { now: september })).toBeUndefined();
  });
});
