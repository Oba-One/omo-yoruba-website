# 03: Kids & STEM and Cultural Exchange inline

Labels: design, content
Status: open
Blocked by: 02

**What to build:** `/programs` describes its two inline programs in full (spec Q3, Q4, ADR 0031): Kids &
STEM with its prose and two sub-program cards (photograph, name, blurb, facts or their chip, outline
action), and Cultural Exchange with its blurb, three facts and a photograph placeholder, each chip naming
its own fact. Both sections sit behind a quiet "Hide details / Show details" toggle that works without
JavaScript and starts open or closed by the `inline` option.

- [ ] `@oy/content`: sub-programs gain `image` and `facts[]`; `kidsStem.image`, `kidsStem.ages` and the
      sub-program's `ages` and `detail` retire; the registry's Kids & STEM facts row and Cultural Exchange's
      rows per field; the query reads them; TypeGen
- [ ] Seed: the two sub-programs' photographs with the prototype's framing, the facts' labels without
      values, the retired fields unset at their nested paths (the seed learns to fill and unset inside an
      object's keyed items)
- [ ] `@oy/ui`: the disclosure with its toggle (open, closed, without JavaScript); the sub-program card
      with its facts and Pending; the Cultural Exchange split; a `span.oy-pend` exemption wherever a new
      container styles its spans; stories and tests
- [ ] `packages/web`: the builder carries both sections and hides the fourth program's section under
      `three`; tested
- [ ] `Pages/Programs/Inline` stories (expanded, collapsed); Playwright: the toggles open and close with
      the keyboard and without JavaScript, the chips name each owed fact

## Comments
