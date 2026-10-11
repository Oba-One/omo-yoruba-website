import { Box, Card, Heading, Label, Select, Stack, Text } from '@sanity/ui';
import { useEffect, useState } from 'react';
import type { Observable } from 'rxjs';
import { usePaneRouter } from 'sanity/structure';
import { CONTENT_PRIORITIES, contentTasks } from './missing-content';
import { missingRowTitle, TODO_GROUPS, todoPages } from './todo';
import type { Live } from './todo-list';

export function MissingContentPane({ options }: { options?: Record<string, unknown> }) {
  const source = options?.source as Observable<Live>;
  const [live, setLive] = useState<Live>({ counting: true });
  const [page, setPage] = useState('all');
  const { ChildLink } = usePaneRouter();
  useEffect(() => {
    const subscription = source.subscribe(setLive);
    return () => subscription.unsubscribe();
  }, [source]);
  const tasks =
    'state' in live
      ? contentTasks(live.state, live.result).filter(
          (task) => page === 'all' || task.pages.includes(page),
        )
      : [];
  const additions =
    'state' in live
      ? live.state.stillToAdd.filter(
          ({ add }) =>
            page === 'all' ||
            todoPages(
              add.presence?.where ?? (add.nextEdition === 'gala' ? 'Gala' : 'Odunde'),
            ).includes(page),
        )
      : [];
  return (
    <Card
      as="section"
      padding={4}
      style={{ height: '100%', overflowY: 'auto' }}
      aria-label="Missing content"
    >
      <Stack gap={4}>
        <Heading as="h1" size={2}>
          Missing content
        </Heading>
        <Text size={2}>One task per document. Expand its checklist, then open it to edit.</Text>
        <Text size={1} muted>
          Includes saved drafts. Filling a draft clears its checklist here; publish the document
          when it is ready for the website.
        </Text>
        <Stack gap={2}>
          <Label as="label" htmlFor="missing-content-page">
            Page
          </Label>
          <Select
            id="missing-content-page"
            value={page}
            onChange={(event) => setPage(event.currentTarget.value)}
          >
            <option value="all">All pages</option>
            {TODO_GROUPS.filter(({ id }) => id !== 'organization' || options?.administrator).map(
              ({ id, title }) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ),
            )}
          </Select>
        </Stack>
        {'counting' in live && <Text role="status">Loading missing content...</Text>}
        {'error' in live && (
          <Text role="alert">Could not load missing content. Trying again shortly.</Text>
        )}
        {'state' in live && (
          <>
            <Text role="status" size={1}>
              {tasks.length} {tasks.length === 1 ? 'document' : 'documents'} to finish •{' '}
              {additions.length} {additions.length === 1 ? 'item' : 'items'} to add
            </Text>
            {CONTENT_PRIORITIES.map((priority) => {
              const group = tasks.filter((task) => task.priority === priority.id);
              const more = priority.id === 'decisions' ? additions : [];
              if (!group.length && !more.length) return null;
              return (
                <Stack gap={3} key={priority.id}>
                  <Heading as="h2" size={1}>
                    {priority.title}
                  </Heading>
                  {group.map((task) => (
                    <Card as="article" key={task.id} padding={3} border radius={2}>
                      <Stack gap={3}>
                        <Text size={2} weight="semibold">
                          <ChildLink childId={task.id}>{task.title}</ChildLink>
                        </Text>
                        {task.draft && (
                          <Text size={1} muted>
                            Has unpublished changes
                          </Text>
                        )}
                        <details>
                          <Box as="summary" paddingY={3}>
                            {task.details.length} missing{' '}
                            {task.details.length === 1 ? 'detail' : 'details'}
                          </Box>
                          <Box as="ul" paddingLeft={4} margin={0}>
                            {task.details.map((detail) => (
                              <li key={detail}>{detail}</li>
                            ))}
                          </Box>
                        </details>
                      </Stack>
                    </Card>
                  ))}
                  {more.map((row) => (
                    <Card key={row.add.id} padding={3} border radius={2}>
                      <Text size={2}>
                        <ChildLink childId={row.add.id}>{missingRowTitle(row)}</ChildLink>
                      </Text>
                    </Card>
                  ))}
                </Stack>
              );
            })}
            {tasks.length === 0 && additions.length === 0 && (
              <Text>Nothing missing for this selection.</Text>
            )}
            {live.state.wording > 0 && (
              <Text>
                <ChildLink childId="wording">
                  Wording to check ({live.state.wording}) across the site
                </ChildLink>
              </Text>
            )}
          </>
        )}
      </Stack>
    </Card>
  );
}
