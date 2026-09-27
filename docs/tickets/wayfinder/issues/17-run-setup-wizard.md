# Finish the setup: Resend and the functions, PostHog, Chromatic

Type: task
Status: open
Owner: yes
Labels: infra
Phase: 0
Blocked by: none

## Question

The setup wizard's Sanity and Vercel stages (1 to 3) are done, and so is the webhook of stage 7 (see
Comments). Three stages are left. Each can be done by hand from its steps in `scripts/setup-wizard.sh`,
or by running the wizard again, which keeps each value it finds when you press Enter. If you run it
again, answer no to stage 3's push to Vercel and to stage 7: as the wizard stands on 27 September 2026,
the push sets Vercel's `PUBLIC_SANITY_DATASET` to `production`, which holds no content, and
`PUBLIC_SITE_URL` to the domain, which does not answer yet, and stage 7 describes a webhook for the
domain and `production` (open-work D2 and D3 choose both). Record what each stage creates in a comment
here, never a secret.

1. **Stage 4, Resend.** Add the sending domain `omoyorubasocal.org`, create the records Resend shows at
   Cloudflare, then an API key with sending access only. Then deploy the two Sanity Functions and give
   `enquiry-notify` its variables `RESEND_API_KEY` and `ENQUIRY_FROM` (`docs/runbook.md`, Functions).
   Until then no enquiry sends an email and no content-lint report reaches the Studio's To do.
2. **Stage 5, PostHog.** Create the project, push its key to Vercel, and redeploy: the key is built into
   the site.
3. **Stage 6, Chromatic.** Add the project and store its token as the repository secret
   `CHROMATIC_PROJECT_TOKEN`; the Storybook job then publishes to Chromatic, and open-work E16 accepts
   the baselines.

Open-work D16 tracks the three.

## Comments

27 September 2026. Rewritten to the stages that are left (open-work H2); the question asked for the
whole wizard, blocked by ticket 12, which is resolved. Done, as checked on 27 September
(`docs/runbook.md`, Hosting today):

- Stage 1: the Sanity project "Website" (`qsya7q8x`), with `production` (public ACL, no content) and
  `development` (private, the content), and the CORS origins.
- Stage 2: a Viewer and an Editor robot token, and the webhook secret (the webhook's one delivery was
  accepted).
- Stage 3: the Vercel project `omo-yoruba` in the Greenpill Dev Guild team (ticket 12), linked to the
  repository; the public host shows content only `development` holds.
- Stage 7: the webhook `purge-site-cache` for `development`, pointed at the stand-in host
  `omo-yoruba-khaki.vercel.app` (ticket 25).

Left, as checked on 27 September:

- Stage 4: `packages/content/.env`, where the stage stores the key, does not exist, and the checkout has
  no `.sanity/blueprint.config.json` from a `blueprints init`. None of the four enquiries in
  `development` carries `notifiedAt` or `notifyError`, and no content-lint report exists, so neither
  function has run there.
- Stage 5: the public host's pages load no analytics script although the site settings leave analytics
  on, so the production build has no `PUBLIC_POSTHOG_KEY`.
- Stage 6: the repository has no Actions secrets (`gh secret list`).
