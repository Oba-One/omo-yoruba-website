# The gallery's owed facts

Type: task
Status: open
Owner: yes
Labels: content
Phase: 8
Blocked by: 02, 09

## Question

`/gallery` and every album page render each fact the Studio does not hold as its Pending chip or line; the
Studio's Pending view lists them under Gallery. The register (`19 Mock Content Register.dc.html`) marks the
prototype's consent rows, soon sentence, "Citrus College" and inbox invented, so none of them stands in. These
pages show real people, children included, so the consent facts come before launch. In the Studio (the album
recipe and the gallery policy are in `oy-content-ops`):

- **Consent and removal** (ADR 0039).
  - The consent and removal policy in your words (`galleryPage.creditsAndConsent`, plain text): how you ask
    permission and how a family asks for a photograph to come down. The prototype's signs at every entrance and
    written consent at registration are invented.
  - The general inbox in the site settings (ticket 02): removal requests link to it.
  - Whether the faces in each album have consent for the gallery (ticket 09), and a consent note on any album
    that needs its own line (`consentNote`, shown under the album's credit).
- **Credits** (ticket 09).
  - Confirm each album's photographer, then tick `creditConfirmed` on the album: Red Carpet Media for Odunde
    2026, "Members and volunteers" for the 2025 Gala, the Omo Yorùbá archive for the summer camp. Until then the
    album page and the Lightbox show the chip "photographer credit to confirm".
  - A photograph by someone other than its album's photographer takes its own `credit` or `creditNote` and its
    own `creditConfirmed`.
- **The summer camp's year** (ticket 09): the album's `date`, or its edition if it belongs to one. Until then its
  tile and page show "the year of the album", and it sorts after the dated albums.
- **Captions and alt text.** Each photograph's caption and alt are the register's description of the moment, the
  same text, so a screen reader hears it once. Confirm the descriptions, and write a shorter caption where you
  want one; the alt keeps describing the moment (who, doing what, where).
- **The header line** in your words. The seed revised the prototype's line, which promised lessons and Collective
  albums and a year for every album, to "Odunde, the Gala and the summer camp. Open an album and start looking."
  (Phase 8 spec, Q15).
- **More albums**, when you have them: the lessons, the Collective, Àgbàlá Ọmọde. The prototype's Àgbàlá Ọmọde
  album reused Odunde photographs under invented captions, so it was never seeded. An album appears on the
  gallery once it holds a photograph; keep a photograph's key when replacing its image, since the key is its
  shared address.
- **Choices you can reverse** (Phase 8 spec): `open` sends a tile to its album's first photograph (`viewer`) or to
  the album page (`grid`); `captions` shows titles and captions always or on hover; `state: soon` hides the albums
  behind the prepared-albums sentence. Ticket 37's answers 2 to 5 (the carousel's dots, chevrons, count and eight
  photographs) are still yours.
