# Editor roles on the Sanity plan

Type: task
Status: resolved
Owner: yes
Labels: infra
Phase: 2
Blocked by: none

## Question

Org members should not edit `siteSettings` or `enquiry`. Sanity roles depend on the plan; the fallback is hiding those types through structure and document actions. Which plan is the project on, and is a custom role available?

## Answer

The owner answered as D4 on 26 September 2026 (ADR 0042): members are Sanity Editors, and administrators
keep site settings, the Inbox, the Vision tool and the three held-back switches. The Studio hides and locks
those for members through its structure, document actions and read-only rules, which shape the interface
only: through the API an Editor can still read and change every document. A custom role needs an Enterprise
plan, or an administrators-only dataset would be the lock; both wait for D3.
