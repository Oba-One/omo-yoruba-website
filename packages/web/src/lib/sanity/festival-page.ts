/**
 * The festival page view: what `/odunde` hands the library parts, built from the one festival query.
 * Pure, so a test drives it with a fixture: the layout with the schema defaults, the next festival
 * edition (ADR 0024) and its facts for the header line and the glance strip with the registry's
 * chips where the Studio holds nothing, the page's two actions, every photograph resolved to a CDN
 * set with its alt and framing, the head's title and description cleaned of stega, and the
 * `data-sanity` attributes for click-to-edit in draft mode.
 */
import { withLayoutDefaults } from '@oy/content/layout';
import { pageEdition } from '@oy/content/lead-event';
import { pendingWhat } from '@oy/content/pending';
import type { festivalPageQuery } from '@oy/content/queries';
import { editionHours, longDate, shortDate } from '@oy/ui/content/edition-dates.ts';
import type { ClientReturn } from '@sanity/client';
import { type BuildOptions, cleanText, editAttributes, resolveImage } from './view';

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
/** The glance strip holds five facts at most. */
const GLANCE_MAX = 5;

const pending = (field: string) => pendingWhat('event', field, KIND) ?? 'this fact';

export function buildFestivalPage(data: FestivalPageData | null, options: BuildOptions) {
  const { imageSet, now = new Date() } = options;
  const edit = editAttributes(options, 'festivalPage');
  const layout = withLayoutDefaults<FestivalLayout>('festivalPage', data?.layout);

  const editions = (data?.editions ?? []).filter((event) => event !== null);
  const edition = pageEdition(editions, KIND, { now });

  const date = longDate(edition?.start);
  const hours = editionHours(edition?.start, edition?.end);
  const cost = cleanText(edition?.cost) ? edition?.cost : undefined;

  const header = data?.header;
  const actions = [data?.primaryAction, ...(data?.secondaryActions ?? [])]
    .filter((action) => action !== null && action !== undefined)
    .slice(0, 2);

  const extraFacts = (data?.extraFacts ?? []).filter((fact) => fact !== null);
  const glance = [
    { label: 'Date', value: shortDate(edition?.start), pending: pending('start') },
    { label: 'Time', value: hours, pending: pending('end') },
    {
      label: 'Where',
      value: edition?.venue?.name || undefined,
      pending: pending('venue.name'),
      note: edition?.venue?.line || undefined,
      notePending: pending('venue.line'),
    },
    { label: 'Cost', value: cost ?? undefined, pending: pending('cost') },
    ...extraFacts.map((fact) => ({
      label: fact.label ?? '',
      value: fact.value ?? undefined,
      note: fact.note ?? undefined,
      pending: pendingWhat('festivalPage', 'extraFacts') ?? 'a glance fact',
    })),
  ].slice(0, GLANCE_MAX);

  return {
    title: cleanText(data?.seo?.title) || cleanText(header?.title) || PAGE_TITLE,
    description: cleanText(data?.seo?.description) || cleanText(header?.line),
    layout,
    root: { ...layout },
    edition,
    header: {
      variant: layout.phead,
      kicker: header?.kicker,
      title: header?.title,
      line: header?.line,
      image: resolveImage(imageSet, header?.image, { width: 1440 }),
      imageEdit: edit('header.image'),
      actions,
      facts: [
        date ? { text: date } : { pending: pending('start') },
        hours ? { text: hours } : { pending: pending('end') },
        cost ? { text: cost } : { pending: pending('cost') },
      ],
    },
    glance,
    whatItIs: data?.whatItIs && data.whatItIs.length > 0 ? data.whatItIs : undefined,
    figure: {
      image: resolveImage(imageSet, data?.whatItIsImage, { width: 560 }),
      caption: data?.whatItIsImage?.caption ?? undefined,
      edit: edit('whatItIsImage'),
    },
    edit: {
      phead: edit('layout.phead'),
      zones: edit('layout.zones'),
      schedule: edit('layout.schedule'),
      takepart: edit('layout.takepart'),
      labels: edit('layout.labels'),
    },
  };
}

export type FestivalPageView = ReturnType<typeof buildFestivalPage>;
