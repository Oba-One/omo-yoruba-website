# 11: The seed script, run against the development dataset

Labels: content
Status: resolved
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

- [x] Tests cover the register parser, the id derivation and the document builders (pure parts)
- [x] A dry run prints what it would write; a real run against `development` creates every
      document and asset, and a second run changes nothing
- [x] Nothing invented: every value is on the confirmed list or is copy from a prototype

## Comments

11 September 2026. The dry run passes against `development` (68 photographs found, the dataset
answers). The real run uploaded the 68 assets and then stopped: the token in `packages/web/.env`
is a Contributor token (`client.users.getById('me')` reports the role `contributor`), which
writes drafts but cannot create published documents, so the transaction was refused with
"permission create required". The seed now checks the role before uploading. Waiting on the
owner: an Editor token in `SANITY_API_WRITE_TOKEN` (wizard stage 2), then `bun seed`, then a
second run to confirm nothing changes. The uploaded assets are reused by SHA-1.

11 September 2026, later. With the tokens renamed and an Editor token in place the seed ran
against `development`: 68 photographs matched by SHA-1 (uploaded earlier), 42 documents created in
one transaction (the first attempt in batches of 20 failed on a cross-batch reference, so the seed
now writes everything in one). A second run reported 42 patched, so the seed now compares against
the existing documents and patches only missing fields: the third run reported 42 unchanged.
Albums hold 43, 6 and 19 photographs with the three photographers and `creditConfirmed: false`;
every register row lists its documents in the Pending view and the presence rows show the two
unnamed zones and the five absent types.
