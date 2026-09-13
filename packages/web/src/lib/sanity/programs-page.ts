/**
 * The Programs hub view: what `/programs` hands the library parts, built from the one Programs query
 * (`10 Programs.dc.html`, spec Q2 of Phase 6). Pure, so a test drives it with a fixture: the layout
 * with the schema defaults, the slim header with the Studio's actions and the registry's chip for a
 * missing heading, every program as a card in order (the first three under the `cards` option's
 * `three`), a program with its own page linking there and an inline program linking to its section
 * on this page, the two inline programs (Kids & STEM with its sub-programs, Cultural Exchange with its
 * facts) open or closed by `inline` and hidden with a card the `three` option leaves out, the year
 * strip's rows named by program or by event page, every
 * photograph resolved to a CDN set with its alt and framing, the take-part rows with the intro that
 * counts them, and the `data-sanity` attributes for click-to-edit in draft mode.
 */
import { pendingWhat } from '@oy/content/pending';
import type { programsPageQuery } from '@oy/content/queries';
import { EVENT_PAGE_NAMES, INLINE_PROGRAM_SECTIONS } from '@oy/content/routes';
import { countWord } from '@oy/ui/content/count-word.ts';
import type { ClientReturn } from '@sanity/client';
import { pageSkeleton } from './page-skeleton';
import { type BuildOptions, cleanText, resolveImage } from './view';

export type ProgramsPageData = NonNullable<ClientReturn<typeof programsPageQuery, unknown>>;

export interface ProgramsLayout extends Record<string, string> {
  cards: 'four' | 'three' | 'pairs';
  inline: 'expanded' | 'collapsed';
  yearstrip: 'shown' | 'hidden';
}

const PAGE_TITLE = 'Our programs';

/** The sections the two inline programs keep on this page, by the program's slug. */
const INLINE_SECTIONS = INLINE_PROGRAM_SECTIONS;

const COLUMNS: Record<ProgramsLayout['cards'], 2 | 3 | 4> = { four: 4, three: 3, pairs: 2 };

/** The inline programs' section headings while the Studio holds no title: the programs' own names. */
const KIDS_STEM = 'Kids & STEM';
const CULTURAL_EXCHANGE = 'Cultural Exchange';

/** The take-part intro, counting the rows the band draws. */
function takePartIntro(count: number): string | undefined {
  if (count === 0) return undefined;
  return `${countWord(count)} ${count === 1 ? 'way' : 'ways'} to be part of the programs.`;
}

const pending = (field: string) => pendingWhat('programsPage', field) ?? 'this fact';

export function buildProgramsPage(data: ProgramsPageData | null, options: BuildOptions) {
  const page = pageSkeleton<ProgramsLayout>('programsPage', data, options, PAGE_TITLE);
  const { edit, layout } = page;

  const programs = (data?.programs ?? []).filter((program) => program !== null);
  const shown = layout.cards === 'three' ? programs.slice(0, 3) : programs;
  // A program the cards leave out takes its inline section with it (the prototype hides #exchange).
  const leftOut = new Set(
    programs.filter((program) => !shown.includes(program)).map((program) => program.slug),
  );
  const open = layout.inline === 'expanded';

  const kidsStem = data?.kidsStem;
  const exchange = data?.culturalExchange;
  const factPending = pending('kidsStem.subprograms');

  return {
    title: page.title,
    description: page.description,
    layout,
    root: { ...layout },
    header: { variant: 'slim' as const, ...page.header },
    cards: {
      columns: COLUMNS[layout.cards],
      // The prototype frames the photographs taller when three cards share the row.
      mediaHeight: layout.cards === 'three' ? 200 : 160,
      items: shown.map((program) => {
        const section = !program.page && program.slug ? INLINE_SECTIONS[program.slug] : undefined;
        return {
          program: {
            ...program,
            image: resolveImage(options.imageSet, program.image, { width: 360 }),
            // An inline program is described below, so its card goes there rather than to the
            // Studio's action, which the homepage words for itself.
            action: section
              ? { label: 'On this page', kind: 'anchor', href: `#${section}` }
              : program.action,
          },
          imageEdit: edit('image', program._id, 'program'),
        };
      }),
    },
    kids: {
      shown: !leftOut.has('kids-stem'),
      open,
      title: cleanText(kidsStem?.title) ? (kidsStem?.title ?? KIDS_STEM) : KIDS_STEM,
      blurb: kidsStem?.blurb ?? undefined,
      subprograms: (kidsStem?.subprograms ?? [])
        .filter((sub) => sub !== null)
        .map((sub) => ({
          _key: sub._key,
          name: sub.name,
          blurb: sub.blurb,
          image: resolveImage(options.imageSet, sub.image, { width: 540 }),
          imageEdit: edit(`kidsStem.subprograms[_key=="${sub._key}"].image`),
          facts: (sub.facts ?? [])
            .filter((fact) => fact !== null)
            .map((fact) => ({
              _key: fact._key,
              label: fact.label,
              value: fact.value,
              pending: factPending,
            })),
          action: sub.action,
        })),
    },
    exchange: {
      shown: !leftOut.has('cultural-exchange'),
      open,
      title: cleanText(exchange?.title)
        ? (exchange?.title ?? CULTURAL_EXCHANGE)
        : CULTURAL_EXCHANGE,
      blurb: cleanText(exchange?.blurb) ? (exchange?.blurb ?? undefined) : undefined,
      blurbPending: pending('culturalExchange.blurb'),
      // The prototype's facts the schema carries; its "Between" has no field (spec Q4).
      facts: [
        {
          label: 'Who it is for',
          value: exchange?.eligibility || undefined,
          pending: pending('culturalExchange.eligibility'),
        },
        {
          label: 'Cadence',
          value: exchange?.cadence || undefined,
          pending: pending('culturalExchange.cadence'),
        },
        {
          label: 'How to join',
          value: exchange?.howToJoin || undefined,
          pending: pending('culturalExchange.howToJoin'),
        },
      ],
      image: resolveImage(options.imageSet, exchange?.image, { width: 540 }),
      imagePending: pending('culturalExchange.image'),
      imageEdit: edit('culturalExchange.image'),
    },
    year: {
      shown: layout.yearstrip !== 'hidden',
      rows: (data?.yearStrip ?? [])
        .filter((row) => row !== null)
        .map((row) => ({
          _key: row._key,
          when: row.when,
          name:
            row.program ??
            (row.kind === 'festival' || row.kind === 'gala'
              ? EVENT_PAGE_NAMES[row.kind]
              : undefined),
          note: row.note,
        })),
      whenPending: pending('yearStrip'),
      pending: pending('yearStrip[]'),
      edit: edit('yearStrip'),
    },
    takePart: {
      ...page.takePart,
      intro: takePartIntro(page.takePart.rows.length),
      labels: 'column' as const,
    },
    edit: page.layoutEdit,
  };
}

export type ProgramsPageView = ReturnType<typeof buildProgramsPage>;
