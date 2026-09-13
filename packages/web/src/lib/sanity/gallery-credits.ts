/**
 * Photography credit and permissions, the section both gallery routes close with (`18 Photo Gallery.dc.html`,
 * spec Q13 of Phase 8, ADR 0039): the prototype's heading and lead, then three rows. Credits states only how
 * the site credits; the consent policy is the owner's words from the gallery singleton, or its chip; removal
 * requests go to the general inbox from the settings, or its chip, with a quiet "Send a message" beside them so
 * a reader can ask while the inbox is owed. The prototype's own rows (the signs at the entrances, consent at
 * registration, "many festival sets", the old domain's inbox) are the register's inventions and stay out.
 */
import { pendingWhat } from '@oy/content/pending';
import { cleanText } from './view';

export const CREDITS_TITLE = 'Photography credit and permissions';

export const CREDITS_LEAD =
  'These photographs show real people, including children. Here is how we credit them, how we ask permission, and how to ask for a photograph to be removed.';

/** How the site credits (ADR 0013): a statement of the model, naming no one. */
export const CREDITS_LINE = 'Given with each album, and with a photograph where it differs.';

export function galleryCredits(
  policy: string | null | undefined,
  generalEmail: string | null | undefined,
) {
  const email = cleanText(generalEmail);
  return {
    title: CREDITS_TITLE,
    lead: CREDITS_LEAD,
    rows: [
      { label: 'Credits', value: CREDITS_LINE },
      {
        label: 'Consent policy',
        value: cleanText(policy) ? (policy ?? undefined) : undefined,
        pending:
          pendingWhat('galleryPage', 'creditsAndConsent') ??
          'your photo consent and removal policy',
      },
      {
        label: 'Removal requests',
        value: email,
        href: email ? `mailto:${email}` : undefined,
        pending: pendingWhat('siteSettings', 'generalEmail') ?? 'the general inbox',
      },
    ],
    action: { label: 'Send a message', kind: 'enquiry', enquiryKind: 'contact' },
  };
}

export type GalleryCreditsView = ReturnType<typeof galleryCredits>;
