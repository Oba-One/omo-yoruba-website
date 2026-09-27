import type { Template } from 'sanity';
import { ACTIVE_EVENT_KINDS, EVENT_KIND_TITLES } from '../edition-fields';

/**
 * A starting template per kind of event, so "New" in a kind's list opens that kind's form, and none
 * without a kind: an event with no kind appears in no list (ADR 0042).
 */
export function studioTemplates(prev: Template[]): Template[] {
  return [
    ...prev.filter((template) => template.id !== 'event'),
    ...ACTIVE_EVENT_KINDS.map((kind) => ({
      id: `event-${kind}`,
      title: EVENT_KIND_TITLES[kind],
      schemaType: 'event',
      value: { kind },
    })),
  ];
}
