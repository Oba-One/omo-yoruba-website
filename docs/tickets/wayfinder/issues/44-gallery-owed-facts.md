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
- 11 October 2026, more photographs and publication: the owner asked for more ("Can we pull in more
  photos please"). A second pass added photographs to eleven albums, every one but the summer camp,
  and set each new one among the photographs its album held, through the import's `order` (pull
  request 36). In the two albums that name an edition, Odunde 2026 and Gala 2025, the first eight
  photographs kept their places, since the event pages show those eight. With four albums still to
  pick, the owner wrote "Publish them for me when the last four are in", and on 11 October the agent
  published all eleven: the nine new albums went live, and the two already published took their
  additions. Counts: Odunde 2026 (59), End-of-Year Gala 2025 (53), Grand Reception for the Ọọ̀ni of
  Ifẹ̀ (48), End-of-Year Gala 2024 (46) and 2022 (46), End-of-Year Gala 2023 (43), Yoruba Cultural
  Fair 2025 (38), End-of-Year Party 2015 (37), End-of-Year Appreciation Party 2018 (31), Yoruba
  Cultural Fair 2024 (24), Thanksgiving and End-of-Year Party 2014 (23). With the summer camp's 14,
  unchanged, the gallery holds 462 photographs in twelve albums. Left out at review: photographs
  showing a payment address on the organization's own banner, the name of a hired hall's own
  congregation, banknotes on the dance floor, a third party's address, and close portraits of one
  child. On the galas' dates the owner wrote "The gala is the saturday after thanksigving so use that
  date": the 2024 album is dated 30 November, that Saturday. The 2022 album is dated Friday 25
  November, from its printed programme, the camera and three phone photographs, where the rule gives
  Saturday 26 November; the owner has been told and has not yet said which stands. The nine new
  albums' credits are still to confirm, the marks on one summer camp caption are still a draft, and
  the two sets by other photographers are still out.
- 11 October 2026, the policy and the other videos: later that day the owner wrote "Publish the
  policy and add the other videos". The consent policy drafted on 10 October was published as
  drafted, so the gallery states it in place of its chip. It still does not say how permission is
  asked, which the question above asks for: that part stays owed. The photographer's channel holds a
  teaser and a highlights video for both fairs and for the 2022 to 2025 galas, and each went into its
  album, as Odunde 2026's had: seven albums show two videos each (ADR 0051), and the Gala page shows
  the 2025 teaser under past years. In each of the seven albums the highlights video takes a
  photograph of its own album as its still and the teaser shows the album's cover; Odunde 2026's
  highlights video took its still last, when the owner asked ("Give the Odunde highlights video its
  own still").
