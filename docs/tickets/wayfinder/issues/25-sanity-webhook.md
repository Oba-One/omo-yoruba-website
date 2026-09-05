# Create the Sanity webhook after Phase 4

Type: task
Status: open
Owner: yes
Labels: infra
Phase: 4
Blocked by: 17

## Question

Once `/api/revalidate` is deployed, create the webhook in Sanity Manage (POST on create, update and delete; secret `SANITY_WEBHOOK_SECRET`; projection with `_type` and slug). The last stage of `scripts/setup-wizard.sh` walks through it.
