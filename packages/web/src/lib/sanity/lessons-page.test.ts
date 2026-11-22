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
  learn: null,
  levels: null,
  oneLesson: null,
  faq: [
    { _key: 'faq-1', question: 'How much does it cost?', answer: null },
    { _key: 'faq-2', question: 'When are the lessons?', answer: null },
    { _key: 'faq-3', question: 'Can a parent sit in?', answer: null },
    { _key: 'faq-4', question: 'What does a child need?', answer: null },
    {
      _key: 'faq-5',
      question: 'What if my child already understands some Yoruba?',
      answer: null,
    },
  ],
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

  it('keeps the glance band with its Pending line while the page holds no facts', () => {
    const view = buildLessonsPage(null, options);
    expect(view.glance).toEqual([]);
    expect(view.glancePending).toBe('the lesson details');
  });

  it("draws the glance's four facts, the owed one with its chip", () => {
    expect(buildLessonsPage(seeded, options).glance).toEqual([
      {
        key: 'format',
        label: 'Format',
        value: 'Online, live',
        note: 'Video call',
        pending: 'the lesson format',
      },
      {
        key: 'when',
        label: 'When',
        value: 'Set with the teacher',
        note: undefined,
        pending: 'when lessons run',
      },
      {
        key: 'ages',
        label: 'Ages',
        value: undefined,
        note: undefined,
        pending: 'the ages lessons serve',
      },
      {
        key: 'cost',
        label: 'Cost',
        value: 'Agreed with her',
        note: undefined,
        pending: 'how lesson fees are agreed',
      },
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
      bioPending: undefined,
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
    expect(view.bioPending).toBe("the teacher's short bio");
    expect(view.variant).toBe('portrait');
    expect(view.email).toBe('teacher@example.org');
    const hidden = buildLessonsPage(
      { ...linked, layout: { portraits: 'hidden' } } as LessonsPageData,
      options,
    );
    expect(hidden.teacher.variant).toBe('nophoto');
    expect(hidden.teacher.person.image).toBeUndefined();
  });

  it('carries what you learn: the prose or its chip, and the levels once each says what it covers', () => {
    const empty = buildLessonsPage(seeded, options).learn;
    // The levels are parked (ADR 0058): the list is left out until a level holds its line.
    expect(empty).toEqual({
      prose: undefined,
      pending: 'what the lessons teach, in her words',
      levels: [],
      levelsShown: false,
      levelsPending: undefined,
      linePending: undefined,
    });
    const written = buildLessonsPage(
      {
        ...seeded,
        learn: [
          {
            _type: 'block',
            _key: 'b1',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 's1', text: '[ In her words ]', marks: [] }],
          },
        ],
        levels: [
          { _key: 'level-1', name: '[ Level one ]', blurb: '[ What it covers ]' },
          { _key: 'level-2', name: '[ Level two ]', blurb: null },
        ],
      } as unknown as LessonsPageData,
      options,
    ).learn;
    expect(written.prose).toHaveLength(1);
    // A level without its line waits unseen beside the one that has it.
    expect(written.levelsShown).toBe(true);
    expect(written.levels).toEqual([
      { _key: 'level-1', title: '[ Level one ]', line: '[ What it covers ]' },
    ]);
  });

  it("carries a lesson's steps as day-led rows, shown or hidden by the option", () => {
    const view = buildLessonsPage(seeded, options).lesson;
    expect(view).toEqual({
      shown: true,
      ground: 'white',
      steps: [],
      pending: 'the shape of a lesson',
      stepPending: 'the step',
    });
    const steps = buildLessonsPage(
      {
        ...seeded,
        oneLesson: [{ _key: 'step-1', step: '[ Step ]', title: '[ What happens ]', detail: null }],
      } as unknown as LessonsPageData,
      options,
    ).lesson.steps;
    expect(steps).toEqual([
      { _key: 'step-1', day: '[ Step ]', title: { en: '[ What happens ]' }, detail: null },
    ]);
    const hidden = buildLessonsPage(
      { ...seeded, layout: { lesson: 'hidden' } } as LessonsPageData,
      options,
    );
    expect(hidden.lesson.shown).toBe(false);
  });

  it('lists the answered questions closed, with the lead that counts them, and none until one is answered', () => {
    // The questions are parked (ADR 0058): one without its answer is left out, and so is a section
    // that would hold none.
    const unanswered = buildLessonsPage(seeded, options).faq;
    expect(unanswered).toMatchObject({
      shown: false,
      items: [],
      defaultOpen: false,
      lead: undefined,
      pending: undefined,
      answerPending: undefined,
    });
    const answer = [
      {
        _type: 'block',
        _key: 'a1',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 's1', text: '[ An answer ]', marks: [] }],
      },
    ];
    const answered = {
      ...seeded,
      faq: (seeded.faq ?? []).map((item) => ({ ...item, answer })),
    } as unknown as LessonsPageData;
    const faq = buildLessonsPage(answered, options).faq;
    expect(faq).toMatchObject({
      shown: true,
      defaultOpen: false,
      lead: 'The five we hear most often.',
    });
    expect(faq.items.map((item) => item.question)).toEqual([
      'How much does it cost?',
      'When are the lessons?',
      'Can a parent sit in?',
      'What does a child need?',
      'What if my child already understands some Yoruba?',
    ]);
    const two = buildLessonsPage(
      {
        ...seeded,
        faq: (seeded.faq ?? []).map((item, at) => (at < 2 ? { ...item, answer } : item)),
      } as unknown as LessonsPageData,
      options,
    ).faq;
    expect(two.items).toHaveLength(2);
    expect(two.lead).toBe('The two we hear most often.');
    // The sections under What you learn take turns from white, counting only the ones drawn.
    const grounds = (data: LessonsPageData) => {
      const view = buildLessonsPage(data, options);
      return [
        view.lesson.shown && view.lesson.ground,
        view.faq.shown && view.faq.ground,
        view.takePart.ground,
      ].filter(Boolean);
    };
    expect(grounds(answered)).toEqual(['white', 'alt', 'white']);
    expect(grounds(seeded)).toEqual(['white', 'alt']);
    expect(grounds({ ...answered, layout: { lesson: 'hidden' } } as LessonsPageData)).toEqual([
      'white',
      'alt',
    ]);
    expect(grounds({ ...seeded, layout: { lesson: 'hidden' } } as LessonsPageData)).toEqual([
      'white',
    ]);
    const open = buildLessonsPage(
      { ...seeded, layout: { faq: 'open' } } as LessonsPageData,
      options,
    );
    expect(open.faq.defaultOpen).toBe(false);
    expect(buildLessonsPage(null, options).faq).toMatchObject({ items: [], lead: undefined });
    const one = buildLessonsPage(
      { ...answered, faq: answered.faq?.slice(0, 1) } as LessonsPageData,
      options,
    );
    expect(one.faq.lead).toBe('The one we hear most often.');
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
