import { evaluate, parse } from 'groq-js';
import { describe, expect, it } from 'vitest';
import { PENDING, pendingFilter } from '../../src/pending';
import { lessonsPageQuery } from '../../src/queries/program-pages';
import { donatePageQuery } from '../../src/queries/trust-pages';
import { applyMutations, blockers, type StoredDocument, unpublished } from './core';
import { namedFactsMigration as migration } from './named-facts';

const before: StoredDocument[] = [
  {
    _id: 'lessonsPage',
    _type: 'lessonsPage',
    _rev: 'l1',
    glance: [
      { _key: 'a', label: 'Format', value: 'Online, live', note: 'Video call' },
      { _key: 'b', label: 'When', value: 'Set with the teacher' },
      { _key: 'c', label: 'Ages' },
      { _key: 'd', label: 'Cost', value: 'Agreed with her' },
    ],
  },
  {
    _id: 'donatePage',
    _type: 'donatePage',
    _rev: 'd1',
    giveNow: {
      title: 'Give now',
      facts: [
        { _key: 'a', label: 'Fees' },
        { _key: 'b', label: 'Receipt', note: 'Confirm with the form owner' },
        { _key: 'c', label: 'Monthly' },
        { _key: 'd', label: 'If the form fails', value: 'Contact the organization.' },
      ],
    },
  },
];
const read = async (query: string, dataset: StoredDocument[]) =>
  (await evaluate(parse(query), { dataset })).get();

describe('named facts migration', () => {
  it('keeps legacy facts visible if an editor starts a new object before migration', async () => {
    const partial = before.map((document) =>
      document._type === 'lessonsPage'
        ? { ...document, lessonDetails: { ages: 'Adults' } }
        : { ...document, paymentDetails: { fees: 'A confirmed fee policy' } },
    );
    const lessons = await read(lessonsPageQuery, partial);
    expect(lessons.glance.map((row: { value: string }) => row.value)).toEqual([
      'Online, live',
      'Set with the teacher',
      'Adults',
      'Agreed with her',
    ]);
    expect(lessons.glance[0].note).toBe('Video call');
    const donate = await read(donatePageQuery, partial);
    expect(donate.giveNow.facts[0].value).toBe('A confirmed fee policy');
    expect(donate.giveNow.facts[3].value).toBe('Contact the organization.');
    expect(donate.giveNow.facts[1].note).toBe('Confirm with the form owner');
    const ages = PENDING.find((row) => row.fields?.includes('lessonDetails.ages'));
    expect(ages).toBeDefined();
    expect(
      await read(
        `*[${pendingFilter(ages ?? { type: 'lessonsPage', fields: [], where: '', what: '' })}]._id`,
        partial,
      ),
    ).toEqual([]);
  });

  it('preserves values, notes, unknowns and public output, and replans to nothing', async () => {
    const plan = migration.plan(before);
    expect(plan.conflicts).toEqual([]);
    expect(plan.mutations).toHaveLength(2);
    expect(plan.mutations[0]).toMatchObject({ patch: { ifRevisionID: 'l1' } });
    const after = applyMutations(before, plan.mutations);
    expect(after[0]?.glance).toBeUndefined();
    expect(after[0]?.lessonDetails).toEqual({
      format: 'Online, live',
      when: 'Set with the teacher',
      cost: 'Agreed with her',
      notes: { format: 'Video call' },
    });
    expect(after[1]?.paymentDetails).toEqual({
      fallback: 'Contact the organization.',
      notes: { receipt: 'Confirm with the form owner' },
    });
    expect(migration.plan(after)).toEqual({ mutations: [], conflicts: [] });
    const values = (rows: { label: string; value: unknown; note: unknown }[]) =>
      rows.map(({ label, value, note }) => ({ label, value, note }));
    const oldLessons = await read(lessonsPageQuery, before);
    const newLessons = await read(lessonsPageQuery, after);
    expect(values(newLessons.glance)).toEqual(values(oldLessons.glance));
    const oldDonate = await read(donatePageQuery, before);
    const newDonate = await read(donatePageQuery, after);
    expect(values(newDonate.giveNow.facts)).toEqual(values(oldDonate.giveNow.facts));
    expect(newDonate.giveNow.facts[1]._key).toBe('receipt');
    for (const entry of PENDING.filter((row) =>
      row.fields?.some((field) => /^(lessonDetails|paymentDetails)\./.test(field)),
    )) {
      const query = `*[${pendingFilter(entry)}]._id`;
      expect(await read(query, after), entry.what).toEqual(await read(query, before));
    }
  });

  it.each([
    [{ label: 'Unexpected', value: 'Keep me' }],
    [
      { label: 'Format', value: 'A' },
      { label: 'Format', value: 'B' },
    ],
    [{ label: 'Format', value: 42 }],
  ])('blocks unfamiliar or conflicting content rather than discarding it: %j', (...rows) => {
    const plan = migration.plan([{ ...before[0], glance: rows } as StoredDocument]);
    expect(plan.mutations).toEqual([]);
    expect(plan.conflicts).toHaveLength(1);
  });

  it('blocks an existing new value and affected drafts, leaving unrelated drafts alone', () => {
    expect(
      migration.plan([{ ...before[0], lessonDetails: { format: 'Changed' } } as StoredDocument])
        .conflicts,
    ).toHaveLength(1);
    const draft = { ...before[0], _id: 'drafts.lessonsPage' } as StoredDocument;
    const otherDraft = { _id: 'drafts.galleryPage', _type: 'galleryPage' };
    const plan = migration.plan(before);
    expect(
      blockers(plan, unpublished(migration, [...before, draft], [draft, otherDraft], plan)),
    ).toHaveLength(1);
    expect(unpublished(migration, before, [otherDraft], plan)).toEqual([]);
  });
});
