/**
 * The Gala page view: what `/gala` hands the library parts, built from the one Gala query. Pure, so a
 * test drives it with a fixture: the layout with the schema defaults, the next gala edition (ADR
 * 0024) and its facts for the header line and the glance strip with the registry's chips where the
 * Studio holds nothing, "Seats from" derived from the edition's tiers (spec Q9), the page's two
 * actions, the evening's intro and running order as the option shows it, the seats and tables with
 * the edition's Eventbrite link and the options that draw them, the sponsor levels, the honorees of
 * this gala and the ones before it, the newest past gala's album with its credit, the take-part rows
 * with the intro that counts them (ADR 0025), every photograph resolved to a CDN set with its alt and framing,
 * the head's title and description cleaned of stega, and the `data-sanity` attributes for
 * click-to-edit in draft mode. The parts every page singleton shares come from `pageSkeleton`.
 */
import { pageEdition } from '@oy/content/lead-event';
import { pendingWhat, presenceWhat } from '@oy/content/pending';
import type { galaPageQuery } from '@oy/content/queries';
import { countWord } from '@oy/ui/content/count-word.ts';
import { longDate, shortDate } from '@oy/ui/content/edition-dates.ts';
import { sentence } from '@oy/ui/content/sentence.ts';
import type { ClientReturn } from '@sanity/client';
import {
  GLANCE_MAX,
  type GlanceFactView,
  glanceFacts,
  pageSkeleton,
  pastYears,
} from './page-skeleton';
import { type BuildOptions, cleanText, resolveImage } from './view';

export type GalaPageData = NonNullable<ClientReturn<typeof galaPageQuery, unknown>>;
type Tier = NonNullable<GalaPageData['editions']>[number]['tiers'][number];
type Honoree = NonNullable<GalaPageData['honorees']>[number];

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

/**
 * The honorees as the cards show them: this gala's first as "This year", then the ones before it,
 * newest first, as "Previously honored" with the year leading the bio, as the prototype writes it.
 * Honorees of a later gala than the next one wait for their year.
 */
export function honoreeCards(
  honorees: readonly (Honoree | null)[] | null | undefined,
  editions: readonly { _id: string; edition: number | null }[],
  current: { _id: string; edition: number | null } | undefined,
) {
  const yearOf = new Map(editions.map((event) => [event._id, event.edition]));
  return (honorees ?? [])
    .filter((honoree): honoree is Honoree => honoree !== null)
    .map((honoree) => {
      const year = honoree.eventId ? (yearOf.get(honoree.eventId) ?? null) : null;
      const now = Boolean(current && honoree.eventId === current._id);
      return { honoree, year, now };
    })
    .filter(
      ({ year, now }) => now || !current?.edition || (year !== null && year < current.edition),
    )
    .sort(
      (a, b) =>
        Number(b.now) - Number(a.now) ||
        (b.year ?? 0) - (a.year ?? 0) ||
        (a.honoree.name ?? '').localeCompare(b.honoree.name ?? ''),
    )
    .map(({ honoree, year, now }) => ({
      _id: honoree._id,
      name: honoree.name,
      role: now ? 'This year' : 'Previously honored',
      bio:
        [
          !now && year ? `${year}.` : undefined,
          honoree.award?.trim() ? sentence(honoree.award.trim()) : undefined,
          honoree.blurb?.trim() || undefined,
        ]
          .filter(Boolean)
          .join(' ') || undefined,
      image: honoree.image,
    }));
}

/** The take-part intro, counting the rows the band draws. */
function takePartIntro(count: number): string | undefined {
  if (count === 0) return undefined;
  return `${countWord(count)} ${count === 1 ? 'way' : 'ways'} to be part of the evening, whether or not you can be in the room.`;
}

export function buildGalaPage(data: GalaPageData | null, options: BuildOptions) {
  const { imageSet, now = new Date() } = options;
  const page = pageSkeleton<GalaLayout>('galaPage', data, options, PAGE_TITLE);
  const { edit, layout } = page;

  const editions = (data?.editions ?? []).filter((event) => event !== null);
  const edition = pageEdition(editions, KIND, { now });
  const past = pastYears(editions, KIND, options, edit);

  const date = longDate(edition?.start);
  const venue = edition?.venue?.name || undefined;
  const seats = seatsFrom(edition?.tiers);
  const tiersPending = presenceWhat('ticketTier')?.what ?? 'the ticket tiers';

  const glance: GlanceFactView[] = [
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
    ...glanceFacts('galaPage', 'extraFacts', data?.extraFacts),
  ].slice(0, GLANCE_MAX);

  return {
    title: page.title,
    description: page.description,
    layout,
    root: { ...layout },
    edition,
    header: {
      ...page.header,
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
        timePending: pendingWhat('event', 'schedule', KIND) ?? 'the time',
      },
    },
    seats: {
      intro: data?.tiersIntro ?? undefined,
      tiers: (edition?.tiers ?? [])
        .filter((tier) => tier !== null)
        .map((tier) => ({ ...tier, edit: edit('name', tier._id, 'ticketTier') })),
      layout: layout.tiers,
      emphasis: layout.emphasis,
      // The edition's own Eventbrite event, the one source for seats (ADR 0024).
      ticketsUrl: cleanText(edition?.ticketsUrl),
      pending: tiersPending,
      ticketsPending: pending('ticketsUrl'),
      pricePending: pendingWhat('ticketTier', 'price') ?? 'the price',
      includesPending: pendingWhat('ticketTier', 'includes[]') ?? 'what the ticket includes',
    },
    sponsor: {
      intro: data?.sponsorIntro ?? undefined,
      // A level tied to an edition shows only with that edition; an untied level every year.
      levels: (data?.sponsorLevels ?? [])
        .filter((level) => level !== null)
        .filter((level) => !level.eventId || level.eventId === edition?._id)
        .map((level) => ({ ...level, edit: edit('name', level._id, 'sponsorLevel') })),
      pending: presenceWhat('sponsorLevel')?.what ?? 'level names and amounts',
      amountPending: pendingWhat('sponsorLevel', 'amount') ?? 'the amount',
      recognitionPending:
        pendingWhat('sponsorLevel', 'recognition[]') ?? 'what the level recognizes',
    },
    honorees: {
      shown: layout.awards === 'shown',
      intro: data?.honoreesIntro ?? undefined,
      items: honoreeCards(data?.honorees, editions, edition).map((card) => ({
        ...card,
        image: resolveImage(imageSet, card.image, { width: 680 }),
        edit: edit('name', card._id, 'honoree'),
      })),
      pending: presenceWhat('honoree')?.what ?? 'whether awards exist, and who',
    },
    past: {
      shown: layout.past !== 'hidden',
      intro: data?.pastIntro ?? undefined,
      ...past.view,
    },
    takePart: {
      ...page.takePart,
      intro: takePartIntro(page.takePart.rows.length),
      labels: layout.labels,
    },
    edit: page.layoutEdit,
  };
}

export type GalaPageView = ReturnType<typeof buildGalaPage>;
