/**
 * The homepage view: what the page hands the library parts, built from the one homepage query.
 * Pure, so a test can drive it with a fixture: the layout with the schema defaults filled, the
 * lead edition from the season rule, the hero's gold button following the highlight option (the
 * highlighted program's own action, as the prototype swaps it), the strip's short labels, every
 * image resolved to a CDN set with its alt and hotspot framing, the voices padded to the
 * prototype's three placeholder slots while fewer exist, the news oldest first with Read more on
 * the page each post is tagged to, the body data attributes the options drive, the head's title
 * and description cleaned of stega, and the `data-sanity` attributes for click-to-edit, only in
 * draft mode.
 */
import type { ImageSetBuilder } from '@oy/content/images';
import { withLayoutDefaults } from '@oy/content/layout';
import { calendarKind, leadEvent, leadKindOf } from '@oy/content/lead-event';
import { HOMEPAGE_VOICE_SLOTS, type VoiceSlot } from '@oy/content/pending';
import type { homepageQuery } from '@oy/content/queries';
import { editionRoute, programRoute } from '@oy/content/routes';
import { usableAction } from '@oy/ui/core/ActionButton/action.ts';
import type { ResolvedImage } from '@oy/ui/media/image.ts';
import type { ClientReturn } from '@sanity/client';
import { stegaClean } from '@sanity/client/stega';
import { dataAttribute } from './data-attribute';

export type HomepageData = NonNullable<ClientReturn<typeof homepageQuery, unknown>>;

export interface HomepageLayout extends Record<string, string> {
  season: 'auto' | 'gala' | 'odunde';
  highlight: 'festival' | 'school' | 'collective';
  gallery: '7' | '5' | '3';
  involved: 'doors' | 'rows';
  newsletter: 'footer' | 'band';
  pattern: 'rich' | 'subtle';
  motion: 'on' | 'off';
}

export interface BuildOptions {
  imageSet: ImageSetBuilder;
  /** Draft mode: the `data-sanity` attributes are rendered. */
  draft: boolean;
  /** The Studio's base path for the edit attributes. */
  studioUrl: string;
  now?: Date;
}

const ORG_NAME = 'Omo Yorùbá of Southern California';

/** The program page each highlight value leads with; `festival` keeps the hero's own action. */
const HIGHLIGHT_PAGES: Record<HomepageLayout['highlight'], string | undefined> = {
  festival: undefined,
  school: 'lessons',
  collective: 'collective',
};

type NewsTag = { _type: string; kind?: string | null; page?: string | null } | null;

/**
 * Where a post's Read more goes while the News page waits on its cadence (wayfinder ticket 08):
 * the page of the first tag that has one, an edition's event page or a program's page (the hub
 * for a program without its own). Undefined leaves the card without a link.
 */
export function newsHref(tags: readonly NewsTag[] | null | undefined): string | undefined {
  for (const tag of tags ?? []) {
    if (tag?._type === 'event') {
      const route = editionRoute(tag.kind);
      if (route) return route;
    }
    if (tag?._type === 'program') return programRoute(tag.page);
  }
  return undefined;
}

type ImageLike = Parameters<ImageSetBuilder>[0] & { alt?: string | null };

function resolve(
  imageSet: ImageSetBuilder,
  image: ImageLike | null | undefined,
  options: Parameters<ImageSetBuilder>[1],
): ResolvedImage | undefined {
  const set = imageSet(image, options);
  return set ? { ...set, alt: image?.alt ?? '' } : undefined;
}

export function buildHomepage(data: HomepageData | null, options: BuildOptions) {
  const { imageSet, draft, studioUrl, now = new Date() } = options;
  const edit = (path: string, id = 'homepage', type = 'homepage') =>
    draft ? dataAttribute({ id, type, path, baseUrl: studioUrl }) : undefined;

  const layout = withLayoutDefaults<HomepageLayout>('homepage', data?.layout);
  const hero = data?.hero;
  const events = (data?.events ?? []).filter((event) => event !== null);
  const lead = leadEvent(events, { season: layout.season, explicit: data?.leadEvent, now });
  const leadKind = lead ? leadKindOf(lead) : calendarKind(now);

  // The prototype's three-column rhythm: placeholder slots fill up to three while voices are few,
  // skipping a slot a testimonial of the same context already fills.
  type Voice = NonNullable<HomepageData['voices']>[number];
  const testimonials = (data?.voices ?? []).filter((voice) => voice !== null);
  const covered = new Set(testimonials.map((voice) => voice.context));
  const voices: { testimonial?: Voice; placeholder?: VoiceSlot }[] = [
    ...testimonials.map((testimonial) => ({ testimonial })),
    ...HOMEPAGE_VOICE_SLOTS.filter((slot) => !covered.has(slot.context))
      .slice(0, Math.max(0, HOMEPAGE_VOICE_SLOTS.length - testimonials.length))
      .map((placeholder) => ({ placeholder })),
  ];

  // The highlighted program's action replaces the hero's gold button (the prototype's CTA switch),
  // looked up among every program, while the grid shows the first three.
  const allPrograms = (data?.programs ?? []).filter((program) => program !== null);
  const highlightPage = HIGHLIGHT_PAGES[layout.highlight];
  const highlightAction = highlightPage
    ? allPrograms.find((program) => program.page === highlightPage)?.action
    : undefined;

  // Nothing in the head may carry stega (the overlay would read the title as editable text).
  const clean = (value: string | null | undefined) =>
    value ? stegaClean(value).trim() || undefined : undefined;

  return {
    title: clean(data?.seo?.title) || clean(hero?.title) || ORG_NAME,
    description: clean(data?.seo?.description) || clean(hero?.sub),
    layout,
    root: {
      highlight: layout.highlight,
      pattern: layout.pattern,
      motion: layout.motion === 'off' ? 'false' : 'true',
      season: layout.season,
      involved: layout.involved,
      newsletter: layout.newsletter,
      gallery: layout.gallery,
    },
    hero: {
      image: resolve(imageSet, hero?.image, { width: 1440 }),
      imageEdit: edit('hero.image'),
      edit: edit('layout.motion'),
      kicker: hero?.kicker,
      title: hero?.title,
      emphasis: hero?.emphasis,
      sub: hero?.sub,
      blessing: hero?.blessing,
      // A half-filled program action (a draft, a write outside the Studio) never removes the button.
      primary: usableAction(highlightAction, hero?.primaryAction),
      secondary: (hero?.secondaryActions ?? []).filter((action) => action !== null),
      motion: layout.motion !== 'off',
    },
    lead: { event: lead, kind: leadKind },
    // The strip's short label where the Studio holds one ("years serving SoCal").
    stats: (data?.stats ?? [])
      .filter((stat) => stat !== null)
      .map((stat) => ({ ...stat, label: stat.shortLabel || stat.label })),
    programsIntro: data?.programsIntro,
    // No aspect lock: the card crops with object-fit and the hotspot, as the prototype does, so a
    // narrow card on a phone does not crop a crop.
    programs: allPrograms.slice(0, 3).map((program) => ({
      program: {
        ...program,
        image: resolve(imageSet, program.image, { width: 360 }),
      },
      imageEdit: edit('image', program._id, 'program'),
    })),
    voicesIntro: data?.voicesIntro,
    voices,
    proverb: data?.voicesProverb,
    newsIntro: data?.newsIntro,
    // The three newest, read oldest first as the prototype lists them.
    news: (data?.news ?? [])
      .filter((post) => post !== null)
      .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
      .map((post) => ({ post, href: newsHref(post.tags) })),
    tiles: (data?.yearInLife ?? []).map((tile) => ({
      image: resolve(imageSet, tile, { width: 640 }),
      alt: tile.alt ?? '',
      caption: tile.caption,
      edit: edit(`yearInLife[_key=="${tile._key}"]`),
    })),
    raiseYourHand: {
      title: data?.raiseYourHand?.title,
      blurb: data?.raiseYourHand?.blurb,
      doors: (data?.raiseYourHand?.doors ?? [])
        .filter((door) => door !== null)
        .map((door) => ({
          door: {
            ...door,
            image: resolve(imageSet, door.image, { width: 540 }),
          },
          imageEdit: edit('image', door._id, 'door'),
        })),
    },
    edit: {
      season: edit('layout.season'),
      highlight: edit('layout.highlight'),
      gallery: edit('layout.gallery'),
      involved: edit('layout.involved'),
      newsletter: edit('layout.newsletter'),
      pattern: edit('layout.pattern'),
      motion: edit('layout.motion'),
    },
  };
}

export type HomepageView = ReturnType<typeof buildHomepage>;
