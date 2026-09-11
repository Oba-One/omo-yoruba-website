# 13: The content-lint function writing lint reports

Labels: infra
Status: open
Blocked by: 07

**What to build:** `content-lint` on `create` and `update` of the content types, walking every
string and text field of the published document, running the em dash and diacritics checks from
`@oy/lint` and writing one `lintReport` document per checked document (findings with path,
kind, excerpt and correction; empty when clean). The Pending view lists reports with findings.

- [ ] Tests: the walker finds strings in nested objects, arrays and Portable Text spans; a
      clean document produces an empty report; the same word list as the repo lint is used
- [ ] `sanity functions test content-lint` transpiles with the workspace lint modules included
      (the `.build` output is checked) and writes nothing when `context.local` is set
- [ ] The function never sees its own reports or enquiries (the filter names the content types)
