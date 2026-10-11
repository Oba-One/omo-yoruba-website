/** Named facts keep their identity when the displayed wording changes (ADR 0053). */
export const LESSON_FACTS = [
  { name: 'format', label: 'Format', what: 'the lesson format' },
  { name: 'when', label: 'When', what: 'when lessons run' },
  { name: 'ages', label: 'Ages', what: 'the ages lessons serve' },
  { name: 'cost', label: 'Cost', what: 'how lesson fees are agreed' },
] as const;

export const PAYMENT_FACTS = [
  { name: 'fees', label: 'Fees', what: 'how the donation form handles fees' },
  { name: 'receipt', label: 'Receipt', what: 'how the donation form handles receipts' },
  { name: 'monthly', label: 'Monthly', what: 'whether monthly giving is offered' },
  { name: 'fallback', label: 'If the form fails', what: 'how to give if the form fails' },
] as const;

export interface KnownFact {
  name: string;
  label: string;
  what: string;
}
export interface NamedFacts {
  [key: string]: string | Record<string, string> | undefined;
  notes?: Record<string, string>;
}

/** Reject unfamiliar or repeated labels instead of losing a row during migration. */
export function nameFacts(rows: unknown, spec: readonly KnownFact[]): NamedFacts {
  if (!Array.isArray(rows)) throw new Error('Expected a list of facts.');
  const result: NamedFacts = {};
  const seen = new Set<string>();
  for (const row of rows) {
    if (!row || typeof row !== 'object' || typeof row.label !== 'string')
      throw new Error('A fact has no label.');
    const field = spec.find(({ label }) => label.toLowerCase() === row.label.trim().toLowerCase());
    if (!field || seen.has(field.name))
      throw new Error(`Unrecognized or repeated fact: ${row.label}`);
    seen.add(field.name);
    if (row.value !== undefined && row.value !== null) {
      if (typeof row.value !== 'string') throw new Error(`Invalid value for ${row.label}`);
      result[field.name] = row.value;
    }
    if (row.note !== undefined && row.note !== null) {
      if (typeof row.note !== 'string') throw new Error(`Invalid note for ${row.label}`);
      result.notes ??= {};
      result.notes[field.name] = row.note;
    }
  }
  return result;
}
