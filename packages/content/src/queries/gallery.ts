import { defineQuery } from 'groq';

/**
 * The gallery in one read (ROUTES section 1, ADR 0039): the `galleryPage` singleton with its header, actions,
 * the owner's consent policy and the layout options; every album with a slug and at least one photograph, with
 * what its tile shows (the title, its own date and its edition's year for the order and the line, the cover,
 * the first photograph for a missing cover and for `open: viewer`'s photo address, the count); and the
 * settings' general inbox for the removal row. The page orders the albums (`byNewestAlbum`). The filter names
 * the type as well as the id, so TypeGen types the singleton alone. Images project the asset reference, the
 * hotspot and the crop (ADR 0022). Layout values come back as stored; the page fills the schema defaults.
 */
export const galleryPageQuery = defineQuery(`*[_type == "galleryPage" && _id == "galleryPage"][0]{
  header{kicker{yo, en}, title, line},
  primaryAction{label, kind, enquiryKind, href, newTab},
  secondaryActions[]{_key, label, kind, enquiryKind, href, newTab},
  creditsAndConsent,
  "albums": *[_type == "album" && defined(slug.current) && count(photos) > 0]{
    _id,
    title,
    "slug": slug.current,
    date,
    "edition": event->edition,
    cover{_type, alt, caption, hotspot, crop, asset},
    "first": photos[0]{_key, _type, alt, caption, hotspot, crop, asset},
    "count": count(photos)
  },
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{generalEmail},
  layout{open, captions, state},
  seo{title, description}
}`);

/**
 * One album page in one read (ROUTES section 1, ADR 0037, ADR 0039): the album by its slug with its credit and
 * whether the photographer confirmed it, its consent note, its edition's year and kind (the facts line and the
 * link to the edition's page) and every photograph in order with its alt, caption and any credit of its own;
 * the gallery singleton's kicker, the owner's consent policy and the `captions` option; and the settings' general
 * inbox. No album for the slug answers `album: null`, which the route serves as a 404.
 */
export const albumPageQuery = defineQuery(`{
  "album": *[_type == "album" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    date,
    consentNote,
    creditConfirmed,
    "credit": coalesce(credit->defaultCredit, credit->name),
    "edition": event->{edition, kind},
    "photos": photos[]{
      _key,
      _type,
      alt,
      caption,
      hotspot,
      crop,
      asset,
      creditConfirmed,
      "credit": coalesce(credit->defaultCredit, credit->name, creditNote)
    }
  },
  "page": *[_type == "galleryPage" && _id == "galleryPage"][0]{
    header{kicker{yo, en}},
    creditsAndConsent,
    layout{captions},
    seo{title, description}
  },
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{generalEmail}
}`);
