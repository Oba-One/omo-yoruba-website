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

/**
 * The Lessons page in one read (ROUTES section 1): the `lessonsPage` singleton with its header,
 * actions, glance facts, what you learn with its levels, the steps of a lesson, the questions parents
 * ask and the take-part rows, the teacher it links with her portrait and short bio, and
 * her routing contact's email from the settings, which the page offers beside the enrol form. Images
 * project the asset reference (ADR 0022). Layout values come back as stored; the page fills the schema
 * defaults (`withLayoutDefaults`).
 */
export const lessonsPageQuery = defineQuery(`*[_type == "lessonsPage" && _id == "lessonsPage"][0]{
  header{kicker{yo, en}, title, line},
  primaryAction{label, kind, enquiryKind, href, newTab},
  secondaryActions[]{_key, label, kind, enquiryKind, href, newTab},
  glance[]{_key, label, value, note},
  "teacher": teacher->{
    _id, name, role, bioShort,
    portrait{_type, alt, caption, hotspot, crop, asset}
  },
  teacherIntro,
  learn,
  levels[]{_key, name, blurb},
  oneLesson[]{_key, step, title, detail},
  faq[]{_key, question, answer},
  takePart[]{_key, way, chip, title, line, label},
  "teacherEmail": *[_id == "siteSettings"][0].contacts[role == "teacher"][0].email,
  layout{lesson, portraits, faq},
  seo{title, description}
}`);

/**
 * The Collective's page in one read (ROUTES section 1): the `collectivePage` singleton with its header,
 * actions, argument and take-part rows, the Collective program's photograph beside the argument (one
 * image for the homepage card, the Programs card and this page, wayfinder ticket 31), the initiatives in
 * the page's order, and the one voice it references. Images project the asset reference (ADR 0022). Layout values come back as stored; the
 * page fills the schema defaults (`withLayoutDefaults`).
 */
export const collectivePageQuery =
  defineQuery(`*[_type == "collectivePage" && _id == "collectivePage"][0]{
  header{kicker{yo, en}, title, line},
  primaryAction{label, kind, enquiryKind, href, newTab},
  secondaryActions[]{_key, label, kind, enquiryKind, href, newTab},
  argument,
  "photo": *[_type == "program" && page == "collective"] | order(order asc)[0]{
    _id,
    name,
    image{_type, alt, caption, hotspot, crop, asset}
  },
  "initiatives": initiatives[]->{
    _id,
    name,
    memberLed,
    status,
    statusLine,
    blurb,
    image{_type, alt, caption, hotspot, crop, asset},
    serves,
    since,
    next
  },
  "voice": voice->{_id, quote, name, relation, permissionToName},
  takePart[]{_key, way, chip, title, line, label},
  layout{initiatives, green, status, events},
  seo{title, description}
}`);
