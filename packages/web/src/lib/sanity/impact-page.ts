/**
 * The Impact page view: what `/impact` hands the library parts, built from the one Impact query
 * (`14 Impact.dc.html`, spec Q5 to Q9 of Phase 7, ADR 0035). Pure, so a test drives it with a fixture: the
 * layout with the schema defaults, the slim header and its two actions, the headline figures (four or six
 * in the framed grid, each with its source line or chip, the empty cells under `six` waiting for
 * attendance and learners served, no source lines at all under `sources: hidden`), how we work with its
 * photograph, the outcomes headed by their subjects with slots for the prototype's subjects not yet
 * covered and the links to their pages, the civic prose with the cells read from the festival's editions,
 * the voices with their slots, the six photographs, governance (the cells and the newest document of each
 * kind), every partner by kind and name, the closing band's sentence from the partnerships routing contact,
 * and the `data-sanity` attributes for click-to-edit in draft mode.
 */
import { pageEdition, pastEdition } from '@oy/content/lead-event';
import {
  GOVERNANCE_NOTE_PENDING,
  IMPACT_OUTCOME_SLOTS,
  IMPACT_SIX_PENDING,
  IMPACT_VOICE_SLOTS,
  OUTCOME_PENDING,
  PARTNERSHIPS_RESPONDS_PENDING,
  pendingWhat,
  presenceWhat,
  type VoiceSlot,
} from '@oy/content/pending';
import type { impactPageQuery } from '@oy/content/queries';
import { EVENT_PAGE_NAMES, editionRoute, programHref } from '@oy/content/routes';
import type { ActionLike } from '@oy/ui/core/ActionButton/action.ts';
import type { ClientReturn } from '@sanity/client';
import { pageSkeleton } from './page-skeleton';
import { type BuildOptions, cleanText, resolveImage } from './view';

export type ImpactPageData = NonNullable<ClientReturn<typeof impactPageQuery, unknown>>;

export interface ImpactLayout extends Record<string, string> {
  stats: 'four' | 'six';
  outcomes: 'cards' | 'rows';
  sources: 'shown' | 'hidden';
  funders: 'shown' | 'hidden';
}

const PAGE_TITLE = 'Impact';

const pending = (field: string) => pendingWhat('impactPage', field) ?? 'this part of the page';

const present = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

/** The lead over the figures, true only while their source lines show. */
const SOURCES_LEAD =
  'Every number carries a source line: the year it covers and how it was counted.';

/** The prototype's heading for the closing band while the Studio holds none. */
const FUND_TITLE = 'Fund the next year';

/** The order partners list in: funders first, then partners, then sponsors, then any without a kind. */
const PARTNER_ORDER: Readonly<Record<string, number>> = { funder: 0, partner: 1, sponsor: 2 };

type Outcome = NonNullable<ImpactPageData['outcomes']>[number];
type Program = ImpactPageData['programs'][number];
type GovernanceDoc = ImpactPageData['governance']['form990'] | undefined;

/** An outcome's subject as the card heads it and links to it. */
interface Subject {
  key: string;
  name?: string;
  href?: string;
}

function programSubject(program: Pick<Program, '_id' | 'name' | 'page' | 'slug'>): Subject {
  return {
    key: program._id,
    name: cleanText(program.name) ? (program.name ?? undefined) : undefined,
    href: programHref(cleanText(program.page), cleanText(program.slug)),
  };
}

function kindSubject(kind: string | undefined): Subject | undefined {
  if (kind !== 'festival' && kind !== 'gala') return undefined;
  return { key: kind, name: EVENT_PAGE_NAMES[kind], href: editionRoute(kind) };
}

function outcomeSubject(outcome: Outcome): Subject | undefined {
  return outcome.program ? programSubject(outcome.program) : kindSubject(cleanText(outcome.kind));
}

/** A governance document's link text: its kind and, when set, its year. */
const docLabel = (kind: string, doc: GovernanceDoc) =>
  cleanText(doc?.year) ? `${kind}, ${cleanText(doc?.year)}` : kind;

/** A document's file as a link the page can follow, or undefined. */
const fileHref = (doc: GovernanceDoc) => cleanText(doc?.file?.url);

export function buildImpactPage(data: ImpactPageData | null, options: BuildOptions) {
  const page = pageSkeleton<ImpactLayout>('impactPage', data, options, PAGE_TITLE);
  const { edit, layout } = page;
  const now = options.now ?? new Date();
  const sources = layout.sources !== 'hidden';
  const six = layout.stats === 'six';

  // Outcomes: the page's own, then the slots for the prototype's subjects none of them names.
  const outcomes = (data?.outcomes ?? []).filter(present);
  const covered = new Set(outcomes.map((outcome) => outcomeSubject(outcome)?.key).filter(present));
  const programs = data?.programs ?? [];
  const slots = IMPACT_OUTCOME_SLOTS.map((slot) => {
    if (slot.kind) return kindSubject(slot.kind);
    const program = programs.find((candidate) => candidate._id === slot.program);
    return program ? programSubject(program) : undefined;
  })
    .filter(present)
    .filter((subject) => !covered.has(subject.key))
    .slice(0, Math.max(0, IMPACT_OUTCOME_SLOTS.length - outcomes.length));
  const outcomeCards = [
    ...outcomes.map((outcome) => {
      const subject = outcomeSubject(outcome);
      const figure = cleanText(outcome.figure?.value) ? outcome.figure : undefined;
      return {
        key: outcome._id,
        subject,
        title: subject?.name,
        figure: figure?.value ?? undefined,
        line: (figure ? figure.label : outcome.plainStatement) ?? undefined,
        source: figure?.source ?? undefined,
        pending: OUTCOME_PENDING,
        edit: edit('figure', outcome._id, 'outcome'),
      };
    }),
    ...slots.map((subject) => ({
      key: `slot-${subject.key}`,
      subject,
      title: subject.name,
      figure: undefined,
      line: undefined,
      source: undefined,
      pending: pending('outcomes[]'),
      edit: undefined,
    })),
  ];
  const links = outcomeCards
    .map((card) => card.subject)
    .filter((subject): subject is Subject => Boolean(subject?.href && subject.name))
    .filter(
      (subject, index, all) => all.findIndex((other) => other.href === subject.href) === index,
    );

  // The civic cells read the festival's editions (ADR 0013): the newest past one with photographs, as
  // the Odunde page's past years does, and the next one.
  const festivals = data?.festivals ?? [];
  const past = pastEdition(festivals, 'festival', {
    now,
    hasPhotos: (edition) => (edition.album?.photos ?? 0) > 0,
  });
  const next = pageEdition(festivals, 'festival', { now });
  const partnerCount = data?.festivalPartners ?? 0;

  // Voices: the testimonials, then the slots whose context none of them fills, up to three.
  type Voice = NonNullable<ImpactPageData['voices']>[number];
  const testimonials = (data?.voices ?? []).filter(present);
  const voiced = new Set(testimonials.map((voice) => voice.context));
  const voices: { testimonial?: Voice; placeholder?: VoiceSlot }[] = [
    ...testimonials.map((testimonial) => ({ testimonial })),
    ...IMPACT_VOICE_SLOTS.filter((slot) => !voiced.has(slot.context))
      .slice(0, Math.max(0, IMPACT_VOICE_SLOTS.length - testimonials.length))
      .map((placeholder) => ({ placeholder })),
  ];

  // Governance: the newest document of each kind, a file link with its note, the note alone, or a chip.
  const governance = data?.governance;
  const settings = data?.settings;
  const address = (cleanText(settings?.address) ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(', ');
  const documentFact = (label: string, kind: 'form990' | 'annualReport' | 'audit') => {
    const doc = governance?.[kind];
    const href = fileHref(doc);
    const note = doc?.note ?? undefined;
    return {
      label,
      value: href ? docLabel(label, doc) : note,
      href,
      note: href ? note : undefined,
      pending: doc
        ? GOVERNANCE_NOTE_PENDING
        : (presenceWhat('governanceDoc', kind)?.what ?? GOVERNANCE_NOTE_PENDING),
    };
  };
  const annual = governance?.annualReport;
  const annualHref = fileHref(annual);
  const board = data?.boardCount ?? 0;

  // The closing band names the partnerships lead as the sponsor form's success copy does.
  const partnerships = settings?.partnerships;
  const leadName = cleanText(partnerships?.name);
  const leadEmail = cleanText(partnerships?.email);
  const responds = partnerships?.responds?.trim();
  const secondAction: ActionLike =
    leadName && leadEmail
      ? { label: `Write to ${leadName}`, kind: 'url', href: `mailto:${leadEmail}` }
      : { label: 'Talk to us', kind: 'enquiry', enquiryKind: 'contact' };

  return {
    title: page.title,
    description: page.description,
    layout,
    root: { ...layout },
    header: { variant: 'slim' as const, ...page.header },
    numbers: {
      stats: (data?.stats ?? []).filter(present).map((stat) => ({
        value: stat.value,
        label: stat.label,
        source: stat.source,
      })),
      columns: six ? (6 as const) : (4 as const),
      sources,
      padPending: six ? IMPACT_SIX_PENDING : undefined,
      pending: pending('stats[]'),
      lead: sources ? SOURCES_LEAD : undefined,
    },
    how: {
      prose: data?.howWeWork && data.howWeWork.length > 0 ? data.howWeWork : undefined,
      pending: pending('howWeWork'),
      photo: resolveImage(options.imageSet, data?.howWeWorkImage, { width: 720 }),
      caption: data?.howWeWorkImage?.caption ?? undefined,
      photoWhat: pending('howWeWorkImage'),
      photoEdit: edit('howWeWorkImage'),
    },
    outcomes: {
      layout: layout.outcomes === 'rows' ? ('row' as const) : ('card' as const),
      sources,
      cards: outcomeCards,
      links,
      sourcePending: pendingWhat('outcome', 'figure.source') ?? 'a source line under the figure',
    },
    civic: {
      prose: data?.civicInfra && data.civicInfra.length > 0 ? data.civicInfra : undefined,
      pending: pending('civicInfra'),
      cells: [
        {
          label: 'Attendance',
          value: past?.attendance?.value ?? undefined,
          note: past?.attendance?.label ?? undefined,
          pending: pendingWhat('event', 'attendance', 'festival') ?? 'the attendance figure',
        },
        {
          label: 'Vendors hosted',
          value: past?.vendorsHosted?.value ?? undefined,
          note: past?.vendorsHosted?.label ?? undefined,
          pending:
            pendingWhat('event', 'vendorsHosted', 'festival') ?? 'the number of vendors hosted',
        },
        {
          label: 'Partners',
          value: partnerCount > 0 ? String(partnerCount) : undefined,
          pending: presenceWhat('partner')?.what ?? 'partner and funder names',
        },
        {
          label: 'Cost to attend',
          value: next?.cost ?? undefined,
          pending: pendingWhat('event', 'cost', 'festival') ?? 'the cost',
        },
      ],
      edit: past ? edit('attendance', past._id, 'event') : undefined,
    },
    voices: {
      items: voices,
      pending: pending('voices[]'),
    },
    photos: {
      tiles: (data?.photos ?? []).filter(present).map((photo) => ({
        image: resolveImage(options.imageSet, photo, { width: 720 }),
        alt: photo.alt ?? '',
        caption: photo.caption,
        edit: edit(`photos[_key=="${photo._key}"]`),
      })),
    },
    governance: {
      cells: [
        { label: 'Tax status', value: '501(c)(3)', note: 'Since 1997' },
        {
          label: 'EIN',
          value: cleanText(settings?.ein),
          pending: pendingWhat('siteSettings', 'ein') ?? 'EIN',
        },
        board > 0
          ? { label: 'Board', value: 'Listed', note: 'Our Story', noteHref: '/our-story#board' }
          : {
              label: 'Board',
              value: undefined,
              pending: presenceWhat('person', 'board')?.what ?? "the board's names, roles and bios",
            },
        annualHref
          ? {
              label: 'Financials',
              value: 'Published',
              note: docLabel('Annual report', annual),
              noteHref: annualHref,
            }
          : annual
            ? {
                label: 'Financials',
                value: 'Not yet published',
                note: annual.note ?? undefined,
                notePending: annual.note ? undefined : GOVERNANCE_NOTE_PENDING,
              }
            : {
                label: 'Financials',
                value: undefined,
                pending:
                  presenceWhat('governanceDoc', 'annualReport')?.what ?? GOVERNANCE_NOTE_PENDING,
              },
      ],
      facts: [
        {
          label: 'Mailing address',
          value: address || undefined,
          pending: pendingWhat('siteSettings', 'address') ?? 'mailing address',
        },
        documentFact('Form 990', 'form990'),
        documentFact('Annual report', 'annualReport'),
        documentFact('Audit', 'audit'),
      ],
    },
    partners: {
      shown: layout.funders !== 'hidden',
      intro: data?.fundersIntro ?? undefined,
      items: (data?.partners ?? [])
        .filter((partner) => cleanText(partner.name))
        .sort(
          (a, b) =>
            (PARTNER_ORDER[cleanText(a.kind) ?? ''] ?? 3) -
            (PARTNER_ORDER[cleanText(b.kind) ?? ''] ?? 3),
        )
        .map((partner) => ({
          _id: partner._id,
          name: partner.name,
          url: cleanText(partner.url),
          logo: resolveImage(options.imageSet, partner.logo, { width: 280 }),
        })),
      pending: presenceWhat('partner')?.what ?? 'partner and funder names',
    },
    fund: {
      title: cleanText(data?.nextYear?.title) ? (data?.nextYear?.title ?? FUND_TITLE) : FUND_TITLE,
      // "{name}, our partnerships lead, answers within a working day." or the role while unnamed.
      line: `${leadName ? `${partnerships?.name}, our partnerships lead,` : 'Our partnerships lead'} answers${responds ? ` ${responds}.` : ''}`,
      linePending: responds ? undefined : PARTNERSHIPS_RESPONDS_PENDING,
      actions: [
        { label: 'Sponsor or partner', kind: 'enquiry', enquiryKind: 'sponsor' } as ActionLike,
        secondAction,
      ],
    },
    edit: page.layoutEdit,
  };
}

export type ImpactPageView = ReturnType<typeof buildImpactPage>;
