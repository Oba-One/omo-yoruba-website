import { describe, expect, it } from 'vitest';
import {
  calendarKind,
  collectiveEvents,
  leadEvent,
  leadKindOf,
  pageEdition,
  pastEdition,
} from './lead-event';

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

  it('picks the kind the season names, the nearest edition, as the event page does', () => {
    expect(leadEvent(seeded, { season: 'odunde', now: september })).toBe(odunde2027);
    const dated = [
      { ...odunde2027, start: '2027-06-12T17:00:00Z' },
      { ...odunde2027, _id: 'odunde-2028', edition: 2028, start: '2028-06-10T17:00:00Z' },
    ];
    expect(leadEvent(dated, { season: 'odunde', now: september })?._id).toBe('odunde-2027');
    // Two undated galas still to come: the band and /gala both lead with the nearer one.
    const gala2027 = { _id: 'gala-2027', kind: 'gala', edition: 2027 };
    expect(leadEvent([gala2027, gala2026], { season: 'gala', now: september })).toBe(gala2026);
    expect(pageEdition([gala2027, gala2026], 'gala', { now: september })).toBe(gala2026);
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

  it('keeps an undated gala ahead for its whole year, and an undated festival until June ends', () => {
    const gala2027 = { _id: 'gala-2027', kind: 'gala', edition: 2027 };
    expect(pageEdition([gala2027, gala2026], 'gala', { now: february })).toBe(gala2027);
    expect(pageEdition([gala2027], 'gala', { now: new Date('2027-12-31T20:00:00Z') })).toBe(
      gala2027,
    );
    expect(pastEdition([{ ...gala2027, album: {} }], 'gala', { now: february })).toBeUndefined();
    // The calendar is read in Los Angeles: 30 June at 8pm there is still June for Odunde 2027.
    expect(pageEdition([odunde2027], 'festival', { now: new Date('2027-07-01T03:00:00Z') })).toBe(
      odunde2027,
    );
    expect(
      pageEdition([odunde2027], 'festival', { now: new Date('2027-07-01T08:00:00Z') }),
    ).toBeUndefined();
  });

  it('keeps an edition with no end until the end of its start day in Los Angeles', () => {
    // Gala night: doors at 6pm PST, no end entered.
    const galaNight = { ...gala2026, start: '2026-12-06T02:00:00Z' };
    expect(pageEdition([galaNight], 'gala', { now: new Date('2026-12-06T03:30:00Z') })).toBe(
      galaNight,
    );
    expect(pageEdition([galaNight], 'gala', { now: new Date('2026-12-06T07:59:00Z') })).toBe(
      galaNight,
    );
    expect(
      pageEdition([galaNight], 'gala', { now: new Date('2026-12-06T08:00:00Z') }),
    ).toBeUndefined();
    // Festival day in June (PDT): over at Los Angeles midnight, 07:00 UTC.
    const festivalDay = { ...odunde2027, start: '2027-06-12T18:00:00Z' };
    expect(pageEdition([festivalDay], 'festival', { now: new Date('2027-06-13T06:59:00Z') })).toBe(
      festivalDay,
    );
    expect(
      pageEdition([festivalDay], 'festival', { now: new Date('2027-06-13T07:00:00Z') }),
    ).toBeUndefined();
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

describe('collectiveEvents', () => {
  // Test values only: the Studio holds no collective event yet. A morning in October 2026 (PDT, UTC-7).
  const walk = { _id: 'walk', kind: 'collective', start: '2026-10-17T17:00:00Z' };
  const workshop = {
    _id: 'workshop',
    kind: 'collective',
    start: '2026-10-03T20:00:00Z',
    end: '2026-10-03T23:00:00Z',
  };
  const undated = { _id: 'undated', kind: 'collective', start: null };
  const gala = { _id: 'gala', kind: 'gala', start: '2026-10-10T02:00:00Z' };

  it('lists every dated collective event still to come, nearest first, never another kind', () => {
    const now = new Date('2026-09-13T12:00:00Z');
    expect(collectiveEvents([walk, undated, gala, workshop], { now })).toEqual([workshop, walk]);
  });

  it('never lists an event without a start', () => {
    expect(collectiveEvents([undated], { now: new Date('2026-01-01T00:00:00Z') })).toEqual([]);
  });

  it('keeps an event with an end until it ends', () => {
    expect(collectiveEvents([workshop], { now: new Date('2026-10-03T22:59:00Z') })).toEqual([
      workshop,
    ]);
    expect(collectiveEvents([workshop], { now: new Date('2026-10-03T23:00:01Z') })).toEqual([]);
  });

  it('keeps an event without an end until its start day ends in Los Angeles', () => {
    // After the walk has begun, the same Los Angeles day: still listed.
    expect(collectiveEvents([walk], { now: new Date('2026-10-18T06:59:00Z') })).toEqual([walk]);
    // Los Angeles midnight (07:00 UTC in October): gone.
    expect(collectiveEvents([walk], { now: new Date('2026-10-18T07:00:00Z') })).toEqual([]);
  });
});
