import { evaluate, parse } from 'groq-js';
import { describe, expect, it } from 'vitest';
import { buildSeed, type SeedAssets } from '../../scripts/seed-data';
import { PENDING, PRESENCE, pendingFilter, rowDocumentType } from '../pending';
import { ADMIN_ONLY_TYPES } from './roles';
import { SITE_PAGES } from './site-pages';
import {
  groupTitle,
  missingRowTitle,
  ORGANIZATION,
  owedRowTitle,
  TODO_GROUPS,
  type TodoPlan,
  type TodoResult,
  todoGroup,
  todoListenQuery,
  todoPlan,
  todoQuery,
  todoRowId,
  todoRowTitle,
  todoState,
  wordingFilter,
} from './todo';

// The To do (ADR 0042): the registry grouped by page, counted the way the site reads it. The query
// runs on the seed with groq-js, as the Studio runs it on the dataset.

const MEMBERS = todoPlan(ADMIN_ONLY_TYPES);
const ADMINISTRATORS = todoPlan();
const rowOf = (plan: TodoPlan, where: string, what: string) => {
  const row = plan.rows.find(({ entry }) => entry.where === where && entry.what === what);
  if (!row) throw new Error(`no row ${where}: ${what}`);
  return row;
};

describe('the rows of the To do', () => {
  it('gathers every registry row under a site page, or Organization details for the settings', () => {
    const pages = new Set<string>(SITE_PAGES.map(({ type }) => type));
    for (const entry of PENDING) {
      const group = todoGroup(entry);
      if (entry.type === 'siteSettings') expect(group, entry.where).toBe(ORGANIZATION.id);
      else expect(pages, `${entry.where}: ${entry.what}`).toContain(group);
    }
    expect(todoGroup(rowOf(ADMINISTRATORS, 'Sponsorship', 'the amount').entry)).toBe('galaPage');
    expect(todoGroup(rowOf(ADMINISTRATORS, 'Doors', 'the blurb').entry)).toBe('getInvolvedPage');
    expect(() => todoGroup({ type: 'zone', where: 'Nowhere, at all', what: 'x' })).toThrow();
  });

  it('keeps the register order within a page, and the pages in the navigation order', () => {
    expect(TODO_GROUPS.map(({ id }) => id)).toEqual([
      ...SITE_PAGES.map(({ type }) => type),
      ORGANIZATION.id,
    ]);
    expect(ADMINISTRATORS.rows.map(({ entry }) => entry)).toEqual(PENDING);
  });

  it('gives each row an id of its own that follows its filter, not its wording', () => {
    const ids = ADMINISTRATORS.rows.map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-zA-Z]+-[0-9a-z]+$/);
    const [first] = PENDING;
    if (!first) throw new Error('an empty registry');
    expect(todoRowId({ ...first, what: 'other words' })).toBe(todoRowId(first));
    expect(todoRowId({ ...first, filter: 'defined(x)' })).not.toBe(todoRowId(first));
    const still = ADMINISTRATORS.stillToAdd.map(({ id }) => id);
    expect(new Set(still).size).toBe(still.length);
  });

  it('titles a row in its page without the page, and a settings row with where it shows', () => {
    expect(todoRowTitle(rowOf(ADMINISTRATORS, 'Odunde, at a glance', 'the date').entry)).toBe(
      'At a glance: the date',
    );
    expect(
      todoRowTitle(
        rowOf(
          ADMINISTRATORS,
          'Impact, Odunde as civic infrastructure',
          'the number of vendors hosted',
        ).entry,
      ),
    ).toBe('Odunde as civic infrastructure: the number of vendors hosted');
    expect(todoRowTitle(rowOf(ADMINISTRATORS, 'Sponsorship', 'the amount').entry)).toBe(
      'Sponsorship: the amount',
    );
    expect(todoRowTitle(rowOf(ADMINISTRATORS, 'Everywhere', 'EIN').entry)).toBe('Everywhere: EIN');
    expect(
      todoRowTitle(rowOf(ADMINISTRATORS, 'Lessons, teacher', "the teacher's email").entry),
    ).toBe("Lessons, teacher: the teacher's email");
  });

  it("leaves an administrator's documents out of a member's To do, the wording to check included", () => {
    expect(MEMBERS.rows.some(({ entry }) => ADMIN_ONLY_TYPES.has(entry.type))).toBe(false);
    expect(MEMBERS.rows).toHaveLength(
      PENDING.filter((entry) => !ADMIN_ONLY_TYPES.has(entry.type)).length,
    );
    expect(wordingFilter(MEMBERS)).toContain(
      `!(documentType in ${JSON.stringify([...ADMIN_ONLY_TYPES])})`,
    );
    expect(wordingFilter(ADMINISTRATORS)).toContain('!(documentType in [])');
  });

  it('asks for the next festival and Gala editions, and every presence row', () => {
    expect(ADMINISTRATORS.stillToAdd.map(({ id }) => id).slice(0, 2)).toEqual([
      'next-festival',
      'next-gala',
    ]);
    expect(ADMINISTRATORS.stillToAdd.filter(({ presence }) => presence)).toHaveLength(
      PRESENCE.length,
    );
    const collective = ADMINISTRATORS.stillToAdd.find(({ presence }) => presence?.type === 'event');
    expect(collective?.template).toBe('event-collective');
    expect(ADMINISTRATORS.stillToAdd.find(({ id }) => id === 'next-gala')?.template).toBe(
      'event-gala',
    );
  });

  it('listens to every type it counts', () => {
    const listened = todoListenQuery(ADMINISTRATORS);
    for (const type of [...PENDING.map(rowDocumentType), ...PRESENCE.map(({ type }) => type)]) {
      expect(listened).toContain(`"${type}"`);
    }
    expect(listened).toContain('"lintReport"');
  });
});

describe('what the To do counts', () => {
  const festival = { _id: 'event-odunde-next', kind: 'festival', start: '2099-06-13T17:00:00Z' };
  const pastFestival = {
    _id: 'event-odunde-past',
    kind: 'festival',
    start: '2000-06-13T17:00:00Z',
    photos: 12,
  };
  const olderFestival = {
    _id: 'event-odunde-old',
    kind: 'festival',
    start: '1999-06-13T17:00:00Z',
  };
  /** Editions as the query finds them: each is its own edition. */
  const editions = (...ids: string[]) => ids.map((_id) => ({ _id, edition: _id }));
  const documents = (...ids: string[]) => ids.map((_id) => ({ _id }));
  const date = rowOf(MEMBERS, 'Odunde, at a glance', 'the date');
  const attendance = rowOf(MEMBERS, 'Odunde, past years', 'the attendance figure');
  const whatItIs = rowOf(MEMBERS, 'Odunde, what the day is', 'what Odunde is, in your words');
  const bio = rowOf(MEMBERS, 'Our Story, board', 'a short bio');

  const result: TodoResult = {
    editions: [festival, pastFestival, olderFestival],
    rows: {
      [date.id]: editions(festival._id, pastFestival._id, olderFestival._id),
      [attendance.id]: editions(pastFestival._id, olderFestival._id),
      [whatItIs.id]: documents('festivalPage'),
      [bio.id]: documents('person-a', 'person-b'),
    },
    presence: {},
    wording: 2,
  };
  const now = new Date('2026-09-26T12:00:00Z');
  const state = todoState(MEMBERS, result, now);
  const owed = (id: string, from = state) =>
    from.groups.flatMap((group) => group.rows).find((row) => row.row.id === id);

  it('asks an event row of the edition its page shows only', () => {
    expect(owed(date.id)?.ids).toEqual([festival._id]);
    expect(owed(attendance.id)?.ids).toEqual([pastFestival._id]);
  });

  it("asks a Collective event row of the events the Collective's page lists only", () => {
    const venue = rowOf(MEMBERS, 'Collective, events', 'the venue');
    const listed = { _id: 'event-harvest', kind: 'collective', start: '2099-09-01T17:00:00Z' };
    const over = { _id: 'event-picnic', kind: 'collective', start: '2000-09-01T17:00:00Z' };
    const undated = { _id: 'event-someday', kind: 'collective' };
    const counted = todoState(
      MEMBERS,
      {
        editions: [listed, over, undated],
        rows: { [venue.id]: editions(listed._id, over._id, undated._id) },
      },
      now,
    );
    expect(counted.groups.flatMap((group) => group.rows).map(({ ids }) => ids)).toEqual([
      [listed._id],
    ]);
  });

  it("asks the Gala's tiers and levels of the edition the Gala page shows, and untied levels every year", () => {
    const gala = { _id: 'event-gala-next', kind: 'gala', start: '2099-11-20T02:00:00Z' };
    const pastGala = { _id: 'event-gala-past', kind: 'gala', start: '2000-11-20T02:00:00Z' };
    const price = rowOf(MEMBERS, 'Gala, seats and tables', 'the price');
    const amount = rowOf(MEMBERS, 'Sponsorship', 'the amount');
    const tiers = MEMBERS.stillToAdd.find(({ presence }) => presence?.type === 'ticketTier');
    const levels = MEMBERS.stillToAdd.find(({ presence }) => presence?.type === 'sponsorLevel');
    if (!tiers || !levels) throw new Error('missing presence rows');
    const counted = todoState(
      MEMBERS,
      {
        editions: [gala, pastGala],
        rows: {
          [price.id]: [
            { _id: 'tier-now', edition: gala._id },
            { _id: 'tier-then', edition: pastGala._id },
            { _id: 'tier-loose' },
          ],
          [amount.id]: [
            { _id: 'level-now', edition: gala._id },
            { _id: 'level-then', edition: pastGala._id },
            { _id: 'level-always' },
          ],
        },
        // Last year's tiers and levels are on file, none for the next Gala.
        presence: {
          [tiers.id]: [{ _id: 'tier-then', edition: pastGala._id }],
          [levels.id]: [{ _id: 'level-then', edition: pastGala._id }],
        },
      },
      now,
    );
    expect(owed(price.id, counted)?.ids).toEqual(['tier-now']);
    expect(owed(amount.id, counted)?.ids).toEqual(['level-now', 'level-always']);
    const missing = counted.stillToAdd.map(({ add }) => add.id);
    expect(missing).toContain(tiers.id);
    expect(missing).toContain(levels.id);
  });

  it('counts every other row for every document its filter finds', () => {
    expect(owed(whatItIs.id)?.ids).toEqual(['festivalPage']);
    expect(owed(bio.id)?.ids).toEqual(['person-a', 'person-b']);
  });

  it('shows only the pages that owe something, in the navigation order, with their counts', () => {
    expect(state.groups.map(({ id }) => id)).toEqual(['festivalPage', 'storyPage']);
    const [odunde, story] = state.groups;
    expect(odunde?.count).toBe(3);
    expect(story?.count).toBe(2);
    if (!odunde || !story) throw new Error('missing groups');
    expect(groupTitle(odunde)).toBe('Odunde Festival (3)');
    expect(story.rows.map(owedRowTitle)).toEqual(['Board: a short bio (2)']);
    expect(odunde.rows.map(owedRowTitle)).toContain('At a glance: the date');
  });

  it('asks for a next edition only while its page has none still to come', () => {
    const missing = state.stillToAdd.map(({ add }) => add.id);
    expect(missing).not.toContain('next-festival');
    expect(missing).toContain('next-gala');
  });

  it('lists a presence row until its documents reach the minimum, with the count where it is more than one', () => {
    const zones = MEMBERS.stillToAdd.find(({ presence }) => presence?.type === 'zone');
    const partners = MEMBERS.stillToAdd.find(({ presence }) => presence?.type === 'partner');
    if (!zones || !partners) throw new Error('missing presence rows');
    const counted = (zoneCount: number, partnerCount: number) =>
      todoState(MEMBERS, {
        ...result,
        presence: {
          [zones.id]: documents(...Array.from({ length: zoneCount }, (_, n) => `zone-${n}`)),
          [partners.id]: documents(
            ...Array.from({ length: partnerCount }, (_, n) => `partner-${n}`),
          ),
        },
      }).stillToAdd;
    const two = counted(2, 0).find(({ add }) => add.id === zones.id);
    expect(two && missingRowTitle(two)).toBe('Odunde, zones: the unnamed zones (2 of 4)');
    const none = counted(2, 0).find(({ add }) => add.id === partners.id);
    expect(none && missingRowTitle(none)).toBe('Partner rows: partner and funder names');
    const full = counted(4, 1).map(({ add }) => add.id);
    expect(full).not.toContain(zones.id);
    expect(full).not.toContain(partners.id);
  });

  it('counts the wording to check, and reads a missing answer as nothing owed', () => {
    expect(state.wording).toBe(2);
    const empty = todoState(MEMBERS, {});
    expect(empty.groups).toEqual([]);
    expect(empty.wording).toBe(0);
  });
});

describe('the To do on the seed', () => {
  const assets: SeedAssets = new Map(
    ['odunde-2026-ayo-game.jpg', 'gala-2025-group-photo.jpg'].map((file) => [
      file,
      {
        assetId: `image-${file.replace(/\W/g, '')}-10x10-jpg`,
        caption: `Caption for ${file}`,
        album: file.startsWith('gala') ? 'gala-2025' : 'odunde-2026',
        photographer: 'red-carpet-media',
      },
    ]),
  );
  const dataset = buildSeed(assets);
  const now = new Date('2026-09-26T12:00:00Z');

  async function run(plan: TodoPlan) {
    const value = await evaluate(parse(todoQuery(plan)), { dataset, timestamp: now } as never);
    return todoState(plan, (await value.get()) as TodoResult, now);
  }

  it('reads as GROQ, every row and presence count included', async () => {
    const value = await evaluate(parse(todoQuery(ADMINISTRATORS)), {
      dataset,
      timestamp: now,
    } as never);
    const result = (await value.get()) as Required<TodoResult>;
    expect(Object.keys(result.rows ?? {})).toHaveLength(PENDING.length);
    expect(Object.keys(result.presence ?? {})).toHaveLength(PRESENCE.length);
    for (const row of ADMINISTRATORS.rows) {
      const found = ((result.rows as Record<string, { _id: string }[]>)[row.id] ?? []).map(
        ({ _id }) => _id,
      );
      const expected = await (
        await evaluate(parse(`*[${pendingFilter(row.entry)}]._id`), {
          dataset,
          timestamp: now,
        } as never)
      ).get();
      expect(found, row.title).toEqual(expected);
    }
  });

  const owedIn = (state: Awaited<ReturnType<typeof run>>, group: string, title: string) =>
    state.groups.find(({ id }) => id === group)?.rows.find(({ row }) => row.title === title)?.ids;

  it("asks each event's next edition for its facts and its past edition for its past years", async () => {
    const state = await run(MEMBERS);
    // Both kinds' editions are undated in the seed, so the season calendar decides: on 26 September
    // 2026 the festival's June has passed and the Gala's November is still to come.
    expect(owedIn(state, 'festivalPage', 'At a glance: the date')).toEqual(['event-odunde-2027']);
    expect(owedIn(state, 'galaPage', 'At a glance: the date')).toEqual(['event-gala-2026']);
    expect(owedIn(state, 'festivalPage', 'Past years: the attendance figure')).toEqual([
      'event-odunde-2026',
    ]);
    expect(
      owedIn(state, 'impactPage', 'Odunde as civic infrastructure: the number of vendors hosted'),
    ).toEqual(['event-odunde-2026']);
    for (const { row, ids } of state.groups.flatMap((group) => group.rows)) {
      if (row.entry.edition === 'next') {
        expect(ids, row.title).not.toContain('event-odunde-2026');
        expect(ids, row.title).not.toContain('event-gala-2025');
      }
    }
  });

  it("keeps an administrator's rows for administrators", async () => {
    const members = await run(MEMBERS);
    expect(members.groups.map(({ id }) => id)).not.toContain(ORGANIZATION.id);
    const administrators = await run(ADMINISTRATORS);
    expect(administrators.groups.at(-1)?.id).toBe(ORGANIZATION.id);
  });
});
