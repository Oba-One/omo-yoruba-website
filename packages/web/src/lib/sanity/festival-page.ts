/**
 * The festival page view: what `/odunde` hands the library parts, built from the one festival query.
 * Pure, so a test drives it with a fixture: the layout with the schema defaults, the next festival
 * edition (ADR 0024) and its facts for the header line and the glance strip with the registry's
 * chips where the Studio holds nothing, the page's two actions, the zones, the next edition's
 * schedule as the option shows it, the plan-your-visit facts, the take-part rows with the next
 * edition's vendor terms and the intro that counts them (ADR 0025), every photograph resolved to a CDN set
 * with its alt and framing, the head's title and description cleaned of stega, and the
 * `data-sanity` attributes for click-to-edit in draft mode.
 */
import { withLayoutDefaults } from '@oy/content/layout';
import { pageEdition, pastEdition } from '@oy/content/lead-event';
import { PENDING, pendingWhat, presenceWhat } from '@oy/content/pending';
import type { festivalPageQuery } from '@oy/content/queries';
import { countWord } from '@oy/ui/content/count-word.ts';
import { editionHours, longDate, shortDate } from '@oy/ui/content/edition-dates.ts';
import { figureSentence } from '@oy/ui/content/figure-sentence.ts';
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
/** The album row is a condition ("creditConfirmed != true"), so it is found by its field. */
const CREDIT_PENDING =
  PENDING.find((row) => row.type === 'album' && row.condition?.includes('creditConfirmed'))?.what ??
  'photographer credit to confirm';

/** The take-part intro, counting the rows the band draws ("Four ways in."). */
function takePartIntro(count: number): string | undefined {
  if (count === 0) return undefined;
  return count === 1
    ? 'One way in. It says what it asks of you, then opens a short form.'
    : `${countWord(count)} ways in. Each one says what it asks of you, then opens a short form.`;
}

export function buildFestivalPage(data: FestivalPageData | null, options: BuildOptions) {
  const { imageSet, now = new Date() } = options;
  const edit = editAttributes(options, 'festivalPage');
  const layout = withLayoutDefaults<FestivalLayout>('festivalPage', data?.layout);

  const editions = (data?.editions ?? []).filter((event) => event !== null);
  const edition = pageEdition(editions, KIND, { now });
  const past = pastEdition(editions, KIND, {
    now,
    hasPhotos: (event) => (event.album?.photos?.length ?? 0) > 0,
  });
  const album = past?.album ?? undefined;

  const date = longDate(edition?.start);
  const hours = editionHours(edition?.start, edition?.end);
  const cost = cleanText(edition?.cost) ? edition?.cost : undefined;

  const header = data?.header;
  const actions = [data?.primaryAction, ...(data?.secondaryActions ?? [])]
    .filter((action) => action !== null && action !== undefined)
    .slice(0, 2);

  const extraFacts = (data?.extraFacts ?? []).filter((fact) => fact !== null);
  const takePart = (data?.takePart ?? []).filter((row) => row !== null);
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
      rows: takePart.map((row) => ({ ...row, edit: edit(`takePart[_key=="${row._key}"]`) })),
      intro: takePartIntro(takePart.length),
      lead: layout.takepart,
      labels: layout.labels,
      // Null while the next edition holds no terms, so the vendor row shows the registry's chip.
      vendorTerms: edition?.vendorTerms ?? null,
      vendorTermsPending: pending('vendorTerms.fees'),
      pending: pendingWhat('festivalPage', 'takePart[]') ?? 'the ways in',
      rowPending:
        pendingWhat('festivalPage', 'takePart') ?? 'a way in, its title or its button label',
    },
    past: {
      intro: data?.pastYearsIntro ?? undefined,
      // The attendance of the edition the photographs come from, or its chip while it is owed.
      attendance: figureSentence(past?.attendance),
      attendancePending: past ? pending('attendance') : undefined,
      slides: (album?.photos ?? [])
        .filter((photo) => photo !== null)
        .map((photo) => ({
          _key: photo._key,
          image: resolveImage(imageSet, photo, { width: 1022 }),
          alt: photo.alt ?? '',
          caption: photo.caption,
        })),
      pending: presenceWhat('album')?.what ?? 'the photo albums',
      album: album
        ? {
            credit: album.credit ?? undefined,
            confirmed: album.creditConfirmed === true,
            pending: CREDIT_PENDING,
            edit: edit('photos', album._id, 'album'),
          }
        : undefined,
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
