/**
 * The Collective page view: what `/programs/cultural-collective` hands the library parts, built from
 * the one Collective query (`12 Yoruba Cultural Collective.dc.html`, spec Q9 and Q12 to Q15 of Phase 6).
 * Pure, so a test drives it with a fixture: the layout with the schema defaults (the page root carries
 * `green`, which the tokens read inside the page's collective scope), the slim header with its gold
 * "Partner with the Collective" and "See what is on", why culture and sustainability sit together (the
 * argument or its chip) beside the Collective program's photograph, each initiative in its own section
 * in the page's order (its status line, blurb, four facts and photograph, each owed one under its own
 * chip, laid out and its status pill shown by the `initiatives` and `status` options), the one voice as
 * it stands or its slot under the registry's chip, the take-part rows with the lead that counts them,
 * and the `data-sanity` attributes for click-to-edit in draft mode.
 */
import { COLLECTIVE_VOICE_SLOT, pendingWhat } from '@oy/content/pending';
import type { collectivePageQuery } from '@oy/content/queries';
import { countWord } from '@oy/ui/content/count-word.ts';
import type { ClientReturn } from '@sanity/client';
import { pageSkeleton } from './page-skeleton';
import { type BuildOptions, cleanText, resolveImage } from './view';

export type CollectivePageData = NonNullable<ClientReturn<typeof collectivePageQuery, unknown>>;

export interface CollectiveLayout extends Record<string, string> {
  initiatives: 'side' | 'stacked';
  green: 'signal' | 'strong';
  status: 'shown' | 'hidden';
  events: 'shown' | 'hidden';
}

const PAGE_TITLE = 'Yoruba Cultural Collective';

const pending = (field: string) => pendingWhat('collectivePage', field) ?? 'this part of the page';

/** An initiative's status value as its fact reads it. */
const STATUS_WORDS: Readonly<Record<string, string>> = {
  planned: 'Planned',
  piloting: 'Piloting',
  running: 'Running',
};

const initiativePending = (field: string) => pendingWhat('initiative', field) ?? 'this fact';

/** A section id from the initiative's name ("Solar Hub" is `solar-hub`), else its place. */
function sectionId(name: string | undefined, index: number): string {
  const id = (name ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return id || `initiative-${index + 1}`;
}

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
  const initiatives = (data?.initiatives ?? []).filter(
    (initiative) => initiative !== null && Boolean(cleanText(initiative.name)),
  );

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
      photoWhat: `a photo of ${cleanText(photo?.name) ?? PAGE_TITLE}`,
      photoEdit: photo ? edit('image', photo._id, 'program') : undefined,
    },
    initiatives: {
      layout: layout.initiatives,
      status: layout.status !== 'hidden',
      items: initiatives.map((initiative, index) => {
        const id = sectionId(cleanText(initiative.name), index);
        const status = cleanText(initiative.status);
        return {
          _id: initiative._id,
          id,
          headingId: `${id}-heading`,
          // The prototype alternates the grounds from white, whether or not the events show.
          ground: index % 2 === 1 ? ('alt' as const) : ('white' as const),
          initiative: {
            name: initiative.name,
            memberLed: initiative.memberLed,
            statusLine: cleanText(initiative.statusLine)
              ? (initiative.statusLine ?? undefined)
              : undefined,
            blurb: cleanText(initiative.blurb) ? (initiative.blurb ?? undefined) : undefined,
            image: resolveImage(options.imageSet, initiative.image, { width: 1100 }),
          },
          facts: [
            {
              label: 'Status',
              value: status ? (STATUS_WORDS[status] ?? status) : undefined,
              pending: initiativePending('status'),
            },
            {
              label: 'Serves',
              value: initiative.serves || undefined,
              pending: initiativePending('serves'),
            },
            {
              label: 'Since',
              value: initiative.since || undefined,
              pending: initiativePending('since'),
            },
            {
              label: 'Next',
              value: initiative.next || undefined,
              pending: initiativePending('next'),
            },
          ],
          statusPending: initiativePending('statusLine'),
          blurbPending: initiativePending('blurb'),
          imageEdit: edit('image', initiative._id, 'initiative'),
        };
      }),
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
