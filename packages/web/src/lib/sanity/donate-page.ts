/**
 * The Donate page view: what `/donate` hands the library parts, built from the one Donate query (`16
 * Donate.dc.html`, spec Q14 to Q17 of Phase 7, ADR 0034, ADR 0035). Pure, so a test drives it with a
 * fixture: the layout with the schema defaults, the slim header whose gold "Give now" is the page's one, the
 * give-now block (its blurb and its facts, the Zeffy ones owed), the doors for organizations (one in the row
 * form, two or more as cards, all outline), the giving levels as outcome cards shown by `impact`, the other
 * ways to give with the address or the EIN and the legal name from the settings, the trust block (tax
 * status, EIN, the tax line, the receipt from the give-now fact) with its box to Impact, and the
 * `data-sanity` attributes in draft mode.
 */
import { otherWaySetting } from '@oy/content/giving';
import { pendingWhat } from '@oy/content/pending';
import type { donatePageQuery } from '@oy/content/queries';
import type { ClientReturn } from '@sanity/client';
import { glanceFacts, pageSkeleton } from './page-skeleton';
import { type BuildOptions, cleanText, oneLine, present, resolveImage, textOr } from './view';

export type DonatePageData = NonNullable<ClientReturn<typeof donatePageQuery, unknown>>;

export interface DonateLayout extends Record<string, string> {
  impact: 'shown' | 'hidden';
}

const PAGE_TITLE = 'Donate';

const pending = (field: string) => pendingWhat('donatePage', field) ?? 'this part of the page';

/** The prototype's headings for the blocks whose Studio heading is empty. */
const GIVE_NOW_TITLE = 'Give now';
const LARGER_SCALE_TITLE = 'Giving at a larger scale';

/** The label of the give-now fact the trust block's Receipt cell reads (spec Q14). */
const RECEIPT_LABEL = 'receipt';

/** The box under the trust block: its promise of a source line holds only while Impact shows them. */
const IMPACT_HANDOFF = 'What your gift has built so far';

const EIN_PENDING = pendingWhat('siteSettings', 'ein') ?? 'EIN';
const ADDRESS_PENDING = pendingWhat('siteSettings', 'address') ?? 'mailing address';

export function buildDonatePage(data: DonatePageData | null, options: BuildOptions) {
  const page = pageSkeleton<DonateLayout>('donatePage', data, options, PAGE_TITLE);
  const { edit, layout } = page;
  const settings = data?.settings;
  const ein = cleanText(settings?.ein);
  const orgName = cleanText(settings?.orgName);
  const address = oneLine(settings?.address);
  const giveFacts = glanceFacts('donatePage', 'giveNow.facts', data?.giveNow?.facts);
  const receipt = giveFacts.find((item) => cleanText(item.label)?.toLowerCase() === RECEIPT_LABEL);
  const doors = (data?.largerScale?.doors ?? []).filter(present);

  // What a way to give carries from the settings (ADR 0035): its sentence, and the chip while the settings
  // hold nothing. The legal name joins the EIN's sentence when both are there.
  const fromSettings = (setting: ReturnType<typeof otherWaySetting>) => {
    if (setting === 'address')
      return { text: address, pending: address ? undefined : ADDRESS_PENDING };
    if (setting !== 'ein') return { text: undefined, pending: undefined };
    const text =
      ein && orgName
        ? `Our EIN is ${ein} and our legal name is ${orgName}.`
        : ein
          ? `Our EIN is ${ein}.`
          : orgName && `Our legal name is ${orgName}.`;
    return { text, pending: ein ? undefined : EIN_PENDING };
  };

  return {
    title: page.title,
    description: page.description,
    layout,
    root: { ...layout },
    header: { variant: 'slim' as const, ...page.header },
    give: {
      title: textOr(data?.giveNow?.title, GIVE_NOW_TITLE),
      blurb: data?.giveNow?.blurb ?? undefined,
      facts: giveFacts,
      factsPending: pending('giveNow.facts[]'),
    },
    larger: {
      title: textOr(data?.largerScale?.title, LARGER_SCALE_TITLE),
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
        const settingsFact = fromSettings(otherWaySetting(cleanText(way.kind)));
        const detail = cleanText(way.detail) ? way.detail : undefined;
        return {
          _key: way._key,
          title: way.title,
          line: way.blurb,
          detail: [detail, settingsFact.text].filter(Boolean).join(' ') || undefined,
          detailPending: settingsFact.pending,
        };
      }),
      pending: pending('otherWays[]'),
    },
    trust: {
      cells: [
        { label: 'Tax status', value: '501(c)(3)', note: 'Since 1997' },
        { label: 'EIN', value: ein, pending: EIN_PENDING },
        { label: 'Deductible', value: data?.taxLine ?? undefined, pending: pending('taxLine') },
        // The receipt is the give-now fact of that name; a page without one leaves the cell out.
        ...(receipt ? [{ label: 'Receipt', value: receipt.value, pending: receipt.pending }] : []),
      ],
      // Impact's `sources` option decides whether its numbers carry source lines (spec Q5).
      handoff:
        cleanText(data?.impactSources) === 'hidden'
          ? `${IMPACT_HANDOFF}.`
          : `${IMPACT_HANDOFF}, with a source line under every number.`,
    },
    edit: page.layoutEdit,
  };
}

export type DonatePageView = ReturnType<typeof buildDonatePage>;
