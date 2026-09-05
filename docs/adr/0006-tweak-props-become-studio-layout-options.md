# Design tweak props become Studio layout options with the same names

Each page prototype carries three to five tweak props (section order, density, hideable
blocks). They are real editorial choices, so each becomes a field on the page singleton's
`layout` object with the same name and options as the prototype
(`docs/design/ROUTES-AND-INTERACTIONS.md` section 5), and the component reads it. Names stay
identical across pages so the Studio feels like one system, and every option gets a
page-section story so the owner can compare by looking.
