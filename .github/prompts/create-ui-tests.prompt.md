---
description: "Create UI tests for required critical user journeys"
agent: test-engineer
tools: ['search', 'read', 'edit', 'execute', 'todo']
---

# Create UI Tests

Create Playwright UI tests for the critical user journeys.

Journeys (optional): ${input:journeys:Journeys to cover (leave blank for the default set)}

## Instructions

1. **Journeys**: if none were provided, use the default set: create, edit, toggle, delete, and core error-state handling.
2. **HARD LIMIT: create a maximum of 5 Playwright tests for this run** (target 3-5 total).
3. **Include at least 1 error-path test** within the 3-5 total.
4. If more than 5 candidate scenarios exist, select the highest-risk 5 and **list the deferred scenarios** instead of creating more tests.
5. **Generate or update** the UI tests using the project UI test framework (Playwright).
6. Prefer **stable selectors** (`getByRole`/`getByLabel`, then `data-testid`) and **state-based waits**; no fixed timeouts.
7. Apply the **Page Object Model**: put reusable interactions and selectors in page objects and keep tests scenario-focused, with no shared state between tests.
8. **Before finishing, verify the count** of created/updated Playwright test cases (`test(...)` / `it(...)`) and reduce to 5 or fewer if over the limit.
9. Do not claim "small scope" if the final authored count is greater than 5.

## Report

- Files changed
- Scenarios covered (with the final test count)
- Deferred scenarios, if any

Next command: `/run-ui-tests`
