/**
 * The Lessons page view: what `/programs/yoruba-lessons` hands the library parts, built from the one
 * Lessons query (`11 Yoruba Language School.dc.html`, spec Q6 to Q9 of Phase 6). Pure, so a test drives
 * it with a fixture: the layout with the schema defaults, the slim header with its gold "Write to the
 * teacher", the glance's facts with the registry's chip for an owed one, the teacher (the woven tick,
 * "Teacher" and the chip for her name before she is linked; her name, role, short bio and portrait
 * after, the portrait by the `portraits` option) with her routing contact's email or its chip, what
 * you learn (the prose and the levels, or their chips), the steps of a lesson as the `lesson` option
 * shows them, the questions parents ask with the lead that counts them, closed or the first open by
 * `faq`, the take-part rows, and the `data-sanity` attributes for click-to-edit in draft mode. The
 * page is Yoruba Language Lessons: never "School", no terms, no Saturdays, no venue.
 */
import { pendingWhat, TEACHER_EMAIL_PENDING } from '@oy/content/pending';
import type { lessonsPageQuery } from '@oy/content/queries';
import { countWord } from '@oy/ui/content/count-word.ts';
import type { ClientReturn } from '@sanity/client';
import { glanceFacts, pageSkeleton } from './page-skeleton';
import { alternate, type BuildOptions, cleanText, heldOrAsked, resolveImage } from './view';

export type LessonsPageData = NonNullable<ClientReturn<typeof lessonsPageQuery, unknown>>;

export interface LessonsLayout extends Record<string, string> {
  lesson: 'shown' | 'hidden';
  portraits: 'shown' | 'hidden';
  faq: 'closed' | 'open';
}

const PAGE_TITLE = 'Yoruba Language Lessons';

const pending = (field: string) => pendingWhat('lessonsPage', field) ?? 'this part of the page';

/** The questions' lead, counting them as the prototype's "The five we hear most often." does. */
function faqLead(count: number): string | undefined {
  return count === 0 ? undefined : `The ${countWord(count).toLowerCase()} we hear most often.`;
}

/** One teacher is a confirmed fact, so her card says "Teacher" before the Studio names her. */
const TEACHER_ROLE = 'Teacher';

export function buildLessonsPage(data: LessonsPageData | null, options: BuildOptions) {
  const page = pageSkeleton<LessonsLayout>('lessonsPage', data, options, PAGE_TITLE);
  const { edit, layout } = page;

  const teacher = data?.teacher;
  const portraits = layout.portraits === 'shown';
  const portrait = portraits
    ? resolveImage(options.imageSet, teacher?.portrait, { width: 640 })
    : undefined;

  // The levels and the questions are parked (ADR 0058): while the registry asks for neither a list nor
  // an item's line, a level without its line and a question without its answer are left out, and so is
  // the block that would hold none.
  const levelsPending = pendingWhat('lessonsPage', 'levels[]');
  const levelPending = pendingWhat('lessonsPage', 'levels');
  const levels = (data?.levels ?? [])
    .filter((level) => level !== null)
    .filter((level) => heldOrAsked(cleanText(level.blurb), levelPending))
    .map((level) => ({ _key: level._key, title: level.name, line: level.blurb }));
  const questionsPending = pendingWhat('lessonsPage', 'faq[]');
  const answerPending = pendingWhat('lessonsPage', 'faq');
  const questions = (data?.faq ?? [])
    .filter((item) => item !== null)
    .map((item) => ({
      _key: item._key,
      question: item.question,
      answer: item.answer && item.answer.length > 0 ? item.answer : undefined,
    }))
    .filter((item) => heldOrAsked(item.answer, answerPending));
  const lessonShown = layout.lesson !== 'hidden';
  const faqShown = heldOrAsked(questions.length > 0, questionsPending);
  // What you learn stands on the alternate ground; the sections under it take turns from white,
  // counting only the ones the page draws, so no two neighbours share a ground.
  const [lessonGround, faqGround, takePartGround] = alternate(
    [lessonShown, faqShown, true],
    'white',
  );

  return {
    title: page.title,
    description: page.description,
    layout,
    root: { ...layout },
    header: { variant: 'slim' as const, ...page.header },
    glance: glanceFacts('lessonsPage', 'lessonDetails', data?.glance),
    glancePending: 'the lesson details',
    teacher: {
      intro: data?.teacherIntro ?? undefined,
      person: {
        _id: teacher?._id,
        name: teacher?.name ?? undefined,
        role: cleanText(teacher?.role) ? (teacher?.role ?? TEACHER_ROLE) : TEACHER_ROLE,
        bio: teacher?.bioShort ?? undefined,
        image: portrait,
      },
      // Without a portrait, or with portraits hidden, the card draws the woven tick.
      variant: portrait ? ('portrait' as const) : ('nophoto' as const),
      namePending: pendingWhat('lessonsPage', 'teacher') ?? "the teacher's name",
      // Before she is linked her name's chip asks for the bio too; after, the bio asks for itself.
      bioPending: teacher ? pendingWhat('person', 'bioShort') : undefined,
      edit: teacher ? edit('name', teacher._id, 'person') : edit('teacher'),
      // Null while the settings hold no address, so the card shows the registry's chip.
      email: cleanText(data?.teacherEmail) ?? null,
      emailPending: TEACHER_EMAIL_PENDING,
    },
    learn: {
      prose: data?.learn && data.learn.length > 0 ? data.learn : undefined,
      pending: pending('learn'),
      levels,
      levelsShown: heldOrAsked(levels.length > 0, levelsPending),
      levelsPending,
      linePending: levelPending,
    },
    lesson: {
      shown: lessonShown,
      ground: lessonGround,
      // Day-led schedule rows: the step's place in the lesson where a festival row shows its time.
      steps: (data?.oneLesson ?? [])
        .filter((step) => step !== null)
        .map((step) => ({
          _key: step._key,
          day: step.step,
          title: step.title ? { en: step.title } : null,
          detail: step.detail,
        })),
      pending: pending('oneLesson[]'),
      stepPending: pending('oneLesson'),
    },
    faq: {
      shown: faqShown,
      ground: faqGround,
      items: questions,
      defaultOpen: layout.faq === 'open',
      lead: faqLead(questions.filter((item) => cleanText(item.question)).length),
      pending: questionsPending,
      answerPending,
    },
    takePart: { ...page.takePart, labels: 'column' as const, ground: takePartGround },
    edit: page.layoutEdit,
  };
}

export type LessonsPageView = ReturnType<typeof buildLessonsPage>;
