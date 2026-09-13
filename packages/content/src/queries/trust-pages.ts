import { defineQuery } from 'groq';

/**
 * Get Involved in one read (ROUTES section 1, ADR 0034): the `getInvolvedPage` singleton with its header
 * and actions, its doors in the page's order (the cards, then the give door that closes the page), the
 * hometown associations block with the stat it shows and every association the Studio holds, the fallback
 * block, and the settings the contact block draws (the general inbox, the phone, the general routing
 * contact's name and response line). The filter names the type as well as the id, so TypeGen types the
 * singleton alone. Images project the asset reference (ADR 0022). Layout values come back as stored; the
 * page fills the schema defaults (`withLayoutDefaults`).
 */
export const getInvolvedPageQuery =
  defineQuery(`*[_type == "getInvolvedPage" && _id == "getInvolvedPage"][0]{
  header{kicker{yo, en}, title, line},
  primaryAction{label, kind, enquiryKind, href, newTab},
  secondaryActions[]{_key, label, kind, enquiryKind, href, newTab},
  "doors": doors[]->{
    _id, key, title, blurb, bullets,
    action{label, kind, enquiryKind, href, newTab},
    image{_type, alt, caption, hotspot, crop, asset}
  },
  hometownAssociations{
    title,
    prose,
    "stat": stat->{_id, value, label}
  },
  "associations": *[_type == "hometownAssociation"] | order(name asc){_id, name, url},
  fallback{title, blurb},
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    generalEmail,
    phone,
    "general": contacts[role == "general"][0]{name, responds}
  },
  layout{doors, hta},
  seo{title, description}
}`);

/**
 * Impact in one read (ROUTES section 1, ADR 0035): the `impactPage` singleton with its header and actions,
 * the headline figures in order with their sources, how we work with its photograph, the outcomes with
 * their subjects (a program or an event page's kind) and every program's name for the slots, the civic
 * prose and every festival edition (the newest past one with photographs gives the attendance and the
 * vendors hosted, the next one the cost), the count of the festival page's partners, the voices, the six
 * photographs, the newest governance document of each kind with its file's URL, the board count, every
 * partner, and the settings the governance block and the closing band draw. Images project the asset
 * reference (ADR 0022). Layout values come back as stored; the page fills the schema defaults.
 */
export const impactPageQuery = defineQuery(`*[_type == "impactPage" && _id == "impactPage"][0]{
  header{kicker{yo, en}, title, line},
  primaryAction{label, kind, enquiryKind, href, newTab},
  secondaryActions[]{_key, label, kind, enquiryKind, href, newTab},
  "stats": stats[]->{_id, value, label, source},
  howWeWork,
  howWeWorkImage{_type, alt, caption, hotspot, crop, asset},
  "outcomes": outcomes[]->{
    _id,
    kind,
    plainStatement,
    figure{value, label, source},
    "program": program->{_id, name, page, "slug": slug.current}
  },
  "programs": *[_type == "program"] | order(order asc){_id, name, page, "slug": slug.current},
  civicInfra,
  "festivals": *[_type == "event" && kind == "festival"] | order(edition desc){
    _id,
    kind,
    edition,
    start,
    end,
    cost,
    attendance{value, label, source},
    vendorsHosted{value, label, source},
    "album": album->{_id, "photos": count(photos)}
  },
  "festivalPartners": count(*[_type == "partner" && "odunde" in scope]),
  "voices": voices[]->{_id, quote, name, relation, permissionToName, context},
  photos[]{_key, _type, alt, caption, hotspot, crop, asset},
  "governance": {
    "form990": *[_type == "governanceDoc" && kind == "form990"] | order(year desc)[0]{
      _id, year, note, "file": file.asset->{url, originalFilename, extension}
    },
    "annualReport": *[_type == "governanceDoc" && kind == "annualReport"] | order(year desc)[0]{
      _id, year, note, "file": file.asset->{url, originalFilename, extension}
    },
    "audit": *[_type == "governanceDoc" && kind == "audit"] | order(year desc)[0]{
      _id, year, note, "file": file.asset->{url, originalFilename, extension}
    }
  },
  "boardCount": count(*[_type == "person" && group == "board"]),
  "partners": *[_type == "partner"] | order(name asc){
    _id,
    name,
    url,
    kind,
    logo{_type, alt, caption, hotspot, crop, asset}
  },
  fundersIntro,
  nextYear{title},
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    ein,
    address,
    "partnerships": contacts[role == "partnerships"][0]{name, email, responds}
  },
  layout{stats, outcomes, sources, funders},
  seo{title, description}
}`);

/**
 * Our Story in one read (ROUTES section 1, ADR 0035): the `storyPage` singleton with its header and
 * actions, how it began with its facts and its earliest photograph, the timeline entries in order, the
 * board and the staff and volunteers by group and order (the teacher is listed on the Lessons page only),
 * Reach us, the take-part rows, and the settings the contact block draws. Images project the asset
 * reference (ADR 0022). Layout values come back as stored; the page fills the schema defaults.
 */
export const storyPageQuery = defineQuery(`*[_type == "storyPage" && _id == "storyPage"][0]{
  header{kicker{yo, en}, title, line},
  primaryAction{label, kind, enquiryKind, href, newTab},
  secondaryActions[]{_key, label, kind, enquiryKind, href, newTab},
  founding,
  foundingFacts[]{_key, label, value, note},
  foundingImage{_type, alt, caption, hotspot, crop, asset},
  "timeline": timeline[]->{_id, year, blurb, milestone},
  boardIntro,
  staffIntro,
  "board": *[_type == "person" && group == "board"] | order(order asc, name asc){
    _id, name, role, bioShort, bioFull,
    portrait{_type, alt, caption, hotspot, crop, asset}
  },
  "staff": *[_type == "person" && group in ["staff", "volunteer"]] | order(group asc, order asc, name asc){
    _id, group, name, role,
    portrait{_type, alt, caption, hotspot, crop, asset}
  },
  reachUs{title, blurb},
  takePart[]{_key, way, chip, title, line, label},
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    generalEmail,
    phone,
    address,
    "general": contacts[role == "general"][0]{name}
  },
  layout{timeline, bios, portraits},
  seo{title, description}
}`);
