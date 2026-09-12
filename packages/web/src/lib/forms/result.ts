/**
 * The action result (CONTEXT.md, ADR 0019): every owned form answers `{ ok: true, title, body }`
 * or `{ ok: false, summary, fields, values }`, for the JavaScript path and the no-JS re-render
 * alike. The pure helpers here turn a posted form and Zod's issues into that shape.
 */
import { REQUIRED_TEMPLATE, summarySentence } from '@oy/content/enquiry-kinds';

export interface FormResultOk {
  ok: true;
  title: string;
  body: string;
}

export interface FormResultFail {
  ok: false;
  /** The summary sentence at the top of the form. */
  summary: string;
  /** One sentence per field id. */
  fields?: Record<string, string>;
  /** The values as typed, echoed for the re-render. */
  values?: Record<string, string>;
}

export type FormResult = FormResultOk | FormResultFail;

export interface Issue {
  path: PropertyKey[];
  message: string;
}

/** The string values of the named fields, as typed. */
export function valuesFrom(formData: FormData, ids: readonly string[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const id of ids) {
    const value = formData.get(id);
    if (typeof value === 'string') values[id] = value;
  }
  return values;
}

const REQUIRED_PATTERN = new RegExp(
  `^${REQUIRED_TEMPLATE.replace('.', '\\.').replace('{req}', '(.+)')}$`,
);

/** Maps Zod's issues to field sentences and a summary that lists every missing item. */
export function resultFromIssues(
  issues: readonly Issue[],
  values: Record<string, string>,
): FormResultFail {
  const fields: Record<string, string> = {};
  const missing: string[] = [];
  for (const issue of issues) {
    const id = String(issue.path[0] ?? '');
    if (!id || fields[id]) continue;
    fields[id] = issue.message;
    const req = REQUIRED_PATTERN.exec(issue.message)?.[1];
    if (req) missing.push(req);
  }
  const first = Object.values(fields)[0] ?? 'Check the form and send again.';
  return { ok: false, summary: missing.length ? summarySentence(missing) : first, fields, values };
}

/** A filled honeypot: a bot, never a person (the field is out of reach). */
export function isHoneypotFilled(formData: FormData): boolean {
  return String(formData.get('website') ?? '').trim() !== '';
}

/** The page path the form was opened on, kept only when it looks like one of ours. */
export function sourceFrom(formData: FormData, fallback = ''): string {
  const value = String(formData.get('source') ?? '').trim();
  if (value.length > 200 || !value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
}
