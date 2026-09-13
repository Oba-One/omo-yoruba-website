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
