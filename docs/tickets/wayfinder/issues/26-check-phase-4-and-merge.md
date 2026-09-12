# Check Visual Editing and the cache, then merge pull request 5

Type: task
Status: open
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
