import type { Migration, Mutation, StoredDocument } from './core';

const referenceTo = (value: unknown) => (value as { _ref?: string } | undefined)?._ref;

/**
 * One link between an album and its edition: the album's (ticket 11, ADR 0042). An edition that still
 * names an album hands the link to that album when the album names no edition yet, then drops its own.
 * An album naming another edition, or two editions naming one album, wait for the owner.
 */
export const albumLinkMigration: Migration = {
  name: 'album-link',
  description: "Move each edition's album link onto the album, then drop the edition's own.",
  filter: '(_type == "event" && defined(album)) || _type == "album"',
  plan: (documents) => {
    const albums = new Map(
      documents.filter(({ _type }) => _type === 'album').map((album) => [album._id, album]),
    );
    const editions = documents.filter(
      (document): document is StoredDocument =>
        document._type === 'event' && referenceTo(document.album) !== undefined,
    );
    const claimants = (albumId: string) =>
      editions.filter((edition) => referenceTo(edition.album) === albumId).map(({ _id }) => _id);
    const mutations: Mutation[] = [];
    const conflicts: string[] = [];
    for (const edition of editions) {
      const albumId = referenceTo(edition.album) as string;
      const album = albums.get(albumId);
      const named = referenceTo(album?.event);
      const others = claimants(albumId).filter((id) => id !== edition._id);
      if (album && named && named !== edition._id) {
        conflicts.push(
          `${albumId} names ${named}, but ${edition._id} names ${albumId}: settle which.`,
        );
        continue;
      }
      if (album && !named && others.length > 0) {
        conflicts.push(
          `${albumId} is named by ${[edition._id, ...others].join(' and ')}: settle which.`,
        );
        continue;
      }
      if (album && !named) {
        mutations.push({
          patch: {
            id: albumId,
            ifRevisionID: album._rev,
            set: { event: { _type: 'reference', _ref: edition._id } },
          },
        });
      }
      mutations.push({ patch: { id: edition._id, ifRevisionID: edition._rev, unset: ['album'] } });
    }
    return { mutations, conflicts };
  },
};
