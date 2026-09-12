import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints';

// The two Sanity Functions (ADR 0004, ADR 0014, ADR 0017). The manifest sits at the repo root next
// to bun.lock, as Sanity's monorepo guidance asks; the code lives under packages/content/functions.
// Deploy with `bunx sanity blueprints deploy` from the root; test locally with
// `bunx sanity functions test <name> --file <event.json>` (docs/runbook.md, Functions).
//
// content-lint lists the content types by name so it never sees its own reports, enquiries or
// subscribers; functions/content-lint/lint.test.ts checks the list against LINT_TYPES.
export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'enquiry-notify',
      src: 'packages/content/functions/enquiry-notify',
      event: {
        on: ['create'],
        filter: '_type == "enquiry" && !defined(notifiedAt)',
      },
    }),
    defineDocumentFunction({
      name: 'content-lint',
      src: 'packages/content/functions/content-lint',
      event: {
        on: ['create', 'update'],
        filter:
          '_type in ["siteSettings", "homepage", "festivalPage", "galaPage", "programsPage", "lessonsPage", "collectivePage", "getInvolvedPage", "impactPage", "storyPage", "donatePage", "galleryPage", "newsPage", "event", "zone", "ticketTier", "sponsorLevel", "honoree", "program", "initiative", "person", "timelineEntry", "testimonial", "newsPost", "album", "photographer", "partner", "outcome", "stat", "door", "hometownAssociation", "givingLevel", "governanceDoc"]',
      },
    }),
  ],
});
