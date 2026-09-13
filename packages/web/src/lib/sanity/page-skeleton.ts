/**
 * The skeleton a page singleton's view repeats, shared by the event pages and the program pages: the
 * head's title and description cleaned of stega, the header with its two actions and the registry's
 * chips, the take-part rows with their edit attributes and wordings (ADR 0025), the edit attribute of
 * every layout option, the glance facts a singleton keeps as fact rows, and past years (the newest past
 * edition of a kind with photographs, ADR 0024). Each builder adds what only its page has.
 */
import { withLayoutDefaults } from '@oy/content/layout';
import { type LeadCandidate, type LeadKind, pastEdition } from '@oy/content/lead-event';
import { ALBUM_CREDIT_PENDING, pendingWhat, presenceWhat } from '@oy/content/pending';
import type { ActionLike } from '@oy/ui/core/ActionButton/action.ts';
import {
  type BuildOptions,
  cleanText,
  type EditAttribute,
  editAttributes,
  type ImageLike,
  present,
  resolveImage,
} from './view';

/** The glance strip holds five facts at most. */
export const GLANCE_MAX = 5;

export interface PageSingletonLike {
  header?: {
    kicker?: { yo?: string | null; en?: string | null } | null;
    title?: string | null;
    line?: string | null;
    image?: ImageLike | null;
  } | null;
  primaryAction?: ActionLike | null;
  secondaryActions?: (ActionLike | null)[] | null;
  takePart?:
    | ({
        _key: string;
        way?: string | null;
        title?: string | null;
        line?: string | null;
        label?: string | null;
      } | null)[]
    | null;
  layout?: Record<string, string | null> | null;
  seo?: { title?: string | null; description?: string | null } | null;
}

/** One cell of the glance strip, as `GlanceStrip` takes it. */
export interface GlanceFactView {
  label: string;
  value?: string;
  note?: string;
  /** The registry's wording when the value is missing. */
  pending: string;
  /** The registry's wording when the note is a missing fact. */
  notePending?: string;
}

/**
 * The parts every page singleton's view shares. `title` is the page's name when neither the SEO title
 * nor the header's heading is set.
 */
export function pageSkeleton<L extends Record<string, string>>(
  type: string,
  data: PageSingletonLike | null | undefined,
  options: BuildOptions,
  title: string,
) {
  const edit = editAttributes(options, type);
  const layout = withLayoutDefaults<L>(
    type,
    data?.layout as Partial<Record<keyof L, string | null>> | null | undefined,
  );
  const header = data?.header;
  const rows = (data?.takePart ?? []).filter(present);

  return {
    edit,
    layout,
    title: cleanText(data?.seo?.title) || cleanText(header?.title) || title,
    description: cleanText(data?.seo?.description) || cleanText(header?.line),
    header: {
      titlePending: pendingWhat(type, 'header.title') ?? 'the page heading',
      imagePending: pendingWhat(type, 'header.image') ?? 'the header photograph',
      kicker: header?.kicker,
      title: header?.title,
      line: header?.line,
      image: resolveImage(options.imageSet, header?.image, { width: 1440 }),
      imageEdit: edit('header.image'),
      // The first is the page's gold action, the second an outline.
      actions: [data?.primaryAction, ...(data?.secondaryActions ?? [])].filter(present).slice(0, 2),
    },
    takePart: {
      rows: rows.map((row) => ({ ...row, edit: edit(`takePart[_key=="${row._key}"]`) })),
      pending: pendingWhat(type, 'takePart[]') ?? 'the ways in',
      rowPending: pendingWhat(type, 'takePart') ?? 'a way in, its title or its button label',
    },
    // One attribute per option, so click-to-edit reaches each option from the block it draws.
    layoutEdit: Object.fromEntries(
      Object.keys(layout).map((name) => [name, edit(`layout.${name}`)]),
    ) as Record<keyof L, string | undefined>,
  };
}

interface FactLike {
  label?: string | null;
  value?: string | null;
  note?: string | null;
}

/**
 * A singleton's fact rows as glance facts (the event pages' extra facts), each value missing shown as
 * the registry's chip for one row of `field`.
 */
export function glanceFacts(
  type: string,
  field: string,
  facts: readonly (FactLike | null)[] | null | undefined,
): GlanceFactView[] {
  const pending = pendingWhat(type, field) ?? 'a glance fact';
  return (facts ?? []).filter(present).map((fact) => ({
    label: fact.label ?? '',
    value: fact.value ?? undefined,
    note: fact.note ?? undefined,
    pending,
  }));
}

interface AlbumLike {
  _id: string;
  creditConfirmed: boolean | null;
  credit: string | null;
  photos: ({ _key: string; alt: string | null; caption: string | null } & ImageLike)[] | null;
}

/** Whether an edition's album has photographs to show: the rule `pastEdition` picks by. */
const hasPhotos = (event: { album?: AlbumLike | null }) => (event.album?.photos?.length ?? 0) > 0;

/**
 * Past years (Phase 5 spec, Q8): the newest past edition of the kind with photographs, and the `view` of
 * its album the carousel and the credit line take: each photograph resolved at the stage's width with
 * its alt and caption, the registry's wording for no album, and the credit with its confirmation and
 * the edit attribute on the album.
 */
export function pastYears<T extends LeadCandidate & { album?: AlbumLike | null }>(
  editions: readonly T[],
  kind: LeadKind,
  options: BuildOptions,
  edit: EditAttribute,
) {
  const edition = pastEdition(editions, kind, { now: options.now, hasPhotos });
  const album = edition?.album;
  return {
    edition,
    view: {
      slides: (album?.photos ?? []).filter(present).map((photo) => ({
        _key: photo._key,
        image: resolveImage(options.imageSet, photo, { width: 1022 }),
        alt: photo.alt ?? '',
        caption: photo.caption,
      })),
      pending: presenceWhat('album')?.what ?? 'the photo albums',
      album: album
        ? {
            credit: album.credit ?? undefined,
            confirmed: album.creditConfirmed === true,
            pending: ALBUM_CREDIT_PENDING,
            edit: edit('photos', album._id, 'album'),
          }
        : undefined,
    },
  };
}
