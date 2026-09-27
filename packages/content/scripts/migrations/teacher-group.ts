import type { Migration, StoredDocument } from './core';

/**
 * The teacher leaves the person groups (ticket 12, ADR 0042): the person the Lessons page picks is the
 * one source. Someone still in the teacher group loses the group once the Lessons page picks her; one
 * it does not pick waits for the owner, who picks her there or gives her a group Our Story lists.
 */
export const teacherGroupMigration: Migration = {
  name: 'teacher-group',
  description: 'Take the teacher the Lessons page picks out of the person groups.',
  filter: '(_type == "person" && group == "teacher") || _id == "lessonsPage"',
  plan: (documents) => {
    const lessons = documents.find(({ _id }) => _id === 'lessonsPage');
    const picked = (lessons?.teacher as { _ref?: string } | undefined)?._ref;
    const teachers = documents.filter(
      (document): document is StoredDocument =>
        document._type === 'person' && document.group === 'teacher',
    );
    return {
      mutations: teachers
        .filter(({ _id }) => _id === picked)
        .map(({ _id, _rev }) => ({ patch: { id: _id, ifRevisionID: _rev, unset: ['group'] } })),
      conflicts: teachers
        .filter(({ _id }) => _id !== picked)
        .map(
          ({ _id, name }) =>
            `${_id} (${String(name ?? 'no name')}) is in the teacher group, but the Lessons page does not pick her: pick her there, or give her a group Our Story lists.`,
        ),
    };
  },
};
