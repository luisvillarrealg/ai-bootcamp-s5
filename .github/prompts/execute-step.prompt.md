---
description: "Execute instructions from the current GitHub Issue step"
agent: tdd-developer
tools: ['search', 'read', 'edit', 'execute', 'web', 'todo']
---

# Execute Step

Execute the instructions from the current step of the exercise GitHub Issue.

Issue number (optional): ${input:issue-number:Issue number (leave blank to auto-detect the exercise issue)}

## Instructions

1. **Find the issue**
   - If an issue number was provided, use it.
   - Otherwise, find the exercise issue with the gh CLI (see **Workflow Utilities** in [copilot-instructions.md](../copilot-instructions.md)); its title contains "Exercise:".
2. **Get the content**: fetch the issue with its comments (steps are posted as comments).
3. **Parse the latest step**: identify the most recent step's instructions and note its step number (for example, `5-1`).
4. **Execute each `:keyboard: Activity:` section systematically**, in order. Track each as a todo item and complete it before moving on.
5. **Follow the project's testing scope constraints** from [copilot-instructions.md](../copilot-instructions.md) (TDD: tests first for new features).

## Scope Boundaries

- Do NOT create or run Playwright UI tests in this prompt.
- For Playwright UI work, hand off to `/create-ui-tests` and `/run-ui-tests` (these switch to the `test-engineer` agent).
- Do NOT commit or push changes. That is the job of `/commit-and-push`.

## When Finished

Stop after completing the activities and summarize what was done. Then provide the next commands, in this order:

- **If the current step requires UI workflow:** `/create-ui-tests` → `/run-ui-tests` → `/validate-step {step-number}`
- **If UI workflow is not required:** `/validate-step {step-number}`

Never recommend `/validate-step` before the required UI prompts.
