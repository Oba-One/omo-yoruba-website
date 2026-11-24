import { describe, expect, it } from 'vitest';
import { EDITION_FIELDS, type EditionField, editionFieldShown } from './edition-fields';
import {
  ALBUM_CREDIT_PENDING,
  ALBUM_YEAR_PENDING,
  askedFor,
  COLLECTIVE_VOICE_SLOT,
  GENERAL_CONTACT_PENDING,
  GENERAL_RESPONDS_PENDING,
  GOVERNANCE_NOTE_PENDING,
  IMPACT_OUTCOME_SLOTS,
  IMPACT_SIX_PENDING,
  IMPACT_VOICE_SLOTS,
  OUTCOME_PENDING,
  PARKED,
  PARTNERSHIPS_RESPONDS_PENDING,
  PENDING,
  type PendingEntry,
  PHOTO_CREDIT_PENDING,
  PRESENCE,
  pendingFilter,
  pendingTitle,
  pendingWhat,
  presenceFilter,
  presenceTotal,
  presenceWhat,
  registerPresenceWhat,
  registerWhat,
  rowDocumentType,
  TEACHER_EMAIL_PENDING,
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
      const type = typeByName(rowDocumentType(entry));
      expect(type?.type, entry.type).toBe('document');
      // A list row names the page's list and the item's own fields (ADR 0042).
      if (entry.list) {
        const { page, field: list } = entry.list;
        expect(typeByName(entry.type)?.type, entry.type).toBe('object');
        // The page's list holds the row's item type, and each item holds the row's fields.
        const items = typeByName(page)?.fields?.find((candidate) => candidate.name === list);
        expect(items?.of?.[0]?.type, `${page}.${list}`).toBe(entry.type);
        for (const field of entry.fields ?? []) {
          expect(hasPath(page, `${list}[].${field}`), `${page}.${list}[].${field}`).toBe(true);
        }
      }
      for (const field of entry.fields ?? []) {
        expect(hasPath(entry.type, field), `${entry.type}.${field}`).toBe(true);
      }
      if (!entry.fields) expect(entry.condition, `${entry.type}: ${entry.what}`).toBeTruthy();
    }
  });

  it("asks a page whether any item of its own list owes a field, keeping the item's chip", () => {
    const status = PENDING.find(
      (entry) => entry.type === 'initiative' && entry.fields?.includes('status'),
    );
    if (!status) throw new Error('no initiative status row');
    expect(pendingFilter(status)).toBe(
      '_type == "collectivePage" && count(initiatives[!defined(status)]) > 0',
    );
    const source = PENDING.find(
      (entry) => entry.type === 'outcome' && entry.fields?.includes('figure.source'),
    );
    if (!source) throw new Error('no outcome source row');
    expect(pendingFilter(source)).toBe(
      '_type == "impactPage" && count(outcomes[defined(figure) && (!defined(figure.source))]) > 0',
    );
    expect(pendingWhat('initiative', 'status')).toBe('the status');
    expect(rowDocumentType(status)).toBe('collectivePage');
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
    expect(covered('storyPage', 'founding')).toBe(true);
    expect(covered('galleryPage', 'creditsAndConsent')).toBe(true);
    expect(
      PENDING.some(
        (e) =>
          e.type === 'album' &&
          e.what === ALBUM_CREDIT_PENDING &&
          e.condition?.includes('creditConfirmed'),
      ),
    ).toBe(true);
  });
});

describe('PARKED', () => {
  it('holds the rows the launch does not wait for, each with its wording kept (ADR 0058)', () => {
    expect(PARKED.rows.map((row) => `${row.where}: ${row.what}`)).toEqual([
      'Odunde, at a glance: the hours',
      'Odunde, vendor dialog: fees, deadline and permit rules',
      'Odunde, past years: the attendance figure',
      'Odunde, plan your visit: a practical fact',
      'Gala, at a glance: the dress code',
      'Sponsorship: the amount',
      'Sponsorship: what the level recognizes',
      'Programs, cards: the ages',
      'Lessons, at a glance: the ages lessons serve',
      "Lessons, teacher: the teacher's short bio",
      "Lessons, teacher: the teacher's email",
      'Lessons, what you learn: what the lessons teach, in her words',
      'Lessons, levels: what each level covers',
      'Lessons, levels: what the level covers',
      'Lessons, questions: the questions parents ask',
      'Lessons, questions: an answer',
      'Collective, the argument: why culture and sustainability sit together, in your words',
      'Collective, one voice: the quote and who said it',
      'Get Involved and Our Story, talk to someone: who answers the general inbox',
      'Impact, outcomes: participation figures per program',
      'Impact, Odunde as civic infrastructure: the number of vendors hosted',
      'Impact, governance: a file, or a note such as Copies on request',
      'Our Story, how it began: the earliest photograph you have: an early gathering, or the founders',
      'Our Story, board: a short bio',
    ]);
    expect(PARKED.presence.map((row) => `${row.where}: ${row.what}`)).toEqual([
      'Sponsorship: level names and amounts',
      'Impact, governance: the annual report position',
      'Impact, governance: the audit position',
      'Yoruba Cultural Collective: the next events',
    ]);
  });

  it('is asked for by neither list, so no chip and no To do row names a parked fact', () => {
    for (const row of PARKED.rows) expect(PENDING, row.what).not.toContain(row);
    for (const row of PARKED.presence) expect(PRESENCE, row.what).not.toContain(row);
    expect(pendingWhat('collectivePage', 'argument')).toBeUndefined();
    expect(pendingWhat('event', 'vendorTerms.fees', 'festival')).toBeUndefined();
    // What a page still owes beside a parked row keeps its chip.
    expect(pendingWhat('festivalPage', 'planYourVisit[]')).toBe('the eight practical facts');
    expect(pendingWhat('lessonsPage', 'oneLesson[]')).toBe('the shape of a lesson');
  });

  it('keeps a wording a story can read, asked or parked', () => {
    expect(registerWhat('lessonsPage', 'faq')).toBe('an answer');
    expect(registerWhat('event', 'attendance', 'festival')).toBe('the attendance figure');
    expect(registerWhat('event', 'attendance', 'gala')).toBeUndefined();
    expect(registerWhat('lessonsPage', 'learn')).toBe('what the lessons teach, in her words');
    expect(registerPresenceWhat('event', 'collective')).toEqual({
      what: 'the next events',
      minimum: 1,
    });
    expect(registerPresenceWhat('zone')).toEqual(presenceWhat('zone'));
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
      'honoree',
      'governanceDoc',
      'zone',
    ]) {
      expect(typeByName(type)?.type, type).toBe('document');
      expect(byType[type], type).toBeGreaterThanOrEqual(1);
    }
    expect(byType.zone).toBe(3);
  });

  it('never asks for what is optional: the association names are listed only if the owner adds them', () => {
    // The register calls prose only "the safe default" (ADR 0035), so no chip asks for nine names.
    expect(PRESENCE.some((row) => row.type === 'hometownAssociation')).toBe(false);
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

describe('presenceTotal', () => {
  it('pads the listed documents to the count the registry expects, and never trims', () => {
    expect(presenceTotal('zone', 0)).toBe(3);
    expect(presenceTotal('zone', 2)).toBe(3);
    expect(presenceTotal('zone', 5)).toBe(5);
    // A type the registry does not count draws what is listed.
    expect(presenceTotal('door', 2)).toBe(2);
  });
});

describe('presenceWhat', () => {
  it('answers the presence row wording and the count the page expects', () => {
    expect(presenceWhat('zone')).toEqual({ what: 'the unnamed zones', minimum: 3 });
    expect(presenceWhat('ticketTier')?.what).toBe('three prices and what each includes');
    expect(presenceWhat('album')?.what).toBe('the photo albums');
  });

  it("finds a row by kind as pendingWhat does, never answering one kind with another kind's row", () => {
    // The Collective's events are parked (ADR 0058), so no kind of event is counted.
    expect(presenceWhat('event', 'collective')).toBeUndefined();
    expect(presenceWhat('event', 'gala')).toBeUndefined();
    expect(presenceWhat('person', 'board')?.what).toBe("the board's names, roles and bios");
    expect(presenceWhat('person', 'staff')?.what).toBe('the staff and volunteers to list');
  });
});

describe('the Collective events', () => {
  it("asks for a collective event's venue on its own row, and counts the events still to come", () => {
    expect(pendingWhat('event', 'venue.name', 'collective')).toBe('the venue');
    // Parked (ADR 0058): the count keeps its filter for the day the events are asked for again.
    expect(PRESENCE.some((entry) => entry.filter?.includes('kind == "collective"'))).toBe(false);
    const row = PARKED.presence.find((entry) => entry.filter?.includes('kind == "collective"'));
    expect(row?.where).toBe('Yoruba Cultural Collective');
    // Still to come as the Studio can read it (ADR 0030): an end ahead, or no end and a start within a day.
    // An event without a start never lists, so it never counts.
    expect(row?.filter).toContain('defined(start) &&');
    expect(row?.filter).toContain('dateTime(end) > dateTime(now())');
    expect(row?.filter).toContain('dateTime(start) > dateTime(now()) - 60 * 60 * 24');
  });
});

describe('pendingWhat and pendingTitle', () => {
  it('returns the chip wording for a field and the row title for the Studio', () => {
    expect(pendingWhat('siteSettings', 'ein')).toBe('EIN');
    expect(pendingWhat('siteSettings', 'nothing')).toBeUndefined();
    expect(pendingWhat('event', 'start', 'gala')).toBe('the date');
    expect(pendingWhat('event', 'start', 'festival')).toBe('the date');
    // The festival's hours are parked (ADR 0058).
    expect(pendingWhat('event', 'end', 'festival')).toBeUndefined();
    expect(pendingWhat('event', 'start')).toBe('the date');
    expect(pendingWhat('event', 'venue.name', 'gala')).toBe('the venue');
    expect(pendingWhat('event', 'venue.name', 'festival')).toBe('the venue');
    expect(pendingWhat('homepage', 'hero.image')).toBe('the hero photograph');
    for (const type of ['programsPage', 'lessonsPage', 'collectivePage']) {
      expect(pendingWhat(type, 'header.title'), type).toBe('the page heading');
    }
    expect(pendingWhat('festivalPage', 'planYourVisit[]')).toBe('the eight practical facts');
    // A row without its value is parked (ADR 0058), so no chip asks for it.
    expect(pendingWhat('festivalPage', 'planYourVisit')).toBeUndefined();
    expect(pendingWhat('festivalPage', 'extraFacts')).toBe('a glance fact');
    // The Gala's glance is full with the edition's five facts, so no extra row can show a chip.
    expect(pendingWhat('galaPage', 'extraFacts')).toBeUndefined();
    expect(
      pendingTitle({ type: 'siteSettings', fields: ['ein'], where: 'Everywhere', what: 'EIN' }),
    ).toBe('Everywhere: EIN');
  });
});

describe('the inline programs on the Programs hub', () => {
  it('defers Lessons card ages without hiding ages still required for other programs', () => {
    expect(pendingWhat('program', 'ages', 'lessons')).toBeUndefined();
    expect(registerWhat('program', 'ages', 'lessons')).toBe('the ages');
    expect(pendingWhat('program', 'ages', 'collective')).toBe('the ages');
    expect(pendingWhat('program', 'ages')).toBe('the ages');
    const ages = PENDING.find((row) => row.type === 'program' && row.fields?.includes('ages'));
    expect(ages && pendingFilter(ages)).toBe(
      '_type == "program" && coalesce(page, "") != "lessons" && (!defined(ages))',
    );
  });

  it("names a sub-program's owed fact with the register's wording, and each of Cultural Exchange's facts by itself", () => {
    expect(pendingWhat('programsPage', 'kidsStem.subprograms')).toBe('ages and what they build');
    expect(pendingWhat('programsPage', 'culturalExchange.blurb')).toBe('what the exchange is');
    expect(pendingWhat('programsPage', 'culturalExchange.eligibility')).toBe('who it is for');
    expect(pendingWhat('programsPage', 'culturalExchange.cadence')).toBe('the cadence');
    expect(pendingWhat('programsPage', 'culturalExchange.howToJoin')).toBe('how to join');
    expect(pendingWhat('programsPage', 'culturalExchange.image')).toBe(
      'a photograph of the exchange',
    );
    // The lumped row the register wrote is gone, so no chip reads "everything about this program".
    expect(PENDING.some((row) => row.what === 'everything about this program')).toBe(false);
  });

  it('names a year strip row without its when, and a strip with no rows', () => {
    expect(pendingWhat('programsPage', 'yearStrip')).toBe('when it runs');
    expect(pendingWhat('programsPage', 'yearStrip[]')).toBe('when each program runs');
  });
});

describe('the Lessons page', () => {
  it('names a glance fact, the teacher and her email the way the page shows them, and no voices', () => {
    expect(pendingWhat('lessonsPage', 'lessonDetails.ages')).toBeUndefined();
    expect(pendingWhat('lessonsPage', 'teacher')).toBe("the teacher's name and bio");
    const email = PARKED.rows.find(
      (row) => row.type === 'siteSettings' && row.what === "the teacher's email",
    );
    expect(email?.condition).toContain('role == "teacher"');
    // The slimmed page has no voices section (ADR 0031), so the Studio lists none.
    expect(
      PENDING.some((row) => row.type === 'lessonsPage' && row.fields?.includes('voices[]')),
    ).toBe(false);
    expect(PRESENCE.find((row) => row.type === 'testimonial')?.where).not.toContain('Lessons');
  });
});

describe("the Lessons page's teaching sections", () => {
  it('names the prose, the levels, the lesson and a step without its place', () => {
    expect(pendingWhat('lessonsPage', 'learn')).toBeUndefined();
    expect(pendingWhat('lessonsPage', 'oneLesson[]')).toBe('the shape of a lesson');
    expect(pendingWhat('lessonsPage', 'oneLesson')).toBe('the step');
    // The levels and the questions are parked (ADR 0058).
    for (const field of ['levels[]', 'levels', 'faq[]', 'faq']) {
      expect(pendingWhat('lessonsPage', field), field).toBeUndefined();
    }
  });
});

describe("the Collective's one voice", () => {
  it('waits in a slot a collective testimonial fills, asking for the quote without inventing it', () => {
    expect(COLLECTIVE_VOICE_SLOT.context).toBe('collective');
    expect(COLLECTIVE_VOICE_SLOT.role).toBe('Member, Yoruba Cultural Collective');
    expect(COLLECTIVE_VOICE_SLOT.quote).toMatch(/^Quote from a member of the Collective/);
    // Parked (ADR 0058): the slot's words stay for the day the voice is asked for again.
    expect(pendingWhat('collectivePage', 'voice')).toBeUndefined();
  });
});

describe('the Lessons page, beyond its sections', () => {
  it("asks for the confirmed glance facts and keeps the deferred teacher bio's scope", () => {
    expect(pendingWhat('lessonsPage', 'lessonDetails.format')).toBe('the lesson format');
    expect(pendingWhat('person', 'bioShort')).toBeUndefined();
    const bio = PARKED.rows.find(
      (row) => row.type === 'person' && row.fields?.includes('bioShort'),
    );
    // Only the person the Lessons page links is listed, never every person without a bio.
    expect(bio?.filter).toContain('lessonsPage');
  });

  it('keeps the teacher email chip in one constant the registry row uses', () => {
    const row = PARKED.rows.find(
      (entry) => entry.type === 'siteSettings' && entry.condition?.includes('"teacher"'),
    );
    expect(row?.what).toBe(TEACHER_EMAIL_PENDING);
  });
});

describe("the Collective's initiatives", () => {
  it('names each owed fact of an initiative on its own', () => {
    expect(pendingWhat('initiative', 'blurb')).toBe('what the initiative is');
    expect(pendingWhat('initiative', 'status')).toBe('the status');
    expect(pendingWhat('initiative', 'statusLine')).toBe('the status line');
    expect(pendingWhat('initiative', 'serves')).toBe('who it serves');
    expect(pendingWhat('initiative', 'since')).toBe('when it started');
    expect(pendingWhat('initiative', 'next')).toBe('what comes next');
    expect(pendingWhat('initiative', 'image')).toBe('a photograph of the project');
    // What is not drawn is not owed.
    expect(pendingWhat('initiative', 'proceedsReturn')).toBeUndefined();
  });
});

describe('the take-part rows every page with a band registers', () => {
  it('names an empty band and an unfinished row the same way on each page', () => {
    for (const type of [
      'festivalPage',
      'galaPage',
      'programsPage',
      'lessonsPage',
      'collectivePage',
    ]) {
      expect(pendingWhat(type, 'takePart[]'), type).toBe('the ways in');
      expect(pendingWhat(type, 'takePart'), type).toBe('which way to take part');
    }
  });
});

describe('pendingWhat for one kind', () => {
  it("never answers a kind from a condition row narrowed to another kind's documents", () => {
    // The festival and the Gala each keep a row for a schedule row missing its time; no row names "other".
    expect(pendingWhat('event', 'schedule', 'festival')).toBe('the time');
    expect(pendingWhat('event', 'schedule', 'gala')).toBe('the time');
    expect(pendingWhat('event', 'schedule', 'other')).toBeUndefined();
  });

  it("never answers a kind from a field row narrowed to another kind's documents", () => {
    // Only the festival's editions list the cost and the exact venue line in the Studio.
    expect(pendingWhat('event', 'cost', 'festival')).toBe('the cost');
    expect(pendingWhat('event', 'cost', 'gala')).toBeUndefined();
    expect(pendingWhat('event', 'venue.line', 'gala')).toBeUndefined();
    // A row no kind narrows answers for every kind.
    expect(pendingWhat('ticketTier', 'price', 'gala')).toBe('the price');
  });
});

describe('a row narrowed by group', () => {
  it("answers Our Story's board and its staff and volunteers apart, as a row narrowed by kind does", () => {
    expect(presenceWhat('person', 'board')).toEqual({
      what: "the board's names, roles and bios",
      minimum: 1,
    });
    for (const group of ['staff', 'volunteer']) {
      expect(presenceWhat('person', group)?.what, group).toBe('the staff and volunteers to list');
    }
    // The teacher is listed on the Lessons page, never counted here.
    expect(presenceWhat('person', 'teacher')).toBeUndefined();
    // The one row for everyone is gone: a page never asks for "names, roles and bios" of nobody in particular.
    expect(PRESENCE.some((row) => row.type === 'person' && !row.filter)).toBe(false);
  });

  it('keeps an unnarrowed row answering for every group', () => {
    // The teacher's deferred bio retains its wording without asking for it at launch.
    expect(registerWhat('person', 'bioShort')).toBe("the teacher's short bio");
    expect(pendingWhat('person', 'bioShort')).toBeUndefined();
  });
});

describe('presenceFilter', () => {
  it('names the type, narrowed by the filter when there is one', () => {
    expect(presenceFilter({ type: 'zone', minimum: 4, where: 'Odunde', what: 'zones' })).toBe(
      '_type == "zone"',
    );
    expect(
      presenceFilter({
        type: 'event',
        minimum: 1,
        filter: 'kind == "gala"',
        where: 'Gala',
        what: 'an edition',
      }),
    ).toBe('_type == "event" && kind == "gala"');
  });
});

describe('Get Involved', () => {
  it('names an empty page of doors, the associations prose and the general contact the way the page shows them', () => {
    expect(pendingWhat('getInvolvedPage', 'doors[]')).toBe('the ways to get involved');
    expect(pendingWhat('door', 'bullets[]')).toBe('what it asks and gives');
    expect(pendingWhat('getInvolvedPage', 'hometownAssociations.prose')).toBe(
      'what the associations are, in your words',
    );
    const general = PENDING.filter(
      (row) => row.type === 'siteSettings' && row.condition?.includes('role == "general"'),
    );
    // Who answers is parked (ADR 0058): the organization answers, so only the reply time is asked.
    expect(general.map((row) => row.what)).toEqual([GENERAL_RESPONDS_PENDING]);
    expect(askedFor(GENERAL_RESPONDS_PENDING)).toBe(true);
    expect(askedFor(GENERAL_CONTACT_PENDING)).toBe(false);
  });
});

describe('Impact', () => {
  it('names four headline figures and the photograph, with no retired six-cell task', () => {
    expect(pendingWhat('impactPage', 'stats[]')).toBe('the headline figures');
    expect(pendingWhat('stat', 'source')).toBe('a source line under the figure');
    const six = PENDING.find((row) => row.what === IMPACT_SIX_PENDING);
    expect(six).toBeUndefined();
    expect(pendingWhat('impactPage', 'howWeWorkImage')).toBe('a photograph of the work');
  });

  it("names an outcome's missing source only where it has a figure, and one with nothing at all", () => {
    expect(pendingWhat('impactPage', 'outcomes[]')).toBeUndefined();
    expect(pendingWhat('outcome', 'figure.source')).toBe('a source line under the figure');
    const source = PENDING.find(
      (row) => row.type === 'outcome' && row.fields?.includes('figure.source'),
    );
    expect(source?.filter).toBe('defined(figure)');
    expect(PENDING.find((row) => row.what === OUTCOME_PENDING)?.condition).toBe(
      '!defined(figure) && !defined(plainStatement)',
    );
    expect(IMPACT_OUTCOME_SLOTS).toEqual([
      { program: 'program-yoruba-lessons' },
      { kind: 'festival' },
      { program: 'program-kids-stem' },
      { program: 'program-cultural-collective' },
    ]);
  });

  it('reads the civic cells from the festival edition, each with the wording the Odunde page uses', () => {
    // The past edition's two figures are parked (ADR 0058).
    expect(pendingWhat('event', 'attendance', 'festival')).toBeUndefined();
    expect(pendingWhat('event', 'vendorsHosted', 'festival')).toBeUndefined();
    expect(pendingWhat('event', 'vendorsHosted', 'gala')).toBeUndefined();
    expect(pendingWhat('event', 'cost', 'festival')).toBe('the cost');
  });

  it('names each kind of governance document apart, and a document with neither file nor note', () => {
    expect(presenceWhat('governanceDoc', 'financialStatements')?.what).toBe(
      'the financial statements',
    );
    expect(presenceWhat('governanceDoc', 'form990')?.what).toBe('the Form 990 position');
    expect(presenceWhat('governanceDoc', 'annualReport')).toBeUndefined();
    expect(presenceWhat('governanceDoc', 'audit')).toBeUndefined();
    expect(registerPresenceWhat('governanceDoc', 'annualReport')?.what).toBe(
      'the annual report position',
    );
    expect(registerPresenceWhat('governanceDoc', 'audit')?.what).toBe('the audit position');
    expect(PENDING.find((row) => row.what === GOVERNANCE_NOTE_PENDING)?.type).toBe('governanceDoc');
    expect(presenceWhat('person', 'board')?.what).toBe("the board's names, roles and bios");
  });

  it("waits for the homepage's three voices, and names the partnerships lead's reply time", () => {
    expect(IMPACT_VOICE_SLOTS.map((slot) => slot.context)).toEqual([
      'lessons',
      'general',
      'festival',
    ]);
    expect(pendingWhat('impactPage', 'voices[]')).toBe('voices with permission to name');
    const reply = PENDING.find((row) => row.what === PARTNERSHIPS_RESPONDS_PENDING);
    expect(reply?.condition).toContain('role == "partnerships"');
  });
});

describe('Our Story', () => {
  it('parks the founding photograph and board bios while keeping the other facts', () => {
    expect(pendingWhat('storyPage', 'foundingImage')).toBeUndefined();
    expect(pendingWhat('storyPage', 'foundingFacts')).toBe('a founding fact');
    expect(pendingWhat('storyPage', 'foundingFacts[]')).toBe('the founding facts');
    expect(pendingWhat('person', 'bioShort', 'board')).toBeUndefined();
    expect(registerWhat('person', 'bioShort')).toBe("the teacher's short bio");
    expect(pendingWhat('person', 'role', 'staff')).toBe('the role');
    expect(pendingWhat('person', 'role', 'teacher')).toBeUndefined();
    expect(pendingWhat('storyPage', 'takePart[]')).toBe('the ways in');
    // The timeline is the page's own list (ADR 0042): its row asks the page for entries.
    expect(presenceWhat('timelineEntry')).toBeUndefined();
    expect(pendingWhat('storyPage', 'timeline[]')).toBe('the dated entries');
  });
});

describe('the gallery', () => {
  it("asks for an album's year only where neither its date nor its edition gives one", () => {
    const row = PENDING.find(
      (entry) => entry.type === 'album' && entry.what === ALBUM_YEAR_PENDING,
    );
    // The edition the album names, the one link between them (ADR 0042).
    expect(row?.condition).toBe('!defined(date) && !defined(event->edition)');
    expect(row?.fields).toBeUndefined();
    expect(ALBUM_YEAR_PENDING).toBe('the year of the album');
    // The field alone no longer answers: the site reads the named constant.
    expect(pendingWhat('album', 'date')).toBeUndefined();
  });

  it("names an album's credit, a photograph's own credit and an album without photographs apart", () => {
    const credit = PENDING.find(
      (entry) => entry.type === 'album' && entry.what === ALBUM_CREDIT_PENDING,
    );
    expect(credit?.condition).toBe('creditConfirmed != true');
    const own = PENDING.find(
      (entry) => entry.type === 'album' && entry.what === PHOTO_CREDIT_PENDING,
    );
    expect(own?.condition).toBe(
      'count(photos[(defined(credit) || defined(creditNote)) && creditConfirmed != true]) > 0',
    );
    expect(pendingFilter(own as PendingEntry)).toBe(
      '_type == "album" && (count(photos[(defined(credit) || defined(creditNote)) && creditConfirmed != true]) > 0)',
    );
    expect(pendingWhat('album', 'photos[]')).toBe('the photographs');
  });

  it("asks for no video: an album's videos are an extra, with no row in the register (ADR 0051)", () => {
    const asked = PENDING.filter((entry) => entry.type === 'album').flatMap((entry) => [
      ...(entry.fields ?? []),
      entry.condition ?? '',
    ]);
    expect(asked.filter((text) => text.includes('video'))).toEqual([]);
    expect(pendingWhat('album', 'videos[]')).toBeUndefined();
  });

  it('keeps the policy as the owner writes it, and counts only albums that hold a photograph', () => {
    expect(pendingWhat('galleryPage', 'creditsAndConsent')).toBe(
      'your photo consent and removal policy',
    );
    const albums = PRESENCE.find((entry) => entry.type === 'album');
    expect(albums?.filter).toBe('count(photos) > 0');
    expect(presenceFilter(albums as (typeof PRESENCE)[number])).toBe(
      '_type == "album" && count(photos) > 0',
    );
    expect(presenceWhat('album')).toEqual({ what: 'the photo albums', minimum: 1 });
  });
});

describe('Donate', () => {
  it("names the Zeffy form's facts, the doors, the tax line and a giving level's missing line and source", () => {
    expect(pendingWhat('donatePage', 'paymentDetails.receipt')).toBe(
      'how the donation form handles receipts',
    );
    expect(pendingWhat('donatePage', 'largerScale.doors[]')).toBe(
      'the ways to get involved for organizations',
    );
    expect(pendingWhat('donatePage', 'taxLine')).toBe('the tax-deductible line');
    expect(pendingWhat('donatePage', 'whatYourGiftDoes[]')).toBe(
      'the preset amounts and what each buys',
    );
    expect(pendingWhat('givingLevel', 'what')).toBe('what the gift does');
    expect(pendingWhat('givingLevel', 'source')).toBe('where the cost comes from');
    expect(pendingWhat('donatePage', 'otherWays[]')).toBe('which other ways to give you accept');
  });
});

describe('the to-do list after the Studio decisions (ADR 0042)', () => {
  // A row naming no kind lists events of every kind, so its fields must show for all three. Rows
  // with a GROQ condition name no field and are checked by their own tests above.
  it('asks no event for an input its kind hides', () => {
    const KINDS = ['festival', 'gala', 'collective'] as const;
    const inputs: readonly string[] = EDITION_FIELDS;
    const asked: string[] = [];
    for (const row of PENDING.filter((entry) => entry.type === 'event')) {
      const named = /kind == "(festival|gala|collective)"/.exec(row.filter ?? '')?.[1];
      const kinds = named ? [named] : KINDS;
      for (const field of row.fields ?? []) {
        const input = field.startsWith('venue.') ? field : (field.split(/[.[]/)[0] ?? field);
        if (!inputs.includes(input)) continue;
        for (const kind of kinds) {
          if (!editionFieldShown(kind, input as EditionField)) asked.push(`${kind}: ${field}`);
        }
      }
    }
    expect(asked).toEqual([]);
  });

  it('counts only honorees tied to a Gala edition', () => {
    const honorees = PRESENCE.find((row) => row.type === 'honoree');
    expect(honorees?.filter).toBe('event->kind == "gala"');
    expect(presenceFilter(honorees as (typeof PRESENCE)[number])).toContain(
      'event->kind == "gala"',
    );
  });
});
