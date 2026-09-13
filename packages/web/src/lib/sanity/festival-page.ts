/**
 * The festival page view: what `/odunde` hands the library parts, built from the one festival query.
 * Pure, so a test drives it with a fixture: the layout with the schema defaults, the next festival
 * edition (ADR 0024) and its facts for the header line and the glance strip with the registry's
 * chips where the Studio holds nothing, the page's two actions, the zones, the next edition's
 * schedule as the option shows it, the plan-your-visit facts, the take-part rows with the next
 * edition's vendor terms and the intro that counts them (ADR 0025), every photograph resolved to a CDN set
 * with its alt and framing, the head's title and description cleaned of stega, and the
 * `data-sanity` attributes for click-to-edit in draft mode. The parts every page singleton shares come
 * from `pageSkeleton`.
 */
import { pageEdition } from '@oy/content/lead-event';
import { pendingWhat, presenceWhat } from '@oy/content/pending';
import type { festivalPageQuery } from '@oy/content/queries';
import { countWord } from '@oy/ui/content/count-word.ts';
import { editionHours, longDate, shortDate } from '@oy/ui/content/edition-dates.ts';
import { figureSentence } from '@oy/ui/content/figure-sentence.ts';
import type { ClientReturn } from '@sanity/client';
import {
  GLANCE_MAX,
  type GlanceFactView,
  glanceFacts,
  pageSkeleton,
  pastYears,
} from './page-skeleton';
import { type BuildOptions, cleanText, resolveImage } from './view';

export type FestivalPageData = NonNullable<ClientReturn<typeof festivalPageQuery, unknown>>;

export interface FestivalLayout extends Record<string, string> {
  phead: 'photo' | 'slim';
  zones: 'mosaic' | 'five' | 'grid' | 'list';
  schedule: 'shown' | 'collapsed' | 'hidden';
  takepart: 'vendor' | 'sponsor';
  labels: 'column' | 'none' | 'kicker';
}

const PAGE_TITLE = 'Odunde Festival';
const KIND = 'festival';

const pending = (field: string) => pendingWhat('event', field, KIND) ?? 'this fact';

/** The take-part intro, counting the rows the band draws ("Four ways in."). */
function takePartIntro(count: number): string | undefined {
  if (count === 0) return undefined;
  return count === 1
    ? 'One way in. It says what it asks of you, then opens a short form.'
    : `${countWord(count)} ways in. Each one says what it asks of you, then opens a short form.`;
}

export function buildFestivalPage(data: FestivalPageData | null, options: BuildOptions) {
  const { imageSet, now = new Date() } = options;
  const page = pageSkeleton<FestivalLayout>('festivalPage', data, options, PAGE_TITLE);
  const { edit, layout } = page;

  const editions = (data?.editions ?? []).filter((event) => event !== null);
  const edition = pageEdition(editions, KIND, { now });
  const past = pastYears(editions, KIND, options, edit);

  const date = longDate(edition?.start);
  // The hours need both ends of the day: a missing end is the registry's "the hours" (its row checks
  // `end`), a missing start its "the date", so the chip always names the row that lists it.
  const hours = edition?.end ? editionHours(edition.start, edition.end) : undefined;
  const hoursPending = edition?.end ? pending('start') : pending('end');
  const cost = cleanText(edition?.cost) ? edition?.cost : undefined;

  const glance: GlanceFactView[] = [
    { label: 'Date', value: shortDate(edition?.start), pending: pending('start') },
    { label: 'Time', value: hours, pending: hoursPending },
    {
      label: 'Where',
      value: edition?.venue?.name || undefined,
      pending: pending('venue.name'),
      note: edition?.venue?.line || undefined,
      notePending: pending('venue.line'),
    },
    { label: 'Cost', value: cost ?? undefined, pending: pending('cost') },
    ...glanceFacts('festivalPage', 'extraFacts', data?.extraFacts),
  ].slice(0, GLANCE_MAX);

  return {
    title: page.title,
    description: page.description,
    layout,
    root: { ...layout },
    edition,
    header: {
      variant: layout.phead,
      ...page.header,
      facts: [
        date ? { text: date } : { pending: pending('start') },
        hours ? { text: hours } : { pending: hoursPending },
        cost ? { text: cost } : { pending: pending('cost') },
      ],
    },
    glance,
    whatItIs: data?.whatItIs && data.whatItIs.length > 0 ? data.whatItIs : undefined,
    zonesIntro: data?.zonesIntro ?? undefined,
    // The zones in order, framed by their hotspots; the block pads the owed ones.
    zones: (data?.zones ?? [])
      .filter((zone) => zone !== null)
      .map((zone) => ({
        _id: zone._id,
        name: zone.name,
        line: zone.line,
        image: resolveImage(imageSet, zone.image, { width: 720 }),
        imageEdit: edit('image', zone._id, 'zone'),
      })),
    schedule: {
      shown: layout.schedule !== 'hidden',
      open: layout.schedule === 'shown',
      items: (edition?.schedule ?? []).filter((item) => item !== null),
      pending: pending('schedule[]'),
      timePending: pendingWhat('event', 'schedule', KIND) ?? 'the time',
    },
    plan: {
      facts: (data?.planYourVisit ?? [])
        .filter((fact) => fact !== null)
        .map((fact) => ({
          _key: fact._key,
          label: fact.label,
          value: fact.value,
          pending: pendingWhat('festivalPage', 'planYourVisit') ?? 'a practical fact',
        })),
      pending: pendingWhat('festivalPage', 'planYourVisit[]') ?? 'the practical facts',
    },
    takePart: {
      ...page.takePart,
      intro: takePartIntro(page.takePart.rows.length),
      lead: layout.takepart,
      labels: layout.labels,
      // Null while the next edition holds no terms, so the vendor row shows the registry's chip.
      vendorTerms: edition?.vendorTerms ?? null,
      vendorTermsPending: pending('vendorTerms.fees'),
    },
    past: {
      intro: data?.pastYearsIntro ?? undefined,
      // The attendance of the edition the photographs come from, or its chip while it is owed.
      attendance: figureSentence(past.edition?.attendance),
      attendancePending: past.edition ? pending('attendance') : undefined,
      ...past.view,
    },
    partners: {
      intro: data?.partnersIntro ?? undefined,
      items: (data?.partners ?? [])
        .filter((partner) => partner !== null)
        .map((partner) => ({
          _id: partner._id,
          name: partner.name,
          url: partner.url,
          logo: resolveImage(imageSet, partner.logo, { width: 280 }),
        })),
      pending: presenceWhat('partner')?.what ?? 'partner and funder names',
    },
    figure: {
      image: resolveImage(imageSet, data?.whatItIsImage, { width: 560 }),
      caption: data?.whatItIsImage?.caption ?? undefined,
      edit: edit('whatItIsImage'),
    },
    edit: page.layoutEdit,
  };
}

export type FestivalPageView = ReturnType<typeof buildFestivalPage>;
