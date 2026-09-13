import { defineQuery } from 'groq';

/**
 * The Programs hub in one read (ROUTES section 1): the `programsPage` singleton with its header,
 * actions and take-part rows, Kids & STEM with its sub-programs (their photographs, facts and
 * actions), Cultural Exchange with its facts and photograph, the year strip's rows with their
 * programs' names, and every program in order for the cards
 * (the page shows four, or the first three under the `cards` option). The filter names the type as
 * well as the id, so TypeGen types the singleton's own fields rather than a union over every document.
 * Images project the asset reference, the hotspot and the crop, never a URL string (ADR 0022). Layout
 * values come back as stored; the page fills the schema defaults (`withLayoutDefaults`).
 */
export const programsPageQuery =
  defineQuery(`*[_type == "programsPage" && _id == "programsPage"][0]{
  header{kicker{yo, en}, title, line},
  primaryAction{label, kind, enquiryKind, href, newTab},
  secondaryActions[]{_key, label, kind, enquiryKind, href, newTab},
  takePart[]{_key, way, chip, title, line, label},
  kidsStem{
    title,
    blurb,
    subprograms[]{
      _key, name, blurb,
      image{_type, alt, caption, hotspot, crop, asset},
      facts[]{_key, label, value, note},
      action{label, kind, enquiryKind, href, newTab}
    }
  },
  culturalExchange{
    title, blurb, cadence, eligibility, howToJoin,
    image{_type, alt, caption, hotspot, crop, asset}
  },
  yearStrip[]{_key, when, kind, note, "program": program->name},
  "programs": *[_type == "program"] | order(order asc){
    _id, name, "slug": slug.current, blurb,
    image{_type, alt, caption, hotspot, crop, asset},
    cadence, ages, page,
    action{label, kind, enquiryKind, href, newTab}
  },
  layout{cards, inline, yearstrip},
  seo{title, description}
}`);
