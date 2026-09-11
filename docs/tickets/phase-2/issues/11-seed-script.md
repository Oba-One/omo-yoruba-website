# 11: The seed script, run against the development dataset

Labels: content
Status: open
Blocked by: 01, 06

**What to build:** `packages/content/scripts/seed.ts` per CONTENT-MODEL section 6 as amended by the
grill: confirmed facts only; the singletons with empty pending fields; four `stat` documents; four
programs and two initiatives; the two named zones; events Odunde 2027 and Gala 2026 (dates empty)
plus Odunde 2026 and Gala 2025 as past editions; the three real news posts; three photographers;
three albums whose photographs come from `docs/design/design/images/w2/` with captions from the
register, alt equal to the caption and `creditConfirmed: false`; four doors. Deterministic ids
without periods; idempotent through `createIfNotExists` plus `setIfMissing` (never overwriting an
edit) with a `--replace` switch; refuses to run without the project id and write token or against
a dataset other than `development` unless told.

- [ ] Tests cover the register parser, the id derivation and the document builders (pure parts)
- [ ] A dry run prints what it would write; a real run against `development` creates every
      document and asset, and a second run changes nothing
- [ ] Nothing invented: every value is on the confirmed list or is copy from a prototype
