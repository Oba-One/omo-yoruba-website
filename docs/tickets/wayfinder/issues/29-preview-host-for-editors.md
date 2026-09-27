# Attach the preview host for editors

Type: task
Status: open
Owner: yes
Labels: infra
Phase: 4
Blocked by: none

## Question

Vercel's CDN keys its cache without cookies, so an editor previewing drafts on the public host can be
served the cached public page (ADR 0021). The public host is `omo-yoruba-khaki.vercel.app` until
`omoyorubasocal.org` answers (open-work D2), and the 13 September hosting session saw it happen there: a
request for `/` carrying the draft cookie came back from the cache (`x-vercel-cache: HIT`). A second name
for the same deployment, never cached, keeps editors on their drafts; the site already treats it that
way and marks everything it serves `noindex` (pull request 5, merged on 12 September).

1. Vercel, the project, Settings, Domains: add the preview host on the `main` branch. The plan is
   `preview.omoyorubasocal.org`, which needs the domain's records: on 27 September Cloudflare held none
   for the domain. Until then, a second `vercel.app` name added under Domains, as the stand-in public
   host was, could serve instead.
2. For `preview.omoyorubasocal.org`: in Cloudflare's DNS, add the CNAME record Vercel shows for it.
3. Vercel, Settings, Environment Variables, Production: `PUBLIC_PREVIEW_ORIGIN` = the preview host's
   origin, such as `https://preview.omoyorubasocal.org`, then redeploy (the value is inlined at build
   time).

The Studio's Presentation tool then previews there. To check: `curl -sI` the preview host twice; each
answer carries `X-Robots-Tag: noindex, nofollow` and never `x-vercel-cache: HIT`, while the public
host's second answer reads `HIT` and carries no robots header. Skipping this is acceptable while
editing is light; drafts can briefly show the published copy. Open-work D15 holds the decision.

## Comments

27 September 2026. Rewritten (open-work H2): ticket 26 is closed, since pull request 5 merged on 12
September, so nothing blocks this. The question named only `omoyorubasocal.org`; the public host is the
stand-in until D2, and the preview host's name follows it.
