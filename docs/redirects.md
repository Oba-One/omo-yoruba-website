# Redirects from the old site

The old site's public URLs and where each should land on the new one. Read on 4 October 2026 from
`omoyorubaofsocal.org` (WordPress; its Yoast sitemap, navigation and footer gave 86 URLs, all answering 200).
The targets are a proposal for the owner to confirm (open-work D18); Phase 9 then puts the confirmed rows in
`astro.config.ts` `redirects` (open-work E11, ROUTES section 1).

Two things decide whether these rules ever run:

- The old site lives on `omoyorubaofsocal.org`, which is not in the owner's hands (runbook, Deploy), and the
  new site answers on `omoyorubasocal.org`. A path rule here only helps once the old name points at the new
  site, or once whoever hosts the old name sends each path across.
- The old name is printed on the 2025 and 2026 flyers and on the IRS record, and `info@omoyorubaofsocal.org`
  is the general inbox and the Zelle address. The name and its mailbox need to keep working after the old
  site retires.

A trailing slash is part of every old path; the rules should match with and without it.

## Pages that have a successor

| Old path | New route | Why |
| --- | --- | --- |
| `/about-us/` | `/our-story` | values and objectives; the new page tells the story and lists the people |
| `/executives/` | `/our-story#board` | the officers and the past presidents |
| `/our-programs/` | `/programs` | the program list |
| `/yoruba-cultural-center/` | `/programs` | no page for the proposed center; the programs are the nearest answer |
| `/yoruba-language-school/` | `/programs/yoruba-lessons` | the language program, now lessons with one teacher |
| `/faqs/` | `/get-involved` | the membership questions |
| `/membership/`, `/new-user-registration/`, `/register/` | `/get-involved` | joining |
| `/login/`, `/account/`, `/logout/`, `/reset-password/` | `/get-involved` | the members' area is gone; joining is the nearest answer |
| `/contact-us/` | `/get-involved` | "Or just talk to someone", and the contact form in the footer |
| `/donate/` | `/donate` | the same path; only the trailing slash differs |
| `/thankyou/`, `/cancel/` | `/donate` | the old donation form's result pages |
| `/media-gallery/`, `/photos/`, `/videos/` | `/gallery` | photographs; the new site has no video page |

## Events

| Old path | New route | Why |
| --- | --- | --- |
| `/our-events/`, `/our-events/list/`, `/our-events/month/`, `/our-events/today/` | `/` | no events index; the homepage band shows the next event |
| `/event/gala-night-2022/` | `/gala` | the Gala |
| `/event/omo-yoruba-cultural-enrichment-fair-2023/` | `/odunde` | the summer fair; the April 2026 sponsor letter calls Odunde its successor |
| `/event/2022-oyosc-summer-conference/` | `/odunde` | the summer conference; its 2023 page says the conference became the fair |
| `/2021-omo-yoruba-cultural-enrichment-conference/`, `/virtual-summer-conference/`, `/cultural-enrichment-conference/` | `/odunde` | registration shells for the 2019 to 2021 summer conferences |
| `/rsvp-form/`, `/rsvp-form-2/` | `/odunde` | the 2019 registration forms |
| `/event/march-mixer/` | `/` | a one-off with no successor page |

## Posts and archives

The new site has no news (ADR 0048), so none of the nine posts has a page of its own. Four land on the page
that covers their subject; the rest go home.

| Old path | New route | Why |
| --- | --- | --- |
| `/blog/`, `/category/blog/`, `/category/news/`, `/category/uncategorized/` | `/` | no news |
| `/2018/09/06/2019-cultural-enrichment-conference/` | `/odunde` | a registration notice for the summer conference |
| `/2019/08/31/cultural-exchange-children-origin/` | `/programs#exchange` | the Cultural Exchange program |
| `/2019/08/31/yoruba-language-lesson/` | `/programs/yoruba-lessons` | the language program |
| `/2019/08/31/cultural-diversity-nigerian-foods/` | `/odunde` | a notice for the summer conference |
| the five posts under `/2023/05/21/` | `/` | general pieces on culture |
| `/tag/*` (ten tags) | `/` | no news |
| `/resources/` | `/` | a list of outside links |

## Leave to the 404 page

These never held the organization's content, or held a member's sign-in. The 404 page has three doors home.

- `/tested/`, `/locations/`, `/categories/`, `/tags/`, `/my-bookings/`, `/terms-of-service/`,
  `/iump-visitor-inside-user-page/`: placeholders and plugin pages.
- `/oysocal_forum/`, `/oysocal-forum/*`, `/topics/`: the forum, five placeholder posts by one person.
- `/portfolios/`, `/media/*`, `/portfolio-category/*`: the theme's demo pages.
- `/author/*`: the two WordPress author archives.
- `/wp-content/uploads/*`: the old media library. One file there needs the owner's eye before the old
  site retires; the owner was told which on 4 October 2026.

## Already broken on the old site

No rule needed: `/rsvp-registration` (linked from three posts), `/donates` and `/blog/sitemap.xml` all answer 404 today.
