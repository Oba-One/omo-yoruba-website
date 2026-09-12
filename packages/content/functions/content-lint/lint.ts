/**
 * The pure half of content-lint (ADR 0010, ADR 0014): walk every string of a document, run the
 * em dash and diacritics checks, and shape one lintReport per document. Imports stay relative
 * so the deploy bundle carries the checks and the word list.
 */
import { emDashMessage, marksMessage } from '../../src/validation/checks';

export type FindingKind = 'em-dash' | 'marks';

export interface Finding {
  path: string;
  kind: FindingKind;
  message: string;
  excerpt: string;
}

export interface LintedDocument {
  _id: string;
  _type: string;
  _rev?: string;
  [field: string]: unknown;
}

export interface LintReport {
  _id: string;
  _type: 'lintReport';
  documentId: string;
  documentType: string;
  title: string;
  checkedRev?: string;
  checkedAt: string;
  findings: (Finding & { _key: string; _type: 'lintFinding' })[];
}

/** Every document type the function checks: the content, never enquiries, subscribers or its own reports. */
export const LINT_TYPES = [
  'siteSettings',
  'homepage',
  'festivalPage',
  'galaPage',
  'programsPage',
  'lessonsPage',
  'collectivePage',
  'getInvolvedPage',
  'impactPage',
  'storyPage',
  'donatePage',
  'galleryPage',
  'newsPage',
  'event',
  'zone',
  'ticketTier',
  'sponsorLevel',
  'honoree',
  'program',
  'initiative',
  'person',
  'timelineEntry',
  'testimonial',
  'newsPost',
  'album',
  'photographer',
  'partner',
  'outcome',
  'stat',
  'door',
  'hometownAssociation',
  'givingLevel',
  'governanceDoc',
] as const;

const EM_DASH = String.fromCharCode(0x2014);
const EN_DASH = String.fromCharCode(0x2013);
const EXCERPT = 40;

function excerptAround(text: string, message: string): string {
  if (text.length <= EXCERPT * 2 + 10) return text;
  const index = message.startsWith('Replace')
    ? Math.max(text.indexOf(EM_DASH), text.indexOf(EN_DASH))
    : 0;
  const at = index < 0 ? 0 : index;
  const start = Math.max(0, at - EXCERPT);
  const end = Math.min(text.length, at + EXCERPT);
  return `${start > 0 ? '...' : ''}${text.slice(start, end)}${end < text.length ? '...' : ''}`;
}

function check(path: string, text: string, findings: Finding[]): void {
  for (const [kind, run] of [
    ['em-dash', emDashMessage],
    ['marks', marksMessage],
  ] as const) {
    const message = run(text);
    if (message !== true)
      findings.push({ path, kind, message, excerpt: excerptAround(text, message) });
  }
}

function isBlock(value: Record<string, unknown>): boolean {
  return value._type === 'block' && Array.isArray(value.children);
}

function walk(value: unknown, path: string, findings: Finding[]): void {
  if (typeof value === 'string') {
    check(path, value, findings);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const key =
        item && typeof item === 'object' && typeof (item as { _key?: unknown })._key === 'string'
          ? (item as { _key: string })._key
          : String(index);
      walk(item, `${path}[${key}]`, findings);
    });
    return;
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (record._type === 'reference') return;
    if (isBlock(record)) {
      const text = (record.children as { text?: unknown }[])
        .map((child) => (typeof child.text === 'string' ? child.text : ''))
        .join('');
      check(path, text, findings);
      return;
    }
    for (const [key, child] of Object.entries(record)) {
      if (key.startsWith('_')) continue;
      walk(child, path ? `${path}.${key}` : key, findings);
    }
  }
}

/** Every voice finding in the document, in field order. */
export function lintDocument(doc: LintedDocument): Finding[] {
  const findings: Finding[] = [];
  walk(doc, '', findings);
  return findings;
}

/** What the report calls the document: its title, name, heading, quote, organisation name or id. */
export function documentTitle(doc: LintedDocument): string {
  const header = doc.header as { title?: unknown } | undefined;
  const name = doc.name as { yo?: unknown } | string | undefined;
  for (const candidate of [
    doc.title,
    typeof name === 'string' ? name : name?.yo,
    header?.title,
    doc.quote,
    doc.orgName,
    doc.question,
    doc.label,
  ]) {
    if (typeof candidate === 'string' && candidate.trim() !== '') return candidate.trim();
  }
  return doc._id;
}

export function buildReport(
  doc: LintedDocument,
  findings: Finding[],
  checkedAt: string,
): LintReport {
  return {
    _id: `lint-${doc._id.replace(/\./g, '-')}`,
    _type: 'lintReport',
    documentId: doc._id,
    documentType: doc._type,
    title: documentTitle(doc),
    ...(doc._rev ? { checkedRev: doc._rev } : {}),
    checkedAt,
    findings: findings.map((finding, index) => ({
      _key: `finding-${index + 1}`,
      _type: 'lintFinding' as const,
      ...finding,
    })),
  };
}
