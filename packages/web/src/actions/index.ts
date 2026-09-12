/**
 * The nine Astro Actions (ADR 0004, ADR 0019): one per enquiry kind and the newsletter, each
 * accepting the posted form and answering the action result. The HTML forms post here without
 * JavaScript; the site's bridge calls the same actions from the modal and the footer. The
 * handlers do the work and stay testable without Astro.
 */

import { defineAction } from 'astro:actions';
import type { EnquiryKind } from '@oy/content/enquiry-kinds';
import { enquiryHandler, newsletterHandler } from '../lib/forms/handlers';
import { siteDeps } from '../lib/forms/site-deps';

const enquiry = (kind: EnquiryKind) =>
  defineAction({
    accept: 'form',
    handler: (input, context) => {
      context.cache.set(false);
      return enquiryHandler(kind, input, context, siteDeps());
    },
  });

export const server = {
  enquiry: {
    sponsor: enquiry('sponsor'),
    performer: enquiry('performer'),
    table: enquiry('table'),
    member: enquiry('member'),
    volunteer: enquiry('volunteer'),
    enrol: enquiry('enrol'),
    vendor: enquiry('vendor'),
    contact: enquiry('contact'),
  },
  newsletter: defineAction({
    accept: 'form',
    handler: (input, context) => {
      context.cache.set(false);
      return newsletterHandler(input, context, siteDeps());
    },
  }),
};
