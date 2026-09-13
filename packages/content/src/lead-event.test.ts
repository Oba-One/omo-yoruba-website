import { describe, expect, it } from 'vitest';
import { calendarKind, leadEvent, leadKindOf, pageEdition, pastEdition } from './lead-event';

const odunde2026 = { _id: 'odunde-2026', kind: 'festival', edition: 2026 };
const odunde2027 = { _id: 'odunde-2027', kind: 'festival', edition: 2027 };
const gala2025 = { _id: 'gala-2025', kind: 'gala', edition: 2025 };
const gala2026 = { _id: 'gala-2026', kind: 'gala', edition: 2026 };
const seeded = [odunde2027, gala2026, odunde2026, gala2025];
const september = new Date('2026-09-12T12:00:00Z');
const february = new Date('2027-02-01T12:00:00Z');

describe('leadEvent', () => {
  it('lets an explicit reference win while it is still to come', () => {
    expect(leadEvent(seeded, { season: 'odunde', explicit: gala2026, now: september })).toBe(
      gala2026,
    );
    // A stale reference to a past edition falls through to the season rule.
    expect(leadEvent(seeded, { season: 'odunde', explicit: gala2025, now: september })).toBe(
      odunde2027,
    );
    expect(leadKindOf(gala2026)).toBe('gala');
    expect(leadKindOf(odunde2027)).toBe('festival');
    expect(leadKindOf(undefined)).toBe('gala');
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

describe('pageEdition', () => {
  it('shows the next edition of the page kind, never a past one', () => {
    expect(pageEdition(seeded, 'festival', { now: september })).toBe(odunde2027);
    expect(pageEdition(seeded, 'gala', { now: september })).toBe(gala2026);
    // Gala 2026 is over once 2027 begins and no later gala exists yet: the page shows Pending.
    expect(pageEdition(seeded, 'gala', { now: february })).toBeUndefined();
    expect(pageEdition([], 'festival', { now: september })).toBeUndefined();
  });

  it('picks the nearest of several editions to come, dated or not', () => {
    const odunde2028 = { _id: 'odunde-2028', kind: 'festival', edition: 2028 };
    expect(pageEdition([odunde2028, odunde2027], 'festival', { now: september })).toBe(odunde2027);
    const dated2028 = { ...odunde2028, start: '2028-06-10T17:00:00Z' };
    expect(pageEdition([dated2028, odunde2027], 'festival', { now: september })).toBe(odunde2027);
    const dated2027 = { ...odunde2027, start: '2027-06-12T17:00:00Z' };
    expect(pageEdition([odunde2028, dated2027], 'festival', { now: september })).toBe(dated2027);
  });

  it('keeps an edition under way until it ends, and ignores other kinds', () => {
    const today = {
      ...odunde2027,
      start: '2027-06-12T18:00:00Z',
      end: '2027-06-13T02:00:00Z',
    };
    expect(pageEdition([today], 'festival', { now: new Date('2027-06-12T22:00:00Z') })).toBe(today);
    expect(
      pageEdition([today], 'festival', { now: new Date('2027-06-13T03:00:00Z') }),
    ).toBeUndefined();
    expect(pageEdition(seeded, 'gala', { now: september })?.kind).toBe('gala');
  });
});

describe('pastEdition', () => {
  const withAlbum = <T extends object>(event: T) => ({ ...event, album: { _id: 'album' } });

  it('is the newest past edition of the kind that has an album', () => {
    const events = [odunde2027, withAlbum(odunde2026), gala2026, withAlbum(gala2025)];
    expect(pastEdition(events, 'festival', { now: september })?._id).toBe('odunde-2026');
    expect(pastEdition(events, 'gala', { now: september })?._id).toBe('gala-2025');
  });

  it('skips a past edition without an album and never counts one still to come', () => {
    const odunde2025 = withAlbum({ _id: 'odunde-2025', kind: 'festival', edition: 2025 });
    expect(pastEdition([odunde2026, odunde2025], 'festival', { now: september })?._id).toBe(
      'odunde-2025',
    );
    expect(pastEdition([withAlbum(odunde2027)], 'festival', { now: september })).toBeUndefined();
    expect(pastEdition([withAlbum(gala2026)], 'gala', { now: september })).toBeUndefined();
  });

  it('orders past editions by date where they have one, else by year', () => {
    const a = withAlbum({
      _id: 'a',
      kind: 'festival',
      edition: 2024,
      start: '2024-06-08T17:00:00Z',
    });
    const b = withAlbum({ _id: 'b', kind: 'festival', edition: 2025 });
    expect(pastEdition([a, b], 'festival', { now: september })?._id).toBe('b');
  });
});
