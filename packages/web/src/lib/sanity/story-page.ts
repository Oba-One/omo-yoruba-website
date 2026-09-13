/**
 * The Our Story page view: what `/our-story` hands the library parts, built from the one Our Story query
 * (`15 People and History.dc.html`, spec Q4 and Q10 to Q13 of Phase 7, ADR 0035). Pure, so a test drives it
 * with a fixture: the layout with the schema defaults, the slim header with whatever actions the Studio
 * holds, how it began (the story or its chip, the founding facts with the owed ones as chips, the earliest
 * photograph or its placeholder), the timeline shown only by its option (hidden until the owner confirms
 * it, wayfinder ticket 07), the board (role, name, short bio, each owed one its chip, the full bio by
 * `bios`, the portrait by `portraits`) and the staff and volunteers (compact), each group with its own
 * Pending line, Reach us (the contact facts and who receives a message, the urgent line only with a phone),
 * the take-part rows with the lead that counts them, and the `data-sanity` attributes in draft mode.
 */
import { GENERAL_CONTACT_PENDING, pendingWhat, presenceWhat } from '@oy/content/pending';
import type { storyPageQuery } from '@oy/content/queries';
import { countWord } from '@oy/ui/content/count-word.ts';
import type { ClientReturn } from '@sanity/client';
import { glanceFacts, pageSkeleton } from './page-skeleton';
import { type BuildOptions, cleanText, resolveImage } from './view';

export type StoryPageData = NonNullable<ClientReturn<typeof storyPageQuery, unknown>>;

export interface StoryLayout extends Record<string, string> {
  timeline: 'hidden' | 'shown';
  bios: 'short' | 'full';
  portraits: 'shown' | 'hidden';
}

const PAGE_TITLE = 'Our Story';

const pending = (field: string) => pendingWhat('storyPage', field) ?? 'this part of the page';

const present = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

/** The prototype's Reach us heading while the Studio holds none. */
const REACH_TITLE = 'Reach us';

/** The take-part lead, counting the rows as the prototype's "Two ways to join in." does. */
function takePartIntro(count: number): string | undefined {
  if (count === 0) return undefined;
  return `${countWord(count)} ${count === 1 ? 'way' : 'ways'} to join in.`;
}

export function buildStoryPage(data: StoryPageData | null, options: BuildOptions) {
  const page = pageSkeleton<StoryLayout>('storyPage', data, options, PAGE_TITLE);
  const { edit, layout } = page;
  const portraits = layout.portraits !== 'hidden';
  const settings = data?.settings;
  const phone = cleanText(settings?.phone);

  type Person = NonNullable<StoryPageData['board']>[number];
  const card = (person: Pick<Person, '_id' | 'name' | 'role' | 'portrait'>, width: number) => {
    const image = portraits
      ? resolveImage(options.imageSet, person.portrait, { width })
      : undefined;
    return {
      _id: person._id,
      name: person.name ?? undefined,
      role: person.role ?? undefined,
      image,
      // Without a portrait, or with portraits hidden, the card draws the woven tick (ADR 0035).
      variant: image ? ('portrait' as const) : ('nophoto' as const),
      edit: edit('name', person._id, 'person'),
    };
  };

  return {
    title: page.title,
    description: page.description,
    layout,
    root: { ...layout },
    header: { variant: 'slim' as const, ...page.header },
    founding: {
      prose: data?.founding && data.founding.length > 0 ? data.founding : undefined,
      pending: pending('founding'),
      facts: glanceFacts('storyPage', 'foundingFacts', data?.foundingFacts),
      factsPending: pending('foundingFacts[]'),
      photo: resolveImage(options.imageSet, data?.foundingImage, { width: 720 }),
      caption: data?.foundingImage?.caption ?? undefined,
      photoWhat: pending('foundingImage'),
      photoEdit: edit('foundingImage'),
    },
    timeline: {
      shown: layout.timeline === 'shown',
      entries: (data?.timeline ?? []).filter(present).map((entry) => ({
        _id: entry._id,
        year: entry.year,
        line: entry.blurb,
        milestone: entry.milestone === true,
      })),
      pending: presenceWhat('timelineEntry')?.what ?? 'the dated entries',
    },
    board: {
      intro: data?.boardIntro ?? undefined,
      full: layout.bios === 'full',
      people: (data?.board ?? []).filter(present).map((person) => ({
        ...card(person, 640),
        bio: person.bioShort ?? undefined,
        bioFull: person.bioFull && person.bioFull.length > 0 ? person.bioFull : undefined,
      })),
      pending: presenceWhat('person', 'board')?.what ?? "the board's names, roles and bios",
      rolePending: pendingWhat('person', 'role', 'board') ?? 'the role',
      bioPending: pendingWhat('person', 'bioShort', 'board') ?? 'a short bio',
    },
    staff: {
      intro: data?.staffIntro ?? undefined,
      people: (data?.staff ?? []).filter(present).map((person) => card(person, 400)),
      pending: presenceWhat('person', 'staff')?.what ?? 'the staff and volunteers to list',
      rolePending: pendingWhat('person', 'role', 'staff') ?? 'the role',
    },
    reach: {
      title: cleanText(data?.reachUs?.title) ? (data?.reachUs?.title ?? REACH_TITLE) : REACH_TITLE,
      intro: data?.reachUs?.blurb ?? undefined,
      // The email becomes a `mailto:` and the phone a `tel:`, so both leave stega behind.
      settings: {
        generalEmail: cleanText(settings?.generalEmail),
        phone,
        address: settings?.address ?? undefined,
      },
      contact: { name: settings?.general?.name ?? undefined },
      namePending: GENERAL_CONTACT_PENDING,
      // The prototype's urgent line needs a number to call.
      urgent: Boolean(phone),
    },
    takePart: {
      ...page.takePart,
      intro: takePartIntro(page.takePart.rows.length),
      labels: 'column' as const,
    },
    edit: page.layoutEdit,
  };
}

export type StoryPageView = ReturnType<typeof buildStoryPage>;
