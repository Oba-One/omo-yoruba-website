---
name: verify-omo-yoruba
description: Prove a change to the Omo Yorùbá site works in a browser, from a clean checkout and with no Sanity access, and keep labeled captures at 375 and 1280 wide for the pull request. Use before opening or updating a pull request that changes what a page renders, or when asked to verify, demo, or screenshot a flow (donate, join, Gala tickets, enquiries, newsletter, gallery, event pages, Studio).
---

# Verify a flow

`feature-map.md` (beside this file) lists the eight flows, the code and specs behind each, and what
can never be proven headless. Find the flows your diff touches there first.

The proof runs against the fixture dataset: the seed's documents and photographs plus one video,
served by `packages/content/scripts/fixture-api.ts`. It needs no `.env` and no token: in fixture mode
the dev server runs with both Sanity tokens empty, even where `packages/web/.env` holds them, and no
query or write reaches Sanity. The photographs' addresses still name Sanity's image CDN, and every spec
takes `test` from `e2e/fixtures.ts`, which answers those requests from the fixture API, so pages and
captures show the photographs. Never point verification at the live dataset: it holds
enquiries from real people.

## Steps

1. From the repository root of a clean checkout: `bun install`.
2. Run the specs for the touched flows against the fixture (Playwright starts the fixture API on
   4400, then `astro dev` on 4322):

   ```bash
   cd packages/web
   PUBLIC_SANITY_PROJECT_ID=fixture PUBLIC_SANITY_DATASET=development SANITY_API_HOST=http://127.0.0.1:4400 bunx playwright test e2e/gallery.spec.ts e2e/album.spec.ts
   ```

   The same suite in placeholder mode (`PUBLIC_SANITY_PROJECT_ID=placeholder`, no
   `SANITY_API_HOST`) shows the Pending states. CI runs both modes on every pull request.
3. Capture the flow at 375 and 1280 wide into a folder outside the checkout, so the evidence
   survives the worktree's cleanup:

   ```bash
   cd packages/web
   OY_EVIDENCE_DIR="$HOME/omo-yoruba-evidence/$(git branch --show-current)" PUBLIC_SANITY_PROJECT_ID=fixture PUBLIC_SANITY_DATASET=development SANITY_API_HOST=http://127.0.0.1:4400 bunx playwright test e2e/evidence.spec.ts --project desktop
   ```

   `e2e/evidence.spec.ts` writes `<flow>-<step>-<width>.png` and a `manifest.json` that records
   the engine, the data source, the time and each capture's page. It holds the gallery flow
   today; add a test there for another flow, following the map's steps. CI's fixture job runs it
   from a clean checkout on every pull request and uploads the folder as the `evidence` artifact
   (kept 30 days): `gh run download <run-id> -n evidence -D <folder>`. Where no browser can run
   locally, that artifact is the capture.
4. Look at every capture before citing it. A capture that shows a broken layout, an empty
   section or a dialog that should not be open is a finding, not proof.
5. In the pull request body, under Verification: the specs and their result, then the captures,
   labeled "Chromium (Playwright), fixture data, 375" and "... 1280", with the folder they are
   kept in. Attach them to the pull request when the change renders UI.

## Limits

- What the map's last column names stays unproven: Zeffy's own forms (Zeffy refuses headless
  browsers), YouTube's player, a real enquiry or subscription, and the signed-in Studio. Say so
  under "Not verified" rather than implying it.
- The fixture is the seed, not the owner's published content: a page that looks right here can
  still differ on the live site where the owner has edited it.
- Under heavy machine load (`uptime` one-minute average above 12), wait before starting
  Playwright; run one heavy step at a time.
