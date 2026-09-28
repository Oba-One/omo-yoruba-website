# Online giving: Zeffy embeds, and API or SDK alternatives

Date: 27 September 2026. Asked by the owner: how to embed Zeffy in the site, and the best 3 or 4
approaches that could use an API or SDK instead of an embedded form, with nonprofit-aligned options
called out. Method: read the repo first (listed under "What the site does today"); then each
vendor's own docs, help centre and pricing pages; the Zeffy API's OpenAPI 3.1 document as served
inline on its docs page; Zeffy's two embed scripts, read as text; and one browser check that put
Zeffy's public sample form in an iframe on example.com and logged its `postMessage` traffic without
typing into or submitting anything. No account was created and no form was submitted. Every fact
carries a source number; the list at the end gives each URL, all checked on 27 September 2026.
Third-party sources are marked as such. Where a page did not say something, this note says "not
stated" and names the page.

## Summary and ranking

Ranked for a small, volunteer-run 501(c)(3) with three money flows: general gifts (one-time, maybe
monthly), the End-of-Year Gala (tickets, tables, sponsor levels) and Odunde Festival vendor fees.

1. **Keep Zeffy, and embed it better (recommended now).** $0 to us on every gift, automatic tax
   receipts, monthly giving with a donor portal, and ticketing that covers Gala tables and sponsor
   tiers [19][23][27][29]. Zeffy now has signed webhooks, so the site can learn about each payment
   [16]. Our Give Dialog keeps its own iframe and listens to Zeffy's resize and thank-you messages;
   a link to Zeffy's hosted page covers Apple Pay and Google Pay, which the embed does not show
   [4][10][33]. Alignment: free to nonprofits, funded only by optional donor contributions; no page
   read describes Zeffy itself as a nonprofit [19][20].
2. **Stripe with our own form in the Give Dialog (the API or SDK path).** Our amount, frequency and
   name fields; Stripe's Checkout Sessions API with its Elements or embedded page for the card step;
   Stripe Billing for monthly gifts [41][42][43]. Full control of the elder-test details and of donor
   data, at the cost of a build we maintain, receipts we send, and card-testing risk on our endpoint
   [50][51]. Alignment: a commercial processor with a 501(c)(3) discount on request, reported as 2.2%
   + 30 cents for Visa and Mastercard [36][38][40].
3. **Every.org behind our own amount picker (nonprofit-run).** Our dialog collects amount and
   frequency, then hands off to Every.org's donate flow with those values prefilled [74][76].
   Every.org is a 501(c)(3) public charity, charges no fees of its own, issues the tax receipt, and
   posts a webhook per gift [66][68][70][75]. No ticketing, and the donor may withhold contact
   details [75]. Small build, low ops. Best as a second channel, and for DAF, stock and crypto gifts
   [74].
4. **Give Lively (nonprofit-aligned alternative platform).** Free to nonprofits, paid for by
   philanthropist founders; runs on our own Stripe account at Stripe's nonprofit rates; event
   ticketing with tables and sponsorships [40][79][81][87]. It is widget or link only: no public API
   or webhooks, Zapier only [84][85]. Membership needs IRS and California (Attorney General Registry
   and Franchise Tax Board) good standing and a values review [78].

Worth considering later: Stripe for general gifts only, with Zeffy kept for the Gala and vendor fees.
Stripe's nonprofit pricing needs at least 80 percent of the Stripe account's volume to be
tax-deductible donations, and ticket sales and registration fees do not count [36]. A
donations-only Stripe account would meet that rule; whether Stripe grants the rate to a second account for the
same organization is not stated (see "Unverified"). Zeffy charges us nothing for the rest.

The three facts that decide most:

1. **Zeffy's API cannot take a payment.** It reads payments, contacts and campaigns, writes
   contacts, and records offline payments only; campaigns are read-only [16][17]. So any form of our
   own must charge through a processor such as Stripe, and Zeffy stays an embed or a hosted page.
   What is new since `docs/plans/wayfinder.md` was written: seven webhook events, signed with
   HMAC-SHA256 and retried for up to 3 days [16].
2. **Zeffy's embed is the weakest part of Zeffy.** Apple Pay and Google Pay "are also not displayed
   on embedded forms" [10], and Zeffy's own embed script turns express checkout off on iPhones [4].
   Only `utm_source` is a documented URL parameter, so the dialog cannot prefill amount or frequency
   [12]. The contribution-to-Zeffy prompt appears on the form, and its "wording and suggested amounts
   ... cannot be customized" by the nonprofit [19].
3. **Stripe's nonprofit rate is conditional, and the rest is ours.** Stripe's own pages do not print
   the rate [36][37]; third parties report 2.2% + 30 cents (Visa, Mastercard) and 3.5% (American
   Express) [38][40]. Monthly gifts add Stripe Billing's 0.7% [35]. Stripe's receipts have no
   documented place for the IRS "no goods or services" sentence, so acknowledgments would be our
   email [49][95]. Any form that creates payments is a card-testing target, and card testers favour
   small amounts [50].

## What the site does today (repo, read-only)

- Every Donate button opens the Give Dialog, a native `<dialog>` that wraps the Zeffy embed with a
  fallback to Contact and the mailing address; `#give` opens it on load (`AGENTS.md`,
  `docs/adr/0020-native-dialogs-and-the-give-embed-island.md`).
- `packages/web/src/components/ZeffyEmbed.astro` is a server island. It reads
  `siteSettings.zeffyEmbedUrl` and hands the dialog a `<template data-zeffy>` holding
  `<iframe src={url} title="Zeffy donation form" allow="payment" loading="lazy">`.
- `packages/ui/src/forms/GiveDialog/GiveDialog.astro` mounts that iframe on first open at
  `height: min(640px, 70vh)` and shows the fallback when the iframe's `load` event has not fired
  within 4 seconds.
- The CSP is report-only today (`docs/adr/0011-csp-report-only-header-until-phase-9.md`).
  `packages/web/src/lib/csp.ts` allows `frame-src https://www.zeffy.com` and no Zeffy script. Pull request 17
  passes the address through `framableSrc` there: only an https address on an origin `frame-src` lists becomes
  the iframe, and anything else answers Pending, in the island and in the layout's Zeffy mode.
- The dialog foot says "Secure • Powered by Zeffy" and "Receipts by email" in every mode, and the
  lead promises "one time or monthly"
  (`docs/tickets/review/issues/38-monthly-giving-and-email-receipts-are-stated-as.md`). The check
  line hides the missing mailing address (ticket 45). The Donate page's Zeffy facts (fees, receipt,
  monthly) are owed (`docs/plans/open-work.md` C12); the pending-mode copy is D8.
- `docs/plans/wayfinder.md` says "Custom checkout: Zeffy's API is read-only, so the embed is the
  checkout." The API now writes contacts and offline payments and has webhooks, but it still cannot
  take a card, so the conclusion holds.
- Giving levels are described as "The preset amounts in your Zeffy form"
  (`packages/content/src/schema/singletons/index.ts`); since pull request 13 they are items in the Donate page's
  "What your gift does" list (`donatePage.whatYourGiftDoes`) rather than documents. Zeffy shows exactly four
  suggested amounts, set in Zeffy [13], so the two must be kept in step by hand.
- Gala seats go to Eventbrite; tables are an enquiry invoiced by hand (`CONTEXT.md`; D9, T04).
- `production` has a public ACL (open-work D3). Donor records must not go into Sanity until D3 is
  settled.
- Form rate limiting is a best-effort in-memory bucket that resets on a cold start
  (`packages/web/src/lib/forms/limits.ts`). That is not enough to guard a payment endpoint.

## Zeffy today

### Ways to put a Zeffy form on the site

Zeffy's help centre lists a direct link, social posts, a QR code, a website button that links to the
campaign page, a website embed, and (peer-to-peer campaigns only) a thermometer or leaderboard
embed [1][7]. "Embedded forms display only the transaction fields and do not show your campaign
description, images, logo, or nonprofit name" [1][2].

**1. The current embed code (v2 script).** Zeffy's generated code is a
`<div data-zeffy-embed data-form-url="/embed/donation-form/<slug>">`, a hidden fallback iframe
(450px tall, `allowpaymentrequest`, `allowTransparency`), and
`<script src="https://www.zeffy.com/embed/v2/zeffy-embed.js">` whose `onerror` reveals the fallback
[3]. A locale prefix (`en-us`, `es-us`, `en-ca`, `fr-ca`) can go before `/embed/` [3]. Read as text,
the script [4]:

- finds `[data-zeffy-embed]:not([data-zeffy-initialized])` when the page loads, with no
  `MutationObserver`, and exposes `window.Zeffy.embed = { version, init }` to start embeds added
  later;
- builds an iframe on `https://www.zeffy.com` with `embed-version=v2` and an `embedId`, sets
  `scrolling="no"`, and on iPhone and iPod user agents adds `disableExpressCheckout=true`;
- listens for `message` events only from origin `https://www.zeffy.com`, and handles
  `zeffy-embed:connected` (hide the skeleton), `zeffy-embed:resized` (set height, 400 ms ease),
  `zeffy-embed:step-changed` (scroll), `zeffy-embed:thank-you-animation-shown` and
  `zeffy-embed:thank-you-page-shown` (scroll), and `zeffy-embed:loading`;
- sets a starting height by form type (donation 244px, ticketing 240px) and a minimum height from
  `data-min-height` (200px when unset), and never posts a message into the iframe or raises an
  event on the host page.

**2. A plain iframe (what our site does).** Our island renders the embed URL as a bare iframe
(`packages/web/src/components/ZeffyEmbed.astro`).
In the browser check, the same sample form loaded with `?embed-version=v2&embedId=t1` posted
`{"type":"zeffy-embed:connected","embedId":"t1"}` and later
`{"type":"zeffy-embed:resized","embedId":"t1","height":542}` to the parent; without those two
parameters it posted only `[iFrameResizerChild]Ready` [33]. So our dialog could size its own iframe
from Zeffy's messages without loading Zeffy's script, keeping the CSP at `frame-src` only. This is
not a documented contract; it is read from Zeffy's script and one test.

**3. The popup button (legacy script).** A button carrying
`zeffy-form-link="https://www.zeffy.com/embed/donation-form/<slug>?modal=true"` plus a header script
from `https://zeffy-scripts.s3.ca-central-1.amazonaws.com/embed-form-script.min.js` [5][9]. The
current help centre no longer lists it [1]; the WordPress plugin still offers a popup shortcode [8].
Read as text, the script [5]: builds a hidden overlay and iframe for every distinct link when the
page loads (`title="Form powered and secured by Zeffy"`, `allow="payment"`, a `cachebust` query);
posts `{id, open: true}` to the iframe with target origin `"*"` on click; closes on a
`{id, close: true}` message without checking `event.origin`, on Escape, or on a backdrop click;
toggles `aria-hidden` but sets no `role="dialog"`, no `aria-modal` and moves no focus; has no
`MutationObserver`. A third-party pull request found it never calls `preventDefault()`, so a real
`<a href>` fallback navigates away to zeffy.com at the same time [9]. Our native dialog already does
all of this better; do not adopt it.

**4. The hosted page link.** The full campaign page, with description, images, logo and name [1][6].
It is the only Zeffy surface where Apple Pay and Google Pay appear (mobile, up to $1,000) [10].

**5. Thermometer and leaderboard.** Peer-to-peer campaigns only [7]. Not relevant to general gifts.

| Method | CSP our page needs | Height | Prefill (amount, frequency, fund) | Completion signal |
| --- | --- | --- | --- | --- |
| v2 embed code | `script-src` and `frame-src https://www.zeffy.com` | Auto, by `postMessage` [4] | Not stated; only `utm_source`, donation forms only [12] | `zeffy-embed:thank-you-page-shown` message, undocumented [4] |
| Plain iframe (today) | `frame-src https://www.zeffy.com` (present) | Fixed unless we listen to the messages [33] | As above | Same messages, if we add the v2 parameters [33] |
| Legacy popup | `script-src https://zeffy-scripts.s3.ca-central-1.amazonaws.com`, `frame-src https://www.zeffy.com` [5] | Full viewport on mobile, 5% margins over 769px [5] | As above | A `close` message only [5] |
| Hosted page | None | Not applicable | `utm_source` [12] | Custom thank-you URL, set up by Zeffy support on request [11] |

Other points for every method:

- A custom thank-you redirect is set by Zeffy support, not by us; "If your form is embedded on
  another site, the custom thank-you page displays inside the iframe" [11]. Whether it carries the
  amount or a transaction id: not stated [11].
- The server-side proof of payment is the webhook, not any browser message [16].
- Theming: one colour, light or dark; Zeffy "applies a variation of that color instead of the exact
  code" [14]. Fonts: not stated.
- Amounts: exactly four suggested amounts, the third prefilled by default (can be turned off);
  frequencies one-time, monthly, quarterly and yearly, one of them set as the default [13].
- Timing: in two runs the sample embed sent `connected` 2.4 s and 4.7 s after insertion, and fired
  `load` at 3.0 s in the second run [33]. Our dialog gives up after 4 s.
- Accessibility: no Zeffy accessibility statement was found. A quick read of the sample form's
  accessibility tree (not an audit) showed the frequency choice as a `tablist`, each amount radio
  exposing an internal id as its name rather than its dollar amount, the custom amount named only
  by its placeholder "Other", and a heading reading "$" [33]. Text size and target size inside the
  iframe are Zeffy's, not ours, so the elder test (17px body, 44px targets) cannot be enforced there.
- Card entry happens in a "Secure payment input frame" inside Zeffy's iframe, and the page shows
  "protected by reCAPTCHA" [33]. Our page never handles card data. Zeffy's PCI statement: not
  stated on the pages read.

### The Zeffy API, webhooks, Zapier and exports

- Base `https://api.zeffy.com/api/v1`, a per-organization key sent as a Bearer token; keys come from
  Settings, Integrations [15][16]. "Only admins can generate API keys", and "Organizations on Zeffy
  only have one admin" [15]. The docs call it "Zeffy API Beta", free, with no per-request charges
  [17].
- Endpoints (OpenAPI 3.1, version 1.0) [16]: `GET` and `POST /payments`, `GET` and
  `DELETE /payments/{id}`; `GET`, `POST` and `PUT /contacts`, `GET`, `PATCH` and
  `DELETE /contacts/{id}`; `GET /campaigns`, `GET /campaigns/{id}`. `POST /payments` "Records an
  offline payment (cash, cheque, in-kind, other)"; online payments "cannot be deleted"; campaigns are
  read-only [16][17]. "Write access requires your organization to have completed its Stripe
  verification" [17]. Nothing creates a checkout or charges a card [16].
- Rate limits: 100 requests a minute and 20 a second per organization [16].
- A payment returns amount in cents, `eligible_amount` (the tax-receipt-eligible part), status,
  type (online, manual, imported), refunds and dispute, card brand and last 4, buyer (email, names,
  company, address), campaign id and category, custom question answers, line items (donation,
  ticket, additional donation, with ticket rate titles), `receipt_url`, a `recurring` block
  (status, interval, subscription id, period) and fund [16].
- Webhooks: `payment.completed`, `payment.created`, `payment.updated`, `payment.deleted`,
  `contact.created`, `contact.updated`, `contact.deleted`. Created events carry the full resource;
  updated and deleted events carry an id-only reference to fetch. Non-2xx answers are retried with
  exponential backoff "for up to 3 days, over 12 attempts"; the event id stays the same across
  attempts for de-duplication. Each delivery carries `Zeffy-Signature: t=...,v1=...`, an HMAC-SHA256
  of `{t}.{rawBody}` keyed with a `whsec_` secret; the docs suggest a 5-minute tolerance [16].
- Zapier: "Zeffy 2.3" connects with the API key and has two triggers, Get Donations and Get Order
  [18]. Payout history, and the payments inside each payout, export from the dashboard [30].

### The model

- Fees: "Our price is $0"; Zeffy covers card and transaction fees; its only revenue is optional
  donor contributions [19][20]. Around 60 percent of donors contribute [19]; the pricing page says
  "2 of 3" [20]. If a nonprofit raised very large card sums with little contribution, Zeffy "would
  personally reach out", for example to set a temporary card payment limit [19].
- The contribution prompt is shown twice, "once when donors begin filling out the form, and again
  at the payment confirmation step", and its wording and suggested amounts cannot be customized; the
  suggested percentage falls as the gift grows [19]. Donors pick a different amount with "Other" in
  the dropdown [22]. In a 2024 request (224 voters) nonprofits reported defaults of "17% or 34% at
  times"; Zeffy closed it without a $0 default, pointing to self-refunds from the confirmation email
  and an "(optional)" label [21]. Zeffy's UK blog says the contribution is "never defaulted" [34].
  What a US donor sees today is unverified (see "Unverified").
- Receipts: 501(c) organizations can switch on "Auto generate & send tax receipts" per form; the
  receipt is a PDF in the confirmation email and can be resent or downloaded [23][24]. Zeffy says
  its US receipts are "fully IRS compliant" [24]. Tickets can carry a partial receipt for the
  eligible amount, with the rest shown as the advantage amount [25].
- Recurring: the first payment is taken at once and sets the monthly date; each payment gets a
  confirmation email and receipt; failed payments retry 4 to 5 times through Stripe, then stop [27].
  Donors manage amount, date, card and cancellation in a donor portal; admins can do the same [28].
  A single cumulative tax receipt for the year goes out before 31 January [26]. Active recurring
  gifts cannot be moved in from another platform automatically [27].
- Ticketing: general admission, group, VIP table and sponsor ticket types, a gift on top, QR
  e-tickets, check-in and Tap to Pay [29]. ACH is not accepted in the 10 days before an event [10].
- Payment methods: cards up to $4,999; Apple Pay and Google Pay on most mobile forms up to $1,000
  but not on embedded forms; ACH up to $20,000; an optional "pay by cheque" above $1,000 for one-time
  gifts [10].
- Payouts: weekly on Mondays (default), monthly, or next day for eligible accounts, after a 1 to 3
  business day anti-fraud review; payouts cannot be triggered by hand [30].
- Eligibility (US): an EIN and a bank account in the organization's name; any 501(c) type [31].
- Disputes: Zeffy submits the evidence; statement descriptors start with ZEFFY [32]. A dispute fee
  charged to the nonprofit: not stated [32].

### What our site would need

1. Keep our dialog, island and iframe (ADR 0020). Do not add Zeffy's popup script [5].
2. Add `embed-version=v2&embedId=give` to the iframe URL, listen for `message` events whose origin is
   `https://www.zeffy.com` and whose `embedId` is ours, and set the iframe height from
   `zeffy-embed:resized` [4][33]. Treat `zeffy-embed:connected` as ready; the 4 s timer may be short
   given 2.4 to 4.7 s in testing [33]. Send `give_completed` to analytics on
   `zeffy-embed:thank-you-page-shown` [4]. No CSP change.
   The alternative is Zeffy's own snippet [3] with `script-src https://www.zeffy.com`. It would need
   a call to `window.Zeffy.embed.init()` (a global the script exposes [4]) after the dialog mounts
   the template, because the script scans the page only once.
3. Add a visible "Give on Zeffy's page" link to the hosted form in the dialog: it brings Apple Pay
   and Google Pay [10] and works without JavaScript. Storing the hosted URL needs a new site-settings
   field (a content-model change for the owner to approve).
4. Optional: `packages/web/src/pages/api/zeffy-webhook.ts` (server-rendered) verifies
   `Zeffy-Signature` against the raw body with `ZEFFY_WEBHOOK_SECRET` (a server secret in the
   `astro:env` schema and in Vercel), de-duplicates on the event id, and notifies the team (for
   example through Resend, already used by the enquiry function, ADR 0004). Do not store donor data
   in Sanity until D3 makes the dataset private. Zapier's Get Donations trigger is the no-code
   alternative [18].
5. Content once the owner's form exists: the C12 facts, and the copy in tickets 38 and 45.

## Approach 1: Zeffy, embedded properly

- **How it fits the Give Dialog:** Zeffy's form inside our dialog (as today), sized by Zeffy's
  messages, plus a link out to the hosted page.
- **What we build:** the listener and the link (small); optionally the webhook endpoint and one
  secret (small). No payment code.
- **Fees:** $50 gift, we keep $50.00; $100 gift, we keep $100.00 [19]. The donor may add a
  contribution to Zeffy on top.
- **Recurring:** monthly, quarterly, yearly; donor portal; cumulative annual receipt [13][26][28].
- **Receipts:** automatic, IRS compliant per Zeffy, once switched on per form [23][24]; partial
  receipts for tickets [25].
- **Ticketing and vendor fees:** yes, for free, including tables and sponsor tiers [29]. This could
  replace Eventbrite for Gala seats (D9, T04); Eventbrite's fees were not researched here.
- **Risks:** the contribution prompt the org cannot change [19]; no Apple Pay or Google Pay in the
  embed [10]; no amount or frequency prefill [12]; accessibility inside the iframe is Zeffy's [33];
  a single admin on the Zeffy account [15]; undocumented `postMessage` contract [4].
- **Alignment:** free to nonprofits; donor-funded company [19][20].

## Approach 2: Stripe with our own form

- **How it works:** our server creates a Checkout Session and the browser mounts Stripe's card step.
  `ui_mode` is one of `hosted_page` (default), `embedded_page`, `form` and `elements` [41]. Stripe
  describes three UIs: "Full page" (hosted or embedded, recommended), "Embedded form" (public
  preview) and "Elements" ("Full CSS customization via the Appearance API") [42]. With `elements` our
  dialog holds the amount, frequency and name fields and Stripe's Payment Element holds the card
  fields. With `embedded_page`,
  `stripe.createEmbeddedCheckoutPage({ fetchClientSecret, onComplete })` mounts Stripe's whole page
  in a `div` in our dialog; Stripe.js must load from `js.stripe.com`, not a bundle, and Checkout
  should not sit inside another iframe [43]. `submit_type: 'donate'` labels the button "Donate"
  (not with `elements`) [41]. `redirect_on_completion: 'never'` keeps the donor on the page and
  disables redirect-based methods; "Webhooks are required for fulfillment" [44].
- **Amounts:** "Customer chooses price" (pay what you want) does not support recurring payments [45],
  so monthly gifts would pass our amount as `line_items[].price_data` with
  `recurring.interval: 'month'` in `subscription` mode [41] (our reading of the API reference). Our
  form can read the giving levels from Sanity directly.
- **Payment Links** are the no-code variant: a Stripe-hosted page with "customers can choose what to
  pay" and subscription links [46]; URL parameters are `client_reference_id` and UTM codes, with no
  documented amount prefill [47].
- **What we build:** an inline custom element for the dialog form (ADR 0018); `POST
  /api/give/session` validating amount and frequency and creating the session; `POST
  /api/stripe-webhook` verifying `Stripe-Signature` on the raw body and handling
  `checkout.session.completed`, delayed ACH success, `invoice.paid`, refunds and disputes [44][55];
  acknowledgment emails through Resend; a year-end summary for monthly donors if wanted. Secrets in
  Vercel: a restricted secret key, the webhook signing secret, the publishable key. Register the
  domain for Apple Pay, Google Pay and Link in Elements or the embeddable form [56]. Stripe retries
  webhooks for up to three days in live mode, may send duplicates, and does not guarantee order
  [55].
- **Fees (US card):** standard 2.9% + 30 cents; +1.5% international; ACH 0.8% capped at $5; dispute
  $15 received plus $15 if countered (refunded if won) [35]. The "+0.5% for manually entered cards"
  applies to cards typed into the Dashboard or Terminal MOTO, not donor checkout [35][57]. The
  nonprofit rate, per third parties: 2.2% + 30 cents for non-American Express cards, 3.5% for
  American Express [38][40]. Worked examples are in the comparison table.
- **Nonprofit discount terms:** registered nonprofit with tax documents, an eligible region (US
  included), and "At least 80% of your Stripe payment volume comes from tax-deductible donations";
  membership fees, tuition, ticket sales, registration fees and auction payments do not count; the
  pricing "applies only to accounts used primarily for receiving donations, not for selling products
  or tickets" [36]. Apply through Stripe support with the account id, email, a statement on donation
  volume, EIN or IRS letter and tax-exempt documents [36]. Stripe's nonprofit page says to contact
  sales and prints no rate [37].
- **Recurring:** Stripe Billing, 0.7% of Billing volume on pay as you go [35]. The customer portal
  lets donors update cards and cancel; Stripe says it cannot be displayed inside an iframe, so it is
  a link out [48].
- **Receipts:** Stripe emails automatic receipts for successful payments, including subscription
  payments; required details are legal name, support address, support email and privacy policy URL
  [49]. No documented field for the IRS "no goods or services" statement [49]. One-time Checkout
  payments can add a post-payment invoice with a custom footer at 0.4%, capped at $2 [35][49]. The
  practical route is our own acknowledgment email from the webhook.
- **Ticketing and vendor fees:** no ticketing product was found. Tickets and fees in the same Stripe
  account count against the 80 percent rule [36].
- **Fraud:** card testers "can use your publishable key"; the latest Payment Element and Checkout get
  Stripe's rate limiters, models and CAPTCHA triggers; Stripe also recommends CAPTCHA, rate limits
  and session checks on the endpoints we own [50]. Radar Lite (card-testing prevention, fraud
  alerts) is included; custom rules and manual review need Radar Plus [51][52]. Paid Radar starts
  at $10 a month or $0.05 per screened transaction [35][52].
- **PCI:** Checkout, Elements and Payment Links qualify for SAQ A [54].
- **CSP:** Stripe.js: `script-src https://js.stripe.com https://*.js.stripe.com`, `frame-src
  https://js.stripe.com https://*.js.stripe.com https://hooks.stripe.com`, `connect-src
  https://api.stripe.com`; Checkout: `https://checkout.stripe.com` in `connect-src`, `frame-src` and
  `script-src`, `img-src https://*.stripe.com`; Link adds `https://link.com https://*.link.com` [53].
  A no-JavaScript form that posts to our endpoint and redirects to Stripe needs the Stripe origin in
  `form-action` (ours is `'self'` today), because Chrome blocks redirects after a form submission and
  Firefox does not [98].
- **Accessibility:** Elements gives us our own labels, sizes and targets around Stripe's card
  fields [42]. A WCAG conformance statement for Checkout or Elements: not stated on the pages read.
- **Ops burden:** highest of the four: code, secrets, webhooks, receipts, refunds, disputes, Radar,
  Stripe API upgrades. **Donor data:** ours, in our own Stripe account.
- **Alignment:** commercial processor with a conditional 501(c)(3) discount [36].

## Approach 3: Every.org behind our own amount picker

- **Who:** "Every.org can be treated as a US 501(c)(3) public charity"; "As the legal recipient of
  donations made through our platform, tax deductions come from Every.org" (EIN 61-1913297) [66].
  Gifts are recorded like donor-advised fund grants (hard credit Every.org, soft credit the donor)
  [70].
- **How it fits the Give Dialog:** our own amount and frequency choices, then a hand-off. The donate
  link `https://www.every.org/<slug>#donate` takes `amount`, `suggestedAmounts`, `min_value`,
  `frequency` (`ONCE`, `MONTHLY`, `YEARLY`), `email`, `first_name`, `last_name`, `designation`,
  `success_url`, `exit_url`, `partner_donation_id`, `theme_color`, `method` and more [74]. Or the
  donate button script `https://embeds.every.org/0.4/button.js` opens Every.org's modal over our
  page, with `setOptions()` and `showWidget()` for our own trigger [76]. No success callback is
  documented [76].
- **What we build:** the picker and link, and optionally `POST /api/everyorg-webhook`. The nonprofit
  webhook sends one POST per completed gift with `chargeId`, amount, `netAmount`, `frequency`,
  `paymentMethod`, donor names and email ("undefined if the donor chose not to share"); no signature
  or secret is documented, so treat it as a notification and reconcile against the dashboard [75].
- **Fees:** Every.org "does not charge any of our own fees"; donors may add an optional tip [68].
  Cards: "2.2% + $0.30 for Visa and Mastercard, or a flat 3.5% for Amex cards", +1% for non-US
  cards; bank-account gifts: "Every.org will cover all fees" [67]. Disbursement: weekly through
  Stripe at 0%, PayPal Grants every 4 to 5 weeks at 0%, or Network for Good every 4 to 6 weeks at
  1.50% [69]. Every.org's pricing page could not be read (a bot checkpoint) [77].
- **Recurring:** `MONTHLY` or `YEARLY` [74]; donors cancel in their Every.org account, guests by
  emailing support [72]. Guests need only first name, last name and email [71].
- **Receipts:** Every.org sends the tax receipt; "your organization should not provide a tax receipt
  for any grants coming from Every.org"; a thank-you without tax language is fine [70].
- **Ticketing and vendor fees:** none found. Not a fit for the Gala or vendors.
- **Risks:** the donor gives to Every.org, not to us, and the dialog copy must say so; contact
  details only if the donor shares them [75]; if Every.org cannot deliver a gift, the donor is
  refunded in gift-card credit for another nonprofit [73].
- **PCI and fraud:** payment happens on Every.org's side. **CSP:** none for a plain link;
  `script-src https://embeds.every.org` for the button, plus a `frame-src` for the modal (likely
  `https://www.every.org`, unverified).
- **Alignment:** strongest of the four: run by a 501(c)(3), free to nonprofits [66][68].

## Approach 4: Give Lively

- **Who:** Give Lively LLC builds the platform; "Our founders are committed philanthropists" who
  "cover our operating costs"; no setup, platform, membership, subscription, annual or monthly fees
  [79][81]. The Give Lively Foundation (501(c)(3), tax id 81-0693451) re-grants gifts only "in
  select circumstances"; otherwise gifts go straight to the nonprofit [80].
- **Eligibility:** 501(c)(3) public charities and private operating foundations, in good standing
  with the IRS and "with both the California Attorney General's Office and the California Franchise
  Tax Board" (for all US nonprofits), aligned with Give Lively's values; approval takes 5 to 7
  business days [78].
- **How it fits the Give Dialog:** a Simple or Branded Donation Widget (a `div` and a script from a
  givelively.org host), or a link to a campaign page. "You can only place one Donation Widget per web
  page", embed codes "should not be placed into an iframe", and widgets do not work with Event
  Ticketing pages [82]. Wallets offered: Apple Pay, Google Pay, PayPal and Venmo, plus DAF grants
  [83].
- **What we build:** the widget mount in the dialog, and Zapier if we want notifications. There is
  no public REST API or webhook; a request for one is open, with comments into February 2026
  [84]. Zapier triggers: new donations, updated donations, updated donation status [85].
- **Fees:** Give Lively takes nothing; our own Stripe account is required and Stripe's rates apply:
  2.9% + 30 cents standard, 2.2% + 30 cents with the nonprofit discount, American Express 3.5% with
  the discount, ACH 0.8% capped at $5; donors may cover fees; Shift4 is an optional one-time card
  processor at 1.99% + 25 cents; check disbursements cost $1.01 each through Lob. The page says "as
  of September 2025" [40]. Tips to Give Lively are voluntary [40].
- **Recurring:** supported; receipts go to "the first payment only" unless we ask support to send one
  per payment [86].
- **Receipts:** automatic, with the nonprofit's name and EIN, amount and date; customizable thank-you
  text [86].
- **Ticketing:** tiers "for tickets, tables, sponsorships and advertising", and a tax-deductible
  amount per ticket [87]. Linked, not embedded [82].
- **Risks:** no API or webhooks; one widget per page; the Donation Widget's styling is theirs.
- **Alignment:** free to nonprofits and philanthropy-funded; values-screened membership [78][81].

## Also considered, not ranked

- **PayPal.** Confirmed charities pay 1.99% plus a 49-cent fixed fee on charity transactions (+1.50%
  international); Advanced Credit and Debit Card Payments (card fields in our own form [64]) cost
  2.19% + 29 cents at the charity rate; ACH 0.80% capped at $5; a standard dispute fee of $15; the
  page was last updated 1 September 2026 [58]. The Donate SDK
  (`https://www.paypalobjects.com/donate/sdk/donate-sdk.js`, `PayPal.Donation.Button`) opens "a pop-up overlaid
  on your website" and returns `tx`, `st`, `amt`, `cc`, `cm` to `onComplete` [59]. Donors can tick a monthly box; the charity rate
  needs a confirmed charity account [60][61]. PayPal Giving Fund is a 501(c)(3) public charity and
  donor-advised fund (EIN 45-0931286); enrolled charities get grants into PayPal 15 to 45 days after
  the gift, and PayPal Giving Fund sends donors the receipt [62][63]. It is a listing channel on
  PayPal, Meta and GoFundMe rather than a form for our site. A good add-on button for donors who already
  pay with PayPal; not a whole solution.
- **Square.** Online API 2.9% + 30 cents on every plan; ACH through the API 1% ($1 minimum, $5 cap)
  [65]. A nonprofit rate: not stated on the fees page [65].
- **Givebutter.** With tips on, 0% platform fee and donors cover processing (backed by the
  "Givebutter Guarantee"); with tips off, 3% platform fee plus 2.9% + 30 cents on cards [88]. Its API
  has 12 webhook events with a signing secret [89]; `POST /v1/transactions` takes a date, amount and
  method with no card token, which reads as recording a transaction rather than charging (the page
  does not say) [90]. Widgets: a popup button, an inline form, a goal bar; 420px maximum width;
  branding cannot be removed [91]. The same tip model as Zeffy; its webhooks also cover recurring
  plans and tickets [89].
- **Donorbox.** Free plan with platform fees of 2.95% to 3.95% plus processing; Pro at $150 a month
  (1.75% to 2%) includes Zapier and API [92]. The API is read-only `GET` endpoints; its README says
  access "costs $17/month", which may be older than the pricing page [93].
- **Donately.** 4% platform fee, or 2% at $99 a month, or 0% after a $5,000 prepayment for up to $1M,
  plus Stripe or PayPal processing; webhooks and API included [94]. An API-first option, but the
  fees rule it out.

## IRS rules the receipts must meet

- A donor needs a contemporaneous written acknowledgment for any single contribution of $250 or
  more: the organization's name, the cash amount, and a statement that no goods or services were
  provided, or a description and good-faith estimate of what was provided [95][97].
- Email is acceptable; separate contributions under $250 are not added together; one annual summary
  can cover several $250-plus gifts; charities typically send by 31 January; the charity pays no
  penalty for not acknowledging, but the donor loses the deduction [97].
- A quid pro quo payment over $75 (a Gala ticket, for example) needs a written disclosure with a
  good-faith estimate of fair market value; the penalty is $10 per contribution, up to $5,000 per
  event or mailing [96].
- What each approach does: Zeffy issues receipts, including partial ticket receipts [23][25];
  Every.org issues them in its own name [70]; Give Lively issues them with our EIN [86]; Stripe
  leaves the acknowledgment to us [49].

## Comparison

Worked card examples use the published or reported rates above, before any donor fee coverage.

| Approach | We keep on $50 | We keep on $100 | Monthly | Tax receipt | Gala tickets, tables, sponsors | Vendor fees |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Zeffy [19] | $50.00 | $100.00 | Yes, donor portal, annual receipt [26][28] | Automatic [23][24] | Yes, free [29] | Yes, free (as a ticket or form; not researched in detail) |
| 2. Stripe, nonprofit rate (Visa, Mastercard) [38][40] | $48.60 | $97.50 | Billing +0.7%: $48.25 and $96.80 [35] | Ours to send [49] | Build it; counts against 80% [36] | Payment Links or invoices; counts against 80% [36] |
| 2. Stripe, American Express at 3.5% [38] | $48.25 | $96.50 | Billing +0.7%: $47.90 and $95.80 [35] | As above | As above | As above |
| 2. Stripe, standard 2.9% + 30 cents [35] | $48.25 | $96.80 | Billing +0.7%: $47.90 and $96.10 | As above | As above | As above |
| 3. Every.org, card, Stripe payout [67][69] | $48.60 | $97.50 | Yes [74] | Every.org's [70] | No | No |
| 3. Every.org, bank gift [67] | $50.00 | $100.00 | Yes | Every.org's | No | No |
| 4. Give Lively, Stripe nonprofit rate [40] | $48.60 | $97.50 | Yes [86] | Automatic, first payment of a recurring gift [86] | Yes, linked page [87] | Not stated |
| PayPal charity rate [58] | about $48.51 | $97.52 | Monthly box [61] | Not stated | No | No |
| Square online API [65] | $48.25 | $96.80 | Not researched | Not researched | No | No |
| Givebutter, tips off [88] | $46.75 | $93.80 | Yes (plan events) [89] | Not researched | Yes [88] | Not researched |
| Donorbox Free plan (2.95% to 3.95% platform fee) with Stripe's nonprofit rate [92][38][40] | $46.62 to $47.12 | $93.55 to $94.55 | Yes | Not researched | Yes [92] | Not researched |

| Approach | Fits the dialog as | What we build | PCI | Fraud exposure | Volunteer ops | Donor data | CSP change | Accessibility control | Alignment |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Zeffy | Their form in our dialog, plus a hosted link | Message listener, link; optional webhook | Card data only in Zeffy's frames [33] | Zeffy's (anti-fraud review, reCAPTCHA) [30][33] | Low | In Zeffy; API, webhooks, exports [16] | None (or `script-src` for the v2 script) | Low inside the iframe | Free; donor-funded company |
| 2. Stripe | Our form, Stripe card fields | Form, two endpoints, receipts, secrets | SAQ A [54] | Ours: endpoints and card testing [50] | High | Ours, in our Stripe account | Stripe.js, Checkout, Link hosts [53] | High with Elements | 501(c)(3) discount |
| 3. Every.org | Our picker, then their modal or page | Picker, link; optional webhook | Theirs | Theirs | Low | Partial: only if the donor shares [75] | None for a link | Our picker only | Run by a 501(c)(3) |
| 4. Give Lively | Their widget, or a link | Widget mount; Zapier | Theirs, on our Stripe account | Theirs plus Stripe | Low | Our Stripe account plus Give Lively | Widget host (from the embed code) | Low | Free, philanthropy-funded |

## Unverified

- The contribution percentage a US Zeffy donor sees by default today. Reports say 17 or 34 percent
  (2024) [21]; the UK blog says never defaulted [34]; the sample form's hidden summary step showed
  "$0.00" before any amount was chosen, which proves nothing [33]. Check by walking a test gift up
  to, not through, the payment step on our own form.
- Zeffy's `postMessage` names and the `embed-version=v2` parameters are read from Zeffy's script and
  one test, not from documentation [4][33]. The thank-you messages were not observed, because that
  needs a completed payment.
- Zeffy's two scripts were read through a fetch tool that summarises; the quoted fragments came back
  verbatim, but the files were not read line by line.
- Whether Apple Pay or Google Pay ever appear in the embed on Android: Zeffy says embedded forms do
  not show them [10]; the script only disables express checkout on iPhone and iPod [4].
- Zeffy's accessibility: no statement found; the tree reading is one sample form, not an audit [33].
- Zeffy's dispute fee and PCI statement: not stated [32].
- Stripe's nonprofit rate numbers come from third parties, not Stripe [37][38][39][40]. Whether a
  second, donations-only Stripe account for the same organization would qualify: not stated [36].
- Every.org: the modal's iframe host for `frame-src`; where query parameters sit relative to
  `#donate`; any webhook signature (none documented) [74][75][76]. Its pricing page and its
  donor-advised fund article (sign-in required) were not read [77].
- Give Lively's production widget host: its help page shows a staging host in the example [82].
- Receipts on Givebutter and Donorbox, and Eventbrite's fees, were not researched.
- Load timing is two runs from one desktop connection [33].
- IRS Publication 1771's revision date was not captured; its footnoted dollar amounts are for 2023
  [97].

## Questions for the owner

1. Does the organization already have a Zeffy account, a donation form, and completed Stripe
   verification (needed for API writes [17])? Who is the single admin [15]?
2. Is monthly giving wanted? Quarterly or yearly too? Which frequency should be the default [13]?
3. Is Zeffy's contribution prompt acceptable for our donors, given the org cannot change it [19]?
4. How much do Apple Pay and Google Pay matter? The embed hides them; the hosted page shows them
   [10].
5. Gala: keep Eventbrite for seats, or move seats, tables and sponsor levels to Zeffy (D9, T04)?
   Odunde: should vendor fees be paid online, and through which tool?
6. Is a fully custom form worth a Stripe build and its upkeep, and roughly what share of card volume
   is donations rather than tickets or fees (the 80 percent rule [36])?
7. Who handles receipts, refunds and disputes through the year, and who holds the payment accounts
   if volunteers change?
8. Where should donor records live: Zeffy's CRM, a private dataset (after D3), or nowhere on the
   site?
9. Would the board accept Every.org as a second channel, knowing gifts legally go to Every.org,
   which issues the receipt [66][70]?
10. Is the organization current with the California Attorney General's Registry and the Franchise
    Tax Board (Give Lively requires it [78])?
11. The mailing address and EIN for the dialog's check line and foot (tickets 38 and 45).

## Sources

All checked on 27 September 2026.

Zeffy

1. Sharing your Zeffy campaign: https://support.zeffy.com/sharing-your-zeffy-campaign-with-your-supporters-and-community-k5z1c
2. How to embed your Zeffy campaign on your website: https://support.zeffy.com/how-to-embed-your-zeffy-campaign-on-your-website-km0gv
3. How to share or embed a translated campaign (embed code with the v2 script): https://support.zeffy.com/how-can-i-embed-a-french-version-of-my-form-to-my-website-9fs93
4. Zeffy embed script v2, read as text: https://www.zeffy.com/embed/v2/zeffy-embed.js
5. Zeffy popup script, read as text: https://zeffy-scripts.s3.ca-central-1.amazonaws.com/embed-form-script.min.js
6. Add a button to a website to share your form: https://support.zeffy.com/add-a-donate-button-to-a-website-dyh1i
7. Embed your peer-to-peer thermometer or leaderboard: https://support.zeffy.com/embed-leaderboard-and-thermometer
8. Zeffy Donate Button WordPress plugin (version 1.2.3): https://wordpress.org/plugins/zeffy-donate-button/
9. Third party: pull request 35 on BioNanomics/REFINERY-site (19 September 2026): https://github.com/BioNanomics/REFINERY-site/pull/35
10. Supported payment methods on Zeffy: https://support.zeffy.com/supported-payment-methods-on-zeffy-g6fei
11. How to redirect donors to a custom thank-you page: https://support.zeffy.com/how-to-redirect-donors-to-a-custom-thank-you-page-9mjy3
12. Set up UTM parameters and source tracking: https://support.zeffy.com/utm-tracking-on-zeffy-forms-sbfs5
13. Set suggested donation amounts and custom amount options: https://support.zeffy.com/set-suggested-donation-amounts-and-custom-amount-options-3dnzs
14. How can I change the color of my form?: https://support.zeffy.com/how-can-i-change-the-color-of-my-form-ntcjr
15. Get started with the Zeffy API: https://support.zeffy.com/get-started-with-the-zeffy-api-yourg
16. Zeffy API documentation (OpenAPI 3.1.0, version 1.0, served inline): https://www.zeffy.com/api/docs
17. Zeffy API, free public API for nonprofits: https://www.zeffy.com/integration/api
18. Integrating Zeffy with Zapier: https://support.zeffy.com/integrating-zeffy-with-zapier-88hkb
19. Zeffy really is free: https://support.zeffy.com/zeffy-really-is-free-no-fees-no-catch-4zjir
20. Zeffy pricing (reached from https://www.zeffy.com/en-US/pricing): https://www.zeffy.com/home/free-online-fundraising-platform
21. Feature request, "Voluntary Contribution Defaults to $0" (posted 8 February 2024): https://feedback.zeffy.com/feature-requests/p/voluntary-contribution-defaults-to-0
22. How to talk to your donors about Zeffy: https://support.zeffy.com/how-to-talk-about-zeffy-04gaw
23. Automatic tax receipts for donations: https://support.zeffy.com/automatic-tax-receipts-for-donations-q0amt
24. Are Zeffy's tax receipts compliant (IRS, CRA, ATO)?: https://support.zeffy.com/are-zeffys-tax-receipts-compliant-with-national-government-authority-requirements-irs-cra-ato-mv6ue
25. Automatic tax receipts for tickets, memberships, and items: https://support.zeffy.com/automatic-tax-receipts-for-tickets-memberships-and-items-c2e7n
26. When do monthly donors receive tax receipts?: https://support.zeffy.com/when-do-monthly-donors-receive-tax-receipts-jcp4m
27. Set up monthly recurring donations: https://support.zeffy.com/set-up-monthly-recurring-donations-qzia5
28. How to edit, manage or cancel a donor's recurring payment: https://support.zeffy.com/how-can-i-edit-or-cancel-my-monthly-donation
29. Fundraiser tickets feature page: https://www.zeffy.com/feature/fundraiser-tickets
30. Zeffy payouts, schedules, amounts and reports: https://support.zeffy.com/zeffy-payouts-schedules-amounts-and-reports-ajuec
31. Is my organization eligible to use Zeffy?: https://support.zeffy.com/is-my-organization-eligible-to-use-zeffy-8m24r
32. Disputes and chargebacks: https://support.zeffy.com/disputes-and-chargebacks-y63dc
33. Browser check of Zeffy's public sample form, embedded on example.com and opened directly (messages, timings, accessibility tree): https://www.zeffy.com/en-US/embed/donation-form/fd612afb-2973-43d9-90c4-d9be3049fa8a
34. How Zeffy makes money (UK blog, 1 July 2026): https://www.zeffy.com/en-gb/blog/how-does-zeffy-make-money

Stripe

35. Stripe pricing: https://stripe.com/pricing
36. Fee discount for nonprofit organizations: https://support.stripe.com/questions/fee-discount-for-nonprofit-organizations
37. Stripe for nonprofits: https://stripe.com/industries/nonprofits
38. Third party: Fundraise Up, Stripe nonprofit rate (last modified 21 September 2026): https://fundraiseup.com/support/stripe-nonprofit-rate/
39. Third party: Givebutter blog, Stripe for nonprofits (12 June 2026): https://givebutter.com/blog/stripe-for-nonprofits
40. Give Lively, transaction fees and donation disbursement (also cited for Stripe's rates): https://www.givelively.org/fees-and-disbursement
41. Stripe API, create a Checkout Session: https://docs.stripe.com/api/checkout/sessions/create
42. Stripe, build a payments page (Checkout UIs): https://docs.stripe.com/payments/checkout
43. Stripe, embed a checkout page (quickstart): https://docs.stripe.com/checkout/embedded/quickstart
44. Stripe, customize redirect behavior (full embedded page): https://docs.stripe.com/payments/checkout/custom-success-page.md?payment-ui=embedded-page
45. Stripe, let customers decide what to pay: https://docs.stripe.com/payments/checkout/pay-what-you-want.md?payment-ui=embedded-page
46. Stripe Payment Links: https://docs.stripe.com/payment-links
47. Stripe, track a payment link (URL parameters): https://docs.stripe.com/payment-links/url-parameters
48. Stripe customer portal: https://docs.stripe.com/customer-management
49. Stripe receipts and paid invoices: https://docs.stripe.com/receipts
50. Stripe, protect yourself from card testing: https://docs.stripe.com/disputes/prevention/card-testing
51. Stripe, how Radar works: https://docs.stripe.com/radar/how-radar-works
52. Stripe Radar pricing: https://stripe.com/radar/pricing
53. Stripe integration security guide (CSP): https://docs.stripe.com/security/guide
54. Stripe guide to PCI compliance: https://stripe.com/guides/pci-compliance
55. Stripe webhooks: https://docs.stripe.com/webhooks
56. Stripe, register domains for payment methods: https://docs.stripe.com/payments/payment-methods/pmd-registration
57. Stripe, manually entered card payments: https://support.stripe.com/questions/price-change-for-cards-entered-manually-in-the-dashboard

PayPal and Square

58. PayPal merchant fees (last updated 1 September 2026): https://www.paypal.com/us/business/paypal-business-fees
59. PayPal Donate SDK: https://developer.paypal.com/sdk/donate/
60. How do I accept donations with PayPal?: https://www.paypal.com/us/cshelp/article/how-do-i-accept-donations-with-paypal-help200
61. Can donors make recurring payments?: https://www.paypal.com/us/cshelp/article/can-donors-make-recurring-payments-help234
62. PayPal Giving Fund: https://www.paypal.com/us/paypal-giving-fund/home
63. How does PayPal Giving Fund grant donations to charities?: https://www.paypal.com/us/cshelp/article/how-does-paypal-giving-fund-grant-donations-to-charities-help969
64. PayPal advanced checkout (card fields): https://developer.paypal.com/docs/checkout/advanced/
65. Square, understanding our fees: https://squareup.com/us/en/payments/our-fees

Every.org

66. What is the 501(c)(3) tax-exempt status of Every.org?: https://support.every.org/hc/en-us/articles/5715755336083-What-is-the-501-c-3-tax-exempt-status-of-Every-org
67. What are the third party processing fees?: https://support.every.org/hc/en-us/articles/360059998533-What-are-the-third-party-processing-fees
68. Does Every.org charge fees?: https://support.every.org/hc/en-us/articles/360061886773-Does-Every-org-charge-fees
69. Disbursements overview: https://support.every.org/hc/en-us/articles/360061887233-Disbursements-overview
70. How do we record and acknowledge donations received from Every.org donors?: https://support.every.org/hc/en-us/articles/5711616989843-How-do-we-record-and-acknowledge-donations-received-from-Every-org-donors
71. Do donors need to create an Every.org account to donate?: https://support.every.org/hc/en-us/articles/9917347131923-Do-donors-need-to-create-an-Every-org-account-to-donate
72. How do I cancel a recurring donation?: https://support.every.org/hc/en-us/articles/4410882247827-How-do-I-cancel-a-recurring-donation
73. What happens if Every.org can't deliver a donation to a nonprofit?: https://support.every.org/hc/en-us/articles/360058165694-What-happens-if-Every-org-can-t-deliver-a-donation-to-a-nonprofit
74. Every.org donate link: https://docs.every.org/docs/donate-link
75. Every.org nonprofit donation webhook: https://docs.every.org/docs/webhooks/nonprofit-webhook
76. Every.org donate button README: https://github.com/everydotorg/donate-button
77. Every.org pricing (not readable: bot checkpoint, then HTTP 429): https://www.every.org/pricing

Give Lively

78. What is Give Lively membership and what are the requirements?: https://www.givelively.org/faqs/what-is-a-give-lively-nonprofit-membership-account
79. Who is Give Lively?: https://www.givelively.org/faqs/who-is-give-lively
80. What is the Give Lively Foundation?: https://www.givelively.org/faqs/what-is-the-give-lively-foundation
81. How and why is Give Lively's platform free for nonprofits?: https://www.givelively.org/faqs/how-and-why-are-give-lively-products-free-for-nonprofits
82. Use embeddable widgets to collect donations on your website: https://www.givelively.org/resources/use-embeddable-widgets-to-collect-donations-on-your-website
83. Donation widgets: https://www.givelively.org/donation-widgets
84. Feature request, "REST API & Webhook Integration please" (27 January 2025, comments to 3 February 2026): https://feedback.givelively.org/third-party-integrations/p/rest-api-webhook-integration-please-3
85. Review the Zapier integration's triggers and templates: https://www.givelively.org/resources/review-the-zapier-integrations-zap-triggers-and-templates
86. Everything nonprofits need to know about Give Lively donor receipts (16 June 2026): https://www.givelively.org/blog/everything-nonprofits-need-to-know-about-give-lively-donor-receipts
87. Event ticketing: https://www.givelively.org/event-ticketing

Givebutter, Donorbox, Donately

88. Givebutter pricing: https://givebutter.com/pricing
89. Givebutter API, create a webhook: https://docs.givebutter.com/api-reference/webhooks/create-a-webhook
90. Givebutter API, create a transaction: https://docs.givebutter.com/api-reference/transactions/create-a-transaction
91. How to use Givebutter Widgets on your website: https://help.givebutter.com/en/articles/6464859-how-to-use-givebutter-widgets-on-your-website
92. Donorbox pricing: https://donorbox.org/pricing
93. Donorbox API README: https://github.com/donorbox/donorbox-api
94. Donately pricing: https://www.donately.com/pricing

IRS and web platform

95. IRS, charitable contributions: written acknowledgments (last reviewed 28 June 2026): https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-contributions-written-acknowledgments
96. IRS, quid pro quo contributions (last reviewed 28 June 2026): https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-contributions-quid-pro-quo-contributions
97. IRS Publication 1771, Charitable Contributions: Substantiation and Disclosure Requirements: https://www.irs.gov/pub/irs-pdf/p1771.pdf
98. MDN, CSP `form-action`: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/form-action
