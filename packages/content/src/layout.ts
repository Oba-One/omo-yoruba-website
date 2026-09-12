import { schemaTypes } from './schema';

interface LayoutField {
  name: string;
  initialValue?: unknown;
}
interface TypeWithLayout {
  name: string;
  fields?: { name: string; fields?: LayoutField[] }[];
}

/**
 * The layout defaults a page singleton carries (ADR 0006): the first option of every tweak, read
 * from the schema's initial values so the seed, the site and the Studio agree on one source.
 */
export function layoutDefaults(typeName: string): Record<string, string> | undefined {
  const type = (schemaTypes as unknown as TypeWithLayout[]).find((t) => t.name === typeName);
  const layout = type?.fields?.find((f) => f.name === 'layout');
  if (!layout?.fields) return undefined;
  return Object.fromEntries(
    layout.fields
      .filter((f) => typeof f.initialValue === 'string')
      .map((f) => [f.name, f.initialValue as string]),
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
  const defaults = layoutDefaults(typeName) ?? {};
  const type = (schemaTypes as unknown as TypeWithLayout[]).find((t) => t.name === typeName);
  const fields = (type?.fields?.find((f) => f.name === 'layout')?.fields ?? []) as (LayoutField & {
    options?: { list?: { value: string }[] };
  })[];
  const result: Record<string, string> = { ...defaults };
  for (const field of fields) {
    const value = raw?.[field.name as keyof T];
    const allowed = field.options?.list?.map((item) => item.value) ?? [];
    if (typeof value === 'string' && allowed.includes(value)) result[field.name] = value;
  }
  return result as T;
}
