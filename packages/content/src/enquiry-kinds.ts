/**
 * The one spec of the eight enquiry kinds (ADR 0007, ADR 0015, ADR 0016), ported from the
 * FORMS object in docs/design/design/Enquiry Modal.dc.html. It drives the Sanity `enquiry`
 * document, the Zod schemas, the Enquiry Modal markup and its stories. Nothing here is a fact:
 * no name, price, date, address or phone number. Those come from the Studio and fill the
 * templates at render time.
 *
 * Templates: `{contact}` names the routing contact ("Name, our partnerships lead," or "Our
 * partnerships lead"), `{responds}` adds the contact's response line with a leading space,
 * `{email}` and `{phone}` come from the contact or the site settings. A segment wrapped in
 * `[[ ]]` is dropped when a slot inside it is empty.
 */
export const ENQUIRY_KINDS = [
  'sponsor',
  'performer',
  'table',
  'member',
  'volunteer',
  'enrol',
  'vendor',
  'contact',
] as const;
export type EnquiryKind = (typeof ENQUIRY_KINDS)[number];

export const CONTACT_ROLES = [
  'membership',
  'volunteers',
  'partnerships',
  'vendors',
  'performers',
  'tables',
  'teacher',
  'general',
] as const;
export type ContactRole = (typeof CONTACT_ROLES)[number];

/** Which routing contact receives each kind (ADR 0016). */
export const KIND_TO_ROLE: Record<EnquiryKind, ContactRole> = {
  sponsor: 'partnerships',
  performer: 'performers',
  table: 'tables',
  member: 'membership',
  volunteer: 'volunteers',
  enrol: 'teacher',
  vendor: 'vendors',
  contact: 'general',
};

export const ROLE_TITLES: Record<ContactRole, string> = {
  membership: 'Membership',
  volunteers: 'Volunteers',
  partnerships: 'Partnerships and sponsors',
  vendors: 'Vendors',
  performers: 'Performers',
  tables: 'Gala tables',
  teacher: 'The teacher',
  general: 'General',
};

export const KIND_TITLES: Record<EnquiryKind, string> = {
  sponsor: 'Sponsor',
  performer: 'Performer',
  table: 'Gala table',
  member: 'Membership',
  volunteer: 'Volunteer',
  enrol: 'Lessons enrolment',
  vendor: 'Vendor booth',
  contact: 'Message',
};

export type FieldKind = 'text' | 'select' | 'area';
export type InputType = 'text' | 'email' | 'tel';

export interface FieldSpec {
  id: string;
  label: string;
  kind: FieldKind;
  /** Input type for `text` fields. */
  type?: InputType;
  required?: boolean;
  /** The noun phrase an error names: "We still need {req}." */
  req?: string;
  /** Spans both columns of the form grid. */
  wide?: boolean;
  options?: readonly string[];
  hint?: string;
  /** The address a reply goes to. Exactly one per kind. */
  email?: boolean;
}

export interface KindSpec {
  kind: EnquiryKind;
  title: string;
  blurb: string;
  submit: string;
  /** The success title: Yoruba thanks, then the outcome. */
  ok: string;
  /** The success body template. */
  okBody: string;
  /** A note under the fields, a template. */
  foot?: string;
  fields: readonly FieldSpec[];
  role: ContactRole;
  /** How `{contact}` reads with a name ("{name}, our partnerships lead,"). */
  contactNamed: string;
  /** How `{contact}` reads without one ("Our partnerships lead"). */
  contactUnnamed: string;
}

// The four helpers keep the prototype's FORMS names (T, SEL, AREA, MAIL) so the port reads side by side.
const T = (id: string, label: string, extra: Partial<FieldSpec> = {}): FieldSpec => ({
  id,
  label,
  kind: 'text',
  type: 'text',
  ...extra,
});
const SEL = (
  id: string,
  label: string,
  options: readonly string[],
  extra: Partial<FieldSpec> = {},
): FieldSpec => ({
  id,
  label,
  kind: 'select',
  options,
  ...extra,
});
const AREA = (id: string, label: string, extra: Partial<FieldSpec> = {}): FieldSpec => ({
  id,
  label,
  kind: 'area',
  wide: true,
  ...extra,
});
const MAIL = (id: string, label: string, req: string): FieldSpec => ({
  id,
  label,
  kind: 'text',
  type: 'email',
  email: true,
  required: true,
  req,
});

export const ENQUIRY_SPECS: Record<EnquiryKind, KindSpec> = {
  sponsor: {
    kind: 'sponsor',
    title: 'Sponsor Omo Yorùbá',
    blurb:
      'Four questions, then we send the deck and the impact numbers. One enquiry covers Odunde, the Gala, the Collective, or all of it.',
    submit: 'Send enquiry',
    ok: 'Ẹ ṣé! ✓ The deck is on its way.',
    okBody:
      '{contact} sends the deck and the impact numbers{responds} and follows up to talk through levels and recognition.',
    role: 'partnerships',
    contactNamed: '{name}, our partnerships lead,',
    contactUnnamed: 'Our partnerships lead',
    fields: [
      T('org', 'Organization', { required: true, wide: true, req: 'an organization' }),
      T('who', 'Your name and role', { required: true, req: 'your name and role' }),
      MAIL('mail', 'Email', 'an email address'),
      SEL(
        'interest',
        'What are you interested in',
        [
          'Odunde Festival',
          'End-of-Year Gala',
          'Both events',
          'Yoruba Cultural Collective',
          'Programs',
          'General, tell me more',
        ],
        { wide: true },
      ),
    ],
  },
  performer: {
    kind: 'performer',
    title: 'Ask about performing',
    blurb:
      'Drummers, dancers, and cultural groups. Five questions, and the program committee sees every one.',
    submit: 'Send enquiry',
    ok: 'Ẹ ṣé! ✓ We have your details.',
    okBody:
      'The festival program is decided in the spring. You hear from us either way{responds}, whether or not there is a slot this year.',
    role: 'performers',
    contactNamed: '{name}, for the program committee,',
    contactUnnamed: 'The program committee',
    fields: [
      T('group', 'Group or artist name', {
        required: true,
        wide: true,
        req: 'a group or artist name',
      }),
      T('who', 'Contact name', { required: true, req: 'a contact name' }),
      MAIL('mail', 'Email', 'an email address'),
      T('what', 'What you perform'),
      T('link', 'Link to video or Instagram'),
      T('size', 'How many people'),
    ],
  },
  table: {
    kind: 'table',
    title: 'Reserve a table of ten',
    blurb: 'Tell us who is coming and we place your table. Nothing is charged here.',
    submit: 'Reserve a table',
    ok: 'Ẹ ṣé! ✓ Your table is held.',
    okBody:
      'We hold it for you and send an invoice by email{responds}. Check or card is fine, and seating is arranged with you in the week before the night.',
    role: 'tables',
    contactNamed: '{name}, who places the tables,',
    contactUnnamed: 'The person who places the tables',
    fields: [
      T('name', 'Your name', { required: true, req: 'your name' }),
      T('org', 'Organization, if any'),
      MAIL('mail', 'Email', 'an email address'),
      T('phone', 'Phone', { type: 'tel' }),
      SEL('count', 'Number of tables', ['One table', 'Two tables', 'Three or more']),
      AREA('guests', 'Guest names, if you have them'),
    ],
  },
  member: {
    kind: 'member',
    title: 'Become a member',
    blurb:
      'Eight questions, about two minutes. Dues are not paid here. We tell you exactly what happens next.',
    submit: 'Become a member',
    ok: 'Ẹ ṣé! ✓ Welcome.',
    okBody:
      'Dues are not paid here. {contact} will call or write{responds} to arrange payment, and you are on the members list from today.',
    role: 'membership',
    contactNamed: '{name}, our membership lead,',
    contactUnnamed: 'Our membership lead',
    fields: [
      T('name', 'Full name', { required: true, req: 'your full name' }),
      MAIL('mail', 'Email', 'an email address we can reach you at'),
      T('phone', 'Phone', { type: 'tel' }),
      T('city', 'City', { required: true, req: 'the city you live in' }),
      SEL('household', 'Membership', ['Individual', 'Household']),
      T('hta', 'Hometown association, if any'),
      T('heard', 'How did you hear about us', { wide: true }),
      AREA('why', 'What draws you to Omo Yorùbá'),
    ],
  },
  volunteer: {
    kind: 'volunteer',
    title: 'Volunteer with us',
    blurb: 'One short form. Tell us when you are free and what you can do, and we place you.',
    submit: 'Raise your hand',
    ok: 'Ẹ ṣé! ✓',
    okBody: '{contact} writes{responds}. Most people start at a single event and go from there.',
    foot: 'Volunteers under 18 are welcome. We send a guardian consent form before a first shift.',
    role: 'volunteers',
    contactNamed: '{name}, who places volunteers,',
    contactUnnamed: 'The person who places volunteers',
    fields: [
      T('name', 'Full name', { required: true, req: 'your full name' }),
      MAIL('mail', 'Email', 'an email address we can reach you at'),
      T('phone', 'Phone', { type: 'tel' }),
      SEL('age', 'Age', ['Adult', 'Under 18']),
      SEL('avail', 'Availability', ['Event days', 'Weekends', 'Weekdays', 'Any of these'], {
        wide: true,
      }),
      T('where', 'Where you would like to help', { wide: true }),
      T('skills', 'Skills or languages', { wide: true }),
      AREA('notes', 'Anything we should know'),
    ],
  },
  enrol: {
    kind: 'enrol',
    title: 'Write to the teacher',
    blurb:
      'Lessons are arranged directly with our teacher. Tell her about the learner and she replies with a level, a time that works, and a start date.',
    submit: 'Send to the teacher',
    ok: 'Ẹ ṣé! ✓ Your message is with the teacher.',
    okBody:
      '{contact} replies{responds} with a level, a time, and the link for the call. Nothing is charged online: fees are agreed with her and settled after the first lesson.',
    role: 'teacher',
    contactNamed: '{name}, our teacher,',
    contactUnnamed: 'Our teacher',
    fields: [
      T('learner', 'Learner name', { required: true, req: 'the learner name' }),
      T('age', 'Age', { required: true, req: 'an age' }),
      SEL('level', 'How much Yoruba do they have', [
        'Not sure, let the teacher place them',
        'None yet',
        'Understands but does not speak',
        'Speaks a little',
        'Speaks well, wants to read and write',
      ]),
      SEL('when', 'When suits you', [
        'Weekday evenings',
        'Weekend mornings',
        'Weekend afternoons',
        'Flexible, let the teacher propose',
      ]),
      T('guardian', 'Your name, if the learner is under 18'),
      MAIL('mail', 'Email', 'an email address she can reply to'),
      T('phone', 'Phone, if you would rather talk', { type: 'tel' }),
      AREA('notes', 'Anything she should know', {
        hint: 'Siblings, time zone, one-to-one or with others, or the best time to reach you.',
      }),
    ],
  },
  vendor: {
    kind: 'vendor',
    title: 'Apply for a booth at Ọjà Balógun',
    blurb:
      'The market at Odunde. Fees and dates are on the festival page, and a booth is not held until the fee is paid.',
    submit: 'Send application',
    ok: 'Ẹ ṣé! ✓ Your application is in.',
    okBody:
      'We review applications in the order they arrive and write to every applicant{responds}. If you are accepted, the booth fee is invoiced and a place is held once it is paid.',
    foot: 'Photographs of your setup help us place you well.[[ Email them to {email} once you have sent this.]]',
    role: 'vendors',
    contactNamed: '{name}, who places the vendors,',
    contactUnnamed: 'The person who places the vendors',
    fields: [
      T('biz', 'Business name', { required: true, wide: true, req: 'a business name' }),
      T('who', 'Contact name', { required: true, req: 'a contact name' }),
      MAIL('mail', 'Email', 'an email address'),
      T('phone', 'Phone', { type: 'tel' }),
      SEL('cat', 'What you sell', [
        'Food, cooked on site',
        'Packaged food and drink',
        'Cloth and clothing',
        'Craft and art',
        'Books and media',
        'Something else',
      ]),
      SEL('size', 'Booth size', ['Standard booth', 'Double booth', 'Food truck']),
      SEL('power', 'Do you need power', ['No', 'Yes']),
      T('permit', 'Food permit number, if food'),
      T('social', 'Instagram or website', { wide: true }),
    ],
  },
  contact: {
    kind: 'contact',
    title: 'Send us a message',
    blurb: 'For anything else. We read everything.',
    submit: 'Send message',
    ok: 'Ẹ ṣé! ✓ We have your message.',
    okBody:
      '{contact} replies{responds}. If it is urgent, calling[[ {phone}]] reaches a person faster than email does.',
    role: 'general',
    contactNamed: '{name}, from our team,',
    contactUnnamed: 'Our team',
    fields: [
      T('name', 'Name', { required: true, req: 'your name' }),
      MAIL('mail', 'Email', 'an email address we can reply to'),
      T('subject', 'What is this about', { wide: true }),
      AREA('message', 'Message', { required: true, req: 'a message' }),
    ],
  },
};

/** The field that names the sender, in order of preference: the Inbox title and the email subject use it. */
export const SENDER_FIELDS = ['org', 'biz', 'group', 'name', 'learner'] as const;

/** The routing contact for a kind, as stored in `siteSettings.contacts[]`. */
export interface RoutingContact {
  name?: string;
  email?: string;
  phone?: string;
  responds?: string;
}

/** Site-wide fallbacks for the slots a contact does not fill. */
export interface SiteContact {
  email?: string;
  phone?: string;
}

/** Fills a template: slots, then the optional `[[ ]]` segments. */
export function fillTemplate(template: string, slots: Record<string, string | undefined>): string {
  const value = (key: string) => slots[key] ?? '';
  const withSegments = template.replace(/\[\[(.*?)\]\]/g, (_, segment: string) => {
    const keys = [...segment.matchAll(/\{(\w+)\}/g)].map((m) => m[1] as string);
    return keys.every((key) => value(key).trim() !== '') ? segment : '';
  });
  return withSegments
    .replace(/\{(\w+)\}/g, (_, key: string) => value(key))
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/ ([.,])/g, '$1')
    .trim();
}

function contactSlots(spec: KindSpec, contact: RoutingContact = {}, site: SiteContact = {}) {
  const name = contact.name?.trim();
  return {
    contact: name ? spec.contactNamed.replace('{name}', name) : spec.contactUnnamed,
    responds: contact.responds?.trim() ? ` ${contact.responds.trim()}` : '',
    email: contact.email ?? site.email,
    phone: contact.phone ?? site.phone,
  };
}

/** The success title and body for a kind, filled from the routing contact. */
export function successCopy(
  kind: EnquiryKind,
  contact: RoutingContact = {},
  site: SiteContact = {},
) {
  const spec = ENQUIRY_SPECS[kind];
  return { title: spec.ok, body: fillTemplate(spec.okBody, contactSlots(spec, contact, site)) };
}

/** The note under the fields, filled from the routing contact; undefined when the kind has none. */
export function footCopy(
  kind: EnquiryKind,
  contact: RoutingContact = {},
  site: SiteContact = {},
): string | undefined {
  const spec = ENQUIRY_SPECS[kind];
  return spec.foot === undefined
    ? undefined
    : fillTemplate(spec.foot, contactSlots(spec, contact, site));
}

/** The error phrases of the required fields, in field order ("We still need a, b."). */
export function requiredPhrases(kind: EnquiryKind): string[] {
  return ENQUIRY_SPECS[kind].fields
    .filter((f) => f.required)
    .map((f) => f.req ?? f.label.toLowerCase());
}

/** The field a reply goes to. */
export function replyToField(kind: EnquiryKind): FieldSpec {
  const field = ENQUIRY_SPECS[kind].fields.find((f) => f.email);
  if (!field) throw new Error(`Enquiry kind ${kind} has no email field`);
  return field;
}
