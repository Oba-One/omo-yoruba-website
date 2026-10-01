import type { Tool } from 'sanity';

/** The embedded Studio shows the repository guide through Astro, which owns Markdown and images. */
function MemberGuide() {
  return (
    <iframe
      title="Member guide"
      src="/member-guide"
      style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
    />
  );
}

export const memberGuideTool: Tool = {
  name: 'member-guide',
  title: 'Member guide',
  component: MemberGuide,
};
