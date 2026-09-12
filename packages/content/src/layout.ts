import { type LayoutSpec, PAGE_LAYOUTS } from './layout-options';

const optionValue = (option: LayoutSpec['options'][number]) =>
  typeof option === 'string' ? option : option.value;

/**
 * The layout defaults a page singleton carries (ADR 0006): the first option of every tweak, from
 * the same list the schema builds its `layout` object from, so the seed, the site and the Studio
 * agree on one source without the site importing the schema.
 */
export function layoutDefaults(typeName: string): Record<string, string> | undefined {
  const specs = PAGE_LAYOUTS[typeName];
  if (!specs || specs.length === 0) return undefined;
  return Object.fromEntries(
    specs.map((spec) => [spec.name, optionValue(spec.options[0] as LayoutSpec['options'][number])]),
  );
}

/**
 * The stored layout values with the defaults filled in for anything empty, unknown or not one
 * of the option's values, so a page never branches on a value the tweak table does not know.
 */
export function withLayoutDefaults<T extends Record<string, string>>(
  typeName: string,
  raw: Partial<Record<keyof T, string | null | undefined>> | null | undefined,
): T {
  const result: Record<string, string> = { ...(layoutDefaults(typeName) ?? {}) };
  for (const spec of PAGE_LAYOUTS[typeName] ?? []) {
    const value = raw?.[spec.name as keyof T];
    if (typeof value === 'string' && spec.options.map(optionValue).includes(value)) {
      result[spec.name] = value;
    }
  }
  return result as T;
}
