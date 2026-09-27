# Check Visual Editing and the cache, then merge pull request 5

Type: task
Status: resolved
Owner: yes
Labels: infra
Phase: 4
Blocked by: none

## Question

Phase 4 (the homepage, Visual Editing, route caching) is pull request
https://github.com/Oba-One/omo-yoruba-website/pull/5, CI green on 12 September 2026. Before merging:

1. Open `/admin`, the Presentation tool and the homepage. Click the hero heading, a photograph,
   the event band (the season option) and the mosaic (the gallery option): each opens its field.
   Save a change and watch the preview reload with the draft.
2. Look at the homepage at 375 and 1440 against `docs/design/design/02 Homepage.dc.html`; ADR 0023
   lists what matches and what stays different on purpose.

After the merge, production on `omoyorubasocal.org` (a custom domain, so outside Vercel
Authentication) serves `/api/revalidate`: create the Sanity webhook (ticket 25) and run the checks
in `docs/runbook.md` ("Webhook and cache purge", "Lighthouse") against the public domain. Phase 5
branches from `main` once this is merged.

## Answer

Phase 4 merged as pull request 5. What its steps left open moved to open-work rows before the ticket
closed; the comment below names each.

## Comments

27 September 2026. Closed (open-work H1): pull request 5 merged on 12 September 2026. Where what
was left went:

- The Sanity webhook and the purge check: open-work E1 (ticket 25). The public host is the stand-in
  `omo-yoruba-khaki.vercel.app` until `omoyorubasocal.org` answers (D2), and a webhook already points
  at it (`docs/runbook.md`, Hosting today); what is left is proving that a publish purges a page, and
  moving the webhook when D2 or D3 changes.
- The Lighthouse check against the public host: open-work E14. The stand-in host answers without the
  bypass secret.
- The homepage's open difference from its prototype, the photo hero's heading on phones (ADR 0023):
  open-work D11 (ticket 30).
- Steps 1 and 2 were the checks before the merge; the deep review (open-work E2) compares the homepage
  with its prototype again.
