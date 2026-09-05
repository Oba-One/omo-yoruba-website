# CSP enforcement versus the ClientRouter cross-fade

Type: grilling
Status: open
Owner: yes
Labels: infra
Phase: 9
Blocked by: none

## Question

Astro's `security.csp` is a meta tag with no report-only mode and is unsupported with `<ClientRouter />`. Phase 0 ships the policy as a report-only header (ADR 0011). For Phase 9 choose: enforce the header with nonces or hashes and keep the 380ms cross-fade, or switch to Astro's meta CSP and drop the cross-fade. The report endpoint's logs during Phases 3 to 8 inform the choice.
