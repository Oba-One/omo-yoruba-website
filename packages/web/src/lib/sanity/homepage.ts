/**
 * The homepage view: what the page hands the library parts, built from the one homepage query.
 * Pure, so a test can drive it with a fixture: the layout with the schema defaults filled, the
 * lead edition from the season rule, the hero's own gold button whatever the highlight (ADR 0042;
 * the prototype swapped in the highlighted program's action), the strip's short labels, every
 * image resolved to a CDN set with its alt and hotspot framing, the voices padded to the
 * prototype's three placeholder slots while fewer exist, the body data attributes the options drive, the head's title
 * and description cleaned of stega, and the `data-sanity` attributes for click-to-edit, only in
 * draft mode.
 */
import { withLayoutDefaults } from '@oy/content/layout';
import { calendarKind, leadEvent, leadKindOf } from '@oy/content/lead-event';
import { HOMEPAGE_VOICE_SLOTS, type VoiceSlot } from '@oy/content/pending';
import type { homepageQuery } from '@oy/content/queries';
import { usableAction } from '@oy/ui/core/ActionButton/action.ts';
import type { ClientReturn } from '@sanity/client';
import { type BuildOptions, cleanText, editAttributes, resolveImage } from './view';

export type { BuildOptions };

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

const ORG_NAME = 'Omo Yorùbá of Southern California';

export function buildHomepage(data: HomepageData | null, options: BuildOptions) {
  const { imageSet, now = new Date() } = options;
  const edit = editAttributes(options, 'homepage');

  const layout = withLayoutDefaults<HomepageLayout>('homepage', data?.layout);
  const hero = data?.hero;
  const events = (data?.events ?? []).filter((event) => event !== null);
  const lead = leadEvent(events, { season: layout.season, now });
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

  const listed = (data?.programs ?? []).filter((program) => program !== null);

  // Nothing in the head may carry stega (the overlay would read the title as editable text).
  const clean = cleanText;

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
      image: resolveImage(imageSet, hero?.image, { width: 1440 }),
      imageEdit: edit('hero.image'),
      edit: edit('layout.motion'),
      kicker: hero?.kicker,
      title: hero?.title,
      emphasis: hero?.emphasis,
      sub: hero?.sub,
      blessing: hero?.blessing,
      // A half-filled action (a draft, a write outside the Studio) shows no button.
      primary: usableAction(hero?.primaryAction),
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
    programs: listed.slice(0, 3).map((program) => ({
      program: {
        ...program,
        image: resolveImage(imageSet, program.image, { width: 360 }),
      },
      imageEdit: edit('image', program._id, 'program'),
    })),
    voicesIntro: data?.voicesIntro,
    voices,
    proverb: data?.voicesProverb,
    tiles: (data?.yearInLife ?? []).map((tile) => ({
      image: resolveImage(imageSet, tile, { width: 640 }),
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
            image: resolveImage(imageSet, door.image, { width: 540 }),
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
