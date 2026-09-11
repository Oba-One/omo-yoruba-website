/**
 * The presence rows of the Pending view (ADR 0014): document types with no documents yet or
 * fewer than the site expects. A field query cannot find what does not exist, so this pane
 * counts. It lives only inside the Studio at /admin.
 */
import { useEffect, useMemo, useState } from 'react';
import { useClient } from 'sanity';
import { PRESENCE, type PresenceEntry, pendingTitle, presenceCountQuery } from '../pending';
import { STUDIO_API_VERSION } from './config';

interface Row {
  entry: PresenceEntry;
  count: number | undefined;
}

export function PendingPresencePane() {
  const base = useClient({ apiVersion: STUDIO_API_VERSION });
  // withConfig returns a new client each call; memoise it or the effect below refetches forever.
  const client = useMemo(() => base.withConfig({ perspective: 'drafts' }), [base]);
  const [rows, setRows] = useState<Row[]>(PRESENCE.map((entry) => ({ entry, count: undefined })));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      PRESENCE.map(async (entry) => ({
        entry,
        count: (await client.fetch<number>(presenceCountQuery(entry))) ?? 0,
      })),
    )
      .then((next) => {
        if (!cancelled) setRows(next);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : String(cause));
      });
    return () => {
      cancelled = true;
    };
  }, [client]);

  const pending = rows.filter((row) => row.count === undefined || row.count < row.entry.minimum);
  const styles = {
    wrap: { padding: '1.25rem', fontSize: '0.9375rem', lineHeight: 1.5 } as const,
    row: {
      padding: '0.5rem 0',
      borderTop: '1px solid var(--card-border-color, currentColor)',
    } as const,
    muted: { opacity: 0.7 } as const,
  };

  return (
    <div style={styles.wrap}>
      <p style={styles.muted}>
        Blocks that render Pending on the site because the documents behind them do not exist yet.
        Add the documents in their group; the row disappears once the count reaches the minimum.
      </p>
      {error ? <p>Could not count: {error}</p> : null}
      {pending.length === 0 && !error ? (
        <p>Nothing missing. Every block has the documents it needs.</p>
      ) : null}
      {pending.map(({ entry, count }) => (
        <div key={`${entry.type}:${entry.what}`} style={styles.row}>
          <strong>{pendingTitle(entry)}</strong>
          <div style={styles.muted}>
            {count === undefined
              ? 'Counting...'
              : `${count} of ${entry.minimum} ${entry.type} document${entry.minimum === 1 ? '' : 's'}`}
          </div>
        </div>
      ))}
    </div>
  );
}
