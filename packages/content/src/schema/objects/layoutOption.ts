import { defineField } from 'sanity';

export type LayoutValue = string | { value: string; title: string };

/**
 * A layout option mirrors one tweak prop of a page prototype with the same name and values
 * (ADR 0006). The first value is the prototype's default and the initial value. A titled value
 * keeps the prototype's value while the Studio shows the repo's word for it.
 */
export function layoutOption(
  name: string,
  title: string,
  options: readonly LayoutValue[],
  description?: string,
) {
  const list = options.map((option) =>
    typeof option === 'string' ? { title: option, value: option } : option,
  );
  return defineField({
    name,
    title,
    type: 'string',
    description,
    options: { list, layout: 'radio', direction: 'horizontal' },
    initialValue: list[0]?.value,
  });
}
