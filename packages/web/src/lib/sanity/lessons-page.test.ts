import { createImageSet } from '@oy/content/images';
import { describe, expect, it } from 'vitest';
import { buildLessonsPage, type LessonsPageData } from './lessons-page';

const imageSet = createImageSet({ projectId: 'abc123', dataset: 'development' });
const image = (alt: string) => ({
  _type: 'oyImage' as const,
  alt,
  caption: null,
  hotspot: null,
  crop: null,
  asset: { _ref: 'image-0a1b2c3d-1100x728-jpg', _type: 'reference' as const },
});
const options = { imageSet, draft: false, studioUrl: '/admin' };

// The development dataset as the seed leaves it on 13 September 2026: no teacher, no address.
const seeded = {
  header: {
    kicker: { yo: 'Ẹ̀kọ́ èdè Yorùbá', en: 'Yoruba lessons' },
    title: 'Yoruba Language Lessons',
    line: 'Live online lessons with one teacher, for children and adults who want to speak, read, and carry the language forward.',
  },
  primaryAction: {
    label: 'Write to the teacher',
    kind: 'enquiry',
    enquiryKind: 'enrol',
    href: null,
    newTab: null,
  },
  secondaryActions: null,
  glance: [
    { _key: 'fact-1', label: 'Format', value: 'Online, live', note: 'Video call' },
    { _key: 'fact-2', label: 'When', value: 'Set with the teacher', note: null },
    { _key: 'fact-3', label: 'Ages', value: null, note: null },
    { _key: 'fact-4', label: 'Cost', value: 'Agreed with her', note: null },
  ],
  teacher: null,
  teacherIntro:
    'There is no sign-up form and no fixed timetable. You write, she places the learner and proposes a time, and the first lesson follows.',
  takePart: [
    {
      _key: 'way-1',
      way: 'volunteer',
      chip: 'Volunteer',
      title: 'Volunteer with us',
      line: 'One short form.',
      label: 'Raise your hand',
    },
    {
      _key: 'way-2',
      way: 'member',
      chip: null,
      title: 'Become a member',
      line: 'Members carry the lessons and every other program.',
      label: 'Become a member',
    },
    {
      _key: 'way-3',
      way: 'give',
      chip: null,
      title: 'Give toward the lessons',
      line: null,
      label: 'Donate',
    },
  ],
  teacherEmail: null,
  layout: { lesson: 'shown', portraits: 'shown', faq: 'closed' },
  seo: null,
} as unknown as LessonsPageData;

// Test values only: the Studio holds no teacher yet.
const teacher = {
  _id: 'person-teacher',
  name: '[ Teacher name ]',
  role: null,
  bioShort: '[ A short bio ]',
  portrait: image('[ Portrait ]'),
};

describe('buildLessonsPage', () => {
  it('fills the layout defaults, the slim header and its gold action', () => {
    const view = buildLessonsPage(seeded, options);
    expect(view.layout).toEqual({ lesson: 'shown', portraits: 'shown', faq: 'closed' });
    expect(view.root).toEqual(view.layout);
    expect(view.header).toMatchObject({ variant: 'slim', title: 'Yoruba Language Lessons' });
    expect(view.header.actions.map((action) => action.label)).toEqual(['Write to the teacher']);
    expect(view.title).toBe('Yoruba Language Lessons');
    expect(buildLessonsPage(null, options).title).toBe('Yoruba Language Lessons');
  });

  it("draws the glance's four facts, the owed one with its chip", () => {
    expect(buildLessonsPage(seeded, options).glance).toEqual([
      { label: 'Format', value: 'Online, live', note: 'Video call', pending: 'a glance fact' },
      { label: 'When', value: 'Set with the teacher', note: undefined, pending: 'a glance fact' },
      { label: 'Ages', value: undefined, note: undefined, pending: 'a glance fact' },
      { label: 'Cost', value: 'Agreed with her', note: undefined, pending: 'a glance fact' },
    ]);
  });

  it('before a teacher is linked: the role, the woven tick and the chips for her name and email', () => {
    const view = buildLessonsPage(seeded, options).teacher;
    expect(view).toMatchObject({
      intro: seeded.teacherIntro,
      person: { role: 'Teacher', name: undefined, bio: undefined, image: undefined },
      variant: 'nophoto',
      namePending: "the teacher's name and bio",
      email: null,
      emailPending: "the teacher's email",
    });
  });

  it('once she is linked: her name, role, bio, and her portrait unless the option hides portraits', () => {
    const linked = { ...seeded, teacher, teacherEmail: 'teacher@example.org' } as LessonsPageData;
    const view = buildLessonsPage(linked, options).teacher;
    expect(view.person).toMatchObject({
      name: '[ Teacher name ]',
      role: 'Teacher',
      bio: '[ A short bio ]',
    });
    expect(view.person.image?.alt).toBe('[ Portrait ]');
    expect(view.variant).toBe('portrait');
    expect(view.email).toBe('teacher@example.org');
    const hidden = buildLessonsPage(
      { ...linked, layout: { portraits: 'hidden' } } as LessonsPageData,
      options,
    );
    expect(hidden.teacher.variant).toBe('nophoto');
    expect(hidden.teacher.person.image).toBeUndefined();
  });

  it('carries the take-part rows without a lead, and edit attributes in draft mode only', () => {
    const view = buildLessonsPage(seeded, options);
    expect(view.takePart.rows.map((row) => row.way)).toEqual(['volunteer', 'member', 'give']);
    expect(view.takePart).toMatchObject({ labels: 'column', pending: 'the ways in' });
    expect(view.edit.portraits).toBeUndefined();
    const draft = buildLessonsPage({ ...seeded, teacher } as LessonsPageData, {
      ...options,
      draft: true,
    });
    expect(draft.edit.portraits).toContain('path=layout.portraits');
    expect(draft.teacher.edit).toContain('id=person-teacher;type=person');
    expect(buildLessonsPage(seeded, { ...options, draft: true }).teacher.edit).toContain(
      'path=teacher',
    );
  });
});
