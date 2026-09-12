# Attach the preview host for editors

Type: task
Status: open
Owner: yes
Labels: infra
Phase: 4
Blocked by: 26

## Question

Vercel's CDN keys its cache without cookies, so an editor previewing drafts on
`omoyorubasocal.org` can be served the cached public page (ADR 0021). A second name for the same
deployment, never cached, keeps editors on their drafts; the site already treats it that way and
marks everything it serves `noindex`.

1. Vercel, the project, Settings, Domains: add `preview.omoyorubasocal.org` on the `main` branch.
2. Cloudflare DNS: add the CNAME record Vercel shows for it.
3. Vercel, Settings, Environment Variables, Production: `PUBLIC_PREVIEW_ORIGIN` =
   `https://preview.omoyorubasocal.org`, then redeploy (the value is inlined at build time).

The Studio's Presentation tool then previews there. To check: `curl -sI
https://preview.omoyorubasocal.org/` shows `X-Robots-Tag: noindex, nofollow` and no
`Vercel-CDN-Cache-Control`; the public host shows the cache header and no robots header. Skipping
this is acceptable while editing is light; drafts can briefly show the published copy.
