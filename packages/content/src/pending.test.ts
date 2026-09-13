import { describe, expect, it } from 'vitest';
import {
  ALBUM_CREDIT_PENDING,
  ALBUM_YEAR_PENDING,
  COLLECTIVE_VOICE_SLOT,
  GENERAL_CONTACT_PENDING,
  GENERAL_RESPONDS_PENDING,
  GOVERNANCE_NOTE_PENDING,
  IMPACT_OUTCOME_SLOTS,
  IMPACT_SIX_PENDING,
  IMPACT_VOICE_SLOTS,
  OUTCOME_PENDING,
  PARTNERSHIPS_RESPONDS_PENDING,
  PENDING,
  type PendingEntry,
  PHOTO_CREDIT_PENDING,
  PRESENCE,
  pendingFilter,
  pendingTitle,
  pendingWhat,
  presenceCountQuery,
  presenceWhat,
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
      'timelineEntry',
      'governanceDoc',
      'outcome',
      'zone',
    ]) {
      expect(typeByName(type)?.type, type).toBe('document');
      expect(byType[type], type).toBeGreaterThanOrEqual(1);
    }
    expect(byType.zone).toBe(4);
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

describe('presenceWhat', () => {
  it('answers the presence row wording and the count the page expects', () => {
    expect(presenceWhat('zone')).toEqual({ what: 'the unnamed zones', minimum: 4 });
    expect(presenceWhat('ticketTier')?.what).toBe('three prices and what each includes');
    expect(presenceWhat('album')?.what).toBe('the photo albums');
  });

  it("finds a row by kind as pendingWhat does, never answering one kind with another kind's row", () => {
    expect(presenceWhat('event', 'collective')).toEqual({
      what: 'the next Collective events',
      minimum: 1,
    });
    expect(presenceWhat('event', 'gala')).toBeUndefined();
  });
});

describe('the Collective events', () => {
  it("asks for a collective event's venue on its own row, and counts the events still to come", () => {
    expect(pendingWhat('event', 'venue.name', 'collective')).toBe('the venue');
    const row = PRESENCE.find((entry) => entry.filter?.includes('kind == "collective"'));
    expect(row?.where).toBe('Collective, events');
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
    expect(pendingWhat('event', 'end', 'festival')).toBe('the hours');
    expect(pendingWhat('event', 'start')).toBe('the date');
    expect(pendingWhat('event', 'venue.name', 'gala')).toBe('the venue');
    expect(pendingWhat('event', 'venue.name', 'festival')).toBe('the venue');
    expect(pendingWhat('homepage', 'hero.image')).toBe('the hero photograph');
    for (const type of ['programsPage', 'lessonsPage', 'collectivePage']) {
      expect(pendingWhat(type, 'header.title'), type).toBe('the page heading');
    }
    expect(pendingWhat('festivalPage', 'planYourVisit[]')).toBe('the eight practical facts');
    expect(pendingWhat('festivalPage', 'planYourVisit')).toBe('a practical fact');
    expect(pendingWhat('festivalPage', 'extraFacts')).toBe('a glance fact');
    // The Gala's glance is full with the edition's five facts, so no extra row can show a chip.
    expect(pendingWhat('galaPage', 'extraFacts')).toBeUndefined();
    expect(
      pendingTitle({ type: 'siteSettings', fields: ['ein'], where: 'Everywhere', what: 'EIN' }),
    ).toBe('Everywhere: EIN');
  });
});

describe('the inline programs on the Programs hub', () => {
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
    expect(pendingWhat('lessonsPage', 'glance')).toBe('a glance fact');
    expect(pendingWhat('lessonsPage', 'teacher')).toBe("the teacher's name and bio");
    const email = PENDING.find(
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
    expect(pendingWhat('lessonsPage', 'learn')).toBe('what the lessons teach, in her words');
    expect(pendingWhat('lessonsPage', 'levels[]')).toBe('what each level covers');
    expect(pendingWhat('lessonsPage', 'oneLesson[]')).toBe('the shape of a lesson');
    expect(pendingWhat('lessonsPage', 'oneLesson')).toBe('the step');
    expect(pendingWhat('lessonsPage', 'levels')).toBe('what the level covers');
  });
});

describe("the Collective's one voice", () => {
  it('waits in a slot a collective testimonial fills, asking for the quote without inventing it', () => {
    expect(COLLECTIVE_VOICE_SLOT.context).toBe('collective');
    expect(COLLECTIVE_VOICE_SLOT.role).toBe('Member, Yoruba Cultural Collective');
    expect(COLLECTIVE_VOICE_SLOT.quote).toMatch(/^Quote from a member of the Collective/);
    expect(pendingWhat('collectivePage', 'voice')).toBe('the quote and who said it');
  });
});

describe('the Lessons page, beyond its sections', () => {
  it("asks for the glance when the page holds none, and for a linked teacher's short bio", () => {
    expect(pendingWhat('lessonsPage', 'glance[]')).toBe('the facts at a glance');
    expect(pendingWhat('person', 'bioShort')).toBe("the teacher's short bio");
    const bio = PENDING.find((row) => row.type === 'person' && row.fields?.includes('bioShort'));
    // Only the person the Lessons page links is listed, never every person without a bio.
    expect(bio?.filter).toContain('lessonsPage');
  });

  it('keeps the teacher email chip in one constant the registry row uses', () => {
    const row = PENDING.find(
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
      expect(pendingWhat(type, 'takePart'), type).toBe('a way in, its title or its button label');
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
    // The linked teacher's short bio is narrowed by her id, not by a group, so it still answers.
    expect(pendingWhat('person', 'bioShort')).toBe("the teacher's short bio");
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

describe('Get Involved', () => {
  it('names an empty page of doors, the associations prose and the general contact the way the page shows them', () => {
    expect(pendingWhat('getInvolvedPage', 'doors[]')).toBe('the ways in');
    expect(pendingWhat('door', 'bullets[]')).toBe('what this way in asks and gives');
    expect(pendingWhat('getInvolvedPage', 'hometownAssociations.prose')).toBe(
      'what the associations are, in your words',
    );
    const general = PENDING.filter(
      (row) => row.type === 'siteSettings' && row.condition?.includes('role == "general"'),
    );
    expect(general.map((row) => row.what)).toEqual([
      GENERAL_CONTACT_PENDING,
      GENERAL_RESPONDS_PENDING,
    ]);
  });
});

describe('Impact', () => {
  it('names the headline figures, the six cells and the photograph beside How we work', () => {
    expect(pendingWhat('impactPage', 'stats[]')).toBe('the headline figures');
    expect(pendingWhat('stat', 'source')).toBe('a source line under the figure');
    const six = PENDING.find((row) => row.what === IMPACT_SIX_PENDING);
    // Listed only while the page asks for six.
    expect(six?.condition).toContain('layout.stats == "six"');
    expect(pendingWhat('impactPage', 'howWeWorkImage')).toBe('a photograph of the work');
  });

  it("names an outcome's missing source only where it has a figure, and one with nothing at all", () => {
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
    expect(pendingWhat('event', 'attendance', 'festival')).toBe('the attendance figure');
    expect(pendingWhat('event', 'vendorsHosted', 'festival')).toBe('the number of vendors hosted');
    expect(pendingWhat('event', 'vendorsHosted', 'gala')).toBeUndefined();
    expect(pendingWhat('event', 'cost', 'festival')).toBe('the cost');
  });

  it('names each kind of governance document apart, and a document with neither file nor note', () => {
    expect(presenceWhat('governanceDoc', 'form990')?.what).toBe('the Form 990 position');
    expect(presenceWhat('governanceDoc', 'annualReport')?.what).toBe('the annual report position');
    expect(presenceWhat('governanceDoc', 'audit')?.what).toBe('the audit position');
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
  it('names the founding photograph, the founding facts and a board member without a short bio', () => {
    expect(pendingWhat('storyPage', 'foundingImage')).toBe(
      'the earliest photograph you have: an early gathering, or the founders',
    );
    expect(pendingWhat('storyPage', 'foundingFacts')).toBe('a founding fact');
    expect(pendingWhat('storyPage', 'foundingFacts[]')).toBe('the founding facts');
    expect(pendingWhat('person', 'bioShort', 'board')).toBe('a short bio');
    // The Lessons page still reads its own row for the linked teacher.
    expect(pendingWhat('person', 'bioShort')).toBe("the teacher's short bio");
    expect(pendingWhat('person', 'role', 'staff')).toBe('the role');
    expect(pendingWhat('person', 'role', 'teacher')).toBeUndefined();
    expect(pendingWhat('storyPage', 'takePart[]')).toBe('the ways in');
    expect(presenceWhat('timelineEntry')?.what).toBe('the dated entries');
  });
});

describe('the gallery', () => {
  it("asks for an album's year only where neither its date nor its edition gives one", () => {
    const row = PENDING.find(
      (entry) => entry.type === 'album' && entry.what === ALBUM_YEAR_PENDING,
    );
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

  it('keeps the policy as the owner writes it, and counts only albums that hold a photograph', () => {
    expect(pendingWhat('galleryPage', 'creditsAndConsent')).toBe(
      'your photo consent and removal policy',
    );
    const albums = PRESENCE.find((entry) => entry.type === 'album');
    expect(albums?.filter).toBe('count(photos) > 0');
    expect(presenceCountQuery(albums as (typeof PRESENCE)[number])).toBe(
      'count(*[_type == "album" && count(photos) > 0])',
    );
    expect(presenceWhat('album')).toEqual({ what: 'the photo albums', minimum: 1 });
  });
});

describe('Donate', () => {
  it("names the Zeffy form's facts, the doors, the tax line and a giving level's missing line and source", () => {
    expect(pendingWhat('donatePage', 'giveNow.facts')).toBe('how your Zeffy form handles this');
    expect(pendingWhat('donatePage', 'largerScale.doors[]')).toBe('the doors for organizations');
    expect(pendingWhat('donatePage', 'taxLine')).toBe('the tax-deductible line');
    expect(pendingWhat('donatePage', 'whatYourGiftDoes[]')).toBe(
      'the preset amounts and what each buys',
    );
    expect(pendingWhat('givingLevel', 'what')).toBe('what the gift does');
    expect(pendingWhat('givingLevel', 'source')).toBe('where the cost comes from');
    expect(pendingWhat('donatePage', 'otherWays[]')).toBe('which other ways to give you accept');
  });
});
