/**
 * The Donate page view: what `/donate` hands the library parts, built from the one Donate query (`16
 * Donate.dc.html`, spec Q14 to Q17 of Phase 7, ADR 0034, ADR 0035). Pure, so a test drives it with a
 * fixture: the layout with the schema defaults, the slim header whose gold "Give now" is the page's one, the
 * give-now block (its blurb and its facts, the Zeffy ones owed), the doors for organizations (one in the row
 * form, two or more as cards, all outline), the giving levels as outcome cards shown by `impact`, the other
 * ways to give with the address or the EIN and the legal name from the settings, the trust block (tax
 * status, EIN, the tax line, the receipt from the give-now fact), and the `data-sanity` attributes in draft
 * mode.
 */
import { otherWaySetting } from '@oy/content/giving';
import { pendingWhat } from '@oy/content/pending';
import type { donatePageQuery } from '@oy/content/queries';
import type { ClientReturn } from '@sanity/client';
import { glanceFacts, pageSkeleton } from './page-skeleton';
import { type BuildOptions, cleanText, resolveImage } from './view';

export type DonatePageData = NonNullable<ClientReturn<typeof donatePageQuery, unknown>>;

export interface DonateLayout extends Record<string, string> {
  impact: 'shown' | 'hidden';
}

const PAGE_TITLE = 'Donate';

const pending = (field: string) => pendingWhat('donatePage', field) ?? 'this part of the page';

const present = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

/** The prototype's headings for the blocks whose Studio heading is empty. */
const GIVE_TITLE = 'Give now';
const LARGER_TITLE = 'Giving at a larger scale';

/** The label of the give-now fact the trust block's Receipt cell reads (spec Q14). */
const RECEIPT_LABEL = 'receipt';

export function buildDonatePage(data: DonatePageData | null, options: BuildOptions) {
  const page = pageSkeleton<DonateLayout>('donatePage', data, options, PAGE_TITLE);
  const { edit, layout } = page;
  const settings = data?.settings;
  const ein = cleanText(settings?.ein);
  const orgName = cleanText(settings?.orgName);
  const address = (cleanText(settings?.address) ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(', ');
  const giveFacts = glanceFacts('donatePage', 'giveNow.facts', data?.giveNow?.facts);
  const receipt = giveFacts.find((item) => cleanText(item.label)?.toLowerCase() === RECEIPT_LABEL);
  const doors = (data?.largerScale?.doors ?? []).filter(present);
  const larger = cleanText(data?.largerScale?.title);
  const give = cleanText(data?.giveNow?.title);

  return {
    title: page.title,
    description: page.description,
    layout,
    root: { ...layout },
    header: { variant: 'slim' as const, ...page.header },
    give: {
      title: give ? (data?.giveNow?.title ?? GIVE_TITLE) : GIVE_TITLE,
      blurb: data?.giveNow?.blurb ?? undefined,
      facts: giveFacts,
    },
    larger: {
      title: larger ? (data?.largerScale?.title ?? LARGER_TITLE) : LARGER_TITLE,
      intro: data?.largerScale?.blurb ?? undefined,
      // One door fills the width in the row form; two or more sit as cards (ADR 0034).
      layout: doors.length === 1 ? ('row' as const) : ('card' as const),
      doors: doors.map((door) => ({
        _id: door._id,
        door: {
          ...door,
          key: cleanText(door.key),
          image: resolveImage(options.imageSet, door.image, {
            width: doors.length === 1 ? 520 : 1080,
          }),
        },
        imageEdit: edit('image', door._id, 'door'),
      })),
      pending: pending('largerScale.doors[]'),
    },
    gifts: {
      shown: layout.impact !== 'hidden',
      levels: (data?.levels ?? []).filter(present).map((level) => ({
        _id: level._id,
        figure: cleanText(level.amount)
          ? `${level.amount}${cleanText(level.frequency) === 'monthly' ? ' a month' : ''}`
          : undefined,
        line: level.what ?? undefined,
        source: level.source ?? undefined,
        edit: edit('amount', level._id, 'givingLevel'),
      })),
      pending: pending('whatYourGiftDoes[]'),
      linePending: pendingWhat('givingLevel', 'what') ?? 'what the gift does',
      sourcePending: pendingWhat('givingLevel', 'source') ?? 'where the cost comes from',
    },
    other: {
      ways: (data?.otherWays ?? []).filter(present).map((way) => {
        const setting = otherWaySetting(cleanText(way.kind));
        const detail = cleanText(way.detail) ? way.detail : undefined;
        // The address and the EIN come from the settings, so neither is typed twice (ADR 0035).
        const fromSettings =
          setting === 'address'
            ? address || undefined
            : setting === 'ein'
              ? ein
                ? `Our EIN is ${ein} and our legal name is ${orgName}.`
                : orgName && `Our legal name is ${orgName}.`
              : undefined;
        return {
          _key: way._key,
          title: way.title,
          line: way.blurb,
          detail: [detail, fromSettings].filter(Boolean).join(' ') || undefined,
          detailPending:
            setting === 'address' && !address
              ? (pendingWhat('siteSettings', 'address') ?? 'mailing address')
              : setting === 'ein' && !ein
                ? (pendingWhat('siteSettings', 'ein') ?? 'EIN')
                : undefined,
        };
      }),
      pending: pending('otherWays[]'),
    },
    trust: {
      cells: [
        { label: 'Tax status', value: '501(c)(3)', note: 'Since 1997' },
        { label: 'EIN', value: ein, pending: pendingWhat('siteSettings', 'ein') ?? 'EIN' },
        { label: 'Deductible', value: data?.taxLine ?? undefined, pending: pending('taxLine') },
        // The receipt is the give-now fact of that name; a page without one leaves the cell out.
        ...(receipt ? [{ label: 'Receipt', value: receipt.value, pending: receipt.pending }] : []),
      ],
    },
    edit: page.layoutEdit,
  };
}

export type DonatePageView = ReturnType<typeof buildDonatePage>;
