/**
 * The Get Involved page view: what `/get-involved` hands the library parts, built from the one Get
 * Involved query (`13 Get Involved.dc.html`, spec Q1 to Q4 of Phase 7, ADR 0034). Pure, so a test drives it
 * with a fixture: the layout with the schema defaults, the slim header with whatever actions the Studio
 * holds, the doors as cards or in the row form (anchored by their keys, the first gold only while the
 * header holds no action), the give door's own words and button as the box that closes the page, the
 * hometown associations (the prose or its chip, the count from its stat, "Not yet" while none is listed,
 * the list once the Studio holds names), the fallback for anyone who would rather speak to a person (the
 * general inbox, the phone and the general routing contact, cleaned of stega since two become links), and
 * the `data-sanity` attributes for click-to-edit in draft mode.
 */
import { isDoorKey } from '@oy/content/doors';
import {
  GENERAL_CONTACT_PENDING,
  GENERAL_RESPONDS_PENDING,
  pendingWhat,
} from '@oy/content/pending';
import type { getInvolvedPageQuery } from '@oy/content/queries';
import type { ClientReturn } from '@sanity/client';
import { pageSkeleton } from './page-skeleton';
import { type BuildOptions, cleanText, resolveImage } from './view';

export type GetInvolvedPageData = NonNullable<ClientReturn<typeof getInvolvedPageQuery, unknown>>;

export interface GetInvolvedLayout extends Record<string, string> {
  doors: 'cards' | 'rows';
  hta: 'shown' | 'hidden';
}

const PAGE_TITLE = 'Get Involved';

const pending = (field: string) => pendingWhat('getInvolvedPage', field) ?? 'this part of the page';

const present = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

/** The prototype's headings for the two blocks whose Studio heading is empty. */
const ASSOCIATIONS_TITLE = 'Hometown associations';
const TALK_TITLE = 'Or just talk to someone';

export function buildGetInvolvedPage(data: GetInvolvedPageData | null, options: BuildOptions) {
  const page = pageSkeleton<GetInvolvedLayout>('getInvolvedPage', data, options, PAGE_TITLE);
  const { edit, layout } = page;
  const doors = (data?.doors ?? []).filter(present);
  const give = doors.find((door) => cleanText(door.key) === 'give');
  const cards = doors.filter((door) => door !== give);
  // One gold action per view: the header's when the Studio holds one, else the first door's (ADR 0034).
  const doorsGold = page.header.actions.length === 0;
  const row = layout.doors === 'rows';

  const associations = data?.hometownAssociations;
  const listed = (data?.associations ?? []).filter((association) => cleanText(association.name));
  const settings = data?.settings;
  const general = settings?.general;

  return {
    title: page.title,
    description: page.description,
    layout,
    root: { ...layout },
    header: { variant: 'slim' as const, ...page.header },
    doors: {
      layout: row ? ('row' as const) : ('card' as const),
      items: cards.map((door, index) => {
        const key = cleanText(door.key);
        return {
          _id: door._id,
          id: isDoorKey(key) ? key : undefined,
          door: {
            ...door,
            key,
            image: resolveImage(options.imageSet, door.image, { width: row ? 520 : 1080 }),
          },
          primary: doorsGold && index === 0,
          imageEdit: edit('image', door._id, 'door'),
        };
      }),
      pending: pending('doors[]'),
    },
    give: give
      ? {
          text: give.blurb ?? undefined,
          textPending: pendingWhat('door', 'blurb') ?? 'the blurb',
          action: give.action,
        }
      : undefined,
    associations: {
      shown: layout.hta !== 'hidden',
      title: cleanText(associations?.title)
        ? (associations?.title ?? ASSOCIATIONS_TITLE)
        : ASSOCIATIONS_TITLE,
      prose: associations?.prose && associations.prose.length > 0 ? associations.prose : undefined,
      pending: pending('hometownAssociations.prose'),
      cells: [
        {
          label: 'Associations',
          value: associations?.stat?.value ?? undefined,
          pending: pending('hometownAssociations.stat'),
        },
        // Listing the names is optional (ADR 0035): the cell says so until the Studio holds them.
        ...(listed.length === 0 ? [{ label: 'Listed publicly', value: 'Not yet' }] : []),
        { label: 'To connect', value: 'Ask when you join' },
      ],
      list: listed.map((association) => ({
        _id: association._id,
        name: association.name,
        url: association.url,
      })),
      statEdit: edit('hometownAssociations.stat'),
    },
    talk: {
      title: cleanText(data?.fallback?.title) ? (data?.fallback?.title ?? TALK_TITLE) : TALK_TITLE,
      intro: data?.fallback?.blurb ?? undefined,
      // The email becomes a `mailto:` and the phone a `tel:`, so both leave stega behind.
      settings: {
        generalEmail: cleanText(settings?.generalEmail),
        phone: cleanText(settings?.phone),
      },
      contact: { name: general?.name ?? undefined, responds: general?.responds ?? undefined },
      namePending: GENERAL_CONTACT_PENDING,
      respondsPending: GENERAL_RESPONDS_PENDING,
    },
    edit: page.layoutEdit,
  };
}

export type GetInvolvedPageView = ReturnType<typeof buildGetInvolvedPage>;
