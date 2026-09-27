# Gala awards: yes or no

Type: grilling
Status: open
Owner: yes
Labels: content
Phase: 5
Blocked by: none

## Question

Does the Gala give awards? If yes, honourees need names, awards, blurbs and images. If no, the honourees block stays hidden by default (`layout.awards: hidden`).

## Comments

12 September 2026 (Phase 5). The Awards option now defaults to hidden for a new page; the development
dataset keeps the `shown` its seed stored, so `/gala` shows the honorees heading with the Pending line
"whether awards exist, and who" until the Studio switches it or adds honorees. The honorees render this
year's first as "This year", then earlier ones as "Previously honored" with the year.

27 September 2026. Ticket 36 is closed; its step 4, switching the Awards option to hidden if the Gala
gives no awards this year, lives here and in open-work D10. `development` still stores `shown` and holds
no honoree (checked 27 September). With ADR 0042 (pull request 11) the option becomes one of three
held-back switches that only an administrator changes.
