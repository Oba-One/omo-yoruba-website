import { defineField } from 'sanity';
import { forMembers } from '../../studio/roles';

export type LayoutValue = string | { value: string; title: string };

/** A plain value in sentence case: "shown" reads "Shown", "events-led" reads "Events-led". */
export const valueTitle = (value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

/**
 * A layout option mirrors one tweak prop of a page prototype with the same name and values
 * (ADR 0006). The first value is the prototype's default and the initial value. A titled value
 * keeps the prototype's value while the Studio shows the repo's word for it; a plain value shows
 * in sentence case. A held-back switch is read-only for members, and says so (ADR 0042).
 */
export function layoutOption(
  name: string,
  title: string,
  options: readonly LayoutValue[],
  description?: string,
  { heldBack = false }: { heldBack?: boolean } = {},
) {
  const list = options.map((option) =>
    typeof option === 'string' ? { title: valueTitle(option), value: option } : option,
  );
  return defineField({
    name,
    title,
    type: 'string',
    description: heldBack
      ? [description, 'Only an administrator changes it.'].filter(Boolean).join(' ')
      : description,
    options: { list, layout: 'radio', direction: 'horizontal' },
    initialValue: list[0]?.value,
    ...(heldBack ? { readOnly: forMembers } : {}),
  });
}
