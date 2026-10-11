import { rowDocumentType } from '../pending';
import { TODO_GROUPS, type TodoResult, type TodoState } from './todo';

export const CONTENT_PRIORITIES = [
  { id: 'events', title: 'Next event essentials' },
  { id: 'content', title: 'Other site content' },
  { id: 'decisions', title: 'Owner decisions and items to add' },
] as const;

export interface ContentTask {
  id: string;
  title: string;
  type: string;
  documentId: string;
  pages: string[];
  priority: (typeof CONTENT_PRIORITIES)[number]['id'];
  details: string[];
  draft: boolean;
}

/** One task per document, preserving every missing fact and every page it appears on. */
export function contentTasks(state: TodoState, result: TodoResult): ContentTask[] {
  const tasks = new Map<string, ContentTask>();
  for (const group of state.groups) {
    for (const { row, ids } of group.rows) {
      for (const id of ids) {
        const type = rowDocumentType(row.entry);
        const found = result.rows?.[row.id]?.find((document) => document?._id === id);
        const task: ContentTask = tasks.get(id) ?? {
          id: `document:${type}:${id}`,
          documentId: id,
          type,
          title:
            typeof found?.title === 'string'
              ? found.title
              : (TODO_GROUPS.find((page) => page.id === type)?.title ??
                (type === 'siteSettings' ? 'Organization details' : id)),
          pages: [],
          details: [],
          draft: Boolean(found?.draft),
          priority: 'content',
        };
        if (row.entry.edition === 'next') task.priority = 'events';
        else if (type === 'siteSettings') task.priority = 'decisions';
        if (!task.pages.includes(group.id)) task.pages.push(group.id);
        const detail = `${group.title}: ${row.title}`;
        if (!task.details.includes(detail)) task.details.push(detail);
        tasks.set(id, task);
      }
    }
  }
  return [...tasks.values()];
}
