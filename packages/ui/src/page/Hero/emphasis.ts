/**
 * The heading split around its gold words (`hero.emphasis`), or undefined when there are none or
 * they do not occur in it. Both are compared in NFC, so Yoruba marks typed as one character or as
 * a letter and a combining mark still match; the pieces come from the normalized heading, which
 * reads the same. Stega's invisible characters sit after the heading and survive NFC.
 */
export function splitEmphasis(
  title: string | null | undefined,
  emphasis: string | null | undefined,
): { before: string; accent: string; after: string } | undefined {
  const heading = title?.normalize('NFC');
  const accent = emphasis?.trim().normalize('NFC');
  if (!heading || !accent) return undefined;
  const at = heading.indexOf(accent);
  if (at < 0) return undefined;
  return { before: heading.slice(0, at), accent, after: heading.slice(at + accent.length) };
}
