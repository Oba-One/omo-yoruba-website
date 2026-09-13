/**
 * The Gala page view: what `/gala` hands the library parts, built from the one Gala query. Pure, so a
 * test drives it with a fixture: the layout with the schema defaults, the next gala edition (ADR
 * 0024) and its facts for the header line and the glance strip with the registry's chips where the
 * Studio holds nothing, "Seats from" derived from the edition's tiers (spec Q9), the page's two
 * actions, the evening's intro and running order as the option shows it, the take-part rows with the
 * intro that counts them (ADR 0025), every photograph resolved to a CDN set with its alt and framing,
 * the head's title and description cleaned of stega, and the `data-sanity` attributes for
 * click-to-edit in draft mode.
 */
import { withLayoutDefaults } from '@oy/content/layout';
import { pageEdition } from '@oy/content/lead-event';
import { pendingWhat, presenceWhat } from '@oy/content/pending';
import type { galaPageQuery } from '@oy/content/queries';
import { countWord } from '@oy/ui/content/count-word.ts';
import { longDate, shortDate } from '@oy/ui/content/edition-dates.ts';
import type { ClientReturn } from '@sanity/client';
import { type BuildOptions, cleanText, editAttributes, resolveImage } from './view';

export type GalaPageData = NonNullable<ClientReturn<typeof galaPageQuery, unknown>>;
type Tier = NonNullable<GalaPageData['editions']>[number]['tiers'][number];

export interface GalaLayout extends Record<string, string> {
  treatment: 'formal' | 'warm';
  tiers: 'columns' | 'rows';
  emphasis: 'seats' | 'tables';
  awards: 'shown' | 'hidden';
  schedule: 'shown' | 'hidden';
  past: 'shown' | 'hidden';
  labels: 'column' | 'none' | 'kicker';
}

const PAGE_TITLE = 'End-of-Year Gala';
const KIND = 'gala';
/** The glance strip holds five facts at most. */
const GLANCE_MAX = 5;

const pending = (field: string) => pendingWhat('event', field, KIND) ?? 'this fact';

/**
 * "Seats from": the first buy-now tier's price by order, and the table tier's price as the note, so
 * no price is typed twice (spec Q9). Undefined values leave the registry's chip in place.
 */
export function seatsFrom(tiers: readonly (Tier | null)[] | null | undefined): {
  value?: string;
  note?: string;
} {
  const priced = (tiers ?? []).filter((tier): tier is Tier => Boolean(tier?.price?.trim()));
  const seat = priced.find((tier) => tier.variant !== 'enquiry');
  const table = priced.find((tier) => tier.variant === 'enquiry');
  return {
    ...(seat ? { value: seat.price?.trim() } : {}),
    ...(table ? { note: `Tables of ten from ${table.price?.trim()}` } : {}),
  };
}

/** The take-part intro, counting the rows the band draws. */
function takePartIntro(count: number): string | undefined {
  if (count === 0) return undefined;
  return `${countWord(count)} ${count === 1 ? 'way' : 'ways'} to be part of the evening, whether or not you can be in the room.`;
}

export function buildGalaPage(data: GalaPageData | null, options: BuildOptions) {
  const { imageSet, now = new Date() } = options;
  const edit = editAttributes(options, 'galaPage');
  const layout = withLayoutDefaults<GalaLayout>('galaPage', data?.layout);

  const editions = (data?.editions ?? []).filter((event) => event !== null);
  const edition = pageEdition(editions, KIND, { now });

  const date = longDate(edition?.start);
  const venue = edition?.venue?.name || undefined;
  const seats = seatsFrom(edition?.tiers);
  const tiersPending = presenceWhat('ticketTier')?.what ?? 'the ticket tiers';

  const header = data?.header;
  const actions = [data?.primaryAction, ...(data?.secondaryActions ?? [])]
    .filter((action) => action !== null && action !== undefined)
    .slice(0, 2);

  const extraFacts = (data?.extraFacts ?? []).filter((fact) => fact !== null);
  const glance = [
    {
      label: 'Date',
      value: shortDate(edition?.start),
      pending: pending('start'),
      note: 'Held each November or December',
    },
    { label: 'Doors', value: edition?.doors || undefined, pending: pending('doors') },
    {
      label: 'Venue',
      value: venue,
      pending: pending('venue.name'),
      note: edition?.venue?.address || edition?.venue?.line || undefined,
    },
    { label: 'Dress', value: edition?.dress || undefined, pending: pending('dress') },
    { label: 'Seats from', value: seats.value, pending: tiersPending, note: seats.note },
    ...extraFacts.map((fact) => ({
      label: fact.label ?? '',
      value: fact.value ?? undefined,
      note: fact.note ?? undefined,
      pending: pendingWhat('galaPage', 'extraFacts') ?? 'a glance fact',
    })),
  ].slice(0, GLANCE_MAX);

  const takePart = (data?.takePart ?? []).filter((row) => row !== null);

  return {
    title: cleanText(data?.seo?.title) || cleanText(header?.title) || PAGE_TITLE,
    description: cleanText(data?.seo?.description) || cleanText(header?.line),
    layout,
    root: { ...layout },
    edition,
    header: {
      kicker: header?.kicker,
      title: header?.title,
      line: header?.line,
      image: resolveImage(imageSet, header?.image, { width: 1440 }),
      imageEdit: edit('header.image'),
      actions,
      facts: [
        date ? { text: date } : { pending: pending('start') },
        venue ? { text: venue } : { pending: pending('venue.name') },
        seats.value ? { text: `Seats from ${seats.value}` } : { pending: tiersPending },
      ],
    },
    glance,
    evening: {
      intro: cleanText(data?.eveningIntro) ? (data?.eveningIntro ?? undefined) : undefined,
      introPending: pendingWhat('galaPage', 'eveningIntro') ?? 'the evening, in your words',
      schedule: {
        shown: layout.schedule !== 'hidden',
        items: (edition?.schedule ?? []).filter((item) => item !== null),
        pending: pending('schedule[]'),
      },
    },
    takePart: {
      rows: takePart.map((row) => ({ ...row, edit: edit(`takePart[_key=="${row._key}"]`) })),
      intro: takePartIntro(takePart.length),
      labels: layout.labels,
      pending: pendingWhat('galaPage', 'takePart[]') ?? 'the ways in',
      rowPending: pendingWhat('galaPage', 'takePart') ?? 'a way in, its title or its button label',
    },
    edit: {
      treatment: edit('layout.treatment'),
      tiers: edit('layout.tiers'),
      emphasis: edit('layout.emphasis'),
      awards: edit('layout.awards'),
      schedule: edit('layout.schedule'),
      past: edit('layout.past'),
      labels: edit('layout.labels'),
    },
  };
}

export type GalaPageView = ReturnType<typeof buildGalaPage>;
