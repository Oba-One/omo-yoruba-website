import { useState } from 'react';
import { type DocumentActionComponent, useClient } from 'sanity';
import { STUDIO_API_VERSION } from '../api-version';
import { type EnquiryStatus, enquiryStatus } from '../enquiry-workflow';

function statusAction(status: EnquiryStatus, label: string): DocumentActionComponent {
  return function StatusAction({ id, published, draft, onComplete }) {
    const client = useClient({ apiVersion: STUDIO_API_VERSION });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string>();
    if (!published || enquiryStatus(published) === status) return null;
    return {
      label,
      disabled: busy || Boolean(draft),
      title: draft ? 'Resolve the existing draft before changing status.' : undefined,
      onHandle: async () => {
        setBusy(true);
        try {
          await client
            .patch(id)
            .ifRevisionId(published._rev)
            .set({ status })
            .unset(['handled'])
            .commit();
          onComplete();
        } catch {
          setError(
            'The enquiry changed or could not be saved. Check its latest status and try again.',
          );
        } finally {
          setBusy(false);
        }
      },
      dialog: error
        ? {
            type: 'confirm',
            message: error,
            onConfirm: () => setError(undefined),
            onCancel: () => setError(undefined),
          }
        : undefined,
    };
  };
}

export const markHandledAction = statusAction('handled', 'Mark handled');
export const startEnquiryAction = statusAction('in-progress', 'Start handling');
export const reopenEnquiryAction = statusAction('new', 'Move to new');

export const retryNotificationAction: DocumentActionComponent = ({
  id,
  published,
  draft,
  onComplete,
}) => {
  const client = useClient({ apiVersion: STUDIO_API_VERSION });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  if (!published || published.notifiedAt) return null;
  return {
    label: 'Retry email notification',
    disabled: busy || Boolean(draft),
    onHandle: async () => {
      setBusy(true);
      try {
        await client
          .patch(id)
          .ifRevisionId(published._rev)
          .set({ notifyRequestedAt: new Date().toISOString() })
          .commit();
        onComplete();
      } catch {
        setError('The retry could not be requested. Refresh the enquiry and try again.');
      } finally {
        setBusy(false);
      }
    },
    dialog: error
      ? {
          type: 'confirm',
          message: error,
          onConfirm: () => setError(undefined),
          onCancel: () => setError(undefined),
        }
      : undefined,
  };
};
