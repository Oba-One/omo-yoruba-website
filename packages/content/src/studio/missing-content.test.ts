import { describe, expect, it } from 'vitest';
import { contentTasks } from './missing-content';
import { type TodoResult, todoPages, todoPlan, todoState } from './todo';

describe('Missing content', () => {
  it('groups one edition’s missing facts into one task and retains its full checklist', () => {
    const plan = todoPlan();
    const gala = plan.rows.filter(
      ({ entry }) =>
        entry.type === 'event' && entry.filter?.includes('gala') && entry.edition === 'next',
    );
    expect(gala.length).toBeGreaterThan(2);
    const result: TodoResult = {
      editions: [{ _id: 'gala-2026', kind: 'gala', start: '2026-11-28T17:00:00Z' }],
      rows: Object.fromEntries(
        gala.map((row) => [
          row.id,
          [{ _id: 'gala-2026', edition: 'gala-2026', title: 'Gala 2026', draft: true }],
        ]),
      ),
    };
    const tasks = contentTasks(todoState(plan, result, new Date('2026-10-11')), result);
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      title: 'Gala 2026',
      documentId: 'gala-2026',
      priority: 'events',
      draft: true,
      pages: ['galaPage'],
    });
    expect(tasks[0]?.details).toHaveLength(gala.length);
    for (const row of gala)
      expect(tasks[0]?.details.some((detail) => detail.endsWith(row.title))).toBe(true);
  });

  it('filters shared presence tasks by every page their registry names', () => {
    expect(todoPages('Gallery; Odunde and Gala, past years').sort()).toEqual([
      'festivalPage',
      'galaPage',
      'galleryPage',
    ]);
    expect(todoPages('Homepage, Impact and the Yoruba Cultural Collective').sort()).toEqual([
      'collectivePage',
      'homepage',
      'impactPage',
    ]);
  });
});
