# 153: The component skill tells agents to render Astro's Image, which ADR 0022 set aside

Labels: infra
Status: open
Blocked by: none

**Finding** (R153 in `docs/plans/review-alignment-and-quality.md`; .claude/skills/oy-component; minor; docs): An agent following the skill would add astro:assets and Sanity image sources to a component, against the rule every component follows and the reason ADR 0022 gives (the same rendering in Storybook and on the site). Verified against the ADR, the type and a repo-wide grep.

**Evidence:** .claude/skills/oy-component/SKILL.md:26-27: images accept 'ImageMetadata | string | SanityImageSource' and render <Image> when they can. ADR 0022:3-8: components take the resolved set, a fixture URL or ImageMetadata and render a plain <img>; Astro's <Image> was set aside. packages/ui/src/media/image.ts:21 defines ImageInput = string | ImageMetadata | ResolvedImage; git grep finds no astro:assets or <Image in packages/ui or packages/web.

**What to build:** Replace the bullet with ImageInput from src/media/image.ts and a plain <img> with width and height, citing ADR 0022. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
