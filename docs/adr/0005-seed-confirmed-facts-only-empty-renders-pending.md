# Seed only confirmed facts, and let an empty field render Pending

The seed script writes only the facts the client has supplied
(`docs/design/CONTENT-MODEL.md` section 1) and the real photographs with unconfirmed
credits. There is no `placeholder: true` flag: a required-for-launch field that is empty
renders a named `Pending` chip on the site and a row in the Studio Pending view, so the
client sees exactly what they owe and nothing invented ever ships.

## Consequences

- Every component that can be empty needs a Pending treatment and a Pending story.
- Fixtures in `packages/ui/src/fixtures/` use confirmed facts and Pending states only.
