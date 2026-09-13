/**
 * The Collective page view: what `/programs/cultural-collective` hands the library parts, built from
 * the one Collective query (`12 Yoruba Cultural Collective.dc.html`, spec Q9 and Q12 to Q15 of Phase 6).
 * Pure, so a test drives it with a fixture: the layout with the schema defaults (the page root carries
 * `green`, which the tokens read inside the page's collective scope), the slim header with its gold
 * "Partner with the Collective" and "See what is on", why culture and sustainability sit together (the
 * argument or its chip) beside the Collective program's photograph, the one voice as it stands or its
 * slot under the registry's chip, the take-part rows with the lead that counts them, and the
 * `data-sanity` attributes for click-to-edit in draft mode.
 */
import { COLLECTIVE_VOICE_SLOT, pendingWhat } from '@oy/content/pending';
import type { collectivePageQuery } from '@oy/content/queries';
import { countWord } from '@oy/ui/content/count-word.ts';
import type { ClientReturn } from '@sanity/client';
import { pageSkeleton } from './page-skeleton';
import { type BuildOptions, resolveImage } from './view';

export type CollectivePageData = NonNullable<ClientReturn<typeof collectivePageQuery, unknown>>;

export interface CollectiveLayout extends Record<string, string> {
  initiatives: 'side' | 'stacked';
  green: 'signal' | 'strong';
  status: 'shown' | 'hidden';
  events: 'shown' | 'hidden';
}

const PAGE_TITLE = 'Yoruba Cultural Collective';

const pending = (field: string) => pendingWhat('collectivePage', field) ?? 'this part of the page';

/** The take-part lead as spec Q15 keeps it, counting the rows the band draws. */
function takePartIntro(count: number): string | undefined {
  if (count === 0) return undefined;
  const ways = `${countWord(count)} ${count === 1 ? 'way' : 'ways'}`;
  return `The projects above are led by members. ${ways} to join them.`;
}

export function buildCollectivePage(data: CollectivePageData | null, options: BuildOptions) {
  const page = pageSkeleton<CollectiveLayout>('collectivePage', data, options, PAGE_TITLE);
  const { edit, layout } = page;
  const photo = data?.photo;
  const voice = data?.voice;

  return {
    title: page.title,
    description: page.description,
    layout,
    root: { ...layout },
    header: { variant: 'slim' as const, ...page.header },
    why: {
      argument: data?.argument && data.argument.length > 0 ? data.argument : undefined,
      pending: pending('argument'),
      edit: edit('argument'),
      // The Collective program's own photograph, so one replacement reaches every card and this page.
      photo: resolveImage(options.imageSet, photo?.image, { width: 720 }),
      photoWhat: `a photo of ${photo?.name?.trim() || PAGE_TITLE}`,
      photoEdit: photo ? edit('image', photo._id, 'program') : undefined,
    },
    voice: {
      testimonial: voice
        ? {
            quote: voice.quote,
            name: voice.name,
            relation: voice.relation,
            permissionToName: voice.permissionToName,
          }
        : undefined,
      placeholder: COLLECTIVE_VOICE_SLOT,
      pending: pending('voice'),
      edit: voice ? edit('quote', voice._id, 'testimonial') : edit('voice'),
    },
    takePart: {
      ...page.takePart,
      intro: takePartIntro(page.takePart.rows.length),
      labels: 'column' as const,
    },
    edit: page.layoutEdit,
  };
}

export type CollectivePageView = ReturnType<typeof buildCollectivePage>;
