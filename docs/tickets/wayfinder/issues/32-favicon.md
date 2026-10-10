# Pick the favicon

Type: grilling
Status: open
Owner: yes
Labels: design
Phase: 4
Blocked by: none

## Question

The site has no favicon: neither `packages/web/public` nor the design handoff holds one, so every
browser logs a 404 for `/favicon.ico` and Lighthouse's best-practices score drops (0.93 on
12 September 2026). The obvious source is the logo mark (`packages/ui/src/navigation/Logo/logo-mark.png`).
Approve that, or supply the icon you want; a session then produces the sizes (an SVG or 32px icon,
a 180px Apple touch icon) and the head links (ticket 33).

## Comments

- 10 October 2026: asked which icon, the owner said to go first with the agent's recommendation and to see
  the options, so this stays open until they confirm what went in or pick another. In: the head from the
  crest of its crown to its chin, without the stem above the crest and without the neck, on the indigo
  ground (`--indigo-700`). The whole mark is 235 by 560, so in a 16px tab icon it is 7px wide and reads as a
  sliver; the crown is what makes the head the Ifẹ̀ head, and the ground gives the icon one shape on light
  and dark tabs alike.
  - `packages/web/public/favicon.ico` holds 16, 32 and 48px, each with rounded corners. The site layout
    links it, which is where search results read it from, and a browser asks for `/favicon.ico` on a page
    that links no icon (the member guide).
  - `packages/web/public/apple-touch-icon.png` is 180px with square corners, since a phone rounds them itself.
  - `chrome.spec.ts` checks that a page links both addresses and that both files answer.
  - Not measured again: Lighthouse's best practices score, which sat at 0.93 for this file's 404 and for the
    report-only CSP's issues (open-work D13).

The five options the owner was shown that day, each a crop of the handoff's master
(`docs/design/design/images/logo-mark.png`):

1. `235x310+0+160` on indigo, filling the icon's height: the one that went in.
2. `235x250+0+222`, the face, on indigo with a margin.
3. `235x235+0+232`, the face, filling an indigo icon.
4. The same crop as 3 on paper (`--paper`).
5. The whole mark with no ground.

Made with ImageMagick 7, in a scratch directory with the two paths made absolute; another option is the
same commands with its crop and ground:

```sh
magick docs/design/design/images/logo-mark.png -crop 235x310+0+160 +repage crown-face.png
magick -size 1024x1024 xc:'#1e2a5a' \( crown-face.png -filter Lanczos -resize x1024 \) \
  -gravity center -composite tile.png
for s in 16 32 48; do
  r=$((s * 3 / 16))
  magick tile.png -filter Lanczos -resize "${s}x${s}" -unsharp 0x0.6+0.6+0 \
    \( -size "${s}x${s}" xc:black -fill white -draw "roundrectangle 0,0 $((s - 1)),$((s - 1)) $r,$r" \) \
    -alpha off -compose CopyOpacity -composite -strip "icon-$s.png"
done
magick icon-16.png icon-32.png icon-48.png packages/web/public/favicon.ico
magick tile.png -filter Lanczos -resize 180x180 -alpha off -depth 8 -strip \
  -define png:compression-level=9 -define png:color-type=2 packages/web/public/apple-touch-icon.png
```
