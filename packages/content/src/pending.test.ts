import { describe, expect, it } from 'vitest';
import {
  PENDING,
  type PendingEntry,
  PRESENCE,
  pendingFilter,
  pendingTitle,
  pendingWhat,
  presenceCountQuery,
  presenceWhat,
} from './pending';
import { schemaTypes } from './schema';

interface FieldDef {
  name: string;
  type: string;
  fields?: FieldDef[];
  of?: { type: string; fields?: FieldDef[] }[];
}
interface TypeDef {
  name: string;
  type: string;
  fields?: FieldDef[];
}

const types = schemaTypes as unknown as TypeDef[];
const typeByName = (name: string) => types.find((t) => t.name === name);

/** Walks a dotted path through inline objects, named object types and arrays (`x[]`). */
function hasPath(typeName: string, path: string): boolean {
  let fields = typeByName(typeName)?.fields;
  const steps = path.split('.');
  for (const [index, rawStep] of steps.entries()) {
    const isArray = rawStep.endsWith('[]');
    const step = isArray ? rawStep.slice(0, -2) : rawStep;
    const field = fields?.find((f) => f.name === step);
    if (!field) return false;
    if (isArray && field.type !== 'array') return false;
    if (index === steps.length - 1) return true;
    const next = isArray ? field.of?.[0] : field;
    if (!next) return false;
    fields = next.fields ?? typeByName(next.type)?.fields;
    if (!fields && typeByName(next.type)?.type === 'object') fields = typeByName(next.type)?.fields;
  }
  return true;
}

describe('PENDING', () => {
  it('names only document types the schema has, and only their fields', () => {
    for (const entry of PENDING) {
      const type = typeByName(entry.type);
      expect(type?.type, entry.type).toBe('document');
      for (const field of entry.fields ?? []) {
        expect(hasPath(entry.type, field), `${entry.type}.${field}`).toBe(true);
      }
      if (!entry.fields) expect(entry.condition, `${entry.type}: ${entry.what}`).toBeTruthy();
    }
  });

  it('has one row per what, worded for the chip', () => {
    const keys = PENDING.map((e) => `${e.type}:${e.where}:${e.what}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const entry of PENDING) {
      expect(entry.what).toMatch(/^[a-z0-9]/i);
      expect(entry.what.endsWith('.')).toBe(false);
    }
  });

  it('covers the register rows that map to seeded documents', () => {
    const covered = (type: string, field: string) =>
      PENDING.some((e) => e.type === type && e.fields?.includes(field));
    expect(covered('siteSettings', 'ein')).toBe(true);
    expect(covered('siteSettings', 'address')).toBe(true);
    expect(
      PENDING.some(
        (e) => e.type === 'siteSettings' && e.condition?.includes('contacts[!defined(email)'),
      ),
    ).toBe(true);
    expect(covered('event', 'start')).toBe(true);
    expect(covered('event', 'schedule[]')).toBe(true);
    expect(covered('zone', 'line')).toBe(true);
    expect(covered('stat', 'source')).toBe(true);
    expect(covered('collectivePage', 'argument')).toBe(true);
    expect(covered('storyPage', 'founding')).toBe(true);
    expect(covered('galleryPage', 'creditsAndConsent')).toBe(true);
    expect(
      PENDING.some((e) => e.type === 'album' && e.condition?.includes('creditConfirmed')),
    ).toBe(true);
  });
});

describe('PRESENCE', () => {
  it('lists the types the register says do not exist yet, with a minimum each', () => {
    const byType = Object.fromEntries(PRESENCE.map((e) => [e.type, e.minimum]));
    for (const type of [
      'person',
      'testimonial',
      'partner',
      'ticketTier',
      'sponsorLevel',
      'honoree',
      'givingLevel',
      'hometownAssociation',
      'timelineEntry',
      'governanceDoc',
      'outcome',
      'zone',
    ]) {
      expect(typeByName(type)?.type, type).toBe('document');
      expect(byType[type], type).toBeGreaterThanOrEqual(1);
    }
    expect(byType.zone).toBe(4);
    expect(byType.hometownAssociation).toBe(9);
  });
});

describe('pendingFilter', () => {
  it('builds a defined check per field, an emptiness check per array, and honours a narrowing filter', () => {
    const plain: PendingEntry = {
      type: 'siteSettings',
      fields: ['ein'],
      where: 'Everywhere',
      what: 'EIN',
    };
    expect(pendingFilter(plain)).toBe('_type == "siteSettings" && (!defined(ein))');
    const arrays: PendingEntry = {
      type: 'event',
      fields: ['start', 'schedule[]'],
      filter: 'kind == "festival"',
      where: 'Odunde',
      what: 'the day',
    };
    expect(pendingFilter(arrays)).toBe(
      '_type == "event" && kind == "festival" && (!defined(start) || !defined(schedule) || count(schedule) == 0)',
    );
    const custom: PendingEntry = {
      type: 'album',
      condition: 'creditConfirmed != true',
      where: 'Gallery',
      what: 'credit',
    };
    expect(pendingFilter(custom)).toBe('_type == "album" && (creditConfirmed != true)');
  });
});

describe('presenceWhat', () => {
  it('answers the presence row wording and the count the page expects', () => {
    expect(presenceWhat('zone')).toEqual({ what: 'the unnamed zones', minimum: 4 });
    expect(presenceWhat('ticketTier')?.what).toBe('three prices and what each includes');
    expect(presenceWhat('event')).toBeUndefined();
  });
});

describe('pendingWhat and pendingTitle', () => {
  it('returns the chip wording for a field and the row title for the Studio', () => {
    expect(pendingWhat('siteSettings', 'ein')).toBe('EIN');
    expect(pendingWhat('siteSettings', 'nothing')).toBeUndefined();
    expect(pendingWhat('event', 'start', 'gala')).toBe('the date');
    expect(pendingWhat('event', 'start', 'festival')).toBe('the date');
    expect(pendingWhat('event', 'end', 'festival')).toBe('the hours');
    expect(pendingWhat('event', 'start')).toBe('the date');
    expect(pendingWhat('event', 'venue.name', 'gala')).toBe('the venue');
    expect(pendingWhat('event', 'venue.name', 'festival')).toBe('the venue');
    expect(pendingWhat('homepage', 'hero.image')).toBe('the hero photograph');
    expect(pendingWhat('festivalPage', 'planYourVisit[]')).toBe('the eight practical facts');
    expect(pendingWhat('festivalPage', 'planYourVisit')).toBe('a practical fact');
    expect(pendingWhat('festivalPage', 'extraFacts')).toBe('a glance fact');
    expect(pendingWhat('galaPage', 'extraFacts')).toBe('a glance fact');
    expect(
      pendingTitle({ type: 'siteSettings', fields: ['ein'], where: 'Everywhere', what: 'EIN' }),
    ).toBe('Everywhere: EIN');
  });
});

describe('presenceCountQuery', () => {
  it('counts the type, narrowed by the filter when there is one', () => {
    expect(presenceCountQuery({ type: 'zone', minimum: 4, where: 'Odunde', what: 'zones' })).toBe(
      'count(*[_type == "zone"])',
    );
    expect(
      presenceCountQuery({
        type: 'event',
        minimum: 1,
        filter: 'kind == "gala"',
        where: 'Gala',
        what: 'an edition',
      }),
    ).toBe('count(*[_type == "event" && kind == "gala"])');
  });
});
