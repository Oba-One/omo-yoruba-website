import type { ArrayOfPrimitivesInputProps, StringInputProps } from 'sanity';

type Choice = string | { value?: unknown; title?: string };

const choiceValue = (choice: Choice) => (typeof choice === 'string' ? choice : choice.value);

/**
 * The choices a document may still pick: retired values drop out, except one the document already
 * holds, so opening an old document never hides or drops its stored value (ADR 0042).
 */
export function visibleChoices<T extends Choice>(
  list: readonly T[],
  retired: readonly string[],
  current: unknown,
): T[] {
  const held = new Set(Array.isArray(current) ? current : current === undefined ? [] : [current]);
  return list.filter((choice) => {
    const value = choiceValue(choice);
    return typeof value !== 'string' || !retired.includes(value) || held.has(value);
  });
}

/** A string or string-array input whose option list leaves out the retired values. */
export function hideRetired(retired: readonly string[]) {
  return function RetiredChoicesInput(props: StringInputProps | ArrayOfPrimitivesInputProps) {
    const options = props.schemaType.options as { list?: Choice[] } | undefined;
    const list = options?.list;
    if (!list) return props.renderDefault(props as never);
    const schemaType = {
      ...props.schemaType,
      options: { ...options, list: visibleChoices(list, retired, props.value) },
    };
    return props.renderDefault({ ...props, schemaType } as never);
  };
}
