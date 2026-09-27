# 144: The git guardrail lets through common spellings of the commands CLAUDE.md says it blocks

Labels: bug
Status: open
Blocked by: none

**Finding** (R144 in `docs/plans/review-alignment-and-quality.md`; .claude/hooks/block-dangerous-git.sh; major; correctness): 'git checkout -- .' and 'git restore -- .' are the usual way an agent discards changes, and 'git clean -xdf' would also delete ignored files such as packages/web/.env and packages/web/.vercel/project.json; all three pass. In a session without permission prompts the hook is the only guard between an agent and uncommitted work, and branch protection covers main only, not the stacked branches of pull requests 12 to 15. The header's 'fails closed' is about unreadable payloads, not these spellings.

**Evidence:** CLAUDE.md:10-12 says the hook blocks forced pushes, hard resets, tree cleaning, branch deletion and whole-tree checkouts or restores. The patterns at block-dangerous-git.sh:21-28 are fixed substrings. Piped as PreToolUse payloads into the hook on 27 Sep (exit 2 means blocked), these were allowed: 'git clean -df', 'git clean -xdf', 'git checkout -- .', 'git restore -- .', 'git reset HEAD~1 --hard', 'git -C . reset --hard', 'git branch --delete --force x', 'git push origin --delete x', 'git push origin :x', 'git push -uf origin main'. Blocked: 'git clean -fd', 'git checkout .', 'git restore .', 'git reset --hard', 'git branch -D x', 'git push -f', 'git push --force-with-lease', 'git push origin +main'.

**What to build:** Match flags in any order and position (clean with any flag cluster holding f, checkout or restore ending in a lone '.', reset with --hard anywhere, branch with -D or --delete, push with --delete, a ':ref' or a flag cluster holding f), and add a small test that feeds the spellings above to the hook. Size S.

- [ ] The fix, with a test that fails before it where the behaviour can be tested
- [ ] `bun check` green; Playwright in both data modes where a page changes

## Comments
