---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ['read', 'execute', 'todo']
---

# Commit and Push

Commit the current changes and push them to the branch provided below.

Branch name (REQUIRED): ${input:branch-name:Feature branch name (for example, feature/add-todo-filter)}

If no branch name was provided, ask the user for it and do not continue until you have it.

## Instructions

1. **UI workflow check**: if the current step includes a required UI workflow, run `npm run test:ui` (or confirm a successful `/run-ui-tests` run in the current chat) before committing. Stop and report if UI tests fail.
2. **Analyze changes** with `git status` and `git diff`.
3. **Generate a commit message** in conventional commit format (see **Git Workflow** in [copilot-instructions.md](../copilot-instructions.md)): `feat:`, `fix:`, `chore:`, `docs:`, etc., with a descriptive summary.
4. **Branch**
   - If the branch does not exist, create it: `git checkout -b <branch-name>`
   - If it exists, switch to it: `git checkout <branch-name>`
5. **Stage all changes**: `git add .`
6. **Commit** with the generated message.
7. **Push**: `git push origin <branch-name>`
8. **Report** the branch, commit message, and push result.

## Restrictions

- DO NOT commit to `main` or any other branch. ONLY use the user-provided branch name.
- Do not force-push.
