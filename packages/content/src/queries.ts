/**
 * The GROQ the site runs (the only package where GROQ lives, ADR 0003). `defineQuery` keeps each
 * query a literal type so TypeGen registers its result on `SanityQueries` and `client.fetch`
 * returns it typed; the two count and lookup queries the actions run are typed by hand where
 * TypeGen cannot evaluate a built string.
 */
import { defineQuery } from 'groq';
import { ENQUIRY_KINDS, replyToField } from './enquiry-kinds';

/** The site settings every page reads for the chrome, the dialogs and the actions. */
export const siteSettingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  orgName,
  wordmarkLine2,
  ein,
  address,
  phone,
  generalEmail,
  contacts[]{role, name, email, phone, responds},
  socials[]{network, url},
  footerBlurb,
  newsletterTitle,
  newsletterBlurb,
  zeffyEmbedUrl,
  eventbriteUrl,
  analyticsEnabled,
  theme
}`);

/** The slice the actions read: the routing contacts and the general inbox. */
export const routingQuery = defineQuery(
  `*[_id == "siteSettings"][0]{contacts[]{role, name, email, phone, responds}, generalEmail, phone}`,
);

/**
 * How many enquiries one reply-to address sent since `$since` (the address cap, ADR 0019). The
 * OR across kinds comes from the spec's reply-to fields, so a kind added once is counted.
 * Parameters: `$email`, `$since` (an ISO datetime). Returns a number.
 */
export const enquiryCountByEmailQuery = `count(*[_type == "enquiry" && submittedAt > $since && (${ENQUIRY_KINDS.map(
  (kind) => `${kind}.${replyToField(kind).id} == $email`,
).join(' || ')})])`;

/** Whether an address is already a subscriber. Parameter: `$email`. Returns an id or null. */
export const subscriberByEmailQuery = defineQuery(
  `*[_type == "subscriber" && email == $email][0]._id`,
);
