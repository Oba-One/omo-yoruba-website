/**
 * The eight enquiry kinds (ADR 0007, ADR 0015) and the routing roles (ADR 0016). The full spec
 * (titles, fields, success copy) follows in this file; these constants are what the schema
 * objects need first.
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
