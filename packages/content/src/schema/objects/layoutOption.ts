import { defineField } from 'sanity';

/**
 * A layout option mirrors one tweak prop of a page prototype with the same name and options
 * (ADR 0006). The first option is the prototype's default and the initial value.
 */
export function layoutOption(
  name: string,
  title: string,
  options: readonly string[],
  description?: string,
) {
  const [first] = options;
  return defineField({
    name,
    title,
    type: 'string',
    description,
    options: {
      list: options.map((value) => ({ title: value, value })),
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: first,
  });
}
