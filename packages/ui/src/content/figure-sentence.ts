/**
 * A sourced figure as the sentence a section's lead adds ("[ value ] [ label ]. [ Source ]."): the
 * value and the label, then the source as written. Undefined while the value or the label is
 * missing, and the page shows the registry's chip instead.
 */
import { sentence } from './sentence';

export interface SourcedFigureLike {
  value?: string | null;
  label?: string | null;
  source?: string | null;
}

export function figureSentence(figure: SourcedFigureLike | null | undefined): string | undefined {
  const value = figure?.value?.trim();
  const label = figure?.label?.trim();
  if (!value || !label) return undefined;
  const source = figure?.source?.trim();
  return [sentence(`${value} ${label}`), source ? sentence(source) : undefined]
    .filter(Boolean)
    .join(' ');
}
