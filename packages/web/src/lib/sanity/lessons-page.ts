/**
 * The Lessons page view: what `/programs/yoruba-lessons` hands the library parts, built from the one
 * Lessons query (`11 Yoruba Language School.dc.html`, spec Q6 to Q9 of Phase 6). Pure, so a test drives
 * it with a fixture: the layout with the schema defaults, the slim header with its gold "Write to the
 * teacher", the glance's facts with the registry's chip for an owed one, the teacher (the woven tick,
 * "Teacher" and the chip for her name before she is linked; her name, role, short bio and portrait
 * after, the portrait by the `portraits` option) with her routing contact's email or its chip, what
 * you learn (the prose and the levels, or their chips), the steps of a lesson as the `lesson` option
 * shows them, the take-part rows, and the `data-sanity` attributes for click-to-edit in draft mode. The
 * page is Yoruba Language Lessons: never "School", no terms, no Saturdays, no venue.
 */
import { PENDING, pendingWhat } from '@oy/content/pending';
import type { lessonsPageQuery } from '@oy/content/queries';
import type { ClientReturn } from '@sanity/client';
import { glanceFacts, pageSkeleton } from './page-skeleton';
import { type BuildOptions, cleanText, resolveImage } from './view';

export type LessonsPageData = NonNullable<ClientReturn<typeof lessonsPageQuery, unknown>>;

export interface LessonsLayout extends Record<string, string> {
  lesson: 'shown' | 'hidden';
  portraits: 'shown' | 'hidden';
  faq: 'closed' | 'open';
}

const PAGE_TITLE = 'Yoruba Language Lessons';

const pending = (field: string) => pendingWhat('lessonsPage', field) ?? 'this part of the page';

/** One teacher is a confirmed fact, so her card says "Teacher" before the Studio names her. */
const TEACHER_ROLE = 'Teacher';

/** The settings row is a condition on the teacher's routing contact, so it is found by that. */
const EMAIL_PENDING =
  PENDING.find((row) => row.type === 'siteSettings' && row.condition?.includes('"teacher"'))
    ?.what ?? "the teacher's email";

export function buildLessonsPage(data: LessonsPageData | null, options: BuildOptions) {
  const page = pageSkeleton<LessonsLayout>('lessonsPage', data, options, PAGE_TITLE);
  const { edit, layout } = page;

  const teacher = data?.teacher;
  const portraits = layout.portraits === 'shown';
  const portrait = portraits
    ? resolveImage(options.imageSet, teacher?.portrait, { width: 640 })
    : undefined;

  return {
    title: page.title,
    description: page.description,
    layout,
    root: { ...layout },
    header: { variant: 'slim' as const, ...page.header },
    glance: glanceFacts('lessonsPage', 'glance', data?.glance),
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
      edit: teacher ? edit('name', teacher._id, 'person') : edit('teacher'),
      // Null while the settings hold no address, so the card shows the registry's chip.
      email: cleanText(data?.teacherEmail) ?? null,
      emailPending: EMAIL_PENDING,
    },
    learn: {
      prose: data?.learn && data.learn.length > 0 ? data.learn : undefined,
      pending: pending('learn'),
      levels: (data?.levels ?? [])
        .filter((level) => level !== null)
        .map((level) => ({ _key: level._key, title: level.name, line: level.blurb })),
      levelsPending: pending('levels[]'),
      linePending: pending('levels'),
    },
    lesson: {
      shown: layout.lesson !== 'hidden',
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
    takePart: { ...page.takePart, labels: 'column' as const },
    edit: page.layoutEdit,
  };
}

export type LessonsPageView = ReturnType<typeof buildLessonsPage>;
