---
name: oy-voice
description: Copy rules and the Yoruba glossary with correct marks. Use when writing any copy, alt text, captions, success or error messages, kickers, story fixtures, or Studio field descriptions.
---

# Voice

Warm, family-oriented, action-forward. Short sentences. "We" and "our" for the org, "you"
and "yours" for the reader. Action verbs open buttons. Never corporate, never generic
"African-inspired". Ethos line: "Many hands make the load light."

## Rules

- Yoruba leads, English supports, always translated. Kicker pattern "Ẹ káàbọ̀ • Welcome".
- Sentence case for headings and buttons ("Enrol a learner", "Raise your hand"). Kickers
  and path chips are the only uppercase text.
- Punctuation: commas, periods, colons. No em dashes, no en dashes as dashes. Bullets "•"
  join short facts. Glyph set: • → ✓ ×. No emoji.
- Nothing stated as fact unless it is in the confirmed list
  (`docs/design/CONTENT-MODEL.md` section 1). Unknowns render Pending, never a guess.
- Success on an owned form: "Ẹ ṣé! ✓" then one plain sentence saying what happens next
  (who writes, within how long). Named contacts come from `siteSettings.contacts`;
  when empty, write the role ("our membership lead").
- Errors: a sentence naming the field ("Add an email address so we can reply."), never
  colour alone, never clearing what was typed. A summary sentence at the top of the form
  with `role="alert"`.
- Every form shows a human fallback beside it: email and phone from `siteSettings`.
- Framing line for the festival: Odunde sits with Chinese New Year, Diwali and Nowruz,
  "communities that pause the world to celebrate who they are."
- Trust line: "501(c)(3) nonprofit since 1997 • EIN XX-XXXXXXX • Los Angeles, CA".
- Alt text describes the moment (who, doing what, where), Yoruba names with marks; no
  "image of".

## Glossary

Always with marks. `packages/lint/yoruba-terms.json` is the lint's list of bare forms and
their corrections (`bun lint:yoruba`); this table is the wider copy glossary.

| Yoruba | Meaning or use |
| --- | --- |
| Omo Yorùbá | the organisation's name |
| Odunde, Ọdúndé | the festival; one word; with marks in the nav |
| Odún dé | the phrase "the year has come", two words; appears only inside the test string, never as the festival name |
| Ọjà Balógun | the market zone |
| Àgbàlá Ọmọde | the children's yard zone |
| Ẹgbẹ́ Ìbílẹ̀ | the community (in the test string) |
| Ẹ káàbọ̀ | welcome (kicker) |
| Ẹ ṣé, Ẹ ṣeun | thank you (success states) |
| Àwòrán | pictures (gallery kicker) |
| aṣọ òkè | the woven cloth; stripe dividers |
| àdìrẹ | the indigo dyed cloth; dot fields |
| gèlè | head wrap |
| Ifẹ̀ | the bronze head on the logo mark |

Test string for type: "Ẹ káàbọ̀ sí Ọjà Balógun, Àgbàlá Ọmọde àti Ẹgbẹ́ Ìbílẹ̀. Odún dé! Ẹ ṣeun."

Open question: `ROUTES-AND-INTERACTIONS.md` writes the newsletter success label with a
different first letter from every other success state. Use "Ẹ ṣé! ✓" and confirm with the
owner (wayfinder ticket 23).
