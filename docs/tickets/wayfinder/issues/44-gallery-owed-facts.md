# The gallery's owed facts

Type: task
Status: open
Owner: yes
Labels: content
Phase: 8
Blocked by: 02, 09

## Question

`/gallery` and every album page render each fact the Studio does not hold as its Pending chip or line; the
Studio's To do lists them under Photo Gallery. The register (`19 Mock Content Register.dc.html`) marks the
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
  behind the prepared-albums sentence (since ADR 0043 it also holds the album pages' photographs and the event
  pages' past photographs). Ticket 37's answers 2 to 5 (the carousel's dots, chevrons, count and eight
  photographs) are still yours.

## Comments

- 28 September 2026: the credits are done. The owner named the event photographer, Red Carpet Films, as the
  photographer of all three albums; each album credits them, confirmed, with the name linking to their YouTube
  channel (ADR 0046). Consent was confirmed on 27 September (open-work D5). The policy in the owner's words, the
  general inbox, the summer camp's year, the captions and the header line remain.
- 10 October 2026: asked for the policy in their words, the owner had the agent draft it ("Not sure
  you craft"; the same answer left the summer camp's year and photographer unknown). The draft says
  the organization has consent to share the gallery's photographs, children's included (D5), and
  that a photograph comes down on request. It does not say how permission is asked, which no file
  records. It waits in the Studio for the owner to publish or reword.
- 10 October 2026, albums: asked which of the nine other occasions become albums and how many
  photographs each, the owner said "I'll go with your recommendation for media count". The agent
  recommended all nine, about 20 photographs each from the photographer's sets, and saved each as a
  draft for the owner to publish, 194 photographs in all: Yoruba Cultural Fair 2025 (24) and 2024
  (18); End-of-Year Gala 2024 (24), 2023 (23) and 2022 (22); End-of-Year Appreciation Party 2018
  (20); Grand Reception for the Ọọ̀ni of Ifẹ̀, 2017 (27); End-of-Year Party 2015 (20); Thanksgiving
  and End-of-Year Party 2014 (16). The titles follow what each occasion called itself: on the 2024
  fair's poster, in the printed programmes photographed in 2017, 2018, 2022, 2023 and 2024, and on
  the 2014 invitation kept with the photographs. Two rest on the photographer's folder name alone:
  the 2025 fair and the 2015 party. The 2024 gala's programme prints 29 November where the cameras
  and that night's certificates say 30 November, and its album takes the 30th. Two sets by other
  photographers, one from 2014 and one from 2018, were left out. Every new album credits Red Carpet
  Films, to be confirmed by the owner.
- 10 October 2026, framing and marks: the content pass found six Odunde 2026 tiles cutting off their
  subject, portrait originals in a wide tile. Drafts of the Odunde 2026 and summer camp albums hold
  a focus point for each of the six and the marks on five captions (agbádá, fìlà, ṣẹ̀kẹ̀rẹ̀, àkàrà).
  `docs/plans/content-pass-2026-10-10.md` lists what the live pages showed that day.
