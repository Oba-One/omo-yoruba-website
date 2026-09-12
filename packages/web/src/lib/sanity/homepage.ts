/**
 * The homepage view: what the page hands the library parts, built from the one homepage query.
 * Pure, so a test can drive it with a fixture: the layout with the schema defaults filled, the
 * lead edition from the season rule, every image resolved to a CDN set with its alt, the voices
 * padded to three Pending cards while none exist, the body data attributes the options drive,
 * and the `data-sanity` attributes for click-to-edit, only in draft mode.
 */
import type { ImageSetBuilder } from '@oy/content/images';
import { withLayoutDefaults } from '@oy/content/layout';
import { calendarKind, leadEvent } from '@oy/content/lead-event';
import type { homepageQuery } from '@oy/content/queries';
import type { ClientReturn } from '@sanity/client';
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

export interface ResolvedImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
}

export interface BuildOptions {
  imageSet: ImageSetBuilder;
  /** Draft mode: the `data-sanity` attributes are rendered. */
  preview: boolean;
  /** The Studio's base path for the edit attributes. */
  studioUrl: string;
  now?: Date;
}

const ORG_NAME = 'Omo Yorùbá of Southern California';

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
  const { imageSet, preview, studioUrl, now = new Date() } = options;
  const edit = (path: string, id = 'homepage', type = 'homepage') =>
    preview ? dataAttribute({ id, type, path, baseUrl: studioUrl }) : undefined;

  const layout = withLayoutDefaults<HomepageLayout>('homepage', data?.layout);
  const hero = data?.hero;
  const events = (data?.events ?? []).filter((event) => event !== null);
  const lead = leadEvent(events, { season: layout.season, explicit: data?.leadEvent, now });
  const leadKind: 'festival' | 'gala' = lead
    ? lead.kind === 'festival'
      ? 'festival'
      : 'gala'
    : calendarKind(now);

  const voices = (data?.voices ?? []).filter((voice) => voice !== null);

  return {
    title: data?.seo?.title?.trim() || hero?.title?.trim() || ORG_NAME,
    description: data?.seo?.description?.trim() || hero?.sub?.trim() || undefined,
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
      kicker: hero?.kicker,
      title: hero?.title,
      sub: hero?.sub,
      blessing: hero?.blessing,
      primary: hero?.primaryAction,
      secondary: (hero?.secondaryActions ?? []).filter((action) => action !== null),
      motion: layout.motion !== 'off',
    },
    lead: { event: lead, kind: leadKind },
    stats: (data?.stats ?? []).filter((stat) => stat !== null),
    programsIntro: data?.programsIntro,
    programs: (data?.programs ?? []).map((program) => ({
      program: {
        ...program,
        image: resolve(imageSet, program.image, { width: 360, aspect: 360 / 170 }),
      },
      imageEdit: edit('image', program._id, 'program'),
    })),
    voicesIntro: data?.voicesIntro,
    voices: voices.length > 0 ? voices : [undefined, undefined, undefined],
    proverb: data?.voicesProverb,
    newsIntro: data?.newsIntro,
    news: (data?.news ?? []).filter((post) => post !== null),
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
            image: resolve(imageSet, door.image, { width: 520, aspect: 520 / 190 }),
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
