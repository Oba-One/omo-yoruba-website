import { defineQuery } from 'groq';

/**
 * The festival page in one read (ROUTES section 1): the `festivalPage` singleton with its header,
 * actions, glance facts, Portable Text, plan-your-visit facts and take-part rows; every festival edition with the
 * facts the page reads (the page picks the next one and the past one, ADR 0024), its schedule with
 * the zone names, its vendor terms and attendance, and the first eight photographs of its album
 * with the album's credit; the zones in order; the partners scoped to Odunde. Images project the
 * asset reference, the hotspot and the crop, never a URL string (ADR 0022). Layout values come back
 * as stored; the page fills the schema defaults (`withLayoutDefaults`).
 */
export const festivalPageQuery = defineQuery(`*[_id == "festivalPage"][0]{
  header{
    kicker{yo, en},
    title,
    line,
    image{_type, alt, caption, hotspot, crop, asset}
  },
  primaryAction{label, kind, enquiryKind, href, newTab},
  secondaryActions[]{_key, label, kind, enquiryKind, href, newTab},
  extraFacts[]{_key, label, value, note},
  whatItIs,
  whatItIsImage{_type, alt, caption, hotspot, crop, asset},
  zonesIntro,
  planYourVisit[]{_key, label, value, note},
  takePart[]{_key, way, title, line, label},
  pastYearsIntro,
  partnersIntro,
  "editions": *[_type == "event" && kind == "festival"] | order(edition desc){
    _id,
    kind,
    title,
    edition,
    start,
    end,
    venue{name, address, line},
    cost,
    summary,
    schedule[]{_key, time, day, title{yo, en}, detail, "zone": zone->name{yo, en}},
    vendorTerms{fees, closeDate, decisionDate, permitNote},
    attendance{value, label, source, asOf},
    "album": album->{
      _id,
      title,
      "slug": slug.current,
      creditConfirmed,
      "credit": coalesce(credit->defaultCredit, credit->name),
      "photos": photos[0...8]{_key, _type, alt, caption, hotspot, crop, asset}
    }
  },
  "zones": *[_type == "zone" && active != false] | order(order asc){
    _id,
    name{yo, en},
    line,
    image{_type, alt, caption, hotspot, crop, asset}
  },
  "partners": *[_type == "partner" && "odunde" in scope] | order(name asc){
    _id,
    name,
    url,
    kind,
    logo{_type, alt, caption, hotspot, crop, asset}
  },
  layout{phead, zones, schedule, takepart, labels},
  seo{title, description}
}`);

/**
 * The Gala page in one read (ROUTES section 1): the `galaPage` singleton with its header, actions,
 * extra glance facts, section intros and take-part rows; every gala edition with the facts the page
 * reads (the page picks the next one and the past one, ADR 0024), its running order, its ticket
 * tiers in order and the first eight photographs of its album with the album's credit; the sponsor
 * levels scoped to the Gala or the whole organization, in order; every honoree with the edition it
 * belongs to. Images project the asset reference, the hotspot and the crop (ADR 0022). Layout values
 * come back as stored; the page fills the schema defaults (`withLayoutDefaults`).
 */
export const galaPageQuery = defineQuery(`*[_id == "galaPage"][0]{
  header{
    kicker{yo, en},
    title,
    line,
    image{_type, alt, caption, hotspot, crop, asset}
  },
  primaryAction{label, kind, enquiryKind, href, newTab},
  secondaryActions[]{_key, label, kind, enquiryKind, href, newTab},
  extraFacts[]{_key, label, value, note},
  eveningIntro,
  tiersIntro,
  sponsorIntro,
  honoreesIntro,
  pastIntro,
  takePart[]{_key, way, title, line, label},
  "editions": *[_type == "event" && kind == "gala"] | order(edition desc){
    _id,
    kind,
    title,
    edition,
    start,
    end,
    doors,
    venue{name, address, line},
    dress,
    ticketsUrl,
    schedule[]{_key, time, day, title{yo, en}, detail, "zone": zone->name{yo, en}},
    "tiers": *[_type == "ticketTier" && event._ref == ^._id] | order(order asc){
      _id,
      name,
      price,
      includes,
      variant,
      featured
    },
    "album": album->{
      _id,
      title,
      "slug": slug.current,
      creditConfirmed,
      "credit": coalesce(credit->defaultCredit, credit->name),
      "photos": photos[0...8]{_key, _type, alt, caption, hotspot, crop, asset}
    }
  },
  "sponsorLevels": *[_type == "sponsorLevel" && scope in ["gala", "org"]] | order(order asc){
    _id,
    name,
    amount,
    recognition
  },
  "honorees": *[_type == "honoree" && event->kind == "gala"] | order(name asc){
    _id,
    name,
    award,
    blurb,
    image{_type, alt, caption, hotspot, crop, asset},
    "eventId": event._ref
  },
  layout{treatment, tiers, emphasis, awards, schedule, past, labels},
  seo{title, description}
}`);
