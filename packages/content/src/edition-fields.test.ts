import { describe, expect, it } from 'vitest';
import { EVENT_KINDS, EVENT_LIST_TITLES, editionFieldShown } from './edition-fields';

describe('the edition form by kind (ADR 0042)', () => {
  it('shows each kind what its pages read', () => {
    expect(editionFieldShown('festival', 'cost')).toBe(true);
    expect(editionFieldShown('festival', 'vendorTerms')).toBe(true);
    expect(editionFieldShown('festival', 'doors')).toBe(false);
    expect(editionFieldShown('gala', 'doors')).toBe(true);
    expect(editionFieldShown('gala', 'ticketsUrl')).toBe(true);
    expect(editionFieldShown('gala', 'cost')).toBe(false);
    expect(editionFieldShown('gala', 'attendance')).toBe(false);
    expect(editionFieldShown('gala', 'vendorsHosted')).toBe(false);
  });

  it('asks a Collective event for no year, schedule or venue line', () => {
    for (const field of ['edition', 'album', 'schedule', 'venue.line', 'cost'] as const) {
      expect(editionFieldShown('collective', field), field).toBe(false);
    }
  });

  it('shows everything to an event with no kind yet, or a kind no longer listed', () => {
    for (const kind of [undefined, 'other']) {
      expect(editionFieldShown(kind, 'doors')).toBe(true);
      expect(editionFieldShown(kind, 'vendorTerms')).toBe(true);
    }
  });

  it('lists the three kinds, Other retired, each with its Events list', () => {
    expect(EVENT_KINDS).toEqual(['festival', 'gala', 'collective']);
    expect(Object.keys(EVENT_LIST_TITLES)).toEqual([...EVENT_KINDS]);
  });
});
