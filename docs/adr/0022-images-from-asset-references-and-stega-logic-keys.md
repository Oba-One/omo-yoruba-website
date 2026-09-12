# Every image is a CDN URL built from the asset reference, and the stega filter keeps the logic keys clean

Decided 12 September 2026 (Phase 4). The site builds every image URL and srcset itself from the
asset reference id, the hotspot and the crop (`createImageSet` in `@oy/content/images`), and no
query projects an asset URL or dimension; components take that resolved set, a fixture URL or
`ImageMetadata` and render a plain `<img>` with width and height. Astro's `<Image>` was set aside
because the photographs live on the Sanity CDN, which already serves AVIF and WebP through
`auto=format`, and because a resolved set renders identically in Storybook and on the site. The
loader also passes a stega filter (`@oy/content/stega`) that keeps the keys the site branches on
out of the encoding (`kind`, `enquiryKind`, `key`, `role`, the layout option values, the settings
that become `mailto:` and `tel:` links), so a `switch` in a component compares the value the Studio
stored, and no page cleans strings by hand. Click-to-edit on images and on the containers of the
layout options comes from a `data-sanity` attribute the site encodes itself
(`packages/web/src/lib/sanity/data-attribute.ts`) in the format of `@sanity/visual-editing-csm`,
because that package is a dependency of `@sanity/astro` and out of reach under Bun's isolated
linker; the test pins the format.

## Consequences

- A URL string from a query would carry stega in draft mode and break the image; the projection
  rule (`asset`, never `asset->url`) is the guard.
- Adding a discriminator field to the schema means adding its key to the stega filter; the hero's
  gold words (`emphasis`) are one, since the site finds them inside the heading by a string match.
- The hotspot also travels as a CSS `object-position` (`position` on the set, measured within the
  crop), so a photo under `object-fit: cover` keeps its framing; the seed writes the prototype's
  `object-position` values as hotspots. Card and door photos are not cropped at the CDN (no
  `aspect`): their box changes shape with the width, and a CDN crop underneath would be cropped
  again, which zoomed the doors on a phone (design review, 12 September 2026).
- If a later release exports `createDataAttribute` from a package the site depends on, the local
  encoder goes.
