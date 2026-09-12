import { defineQuery } from 'groq';

/**
 * The homepage in one read (ROUTES section 1): the singleton with its hero, stats, voices,
 * year-in-the-life tiles and doors resolved, every festival and gala edition for the season rule
 * (`leadEvent`), the programs in order and the three newest posts. Images project the asset
 * reference, the hotspot and the crop, never a URL string, so the site builds every URL itself
 * (`createImageSet`) and stega never lands in a `src`. Layout values come back as stored; the
 * page fills the schema defaults (`withLayoutDefaults`).
 */
export const homepageQuery = defineQuery(`*[_id == "homepage"][0]{
  hero{
    kicker{yo, en},
    title,
    sub,
    blessing{yo, en},
    image{_type, alt, caption, hotspot, crop, asset},
    primaryAction{label, kind, enquiryKind, href, newTab},
    secondaryActions[]{_key, label, kind, enquiryKind, href, newTab}
  },
  "leadEvent": leadEvent->{_id, kind, title, edition, start, end, "venueName": venue.name, summary},
  "events": *[_type == "event" && kind in ["festival", "gala"]] | order(edition desc){
    _id, kind, title, edition, start, end, "venueName": venue.name, summary
  },
  "stats": stats[]->{_id, value, label, source, asOf},
  programsIntro,
  "programs": *[_type == "program"] | order(order asc){
    _id, name, "slug": slug.current, kicker{yo, en}, blurb,
    image{_type, alt, caption, hotspot, crop, asset},
    cadence, ages, page,
    action{label, kind, enquiryKind, href, newTab}
  },
  "voices": voices[]->{_id, quote, name, relation, permissionToName, context},
  voicesIntro,
  voicesProverb{yo, en},
  newsIntro,
  "news": *[_type == "newsPost"] | order(date desc)[0...3]{
    _id, title, "slug": slug.current, date, kicker{yo, en}, summary,
    image{_type, alt, caption, hotspot, crop, asset}
  },
  yearInLife[]{_key, _type, alt, caption, hotspot, crop, asset},
  raiseYourHand{
    title,
    blurb,
    "doors": doors[]->{
      _id, key, title, blurb, bullets,
      action{label, kind, enquiryKind, href, newTab},
      image{_type, alt, caption, hotspot, crop, asset}
    }
  },
  layout{season, highlight, gallery, involved, newsletter, pattern, motion},
  seo{title, description}
}`);
