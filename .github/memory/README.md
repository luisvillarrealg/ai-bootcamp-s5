# Working Memory System

## Purpose

Track patterns, decisions, and lessons learned during development so they are not rediscovered every session. Humans and AI assistants both read these files to give context-aware help.

## Two Types of Memory

| Type | Location | Contents | Changes |
|------|----------|----------|---------|
| **Persistent** | `.github/copilot-instructions.md` | Foundational principles, workflows, conventions | Rarely; deliberate edits |
| **Working** | `.github/memory/` | Discoveries, patterns, session history | Often; every session |

Promote a pattern from working to persistent memory only once it has proven to be a stable, project-wide rule.

## Directory Structure

```
.github/memory/
├── README.md              # This guide
├── session-notes.md       # Historical summaries of completed sessions (committed)
├── patterns-discovered.md # Accumulated code patterns (committed)
└── scratch/
    ├── .gitignore         # Ignores everything in scratch/ (contents: *)
    └── working-notes.md   # Active session notes (NOT committed)
```

### session-notes.md vs scratch/working-notes.md

- **`scratch/working-notes.md`** is for *active* work: current task, hypotheses, blockers, half-formed thoughts. It is ephemeral and never committed.
- **`session-notes.md`** is for *completed* sessions: a concise summary of what was done, found, and decided. It is committed as a historical record.

At the end of a session, distill the key findings from `working-notes.md` into `session-notes.md`, then clear the scratch file for the next session. Active work stays ephemeral; learnings are preserved.

> Note: because `scratch/.gitignore` ignores `*`, `working-notes.md` is local-only. If it is missing (e.g., fresh clone), recreate it with these sections: Current Task, Approach, Key Findings, Decisions Made, Blockers, Next Steps, Notes.

## When to Use Each File

### TDD Workflow (Write test → Fail → Implement → Pass → Refactor)
- **Start:** Record the task and approach in `scratch/working-notes.md`.
- **During:** Note failing test messages, surprising behavior, and design decisions.
- **Refactor:** If a reusable structure emerges, add it to `patterns-discovered.md`.
- **End:** Summarize into `session-notes.md`.

### Code Quality / Linting Workflow
- Log categories of lint errors and the fix strategy in `scratch/working-notes.md`.
- If the same lint issue recurs, add the fix as a pattern in `patterns-discovered.md`.

### Debugging / Integration Workflow
- Keep a running log of hypotheses, reproduction steps, and what was ruled out in `scratch/working-notes.md` (Key Findings, Blockers).
- Once resolved, record root cause and fix in `session-notes.md`; add a pattern if it could recur.

## How AI Reads and Applies These Files

1. `.github/copilot-instructions.md` is loaded automatically and points to this directory.
2. Before suggesting changes, the AI should check `patterns-discovered.md` for established conventions and `session-notes.md` for prior decisions, so it does not contradict or repeat past work.
3. During a session, the AI reads `scratch/working-notes.md` (if present) for current context and updates it as work progresses.
4. At session end, the AI proposes a summary for `session-notes.md` and any new entries for `patterns-discovered.md`.
5. When a suggestion follows a recorded pattern, the AI should cite the pattern by name.

## Maintenance Tips

- Keep entries short, specific, and dated.
- Prefer one pattern per entry, with a runnable example.
- Prune or update patterns that become outdated.
- Never store secrets or credentials in any memory file.
