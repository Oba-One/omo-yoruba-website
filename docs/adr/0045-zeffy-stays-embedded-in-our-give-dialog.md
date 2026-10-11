# Zeffy stays, embedded in our own Give Dialog and sized by its own messages

Amended by ADR 0051: the policy also frames YouTube's no-cookie player, for an album's videos; what the Give
Dialog may frame stays Zeffy's origin alone.

Decided on 27 September 2026 by the owner, from `docs/research/online-giving-options.md` (pull request 16), which
ranked four ways to take gifts online: Zeffy embedded properly, Stripe behind our own form, Every.org behind our own
amount picker, and Give Lively. The owner chose the first. Zeffy charges the organization nothing on a gift, can
issue the tax receipts, runs monthly giving with a donor portal and sells tickets, Gala tables and sponsor levels
included. Its API cannot take a payment, so on our site Zeffy stays an embed or its own page. How the owner's form
handles monthly giving and receipts is still open (open-work C12).

The Give Dialog keeps its native dialog and the island's iframe (ADR 0020). The page loads no Zeffy script, so the
policy keeps `frame-src https://www.zeffy.com` and nothing more. What this change adds:

- The iframe's address carries `embed-version=v2&embedId=give`, set with the URL API on the address `framableSrc`
  accepts, so the address keeps its own parameters. With those two parameters Zeffy's form posts its state to the
  page that frames it. That contract is read from Zeffy's own embed script and one test of its public sample form,
  not from documentation; the research lists it as unverified.
- The dialog hears only `message` events whose origin is exactly `https://www.zeffy.com` and whose data is an object
  naming `embedId: 'give'`, as Zeffy's own script filters them, through one window listener registered when the
  element is defined (ADR 0041), and only once a form is mounted. `zeffy-embed:connected` counts as ready, as the
  frame's `load` does, and after the timer it brings the form back over the fallback; a late `load` does not, since a
  frame loads an error page too. `zeffy-embed:resized` sets the frame's height, rounded, up to 2400px; the stylesheet
  keeps today's height, `min(640px, 70vh)`, as the floor, so a taller step grows the frame and a shorter one never
  shrinks it. Because the frame then grows with the form, the dialog holds the scroll: on
  `zeffy-embed:step-changed` and `zeffy-embed:thank-you-page-shown` the dialog, or the bottom sheet under 720px,
  scrolls back to the frame's top when that begins above the view. The thank-you page also announces the track event
  `give_completed`, once per connection: Safari reloads a persisted frame on every page swap, and the reloaded form
  connects again.
- The fallback timer is eight seconds, not four: the research measured 2.4 and 4.7 seconds from insertion to
  `connected`. The fallback still offers the check line, Contact us and Try again.
- Under the form, a quiet link opens Zeffy's own page for the same form in a new tab. Zeffy never shows Apple Pay and
  Google Pay in an embed; on its own page it shows them on most forms viewed on a phone, for gifts up to $1,000,
  with nothing for the organization to switch on. The layout derives the page from the embed address by dropping its
  `/embed` segment (`https://www.zeffy.com/en-US/embed/donation-form/<slug>` becomes
  `https://www.zeffy.com/en-US/donation-form/<slug>`, the locale optional) and draws no link for any other address.
  Both shapes were checked on 27 September 2026 against the embed code in Zeffy's help centre and its public sample
  form, which answer at both addresses, without submitting anything. A gift made there never reports back to the
  page, so the link announces `give_page_opened` instead, and the embed's lead drops "You never leave the page.",
  which the link made untrue.
- On an iPhone the dialog adds `disableExpressCheckout=true` to the frame's address before the frame loads, as Zeffy's
  own embed script does there.
- The deep review's tickets R38 and R45 (pull request 16) are fixed on the way. The dialog no longer states monthly
  giving or emailed receipts, and its foot ("Secure • Powered by Zeffy" and the EIN) shows only with the form, not in
  the pending and fallback modes. The check line shows the mailing address's Pending chip whenever the address is
  empty, with the organization's name only before a present address.

## Considered options

- Stripe behind our own form in the dialog: our own fields and full control of the elder test, at the cost of
  payment code, receipts and card-testing exposure the organization would carry. Rejected.
- Every.org behind our own amount picker: run by a 501(c)(3) and free, but the gift and the receipt are Every.org's
  and it sells no tickets. Rejected; it could come back later as a second channel.
- Give Lively: free and funded by philanthropists, but a widget or a link only, with no API and no webhooks.
  Rejected.
- Zeffy's own v2 embed script instead of our listener: it needs `script-src https://www.zeffy.com`, and a call to
  `window.Zeffy.embed.init()` after the dialog mounts the template, since the script scans the page once. Our iframe
  and one listener do the same work with no third-party script.
- Zeffy's page address as a new site-settings field: a content-model change, and one more field for an administrator
  to keep in step, when the embed address already names the form.
- Fitting the frame to every step's height: the dialog would shrink and grow between steps. The floor keeps it
  steady for every step that fits today's frame.
- Checking each message's `source` against the mounted frame's window as well as its origin: stricter, but Zeffy's
  own script does not, and a form that posts from a frame inside its own would go unheard.
- A fresh embed id for each mounted frame, as Zeffy's own script mints one per embed, so that a message a frame sent
  just before Try again removed it cannot mark the new frame ready: the island would have to hand the dialog a
  changing address, for a race of milliseconds.
- The link to Zeffy's page in the fallback as well: it depends on neither the frame nor the island, so it could help
  when those fail, but its note speaks of Apple Pay and Google Pay, and the fallback's lead counts two other ways to
  give. Left to the owner with the dialog's copy (open-work D8).

## Consequences

- Amends ADR 0020, noted there: the timer is eight seconds, the frame's address carries the v2 parameters, and the
  dialog links Zeffy's page. The island still reads the settings itself. The page link rides the cached page, as the
  dialog's mode already does, and a publish of the site settings purges every page (`type:siteSettings`). The purge
  is soft, so for one serve after the Zeffy address changes a page can link the old form while its island frames the
  new one.
- The contract is undocumented. If Zeffy changes it, the frame keeps today's height, `give_completed` stops arriving
  and the frame's `load` still counts as ready: the form works as it did before this change.
- `give_completed` is a sign seen in the browser, not a record of a gift. The gift's record is Zeffy's: its
  dashboard, and its signed `payment.completed` webhook if the owner later wants the site told of each gift (not
  built). No donor data reaches the site.
- `packages/ui/src/forms/GiveDialog/zeffy.ts` keeps the contract in one place: the origin, the embed id, the frame's
  address and the page's. `packages/web/src/lib/csp.test.ts` checks that the policy frames the same origin.
- Vitest can now run a component's own inline script (`renderLive` in `packages/ui/src/test/stories.ts`), so the
  GiveDialog element tests post Zeffy's messages to the script the page ships. Every other test still asserts the
  initial markup and ARIA state, as ADR 0018 describes.
- Still owed (open-work C12 and D8): the Zeffy form itself, its embed address in the site settings, and whether it
  offers monthly giving and emails receipts. The Donate page's give-now blurb still promises both, and the Gala's
  give row monthly giving; they are Studio content, for the owner to change once the form says what it does.
- `packages/web/e2e/give.spec.ts` checks the frame's parameters once the settings hold an address, and holds Zeffy's
  requests unanswered to reach the fallback in that mode; until then every run meets the pending mode.
