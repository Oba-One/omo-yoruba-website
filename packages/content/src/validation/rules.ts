/**
 * Rule builders for `defineField({ validation })`. Every string and text field takes
 * `voice.text`; headings and button labels take `voice.heading`; Portable Text takes
 * `voice.blocks`. Errors block publishing, warnings show in the Studio (ADR 0010).
 */
import type { ArrayRule, StringRule, TextRule, UrlRule } from 'sanity';
import { emDashMessage, marksMessage, sentenceCaseMessage, voiceMessages } from './checks';

type StringOrText = StringRule | TextRule | UrlRule;

// `custom()` and `required()` return the rule they were called on, so the cast only restores
// the type the union call widened.
function voiceRules<R extends StringOrText>(rule: R, heading: boolean, required: boolean): R[] {
  const rules: StringOrText[] = [];
  if (required) rules.push(rule.required());
  rules.push(rule.custom(emDashMessage).error(), rule.custom(marksMessage).warning());
  if (heading) rules.push(rule.custom(sentenceCaseMessage).warning());
  return rules as R[];
}

export const voice = {
  /** No em dash (error), Yoruba marks (warning). */
  text: <R extends StringOrText>(rule: R): R[] => voiceRules(rule, false, false),
  /** As `text`, plus sentence case (warning) for headings, titles and button labels. */
  heading: <R extends StringOrText>(rule: R): R[] => voiceRules(rule, true, false),
  /** As `text`, and the field is required. */
  requiredText: <R extends StringOrText>(rule: R): R[] => voiceRules(rule, false, true),
  /** As `heading`, and the field is required. */
  requiredHeading: <R extends StringOrText>(rule: R): R[] => voiceRules(rule, true, true),
  /** Every span of a Portable Text value: em dash (error) and marks (warning) as one message each. */
  blocks: (rule: ArrayRule<unknown[]>) => [
    rule
      .custom((value) => {
        const dashes = voiceMessages(value).filter((m) => m.startsWith('Replace the em dash'));
        return dashes.length === 0 ? true : (dashes[0] as string);
      })
      .error(),
    rule
      .custom((value) => {
        const marks = voiceMessages(value).filter((m) => m.startsWith('Add the marks'));
        return marks.length === 0 ? true : marks.join(' ');
      })
      .warning(),
  ],
};
