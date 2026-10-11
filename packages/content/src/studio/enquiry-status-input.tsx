import { Card, Stack, Text } from '@sanity/ui';
import { type StringInputProps, useFormValue } from 'sanity';
import { type EnquiryKind, replyToField } from '../enquiry-kinds';
import { enquiryStatus } from '../enquiry-workflow';

export function EnquiryStatusInput(props: StringInputProps) {
  const document = useFormValue([]) as {
    kind?: EnquiryKind;
    status?: string;
    handled?: boolean;
    notifiedAt?: string;
    notifyError?: string;
    [field: string]: unknown;
  };
  const details = document.kind
    ? (document[document.kind] as Record<string, unknown> | undefined)
    : undefined;
  const reply = document.kind ? details?.[replyToField(document.kind).id] : undefined;
  return (
    <Stack gap={3}>
      {props.renderDefault({ ...props, value: enquiryStatus(document) })}
      {typeof reply === 'string' && (
        <Text size={1}>
          Reply to <a href={`mailto:${encodeURIComponent(reply)}`}>{reply}</a>
        </Text>
      )}
      <Card
        padding={3}
        radius={2}
        tone={document.notifyError && !document.notifiedAt ? 'caution' : 'transparent'}
      >
        <Text size={1}>
          {document.notifiedAt
            ? 'Email accepted by the mail service. Reply from your email inbox, then update the status here.'
            : document.notifyError
              ? 'Email needs attention. Read the problem below, then retry the notification.'
              : 'No email receipt yet. The enquiry is saved here.'}
        </Text>
      </Card>
    </Stack>
  );
}
