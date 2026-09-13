/**
 * The Programs hub view: what `/programs` hands the library parts, built from the one Programs query
 * (`10 Programs.dc.html`, spec Q2 of Phase 6). Pure, so a test drives it with a fixture: the layout
 * with the schema defaults, the slim header with the Studio's actions and the registry's chip for a
 * missing heading, every program as a card in order (the first three under the `cards` option's
 * `three`), a program with its own page linking there and an inline program linking to its section
 * on this page, every photograph resolved to a CDN set with its alt and framing, the take-part rows
 * with the intro that counts them, and the `data-sanity` attributes for click-to-edit in draft mode.
 */
import type { programsPageQuery } from '@oy/content/queries';
import { countWord } from '@oy/ui/content/count-word.ts';
import type { ClientReturn } from '@sanity/client';
import { pageSkeleton } from './page-skeleton';
import { type BuildOptions, resolveImage } from './view';

export type ProgramsPageData = NonNullable<ClientReturn<typeof programsPageQuery, unknown>>;

export interface ProgramsLayout extends Record<string, string> {
  cards: 'four' | 'three' | 'pairs';
  inline: 'expanded' | 'collapsed';
  yearstrip: 'shown' | 'hidden';
}

const PAGE_TITLE = 'Our programs';

/** The sections the two inline programs keep on this page, by the program's slug. */
export const INLINE_SECTIONS: Readonly<Record<string, string>> = {
  'kids-stem': 'kids',
  'cultural-exchange': 'exchange',
};

const COLUMNS: Record<ProgramsLayout['cards'], 2 | 3 | 4> = { four: 4, three: 3, pairs: 2 };

/** The take-part intro, counting the rows the band draws. */
function takePartIntro(count: number): string | undefined {
  if (count === 0) return undefined;
  return `${countWord(count)} ${count === 1 ? 'way' : 'ways'} to be part of the programs.`;
}

export function buildProgramsPage(data: ProgramsPageData | null, options: BuildOptions) {
  const page = pageSkeleton<ProgramsLayout>('programsPage', data, options, PAGE_TITLE);
  const { edit, layout } = page;

  const programs = (data?.programs ?? []).filter((program) => program !== null);
  const shown = layout.cards === 'three' ? programs.slice(0, 3) : programs;

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
    takePart: {
      ...page.takePart,
      intro: takePartIntro(page.takePart.rows.length),
      labels: 'column' as const,
    },
    edit: page.layoutEdit,
  };
}

export type ProgramsPageView = ReturnType<typeof buildProgramsPage>;
