/** Status belongs to the staff workflow, independently of email forwarding. */
export const ENQUIRY_STATUSES = [
  { title: 'New', value: 'new' },
  { title: 'In progress', value: 'in-progress' },
  { title: 'Handled', value: 'handled' },
] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number]['value'];

/** Older records carry only handled. The first status edit replaces that legacy value. */
export function enquiryStatus(
  document: { status?: unknown; handled?: unknown; [field: string]: unknown } | null,
): EnquiryStatus {
  const status = ENQUIRY_STATUSES.find(({ value }) => value === document?.status);
  return status?.value ?? (document?.handled === true ? 'handled' : 'new');
}

export const ENQUIRY_STATUS_FILTER =
  'coalesce(status, select(handled == true => "handled", "new"))';
